import type { ItService } from "@/types";

// The IT services catalogue is site content: the backend has no endpoint for it
// (GET /services/ returns customer requests, not the services on offer).
export const itServiceCatalogue: ItService[] = [
  {
    id: "consulting",
    name: "IT Consulting",
    description: "A clear technology roadmap for your business.",
    icon: "consulting",
  },
  {
    id: "support",
    name: "Technical Support",
    description: "Fast, friendly help when you need it most.",
    icon: "support",
  },
  {
    id: "network",
    name: "Network & Setup",
    description: "Connected offices, secure networks, seamless work.",
    icon: "network",
  },
];
