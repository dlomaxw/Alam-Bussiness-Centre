"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { signIn, type FormState } from "@/app/crm/actions";

const field =
  "w-full rounded-lg border border-line bg-white px-3.5 py-3 text-[15px] text-ink outline-none transition-colors focus:border-ink";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-12 w-full rounded-full bg-red px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-red-dark disabled:opacity-60"
    >
      {pending ? "Signing in..." : "Sign in"}
    </button>
  );
}

export function LoginForm() {
  const [state, action] = useActionState<FormState, FormData>(signIn, {});

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-xs font-medium tracking-wide text-ink/70">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className={field}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-xs font-medium tracking-wide text-ink/70">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={field}
        />
      </div>

      {state.error ? (
        <p role="alert" className="rounded-lg bg-red/8 px-4 py-3 text-sm text-red-dark">
          {state.error}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
