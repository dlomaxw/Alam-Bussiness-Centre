"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { createNote, saveLeadDetails, type FormState } from "@/app/crm/actions";
import { leadStatuses } from "@/lib/leads";

const field =
  "min-h-10 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink";

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-10 rounded-full bg-red px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-dark disabled:opacity-60"
    >
      {pending ? "Saving..." : label}
    </button>
  );
}

function Feedback({ state }: { state: FormState }) {
  if (state.error) {
    return (
      <p role="alert" className="rounded-lg bg-red/8 px-3 py-2 text-xs text-red-dark">
        {state.error}
      </p>
    );
  }
  if (state.message) {
    return <p className="text-xs text-ink/55">{state.message}</p>;
  }
  return null;
}

export function LeadEditor({
  lead,
  agents,
  canAssign,
}: {
  lead: {
    id: string;
    status: string;
    assigned_agent: string | null;
    next_follow_up: string | null;
    outcome: string | null;
  };
  agents: string[];
  canAssign: boolean;
}) {
  const [state, action] = useActionState<FormState, FormData>(saveLeadDetails, {});

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="id" value={lead.id} />

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-ink/60">Status</span>
        <select name="status" defaultValue={lead.status} className={field}>
          {leadStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>

      {canAssign ? (
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-ink/60">Assigned agent</span>
          <select
            name="assigned_agent"
            defaultValue={lead.assigned_agent ?? ""}
            className={field}
          >
            <option value="">Unassigned</option>
            {agents.map((agent) => (
              <option key={agent} value={agent}>
                {agent}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <div className="text-xs text-ink/50">
          Assigned to {lead.assigned_agent ?? "nobody"} — only a manager can reassign.
        </div>
      )}

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-ink/60">Next follow-up</span>
        <input
          type="date"
          name="next_follow_up"
          defaultValue={lead.next_follow_up ?? ""}
          className={field}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-ink/60">Final outcome</span>
        <input
          name="outcome"
          defaultValue={lead.outcome ?? ""}
          placeholder="Signed Unit 3, lost on price, ..."
          className={field}
        />
      </label>

      <div className="flex items-center gap-3">
        <Submit label="Save" />
        <Feedback state={state} />
      </div>
    </form>
  );
}

export function NoteForm({ leadId }: { leadId: string }) {
  const [state, action] = useActionState<FormState, FormData>(createNote, {});

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="id" value={leadId} />
      <textarea
        name="note"
        rows={3}
        required
        placeholder="Called and left a voicemail. Sending the Unit 3 floor plan."
        className="w-full resize-y rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink"
      />
      <div className="flex items-center gap-3">
        <Submit label="Add note" />
        <Feedback state={state} />
      </div>
    </form>
  );
}
