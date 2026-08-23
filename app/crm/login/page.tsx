import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/app/crm/login/login-form";
import { currentUser } from "@/lib/server/auth";
import { d1Configured } from "@/lib/server/d1";

export default async function LoginPage() {
  if (await currentUser()) redirect("/crm");

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5 py-16">
      <div className="w-full max-w-md">
        <div className="flex justify-center">
          <Image
            src="/logo/alam-logo-light.png"
            alt="Alam Business Centre"
            width={215}
            height={90}
            priority
            className="h-11 w-auto"
          />
        </div>

        <div className="mt-8 rounded-2xl bg-white p-7 sm:p-8">
          <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-red uppercase">
            Leasing CRM
          </p>
          <h1 className="font-display mt-2 text-3xl text-ink">Sign in</h1>
          <p className="mt-2 text-sm text-ink/60">
            Enquiries, pricing requests and site-visit bookings from the website all arrive
            here.
          </p>

          {!d1Configured ? (
            <p className="mt-5 rounded-lg bg-red/8 px-4 py-3 text-sm text-red-dark">
              The lead database is not configured on this server, so sign-in is unavailable.
              Set the Cloudflare environment variables and restart.
            </p>
          ) : (
            <div className="mt-6">
              <LoginForm />
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-white/40">
          <Link href="/" className="transition-colors hover:text-white/70">
            Back to the public website
          </Link>
        </p>
      </div>
    </div>
  );
}
