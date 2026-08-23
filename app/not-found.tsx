import { ButtonLink, SectionHeading } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="bg-ink text-white">
      <div className="container-x flex min-h-[60vh] flex-col justify-center py-20">
        <SectionHeading
          as="h1"
          eyebrow="404"
          title="That page has moved on"
          intro="The page you were looking for is not here. The available units, floor pages and leasing contacts are all a click away."
          tone="light"
        />
        <div className="mt-9 flex flex-wrap gap-3">
          <ButtonLink href="/available-spaces">View Available Units</ButtonLink>
          <ButtonLink href="/" variant="ghost">
            Back to the homepage
          </ButtonLink>
          <ButtonLink href="/contact" variant="ghost">
            Contact the leasing team
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
