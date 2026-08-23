"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { saveUnit, type FormState } from "@/app/crm/actions";

const STATUSES = [
  "Available",
  "Enquiries Open",
  "Viewing Scheduled",
  "Under Negotiation",
  "Reserved",
  "Let",
  "Coming Soon",
];

const field =
  "min-h-10 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-10 rounded-full bg-red px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-dark disabled:opacity-60"
    >
      {pending ? "Saving..." : "Save unit"}
    </button>
  );
}

export function UnitEditor({
  slug,
  status,
  promoLabel,
  rentNote,
  displayPriority,
}: {
  slug: string;
  status: string;
  promoLabel: string;
  rentNote: string;
  displayPriority: number;
}) {
  const [state, action] = useActionState<FormState, FormData>(saveUnit, {});

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="slug" value={slug} />

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-ink/60">Availability</span>
          <select name="status" defaultValue={status} className={field}>
            {STATUSES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-ink/60">Display order</span>
          <input
            type="number"
            name="display_priority"
            min={1}
            max={99}
            defaultValue={displayPriority}
            className={field}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-ink/60">Promotional label</span>
          <input
            name="promo_label"
            defaultValue={promoLabel}
            placeholder="Last unit on this floor"
            className={field}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-ink/60">Internal rent note</span>
          <input
            name="rent_note"
            defaultValue={rentNote}
            placeholder="Landlord will consider 3-month rent free"
            className={field}
          />
        </label>
      </div>

      <div className="flex items-center gap-3">
        <Submit />
        {state.error ? (
          <p role="alert" className="text-xs text-red-dark">
            {state.error}
          </p>
        ) : state.message ? (
          <p className="text-xs text-ink/55">{state.message}</p>
        ) : null}
      </div>
    </form>
  );
}
