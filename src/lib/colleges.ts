export const COLLEGES = [
    // IITs
    "IIT Bombay",
    "IIT Delhi",
    "IIT Madras",
    "IIT Kanpur",
    "IIT Kharagpur",
    "IIT Roorkee",
    "IIT Hyderabad",
    "IIT BHU Varanasi",
    // Top Institutes
    "BITS Pilani",
    "NIT Trichy",
    "NIT Warangal",
    "NIT Surathkal",
    "Delhi University",
    "VIT Vellore",
    "SRM Chennai",
    "Manipal Institute of Technology",
    "IIIT Hyderabad",
    "Christ University Bangalore",
    "Amity University",
    "Lovely Professional University",
    // Other
    "Other",
] as const;

export type College = (typeof COLLEGES)[number];
