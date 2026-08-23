/**
 * Single source of truth for everything the leasing team may need to change:
 * contact details, unit inventory, availability and building specifications.
 *
 * Values marked PLACEHOLDER must be confirmed before launch - see README.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://www.alambusinesscentre.com";

export const property = {
  name: "Alam Business Centre",
  tagline: "Premium Commercial Space on Fifth Street",
  street: "Plot 86-90, Fifth Street, Industrial Area",
  locality: "Central Division",
  city: "Kampala",
  region: "Central Region",
  country: "UG",
  countryName: "Uganda",
  latitude: 0.3163,
  longitude: 32.6062,
  // PLACEHOLDER - confirm official leasing contact details before launch
  phone: process.env.NEXT_PUBLIC_LEASING_PHONE ?? "+256700000000",
  phoneDisplay: process.env.NEXT_PUBLIC_LEASING_PHONE_DISPLAY ?? "+256 700 000 000",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "256700000000",
  email: process.env.NEXT_PUBLIC_LEASING_EMAIL ?? "leasing@alambusinesscentre.com",
  viewingHours: "Monday to Friday, 9:00am to 5:00pm. Saturday, 9:00am to 1:00pm.",
  presentation: "/downloads/alam-business-centre-property-presentation.pdf",
} as const;

export const buildingStats = [
  { value: "4,940 m²", label: "Phase One lettable area" },
  { value: "8", label: "Available showroom units" },
  { value: "570-660 m²", label: "Per unit" },
  { value: "31", label: "On-plot parking bays" },
  { value: "6 m", label: "Floor-to-floor height" },
] as const;

export const buildingSpecs = [
  { label: "Phase One lettable area", value: "4,940 m²" },
  { label: "Ground-floor area", value: "2,390 m²" },
  { label: "First-floor area", value: "2,550 m²" },
  { label: "Showroom units", value: "8" },
  { label: "Unit sizes", value: "570-660 m²" },
  { label: "Floor-to-floor height", value: "6 metres" },
  { label: "Structural grid", value: "6 metres" },
  { label: "Building frontage", value: "Approximately 77.1 metres" },
  { label: "Parking", value: "31 on-plot parking bays" },
  { label: "Vehicle circulation", value: "Separate entrance and exit" },
  { label: "Security", value: "Perimeter fencing and two guardhouses" },
  { label: "Vertical circulation", value: "Two staircases and two service lifts" },
  { label: "Ground-floor finish", value: "Terrazzo" },
  { label: "Offices and facilities", value: "Porcelain tiles" },
  { label: "Second floor", value: "Leisure, hospitality and offices" },
  {
    label: "Leasing options",
    value: "Individual units, paired units, full floors or the whole building",
  },
] as const;

export type AvailabilityStatus =
  | "Available"
  | "Enquiries Open"
  | "Viewing Scheduled"
  | "Under Negotiation"
  | "Reserved"
  | "Let"
  | "Coming Soon";

export type FloorSlug = "ground-floor" | "first-floor" | "second-floor";

export type BusinessCategory =
  | "Automotive"
  | "Retail"
  | "Electronics"
  | "Supermarket"
  | "Furniture"
  | "Banking & Finance"
  | "Offices"
  | "Hospitality"
  | "Leisure & Wellness";

export interface Unit {
  slug: string;
  number: number;
  name: string;
  floor: FloorSlug;
  floorName: string;
  area: number;
  status: AvailabilityStatus;
  categories: BusinessCategory[];
  headline: string;
  summary: string;
  uses: string[];
  features: string[];
  image: string;
  imageAlt: string;
  priority: number;
}

export interface FloorInfo {
  slug: FloorSlug;
  name: string;
  shortName: string;
  area: string;
  intro: string;
  sellingPoints: string[];
  image: string;
  imageAlt: string;
}

export const floors: Record<FloorSlug, FloorInfo> = {
  "ground-floor": {
    slug: "ground-floor",
    name: "Ground Floor",
    shortName: "Ground",
    area: "2,390 m²",
    intro:
      "Four street-facing showroom units opening directly onto the internal forecourt, with customer parking immediately in front of the glazing and level vehicle access into every unit.",
    sellingPoints: [
      "Direct access from the internal forecourt",
      "Parking immediately in front of the units",
      "Full-height street-facing glazing",
      "Level vehicle access for showroom display",
      "6 m floor-to-floor height",
      "Suitable for vehicle display",
      "Goods-lift access",
      "Terrazzo floors",
      "Strong passing-traffic visibility from Fifth Street",
    ],
    image: "/images/unit-1-dealership.webp",
    imageAlt:
      "Double-height ground-floor showroom at Alam Business Centre fitted as a car and motorcycle dealership behind full-height glazing",
  },
  "first-floor": {
    slug: "first-floor",
    name: "First Floor",
    shortName: "First",
    area: "2,550 m²",
    intro:
      "Four larger units served by two service lifts and two staircases, with continuous full-height glazing, deep natural daylight and flexible partitioning for showroom, banking or office fit-outs.",
    sellingPoints: [
      "Two service lifts",
      "Two staircases",
      "Shared secure access",
      "Full-height glazing",
      "Natural daylight across the floor plate",
      "Terrazzo floors",
      "Porcelain tiles within office areas",
      "Flexible partitioning",
      "Suitable for combined units",
      "Shared washroom facilities",
    ],
    image: "/images/unit-5-furniture.webp",
    imageAlt:
      "First-floor showroom at Alam Business Centre fitted as a furniture and interior-design display with city views through full-height glazing",
  },
  "second-floor": {
    slug: "second-floor",
    name: "Second Floor",
    shortName: "Second",
    area: "Area available on application",
    intro:
      "A dedicated leisure, hospitality and office level. Areas are configured to tenant requirements, making the second floor suited to restaurants, wellness operators, fitness studios, event venues and corporate headquarters.",
    sellingPoints: [
      "Configured to tenant requirements",
      "Panoramic glazing with long views over Kampala",
      "Served by two service lifts and two staircases",
      "Suited to extended trading and evening hours",
      "Terrace and roof-level opportunities",
      "Dedicated hospitality servicing routes",
    ],
    image: "/images/concept-restaurant.webp",
    imageAlt:
      "Second-floor restaurant and bar concept fit-out at Alam Business Centre with panoramic glazing over Kampala",
  },
};

export const units: Unit[] = [
  {
    slug: "unit-1-570sqm",
    number: 1,
    name: "Unit 1",
    floor: "ground-floor",
    floorName: "Ground Floor",
    area: 570,
    status: "Available",
    categories: ["Automotive", "Retail"],
    headline: "Street-facing dealership showroom",
    summary:
      "A 570 m² corner showroom with level vehicle access and 6 m floor-to-floor height, sized for a car and motorcycle dealership with a service reception and sales desk.",
    uses: [
      "Car dealership",
      "Motorcycle dealership",
      "Vehicle and machinery display",
      "Tyre and accessory retail",
    ],
    features: [
      "Level vehicle access from the forecourt",
      "6 m floor-to-floor height",
      "Full-height glazing to Fifth Street",
      "Terrazzo floor finish",
      "Customer parking directly in front",
      "Goods-lift access",
    ],
    image: "/images/unit-1-dealership.webp",
    imageAlt:
      "Unit 1 at Alam Business Centre fitted as a car and motorcycle dealership with vehicles displayed behind full-height glazing",
    priority: 1,
  },
  {
    slug: "unit-2-625sqm",
    number: 2,
    name: "Unit 2",
    floor: "ground-floor",
    floorName: "Ground Floor",
    area: 625,
    status: "Available",
    categories: ["Electronics", "Retail"],
    headline: "Electronics and home-appliance retail",
    summary:
      "625 m² of column-light retail frontage suited to an electronics and home-appliance brand, with the depth for feature displays, a service counter and back-of-house storage.",
    uses: [
      "Electronics retail",
      "Home-appliance retail",
      "Mobile and computing brand store",
      "Consumer showroom",
    ],
    features: [
      "6 m structural grid",
      "Full-height street-facing glazing",
      "Terrazzo floor finish",
      "Direct forecourt access",
      "Goods-lift access",
      "Three-phase power provision",
    ],
    image: "/images/unit-2-electronics.webp",
    imageAlt:
      "Unit 2 at Alam Business Centre fitted as an electronics and home-appliance showroom with television and appliance displays",
    priority: 2,
  },
  {
    slug: "unit-3-625sqm",
    number: 3,
    name: "Unit 3",
    floor: "ground-floor",
    floorName: "Ground Floor",
    area: 625,
    status: "Available",
    categories: ["Supermarket", "Retail", "Banking & Finance"],
    headline: "Retail anchor, supermarket or bank",
    summary:
      "625 m² positioned as the ground-floor anchor. The forecourt frontage, trolley-friendly level access and parking make it a natural fit for a supermarket, bank branch or anchor retailer.",
    uses: [
      "Supermarket and grocery",
      "Bank branch",
      "Pharmacy and convenience anchor",
      "General retail anchor",
    ],
    features: [
      "Anchor position on the forecourt",
      "Level trolley access",
      "Full-height glazing",
      "Terrazzo floor finish",
      "Parking immediately in front",
      "Goods-lift access",
    ],
    image: "/images/unit-3-supermarket.webp",
    imageAlt:
      "Unit 3 at Alam Business Centre fitted as a supermarket with fresh-produce displays, aisles and checkout lanes",
    priority: 3,
  },
  {
    slug: "unit-4-570sqm",
    number: 4,
    name: "Unit 4",
    floor: "ground-floor",
    floorName: "Ground Floor",
    area: 570,
    status: "Available",
    categories: ["Retail", "Offices"],
    headline: "Finishes showroom or corporate office",
    summary:
      "570 m² suited to a building-finishes, interiors or commercial showroom with an integrated office suite - a premium display floor at street level with staff parking behind.",
    uses: [
      "Building-materials and finishes showroom",
      "Interior and joinery showroom",
      "Corporate office with display area",
      "Commercial showroom",
    ],
    features: [
      "Full-height glazing to the forecourt",
      "6 m floor-to-floor height",
      "Terrazzo floors, porcelain tiles to offices",
      "Flexible partitioning",
      "Goods-lift access",
      "Dedicated staff parking",
    ],
    image: "/images/unit-4-finishes-showroom.webp",
    imageAlt:
      "Unit 4 at Alam Business Centre fitted as a building-finishes showroom with window, door and facade displays",
    priority: 4,
  },
  {
    slug: "unit-5-615sqm",
    number: 5,
    name: "Unit 5",
    floor: "first-floor",
    floorName: "First Floor",
    area: 615,
    status: "Available",
    categories: ["Furniture", "Retail"],
    headline: "Furniture and interior showroom",
    summary:
      "615 m² of daylit first-floor space for a furniture, lighting or interior-design showroom, with room for staged room-sets and a design consultation desk.",
    uses: [
      "Furniture showroom",
      "Interior-design studio",
      "Lighting and decor retail",
      "Kitchen and bedroom display",
    ],
    features: [
      "Full-height glazing on two elevations",
      "Service-lift access for deliveries",
      "Terrazzo floors",
      "Flexible partitioning",
      "Shared washroom facilities",
      "Combinable with Unit 6",
    ],
    image: "/images/unit-5-furniture.webp",
    imageAlt:
      "Unit 5 at Alam Business Centre fitted as a furniture and interior-design showroom with staged living and bedroom sets",
    priority: 5,
  },
  {
    slug: "unit-6-660sqm",
    number: 6,
    name: "Unit 6",
    floor: "first-floor",
    floorName: "First Floor",
    area: 660,
    status: "Available",
    categories: ["Electronics", "Furniture", "Retail"],
    headline: "Home-appliance and kitchen showroom",
    summary:
      "At 660 m² this is one of the two largest units in Phase One - depth enough for working kitchen displays, white goods, air-conditioning ranges and a demonstration area.",
    uses: [
      "Home-appliance showroom",
      "Kitchen and cabinetry display",
      "Air-conditioning and HVAC retail",
      "White-goods distribution showroom",
    ],
    features: [
      "Largest floor plate on the first floor",
      "Full-height glazing",
      "Service-lift access for deliveries",
      "Terrazzo floors",
      "Water and drainage provision for kitchen displays",
      "Combinable with Unit 5 or Unit 7",
    ],
    image: "/images/unit-6-appliances.webp",
    imageAlt:
      "Unit 6 at Alam Business Centre fitted as a home-appliance and kitchen showroom with cookers, refrigeration and laundry displays",
    priority: 6,
  },
  {
    slug: "unit-7-660sqm",
    number: 7,
    name: "Unit 7",
    floor: "first-floor",
    floorName: "First Floor",
    area: 660,
    status: "Available",
    categories: ["Banking & Finance", "Offices"],
    headline: "Bank, fintech or corporate floor",
    summary:
      "660 m² laid out for a banking hall or regional head office - a public banking floor with a teller line, private meeting rooms and secure back-office in one tenancy.",
    uses: [
      "Bank branch and banking hall",
      "Fintech head office",
      "Insurance and financial services",
      "Regional corporate office",
    ],
    features: [
      "Secure shared lobby access",
      "Full-height glazing",
      "Porcelain tiles within office areas",
      "Flexible partitioning for teller and back-office zones",
      "Two service lifts",
      "Shared washroom facilities",
    ],
    image: "/images/unit-7-bank.webp",
    imageAlt:
      "Unit 7 at Alam Business Centre fitted as a bank branch with a teller line, waiting lounge and private meeting rooms",
    priority: 7,
  },
  {
    slug: "unit-8-615sqm",
    number: 8,
    name: "Unit 8",
    floor: "first-floor",
    floorName: "First Floor",
    area: 615,
    status: "Available",
    categories: ["Offices"],
    headline: "Glazed offices and meeting suites",
    summary:
      "615 m² for a corporate occupier: reception, open-plan desking, glazed boardroom and meeting suites, all under continuous daylight from the full-height facade.",
    uses: [
      "Corporate head office",
      "Regional and representative office",
      "Professional services practice",
      "Serviced office and meeting suites",
    ],
    features: [
      "Reception and boardroom capable layout",
      "Full-height glazing",
      "Porcelain tiles within office areas",
      "Flexible partitioning",
      "Two service lifts and two staircases",
      "Combinable with Unit 7",
    ],
    image: "/images/unit-8-offices.webp",
    imageAlt:
      "Unit 8 at Alam Business Centre fitted as a corporate office with reception, open-plan desking and a glazed boardroom",
    priority: 8,
  },
];

export interface SecondFloorConcept {
  slug: string;
  name: string;
  summary: string;
  image: string;
  imageAlt: string;
  categories: BusinessCategory[];
}

export const secondFloorConcepts: SecondFloorConcept[] = [
  {
    slug: "restaurant-and-bar",
    name: "Restaurant and bar",
    summary:
      "A full-service restaurant and bar with an open kitchen, lounge seating and a counter along the glazed elevation.",
    image: "/images/concept-restaurant.webp",
    imageAlt:
      "Restaurant and bar concept fit-out on the second floor of Alam Business Centre with an open kitchen and city views",
    categories: ["Hospitality"],
  },
  {
    slug: "gym-with-sauna-and-steam",
    name: "Gym with sauna and steam",
    summary:
      "Cardio and strength floors against the glazing, with a functional zone, changing rooms and dedicated sauna and steam suites.",
    image: "/images/concept-gym.webp",
    imageAlt:
      "Gym concept fit-out on the second floor of Alam Business Centre with cardio equipment, free weights and sauna and steam rooms",
    categories: ["Leisure & Wellness"],
  },
  {
    slug: "wellness-spa",
    name: "Wellness spa and treatment suites",
    summary:
      "A reception and relaxation lounge leading to private treatment rooms, a hydrotherapy pool and retail display.",
    image: "/images/concept-spa.webp",
    imageAlt:
      "Wellness spa concept fit-out on the second floor of Alam Business Centre with treatment suites and a hydrotherapy pool",
    categories: ["Leisure & Wellness"],
  },
  {
    slug: "yoga-and-fitness-studio",
    name: "Yoga and fitness studio",
    summary:
      "A column-light studio floor with timber flooring, mirrored walls, a members lounge and long views across the city.",
    image: "/images/concept-yoga.webp",
    imageAlt:
      "Yoga studio concept fit-out on the second floor of Alam Business Centre with timber flooring, mats and panoramic glazing",
    categories: ["Leisure & Wellness"],
  },
  {
    slug: "nightclub-and-events-lounge",
    name: "Nightclub and events lounge",
    summary:
      "An evening venue with a full bar, booth seating, DJ stage and lighting rig, served by a separate after-hours entrance.",
    image: "/images/concept-nightclub.webp",
    imageAlt:
      "Nightclub and events lounge concept fit-out on the second floor of Alam Business Centre with a bar, dance floor and lighting rig",
    categories: ["Hospitality", "Leisure & Wellness"],
  },
  {
    slug: "corporate-offices-and-reception",
    name: "Corporate offices and reception",
    summary:
      "A headquarters floor with a formal reception, executive suites, open-plan desking and boardroom.",
    image: "/images/unit-8-offices.webp",
    imageAlt:
      "Corporate office concept fit-out with reception, open-plan desking and a glazed boardroom at Alam Business Centre",
    categories: ["Offices"],
  },
  {
    slug: "conference-and-training-centre",
    name: "Conference or training centre",
    summary:
      "Divisible conference halls with breakout lounges, catering support and a dedicated delegate arrival area.",
    image: "/images/interior-showroom-meeting-suite.webp",
    imageAlt:
      "Conference and training centre concept with glazed meeting suites and breakout space at Alam Business Centre",
    categories: ["Offices", "Hospitality"],
  },
];

export const CONCEPT_DISCLAIMER =
  "The interior visual is an illustrative fit-out concept. Final layouts, areas, services and approvals will depend on the selected unit and tenant requirements.";

export const businessCategories: BusinessCategory[] = [
  "Automotive",
  "Retail",
  "Electronics",
  "Supermarket",
  "Furniture",
  "Banking & Finance",
  "Offices",
  "Hospitality",
  "Leisure & Wellness",
];

export function getUnit(floor: string, slug: string) {
  return units.find((u) => u.floor === floor && u.slug === slug);
}

export function unitsByFloor(floor: FloorSlug) {
  return units
    .filter((u) => u.floor === floor)
    .sort((a, b) => a.priority - b.priority);
}

export function unitHref(unit: Pick<Unit, "floor" | "slug">) {
  return `/available-spaces/${unit.floor}/${unit.slug}`;
}

export function formatArea(area: number) {
  return `${area.toLocaleString("en-US")} m²`;
}

export function isFloorSlug(value: string): value is FloorSlug {
  return value in floors;
}
