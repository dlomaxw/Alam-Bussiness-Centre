# Alam Business Centre — leasing website

Marketing and lead-capture site for the commercial space at **Plot 86–90, Fifth Street,
Industrial Area, Central Division, Kampala**.

Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · Cloudflare D1

---

## Running it

```bash
npm install
npm run dev
```

The site runs at http://localhost:3000. Configuration comes from `.env.local`
(copy `.env.example` and fill it in). Every value has a working fallback except the
Cloudflare credentials — without those, enquiries are logged to the console instead of
being saved, and the site still runs.

```bash
npm run build   # production build, prerenders 37 pages
npm start       # serve the production build
```

## How the price gate works

Rental rates are **not in the browser bundle**. This is the mechanism:

- `lib/server/pricing.ts` imports `server-only`, so importing it from a client component
  is a build error. The rate (`LEASE_RATE_USD_PER_SQM_MONTH`, default 15) lives there and
  in the environment, nowhere else.
- `POST /api/leads` validates the enquiry, writes the lead to D1, and only then returns the
  computed rate card in the response.
- `components/pricing-context.tsx` holds that payload and persists it to `localStorage`, so
  rates stay visible on every unit, floor and combination for the rest of the visit.
- Until then, `PriceTag` renders "Lease Terms on Application" as a button that opens the form.

Server-side validation is the same code the browser runs (`lib/leads.ts`), so posting junk
straight at the endpoint does not open the gate. Prices are also deliberately absent from the
JSON-LD `Offer` blocks — publishing them there would hand them to anyone reading page source.

Verified: no price string appears in any prerendered HTML or client chunk.

**Rate currently configured:** USD 15 per m² per month, exclusive of service charge, VAT and
utilities. That yields Unit 1 $8,550 · Unit 2 $9,375 · Unit 3 $9,375 · Unit 4 $8,550 ·
Unit 5 $9,225 · Unit 6 $9,900 · Unit 7 $9,900 · Unit 8 $9,225, a full ground floor at $35,850
and a full first floor at $38,250. Second-floor areas use the same rate once the area is agreed.
To change the rate, edit `LEASE_RATE_USD_PER_SQM_MONTH` — nothing else needs touching.

## Lead database (Cloudflare D1)

Database `alam-business-centre-crm`, reached over the Cloudflare REST API rather than a
Workers binding, so the same build deploys to Vercel, Node or Cloudflare.

| Table | Holds |
| --- | --- |
| `leads` | Every enquiry: contact details, business category, unit and floor interest, required area, occupation date, lease duration, consent, campaign attribution, hashed IP, status |
| `site_visits` | Viewing requests linked to a lead |
| `lead_notes` | Internal follow-up notes |
| `lead_events` | Capture and duplicate-enquiry events |

Schema lives in `db/schema.sql`. To inspect leads before the CRM dashboard is built:

```bash
npx wrangler d1 execute alam-business-centre-crm --remote --command "SELECT reference, created_at, full_name, company, email, phone, source, status FROM leads ORDER BY created_at DESC LIMIT 20"
```

Protections on the endpoint: shared validation, a honeypot field, a fixed-window rate limit
(6 submissions per 10 minutes per hashed IP), 500-character field caps, and duplicate-email
flagging (flagged, never blocked — the same company enquiring twice is a signal, not an error).

## The CRM

Every enquiry, pricing request, unit enquiry, contact message and site-visit booking from the
website arrives in the CRM at **`/crm`**. There is no separate inbox to watch.

### Creating the first account

Accounts are created from the command line so that nobody but you ever types the password:

```bash
npm run crm:user
```

It asks for a name, email and role, then the password twice (hidden). Passwords are stored as
scrypt hashes with a per-user salt. Run it again with the same email to reset a password or
change a role. Create at least one **Super Administrator**, then sign in at `/crm/login`.

### Roles

| Role | Can do |
| --- | --- |
| Super Administrator | Everything, including user management |
| Leasing Manager | Edit and assign leads, manage units, view reports, export |
| Leasing Agent | Edit leads and add notes; cannot reassign or export |
| Marketing Manager | View leads and reports, export CSV |
| Viewer | Read-only leads and reports |

Permissions live in one table in `lib/server/auth.ts` — changing what a role can do is one edit.

### Screens

- **Dashboard** — the twelve pipeline counters from the brief, latest enquiries, follow-ups due
  today, units attracting multiple enquiries, duplicate-email detection and an activity feed.
- **Leads** — search by name, company, email, phone or reference; filter by status, unit,
  category, source, assigned agent and date range; "follow-up due only"; paginated; CSV export.
- **Lead detail** — the full enquiry with campaign attribution, one-tap call/WhatsApp/email using
  the lead's own number, the 14-stage pipeline, agent assignment, follow-up date, outcome,
  internal notes and site-visit history with its own status.
- **Units** — availability status, promotional label, display order and an internal rent note per
  unit, alongside the enquiry count for each. Saving updates the public site.
- **Reports** — conversion rate, unit demand, enquiry source, business category and monthly
  performance.

### Security

Sessions are stateless signed cookies (HttpOnly, SameSite=Lax, Secure in production, 8-hour
expiry) keyed on `CRM_SESSION_SECRET`. The user row is re-read on every request, so deactivating
an account takes effect immediately. Failed logins are throttled to 8 per 15 minutes per
IP-and-email and are recorded; sign-in never reveals whether an address exists. Every mutation is
written to `activity_log`. All lead queries are parameterised, and CSV export escapes values that
would otherwise be interpreted as spreadsheet formulas.

`/crm` is disallowed in `robots.txt` and carries `noindex` regardless.

### Unit availability and the public site

`lib/server/units.ts` merges CRM overrides onto the inventory in `lib/property.ts`. The public
read is cached for five minutes so unit pages stay statically rendered, and saving a unit calls
`revalidatePath`, so a status change is visible straight away rather than in five minutes. If D1
is unreachable, the published defaults are served rather than an error.

## Where content lives

Almost everything the leasing team will want to change sits in two files:

- **`lib/property.ts`** — contact details, viewing hours, the eight units (area, status,
  suggested uses, features, images), floor descriptions, second-floor concepts, building specs.
  Change a unit's `status` to `"Reserved"` or `"Let"` and it updates the card, the filters and
  the structured data everywhere.
- **`lib/seo-pages.ts`** — the ten SEO landing pages, each written for a different reader.

## Images

23 renders were converted from 57 MB of PNGs to 4.2 MB of WebP by `scripts/prepare-images.mjs`,
and the logo variants by `scripts/prepare-logo.mjs` (transparent background, plus a white
knockout of the wordmark for the black header). Re-run either if the source assets change.

Source assets: `../alam group Bussiness centre/`. Note that `9.png` and `10.png` were not on
disk when the images were converted, so exteriors come from 7, 8, 11 and 12.

## Analytics

GA4, GTM, Meta Pixel and Microsoft Clarity are all opt-in — set the ID in the environment and
the tag loads; leave it blank and nothing is injected. `track()` in `lib/analytics.ts` fans a
single call out to whichever are configured, covering all thirteen events in the brief
(register interest opened/submitted, unit viewed, brochure downloaded, site visit requested,
phone/email/WhatsApp clicked, map opened, floor plan viewed, comparison completed, form
abandoned, lead captured).

---

## Before launch — must be confirmed

The site runs on placeholders for these. Search `lib/property.ts` for `PLACEHOLDER`.

- [ ] **Leasing phone number** — currently `+256 700 000 000`
- [ ] **WhatsApp number** — currently `256700000000`
- [ ] **Leasing email** — currently `leasing@alambusinesscentre.com`
- [ ] **Domain** — `NEXT_PUBLIC_SITE_URL` drives canonicals, sitemap and Open Graph
- [ ] **Map coordinates** — `latitude`/`longitude` are approximate for Industrial Area;
      the embed searches by address, so a wrong pin is possible until these are set
- [ ] **Site-visit operating hours** — currently Mon–Fri 9–5, Sat 9–1
- [ ] **Service charge, deposit, minimum lease duration** — referenced in copy as
      "confirmed in the written proposal"; add them if they should be published
- [ ] **Company registration details** for the privacy policy and terms, reviewed by the
      landlord's legal adviser
- [ ] **Rotate the Cloudflare API token** — it was shared in chat during setup
- [ ] **Create the real CRM accounts** with `npm run crm:user` (the database ships empty)
- [ ] **Set `CRM_SESSION_SECRET`** in the production environment — it is generated per install
      and is already in your local `.env.local`

### One naming decision outstanding

The supplied logo reads **"Alam BUSINESS CENTER"** (American spelling). All site copy, page
titles and meta descriptions use **"Alam Business Centre"** (British), per the brief. Confirm
which spelling is correct and the other gets aligned — it is a single find-and-replace, but
having the logo and the H1 disagree is the kind of thing a tenant notices.

## Not built yet

- **Outbound notifications.** New enquiries appear in the CRM immediately, but nothing emails or
  texts the leasing team yet — that needs a mail provider (Resend, SendGrid, Cloudflare Email)
  and the confirmed leasing address. The same applies to the automated reminders in the brief
  (follow-up due, proposal not chased, reserved unit changed).
- **Scheduled monthly report delivery.** The reports screen is live; emailing it on a schedule
  needs the mail provider above.
- **User management screen.** Accounts are created and updated with `npm run crm:user`. A
  Super Administrator UI for this is straightforward to add if you want it.
- **Per-unit floor-plan extracts.** Units link to a "request a floor plan" enquiry rather than
  showing a plan, because no floor-plan images were supplied.
