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

### One naming decision outstanding

The supplied logo reads **"Alam BUSINESS CENTER"** (American spelling). All site copy, page
titles and meta descriptions use **"Alam Business Centre"** (British), per the brief. Confirm
which spelling is correct and the other gets aligned — it is a single find-and-replace, but
having the logo and the H1 disagree is the kind of thing a tenant notices.

## Not built yet

This release is the public site. Deliberately out of scope for now, per the agreed plan:

- CRM dashboard, login and role-based access (the lead database underneath it is live and
  already collecting, so nothing is lost in the meantime)
- Email/SMS/WhatsApp notification on new enquiry
- CSV export and monthly reports
- Per-unit floor-plan extracts — units link to a "request a floor plan" enquiry instead of
  showing a plan, because no floor-plan images were supplied
