import { units, type Unit } from "@/lib/property";

/**
 * Landing pages targeting the search terms tenants actually use.
 * Each one is written for a different reader and a different decision, so the
 * bodies do not overlap - duplicate landing pages compete with each other.
 */

export interface SeoSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface SeoPage {
  slug: string;
  title: string;
  description: string;
  h1: string;
  eyebrow: string;
  intro: string[];
  image: string;
  imageAlt: string;
  sections: SeoSection[];
  unitSlugs: string[];
  faqs: { question: string; answer: string }[];
}

export const seoPages: SeoPage[] = [
  {
    slug: "commercial-space-for-rent-in-kampala",
    title: "Commercial Space for Rent in Kampala | 570-660 m² Units, Industrial Area",
    description:
      "Commercial space for rent in Kampala: eight units of 570-660 m² across 4,940 m² at Alam Business Centre, Fifth Street, Industrial Area, with 31 parking bays and 6 m headroom.",
    h1: "Commercial Space for Rent in Kampala",
    eyebrow: "Kampala, Uganda",
    intro: [
      "Commercial space in Kampala usually forces a trade-off: visibility in the centre with no parking and no loading access, or space and access on the outskirts with no passing trade. Alam Business Centre on Fifth Street sits on the right side of both, in the Industrial Area that has been the city's commercial address for decades.",
      "Phase One offers 4,940 m² of lettable area split into eight units of 570 to 660 m², behind approximately 77.1 metres of full-height glazed frontage, with 31 on-plot parking bays and separate vehicle entry and exit.",
    ],
    image: "/images/exterior-street-dusk.webp",
    imageAlt:
      "Alam Business Centre, commercial space for rent on Fifth Street, Industrial Area, Kampala, lit at dusk",
    sections: [
      {
        heading: "What you get for the money in Industrial Area",
        paragraphs: [
          "Rent in Kampala is quoted per square metre per month, and the headline figure rarely tells the whole story. What changes the economics of a commercial lease is whether the space works without modification: whether a delivery vehicle can reach the door, whether customers can park, and whether the clear height allows the fit-out you have in mind.",
          "Every unit here has a 6-metre floor-to-floor height on a 6-metre structural grid, terrazzo floors, three-phase power provision and access to two service lifts. Ground-floor units take vehicles at floor level from the internal forecourt.",
        ],
        bullets: [
          "4,940 m² of lettable area in Phase One",
          "Eight units from 570 m² to 660 m²",
          "31 on-plot parking bays within a secure forecourt",
          "Separate vehicle entrance and exit",
          "Perimeter fencing and two guardhouses",
          "Two staircases and two service lifts",
        ],
      },
      {
        heading: "Lease one unit, a pair, a floor or the building",
        paragraphs: [
          "The building is designed to be divided or consolidated. Adjacent units on the same floor combine into a single tenancy, giving contiguous areas up to 1,320 m². A full floor is 2,390 m² on the ground or 2,550 m² on the first, and the whole of Phase One can go to one occupier.",
          "That flexibility matters for growing businesses: take one unit now with the option to talk to us about the one next door later, rather than committing to space you will not use for two years.",
        ],
      },
      {
        heading: "Who is leasing here",
        paragraphs: [
          "The building suits occupiers who need to be seen and need to move goods: vehicle and motorcycle dealerships, electronics and appliance retailers, supermarkets, furniture and interiors brands, building-material suppliers, banks and fintechs, corporate and regional offices, and hospitality and leisure operators on the second floor.",
        ],
      },
    ],
    unitSlugs: ["unit-1-570sqm", "unit-3-625sqm", "unit-7-660sqm"],
    faqs: [
      {
        question: "How much is commercial space per square metre in Kampala?",
        answer:
          "Rates vary widely by district, frontage and specification. Our rate is quoted per square metre per month and is released to prospective tenants when they register their details, along with the service charge basis and lease terms.",
      },
      {
        question: "What is the smallest space available?",
        answer:
          "The smallest single unit is 570 m². Phase One is designed around showroom-scale tenancies rather than small suites.",
      },
      {
        question: "Is the space serviced or shell?",
        answer:
          "Units are handed over as flexible shells with terrazzo floors, full-height glazing and services provision, ready for your own fit-out. Fit-out proposals are agreed with the landlord before works begin.",
      },
    ],
  },
  {
    slug: "showroom-space-for-rent-in-industrial-area",
    title: "Showroom Space for Rent in Industrial Area, Kampala | 6 m Height, Glazed Frontage",
    description:
      "Showroom space for rent in Industrial Area, Kampala: 570-660 m² units with 6 m floor-to-floor height, full-height glazing, level vehicle access and parking at the door.",
    h1: "Showroom Space for Rent in Industrial Area",
    eyebrow: "Showrooms",
    intro: [
      "A showroom is a display instrument before it is a floor area. It needs height so products do not look cramped, glass so the street can see in, light that flatters what is on display, and a way to get stock through the door without closing the shop.",
      "Alam Business Centre was designed around those four requirements, in the district where Kampala's trade buyers already come to compare suppliers.",
    ],
    image: "/images/interior-showroom-dusk.webp",
    imageAlt:
      "Showroom space for rent in Industrial Area, Kampala, with display plinths, terrazzo floors and full-height glazing at dusk",
    sections: [
      {
        heading: "Height, grid and glass",
        paragraphs: [
          "The 6-metre floor-to-floor height is the specification that separates this building from converted retail space. It carries double-height display, tall stock such as vehicles, ladders and machinery, feature lighting rigs, and mezzanine sales desks where the landlord approves them.",
          "The 6-metre structural grid keeps columns out of sightlines, so a customer standing at the entrance can see the depth of the floor. Full-height curtain-wall glazing turns the whole elevation into your window display, and at dusk a lit showroom reads from the length of Fifth Street.",
        ],
        bullets: [
          "6 m floor-to-floor height",
          "6 m structural grid keeping the floor plate open",
          "Full-height curtain-wall glazing",
          "Approximately 77.1 m of building frontage",
          "Terrazzo floors throughout the ground floor",
          "Bronze and champagne composite cladding",
        ],
      },
      {
        heading: "Getting stock in and out",
        paragraphs: [
          "Ground-floor units take deliveries at floor level directly from the internal forecourt, so a truck can back up to the unit rather than to a shared loading bay across a car park. First-floor units are served by two service lifts, which means restocking does not have to happen through the customer entrance.",
          "The forecourt has separate vehicle entry and exit, so delivery vehicles are not reversing against arriving customers.",
        ],
      },
      {
        heading: "Why Industrial Area for a showroom",
        paragraphs: [
          "Trade and retail buyers in Kampala already travel to Industrial Area to compare suppliers, which means a showroom here inherits footfall that a standalone location has to buy. Fifth Street carries steady commercial traffic through the working day, and the district connects directly to the CBD and the Jinja Road corridor.",
        ],
      },
    ],
    unitSlugs: ["unit-2-625sqm", "unit-5-615sqm", "unit-6-660sqm"],
    faqs: [
      {
        question: "Can I build a mezzanine in the showroom?",
        answer:
          "The 6-metre floor-to-floor height allows for a mezzanine sales or office deck subject to structural approval and landlord consent. Raise it with the leasing team at the fit-out proposal stage.",
      },
      {
        question: "Can I put signage on the frontage?",
        answer:
          "Yes. There is provision for tenant signage on the frontage, coordinated with the landlord so the elevation stays consistent across tenancies.",
      },
      {
        question: "How much frontage does each unit get?",
        answer:
          "The building has approximately 77.1 metres of frontage in total, shared across the ground-floor units. Frontage per unit depends on which unit you take - ask the leasing team for the dimensioned plan.",
      },
    ],
  },
  {
    slug: "retail-space-for-rent-on-fifth-street",
    title: "Retail Space for Rent on Fifth Street, Kampala | Parking at the Door",
    description:
      "Retail space for rent on Fifth Street, Industrial Area, Kampala: 570-625 m² ground-floor units with level access, 31 parking bays, full-height glazing and secure forecourt.",
    h1: "Retail Space for Rent on Fifth Street",
    eyebrow: "Retail",
    intro: [
      "Retail in Kampala lives or dies on two things the landlord controls: whether a customer can park, and whether they can see you from the road. Fifth Street gives you the traffic; the building gives you 31 bays inside a secure forecourt and an unbroken glazed elevation facing it.",
      "Four ground-floor units of 570 to 625 m² open straight onto that forecourt, with parking immediately in front of the glass rather than across a shared service yard.",
    ],
    image: "/images/unit-3-supermarket.webp",
    imageAlt:
      "Retail space for rent on Fifth Street, Kampala, fitted as a supermarket with produce displays and checkout lanes",
    sections: [
      {
        heading: "Parking that customers will actually use",
        paragraphs: [
          "31 on-plot bays sit inside the fenced forecourt with a guardhouse at the entrance and a second at the exit. Customers park within sight of the shop door, which matters for anyone carrying purchases, pushing a trolley, or leaving a car unattended in a city where secure parking is a real consideration.",
          "Separate entry and exit means the forecourt does not gridlock at peak trading hours.",
        ],
        bullets: [
          "31 secure on-plot parking bays",
          "Parking immediately in front of the units",
          "Separate vehicle entrance and exit",
          "Level, trolley-friendly access from the forecourt",
          "Perimeter fencing and two guardhouses",
          "Terrazzo floors ready for retail fit-out",
        ],
      },
      {
        heading: "Ground-floor units suited to retail",
        paragraphs: [
          "Unit 3 at 625 m² is positioned as the ground-floor anchor and is the natural home for a supermarket, pharmacy-led convenience anchor or bank branch. Unit 2, also 625 m², suits an electronics or appliance retailer with the depth for feature displays and a service counter.",
          "Units 1 and 4 at 570 m² each work for specialist retail, dealerships and finishes showrooms. Any two adjacent units combine, giving up to 1,250 m² of contiguous retail on the ground floor.",
        ],
      },
      {
        heading: "Trading conditions on Fifth Street",
        paragraphs: [
          "Fifth Street is a working commercial street rather than a mall corridor, which means your neighbours are other businesses drawing their own trade rather than competing for the same shopper. The 6-metre height and full-height glazing let a retail fit-out read as a destination from the road instead of a unit in a terrace.",
        ],
      },
    ],
    unitSlugs: ["unit-1-570sqm", "unit-2-625sqm", "unit-3-625sqm"],
    faqs: [
      {
        question: "Is the parking reserved for my customers?",
        answer:
          "The 31 bays serve the building. Allocation between tenancies is agreed as part of the lease - tell the leasing team how many bays your operation needs.",
      },
      {
        question: "Can I trade outside normal hours?",
        answer:
          "Trading hours are agreed in the lease. The second floor is designed for extended and evening hours, and ground-floor arrangements are discussed case by case.",
      },
      {
        question: "Is there space for storage behind the shop floor?",
        answer:
          "Each unit is a single open floor plate that you partition to suit, so back-of-house storage is carved out of your own area. Goods reach the units through the forecourt and two service lifts.",
      },
    ],
  },
  {
    slug: "car-dealership-showroom-for-rent",
    title: "Car Dealership Showroom for Rent in Kampala | Level Vehicle Access, 6 m Height",
    description:
      "Car and motorcycle dealership showroom for rent in Kampala: 570 m² ground-floor unit with level vehicle access from the forecourt, 6 m headroom and customer parking at the door.",
    h1: "Car Dealership Showroom for Rent in Kampala",
    eyebrow: "Automotive",
    intro: [
      "A dealership needs three things a standard retail unit cannot give you: a way to drive stock onto the display floor, height so the cars do not sit under a low ceiling, and glass so the street sees the stock rather than a shopfront.",
      "Unit 1 at 570 m² on the ground floor was planned around exactly that, and the render on this site shows it fitted as a car and motorcycle dealership with a sales desk and customer lounge.",
    ],
    image: "/images/unit-1-dealership.webp",
    imageAlt:
      "Car dealership showroom for rent in Kampala with vehicles and motorcycles displayed behind full-height glazing",
    sections: [
      {
        heading: "Driving stock onto the floor",
        paragraphs: [
          "Ground-floor units have level access directly from the internal forecourt, so vehicles are driven in rather than craned or ramped. Deliveries arrive through a controlled entrance with a separate exit, which keeps a transporter unloading without blocking customer arrivals.",
          "The 6-metre floor-to-floor height carries showroom lighting rigs, raised display platforms and stacked motorcycle display without the ceiling closing in on the stock.",
        ],
        bullets: [
          "570 m² ground-floor unit with level vehicle access",
          "6 m floor-to-floor height for display rigs and platforms",
          "6 m structural grid keeping sightlines clear across the stock",
          "Full-height glazing facing Fifth Street",
          "Customer parking directly outside the glass",
          "Terrazzo floors that take vehicle loading",
        ],
      },
      {
        heading: "Sales floor, service reception and handover",
        paragraphs: [
          "570 m² is enough to run a display floor, a sales desk, a customer lounge and a service reception in one tenancy without the layout feeling compromised. The open grid means you can zone the space rather than work around columns.",
          "If the operation needs more, Unit 2 next door at 625 m² combines with Unit 1 to give 1,195 m² of contiguous ground-floor space - enough to separate new stock, used stock and aftersales.",
        ],
      },
      {
        heading: "Being seen by buyers",
        paragraphs: [
          "Industrial Area is where Kampala buyers already go to compare vehicles, parts and machinery. A lit dealership behind full-height glass on Fifth Street works as its own advertising, particularly at dusk when the glazed elevation reads from a distance.",
        ],
      },
    ],
    unitSlugs: ["unit-1-570sqm", "unit-2-625sqm", "unit-4-570sqm"],
    faqs: [
      {
        question: "Can vehicles be driven into the showroom?",
        answer:
          "Yes. Ground-floor units have level access from the internal forecourt, so vehicles enter the display floor directly.",
      },
      {
        question: "Is there room for a workshop or service bay?",
        answer:
          "The units are display and sales floors rather than workshops. Service reception works well here; talk to the leasing team about servicing arrangements and any works requiring drainage or extraction.",
      },
      {
        question: "Can I display motorcycles and cars together?",
        answer:
          "Yes - the concept render for Unit 1 shows exactly that, with a motorcycle display against the glazing and cars on the main floor.",
      },
    ],
  },
  {
    slug: "supermarket-space-for-rent",
    title: "Supermarket Space for Rent in Kampala | 625 m² Anchor Unit with Parking",
    description:
      "Supermarket space for rent in Kampala: 625 m² ground-floor anchor unit at Alam Business Centre with trolley-level access, 31 parking bays and goods-lift servicing.",
    h1: "Supermarket Space for Rent in Kampala",
    eyebrow: "Grocery and convenience",
    intro: [
      "A supermarket is a logistics operation with a shopfront attached. The site has to work for a delivery truck at 6am, a trolley at 6pm, and a chiller run in between - and it has to have enough parking that a weekly shop is practical.",
      "Unit 3 at 625 m² is positioned as the ground-floor anchor at Alam Business Centre, with level access from the forecourt and the building's parking directly in front of it.",
    ],
    image: "/images/unit-3-supermarket.webp",
    imageAlt:
      "Supermarket space for rent in Kampala with fresh-produce displays, chilled aisles, bakery counter and checkout lanes",
    sections: [
      {
        heading: "Trolleys, deliveries and back-of-house",
        paragraphs: [
          "The floor plate is level with the forecourt, so trolleys run from the checkout to a parked car without a ramp or a threshold. Deliveries come off the forecourt into the same level, and the two service lifts handle anything routed through the building.",
          "At 625 m² on an open 6-metre grid you can lay out produce at the entrance, dry goods through the middle, chilled and frozen against the rear wall where the plant runs, and carve back-of-house storage and a bakery prep area out of the same tenancy.",
        ],
        bullets: [
          "625 m² anchor position on the ground floor",
          "Level, trolley-friendly access from the forecourt",
          "31 on-plot parking bays for the weekly shop",
          "Water and drainage provision for fresh and bakery counters",
          "Three-phase power provision for refrigeration",
          "Goods-lift access and secure overnight forecourt",
        ],
      },
      {
        heading: "Catchment and trading",
        paragraphs: [
          "Industrial Area carries a substantial daytime working population alongside the residential catchment around Central Division, which gives a grocery operator two distinct trading patterns: lunchtime and after-work convenience on weekdays, and full shops at the weekend.",
          "Secure parking behind a fenced perimeter with two guardhouses is a genuine differentiator for evening trade.",
        ],
      },
      {
        heading: "Room to grow into",
        paragraphs: [
          "If 625 m² is tight for the format you run, Unit 3 combines with Unit 2 or Unit 4 either side, giving 1,250 m² or 1,195 m² of contiguous ground-floor space for a full-line supermarket with a wider fresh offer.",
        ],
      },
    ],
    unitSlugs: ["unit-3-625sqm", "unit-2-625sqm", "unit-4-570sqm"],
    faqs: [
      {
        question: "Is there power provision for refrigeration?",
        answer:
          "Three-phase power provision is available to the units. Confirm your connected load with the leasing team so it can be checked against the incoming supply at fit-out stage.",
      },
      {
        question: "Can I install chillers and a bakery?",
        answer:
          "Water and drainage provision is available for retail and hospitality fit-outs. Chiller plant, extraction and drainage runs are agreed as part of the fit-out proposal.",
      },
      {
        question: "How many parking bays would a supermarket get?",
        answer:
          "The building has 31 bays in total. Allocation is agreed in the lease and reflects the trading pattern of each tenancy - raise your requirement early in the discussion.",
      },
    ],
  },
  {
    slug: "corporate-office-space-for-rent",
    title: "Corporate Office Space for Rent in Kampala | 615-660 m² Daylit Floors",
    description:
      "Corporate office space for rent in Kampala: 615-660 m² first-floor plates at Alam Business Centre with full-height glazing, porcelain finishes, lift access and secure parking.",
    h1: "Corporate Office Space for Rent in Kampala",
    eyebrow: "Offices",
    intro: [
      "Most office space in Kampala is either a converted floor in an older block or a small suite in a shared building. Neither reads well when a regional director or a client visits, and neither gives you a floor plate you can lay out from scratch.",
      "The first floor at Alam Business Centre offers 615 to 660 m² plates with continuous daylight, a secure shared lobby and lift access - enough for a reception, open-plan desking, meeting suites and a boardroom in one tenancy.",
    ],
    image: "/images/unit-8-offices.webp",
    imageAlt:
      "Corporate office space for rent in Kampala with reception, open-plan desking and a glazed boardroom",
    sections: [
      {
        heading: "A floor plate you can plan properly",
        paragraphs: [
          "A 6-metre structural grid means partitions land where the plan wants them rather than where the columns allow. Full-height glazing on the principal elevations pushes daylight deep into the plate, which matters for desk positions along the internal wall.",
          "Porcelain tiles run through office and facility areas, terrazzo through circulation, and partitioning is flexible so the layout can change as headcount does.",
        ],
        bullets: [
          "615 m² (Unit 8) and 660 m² (Unit 7) first-floor plates",
          "Full-height glazing and deep natural daylight",
          "Porcelain tiles within office areas",
          "Flexible partitioning for cellular and open-plan mixes",
          "Two service lifts and two staircases",
          "Shared washroom facilities on the floor",
        ],
      },
      {
        heading: "Arrival matters for a head office",
        paragraphs: [
          "Visitors arrive through a controlled entrance into a secure forecourt, park on-plot, and come up through a shared lobby rather than off the street. For a regional office, a bank's head function or a professional practice, that sequence does a lot of the work before anyone reaches reception.",
        ],
      },
      {
        heading: "Scaling from one floor plate to two",
        paragraphs: [
          "Units 7 and 8 sit adjacent and combine into 1,275 m², which suits an organisation running a public-facing function alongside back-office - a bank with a branch and its head function, or a company with client-facing and operational teams on one floor.",
        ],
      },
    ],
    unitSlugs: ["unit-8-615sqm", "unit-7-660sqm", "unit-4-570sqm"],
    faqs: [
      {
        question: "Is the office space partitioned or open?",
        answer:
          "Units are handed over as open plates with flexible partitioning, so you set the balance of open-plan, cellular offices and meeting rooms in your own fit-out.",
      },
      {
        question: "Is there lift access for staff and visitors?",
        answer:
          "Two service lifts and two staircases serve all floors, with a shared secure lobby on the first floor.",
      },
      {
        question: "Can we get dedicated staff parking?",
        answer:
          "Parking allocation from the 31 on-plot bays is agreed as part of the lease. Tell the leasing team your headcount and visitor pattern.",
      },
    ],
  },
  {
    slug: "restaurant-space-for-rent",
    title: "Restaurant Space for Rent in Kampala | Second Floor with City Views",
    description:
      "Restaurant and bar space for rent in Kampala on the second floor of Alam Business Centre, Fifth Street - panoramic glazing, servicing routes, parking and extended trading hours.",
    h1: "Restaurant Space for Rent in Kampala",
    eyebrow: "Hospitality",
    intro: [
      "A restaurant needs a view, a kitchen route and a car park - in that order of what customers notice and reverse order of what usually kills a site. The second floor at Alam Business Centre has all three.",
      "Areas on the second floor are available on application and configured to the operator, so the kitchen, bar and cover count are planned around your concept rather than inherited from a previous tenant.",
    ],
    image: "/images/concept-restaurant.webp",
    imageAlt:
      "Restaurant and bar space for rent in Kampala on the second floor with open kitchen, bar counter and panoramic glazing",
    sections: [
      {
        heading: "The room and the view",
        paragraphs: [
          "Two floors up with panoramic glazing, the dining room looks out over Industrial Area and the city beyond rather than into passing traffic. That is the difference between a lunch trade and an evening destination.",
          "The concept render on this site shows a full-service layout: open kitchen, bar with a counter run along the glazing, banquette and loose seating, and a lounge zone at the entrance.",
        ],
        bullets: [
          "Area configured to the operator, available on application",
          "Panoramic glazing with long views over Kampala",
          "Dedicated hospitality servicing routes",
          "Two service lifts for kitchen deliveries and waste",
          "Water and drainage provision for kitchen fit-out",
          "31 secure on-plot parking bays for evening trade",
        ],
      },
      {
        heading: "Servicing a kitchen two floors up",
        paragraphs: [
          "Kitchen deliveries and waste run through dedicated servicing routes and the building's two service lifts, so goods never cross the dining room. Water and drainage provision is available for the kitchen and bar fit-out, with extraction routes agreed at fit-out stage.",
        ],
      },
      {
        heading: "Trading into the evening",
        paragraphs: [
          "The second floor is designed for extended and evening hours, with a secure fenced forecourt and two guardhouses - which is what makes an evening restaurant viable here. Neighbouring second-floor uses such as a gym, spa or events lounge bring their own footfall past your door.",
        ],
      },
    ],
    unitSlugs: [],
    faqs: [
      {
        question: "How big is the restaurant space?",
        answer:
          "Second-floor areas are available on application and configured to the operator. Tell the leasing team your target cover count and kitchen requirement and they will come back with the area that fits.",
      },
      {
        question: "Can I install a commercial kitchen?",
        answer:
          "Yes. Water and drainage provision is available, and extraction, gas and plant routes are agreed as part of the fit-out proposal.",
      },
      {
        question: "Is there a separate entrance for evening guests?",
        answer:
          "The second floor is planned for extended-hours uses with its own arrival arrangements. Discuss the access pattern your concept needs with the leasing team.",
      },
    ],
  },
  {
    slug: "gym-and-wellness-space-for-rent",
    title: "Gym & Wellness Space for Rent in Kampala | Second-Floor Studio and Spa Space",
    description:
      "Gym, spa, yoga and wellness space for rent in Kampala on the second floor of Alam Business Centre - column-light floors, wet-area provision, parking and city views.",
    h1: "Gym and Wellness Space for Rent in Kampala",
    eyebrow: "Leisure and wellness",
    intro: [
      "Fitness and wellness operators need three things that are hard to find together in Kampala: a big column-light floor, drainage for wet areas, and parking that members will use at 6am and 8pm.",
      "The second floor at Alam Business Centre carries all three, with the area configured to the operator rather than fixed in advance.",
    ],
    image: "/images/concept-gym.webp",
    imageAlt:
      "Gym and wellness space for rent in Kampala with cardio equipment, free-weight area, sauna and steam rooms",
    sections: [
      {
        heading: "Floor, plant and wet areas",
        paragraphs: [
          "A 6-metre structural grid gives the open runs a gym floor needs: cardio along the glazing, a rig and free-weight zone in the middle, and a functional area without columns interrupting a sled track.",
          "Sauna, steam, changing rooms, hydrotherapy and treatment suites all need drainage, water and ventilation. Water and drainage provision is available, with the routes agreed as part of the fit-out proposal.",
        ],
        bullets: [
          "Column-light floor plate on a 6 m grid",
          "Area configured to the operator, available on application",
          "Water and drainage provision for wet areas",
          "Panoramic glazing for studio and cardio floors",
          "Two service lifts for equipment delivery",
          "Secure forecourt parking for early and late sessions",
        ],
      },
      {
        heading: "Three concepts the floor supports",
        paragraphs: [
          "The renders on this site show three distinct fit-outs: a full gym with sauna and steam suites; a wellness spa with a reception lounge, private treatment rooms and a hydrotherapy pool; and a yoga and fitness studio with timber flooring, mirrored walls and a members' lounge.",
          "All three benefit from the same thing - a floor two levels up with long views and no passing traffic at the window.",
        ],
      },
      {
        heading: "Members arriving safely",
        paragraphs: [
          "Perimeter fencing, two guardhouses and 31 on-plot bays make early-morning and evening sessions practical, which is when most gym and studio revenue is earned. Neighbouring hospitality uses on the same floor add to the reasons a member stays on site after a session.",
        ],
      },
    ],
    unitSlugs: [],
    faqs: [
      {
        question: "Is there enough floor loading for gym equipment?",
        answer:
          "Equipment loading, particularly for free-weight areas and any pool, is confirmed against the structural design during the fit-out proposal. Share your equipment schedule early.",
      },
      {
        question: "Can we install a sauna, steam room and pool?",
        answer:
          "The concept renders show sauna, steam and hydrotherapy fit-outs. Water, drainage and ventilation provision is available and the detailed routes are agreed at fit-out stage.",
      },
      {
        question: "How is equipment delivered to the second floor?",
        answer: "Through the building's two service lifts and dedicated servicing routes.",
      },
    ],
  },
  {
    slug: "large-commercial-units-in-kampala",
    title: "Large Commercial Units in Kampala | 1,195-4,940 m² Combined Space",
    description:
      "Large commercial units for rent in Kampala: combine adjacent units for 1,195-1,320 m², take a full floor of 2,390 or 2,550 m², or lease the whole 4,940 m² Phase One building.",
    h1: "Large Commercial Units in Kampala",
    eyebrow: "Large-format space",
    intro: [
      "Finding a genuinely large, contiguous commercial floor in Kampala is difficult. Most large requirements end up split across buildings or across floors of a block that was never designed for a single occupier.",
      "Alam Business Centre is designed to consolidate. Adjacent units combine, full floors let as one, and the entire 4,940 m² of Phase One can go to a single tenant.",
    ],
    image: "/images/exterior-aerial-dusk.webp",
    imageAlt:
      "Aerial view of Alam Business Centre in Kampala showing the full 4,940 m² Phase One building and forecourt",
    sections: [
      {
        heading: "The combinations available",
        paragraphs: [
          "On the ground floor, Units 1 and 2 give 1,195 m², Units 2 and 3 give 1,250 m², and Units 3 and 4 give 1,195 m². On the first floor, Units 5 and 6 give 1,275 m², Units 6 and 7 give 1,320 m² - the largest contiguous pair in the building - and Units 7 and 8 give 1,275 m².",
          "A full ground floor is 2,390 m². A full first floor is 2,550 m². Together with the second floor, Phase One totals 4,940 m² of lettable area.",
        ],
        bullets: [
          "1,195 - 1,320 m² from two adjacent units",
          "2,390 m² for the whole ground floor",
          "2,550 m² for the whole first floor",
          "4,940 m² for the whole of Phase One",
          "Second-floor area configured on application",
          "One landlord, one lease, one service charge",
        ],
      },
      {
        heading: "Why one large tenancy beats several small ones",
        paragraphs: [
          "A single large tenancy removes the coordination cost of running an operation across separate landlords, leases and service charges. Staff move between functions without leaving the building, deliveries land in one forecourt, and your brand takes the whole frontage rather than a share of it.",
          "For distributors and multi-format retailers, taking a full floor also means the layout is planned end to end instead of assembled from whatever units happened to be free.",
        ],
      },
      {
        heading: "Who takes space at this scale",
        paragraphs: [
          "Regional distributors, multi-brand retail groups, banks consolidating branch and head-office functions, corporate headquarters, and international companies establishing a Ugandan base. If the requirement spans display, office and storage, the building can carry all three in one tenancy.",
        ],
      },
    ],
    unitSlugs: ["unit-6-660sqm", "unit-7-660sqm", "unit-3-625sqm"],
    faqs: [
      {
        question: "What is the largest single contiguous area?",
        answer:
          "A full first floor at 2,550 m², or the whole of Phase One at 4,940 m² across all levels. The largest two-unit combination is Units 6 and 7 at 1,320 m².",
      },
      {
        question: "Is there a discount for taking a full floor?",
        answer:
          "Terms for full-floor and whole-building lettings are negotiated directly. Register your interest with the area you need and the leasing team will respond with a proposal.",
      },
      {
        question: "Can we phase our expansion?",
        answer:
          "Talk to the leasing team about taking one unit now with an option on the adjacent unit. Arrangements of this kind are agreed case by case.",
      },
    ],
  },
  {
    slug: "commercial-property-near-jinja-road",
    title: "Commercial Property Near Jinja Road, Kampala | Fifth Street, Industrial Area",
    description:
      "Commercial property for rent near Jinja Road, Kampala: showroom, retail and office units of 570-660 m² on Fifth Street, Industrial Area, with direct corridor access and on-plot parking.",
    h1: "Commercial Property Near Jinja Road",
    eyebrow: "Jinja Road corridor",
    intro: [
      "If your business moves goods, the Jinja Road corridor is the road that matters in Kampala. It carries freight east towards Jinja and the border, and it is the route most regional distribution runs on.",
      "Alam Business Centre sits on Fifth Street in Industrial Area, connected directly to that corridor while staying minutes from the CBD - which means a delivery fleet and a walk-in customer both find you easily.",
    ],
    image: "/images/exterior-corner-entrance.webp",
    imageAlt:
      "Commercial property near Jinja Road, Kampala - the corner elevation and controlled vehicle entrance at Alam Business Centre",
    sections: [
      {
        heading: "What the location connects to",
        paragraphs: [
          "Industrial Area sits between the CBD and the eastern approach to the city, which is why it has stayed Kampala's commercial and distribution district. From Fifth Street you reach the city centre in minutes, the Jinja Road corridor directly, and Port Bell Road for the lakeside industrial belt.",
          "The Northern Bypass gives goods vehicles a route around the centre, and Entebbe Road connects to the airport via the southern route.",
        ],
        bullets: [
          "Direct access to the Jinja Road corridor",
          "Minutes from Kampala CBD",
          "Adjacent to the Nakawa commercial district",
          "Port Bell Road for the lakeside industrial belt",
          "Northern Bypass for goods vehicles avoiding the centre",
          "Entebbe Road for airport access",
        ],
      },
      {
        heading: "A site built for vehicles",
        paragraphs: [
          "Separate vehicle entrance and exit means a delivery vehicle is never reversing against arriving customers. 31 on-plot bays sit inside a fenced forecourt with two guardhouses, and ground-floor units take vehicles at floor level.",
          "For distribution-led businesses, that combination - corridor access outside, controlled circulation inside - is what makes a city-fringe site work without the compromises of an out-of-town shed.",
        ],
      },
      {
        heading: "Space available on the corridor",
        paragraphs: [
          "Eight units of 570 to 660 m² across two floors, combinable in pairs, full floors of 2,390 and 2,550 m², and a second floor for leisure, hospitality and offices. Terrazzo floors, 6-metre heights and full-height glazing throughout.",
        ],
      },
    ],
    unitSlugs: ["unit-2-625sqm", "unit-4-570sqm", "unit-6-660sqm"],
    faqs: [
      {
        question: "How far is the site from the city centre?",
        answer:
          "Industrial Area adjoins the CBD, so the centre is a short drive from Fifth Street outside peak traffic.",
      },
      {
        question: "Can articulated vehicles reach the site?",
        answer:
          "The forecourt has a separate entrance and exit and is designed for commercial vehicle circulation. Confirm your largest vehicle size with the leasing team when you view.",
      },
      {
        question: "Is there overnight vehicle security?",
        answer:
          "The site has perimeter fencing to the full boundary and two guardhouses controlling entry and exit.",
      },
    ],
  },
];

export function getSeoPage(slug: string) {
  return seoPages.find((page) => page.slug === slug);
}

export function unitsForPage(page: SeoPage): Unit[] {
  return page.unitSlugs
    .map((slug) => units.find((unit) => unit.slug === slug))
    .filter((unit): unit is Unit => Boolean(unit));
}
