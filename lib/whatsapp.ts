import { property } from "@/lib/property";

/**
 * Message builders live outside the client bundle so server components can
 * compose WhatsApp links without pulling in the interactive action modules.
 */

export function whatsappHref(message: string) {
  return `https://wa.me/${property.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const GENERAL_WHATSAPP_MESSAGE =
  "Hello, I am interested in leasing commercial space at Alam Business Center on Fifth Street. Please share the available units and lease terms.";

export function unitWhatsappMessage(unitName: string, floorName: string, area: number) {
  return `Hello, I am interested in ${unitName}, ${floorName}, ${area} m² at Alam Business Center. Please send me the availability and lease terms.`;
}
