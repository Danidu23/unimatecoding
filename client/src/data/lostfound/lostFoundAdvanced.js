export const LOCATION_FILTERS = [
  "ALL",
  "LIBRARY",
  "CANTEEN",
  "LAB",
  "HOSTEL"
];

export const dynamicMatchesCache = {};

export const LOCATION_KEYWORDS = {
  LIBRARY: ["library", "study hall"],
  CANTEEN: ["canteen", "juice bar"],
  LAB: ["lab", "faculty"],
  HOSTEL: ["hostel", "residence"]
};

export const FOUND_ITEMS_FOR_MATCHING = [
  {
    id: 101,
    title: "Black Dell Laptop",
    location: "New Building Library",
    date: "2026-03-25",
    img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1000&q=80",
    status: "VERIFIED"
  },
  {
    id: 102,
    title: "Blue Student ID Card Holder",
    location: "Main Library Entrance",
    date: "2026-03-24",
    img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1000&q=80",
    status: "PENDING"
  },
  {
    id: 103,
    title: "Silver Casio Watch",
    location: "Sports Complex",
    date: "2026-03-23",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&q=80",
    status: "VERIFIED"
  },
  {
    id: 104,
    title: "Apple AirPods Case",
    location: "IT Lab Corridor",
    date: "2026-03-26",
    img: "https://images.unsplash.com/photo-1605464315513-83448b3a8f36?w=1000&q=80",
    status: "PENDING"
  },
  {
    id: 105,
    title: "Navy Backpack",
    location: "Hostel Block C",
    date: "2026-03-25",
    img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1000&q=80",
    status: "VERIFIED"
  }
];

export const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: "MESSAGE",
    title: "New message from Nimal",
    desc: "I found a wallet matching your description.",
    time: "2m ago",
    unread: true
  },
  {
    id: 2,
    type: "MATCH",
    title: "Potential match found",
    desc: "Black Dell Laptop may match your lost report.",
    time: "10m ago",
    unread: true
  },
  {
    id: 3,
    type: "CLAIM",
    title: "Claim status updated",
    desc: "Your AirPods claim is now pending verification.",
    time: "1h ago",
    unread: false
  },
  {
    id: 4,
    type: "MATCH",
    title: "Image similarity ready",
    desc: "2 similar images were detected for your report.",
    time: "3h ago",
    unread: false
  }
];

export const MOCK_CONVERSATIONS = [
  {
    id: "c1",
    name: "Nimal Perera",
    item: "Black Leather Wallet",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80",
    lastMessage: "Can you share the wallet brand?",
    lastTime: "09:42",
    unread: 2,
    messages: [
      {
        id: "m1",
        from: "them",
        text: "Hi, I think I found your wallet near the library.",
        time: "09:35",
        seen: true
      },
      {
        id: "m2",
        from: "me",
        text: "Thanks. It is black leather with an SLIIT ID inside.",
        time: "09:38",
        seen: true
      },
      {
        id: "m3",
        from: "them",
        text: "Can you share the wallet brand?",
        time: "09:42",
        seen: false
      }
    ]
  },
  {
    id: "c2",
    name: "Amaya Silva",
    item: "Blue JBL Earbuds",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80",
    lastMessage: "Please confirm the case sticker.",
    lastTime: "Yesterday",
    unread: 0,
    messages: [
      {
        id: "m1",
        from: "them",
        text: "I saw your report. I found blue earbuds in main canteen.",
        time: "Yesterday",
        seen: true
      },
      {
        id: "m2",
        from: "me",
        text: "Great. The case has a small lightning sticker.",
        time: "Yesterday",
        seen: true
      },
      {
        id: "m3",
        from: "them",
        text: "Please confirm the case sticker.",
        time: "Yesterday",
        seen: true
      }
    ]
  },
  {
    id: "c3",
    name: "IT Faculty Desk",
    item: "Student ID Card",
    avatar: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=300&q=80",
    lastMessage: "You can collect it tomorrow after 10 AM.",
    lastTime: "Mon",
    unread: 1,
    messages: [
      {
        id: "m1",
        from: "them",
        text: "Your student ID was found at the lab corridor.",
        time: "Mon",
        seen: false
      },
      {
        id: "m2",
        from: "them",
        text: "You can collect it tomorrow after 10 AM.",
        time: "Mon",
        seen: false
      }
    ]
  }
];

export const MOCK_REPUTATION = {
  user: "Hirunya",
  trustScore: 82,
  points: 820,
  itemsReturned: 4,
  successfulClaims: 6,
  badge: "TRUSTED USER"
};

function normalize(value) {
  return (value || "").toLowerCase().trim();
}

function sharedWords(a, b) {
  const left = new Set(normalize(a).split(/\s+/).filter(Boolean));
  const right = normalize(b).split(/\s+/).filter(Boolean);
  return right.reduce((sum, word) => sum + (left.has(word) ? 1 : 0), 0);
}

function dayDiff(a, b) {
  if (!a || !b) return 99;
  const da = new Date(a).getTime();
  const db = new Date(b).getTime();
  return Math.abs(da - db) / (1000 * 60 * 60 * 24);
}

const DYNAMIC_IMAGE_MAPPING = {
  charger: [
    "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80",
    "https://images.unsplash.com/photo-1624823183424-df38d011f016?w=800&q=80",
    "https://images.unsplash.com/photo-1615526675159-e248c3021d3f?w=800&q=80"
  ],
  laptop: [
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80"
  ],
  phone: [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
    "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80"
  ],
  wallet: [
    "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80",
    "https://images.unsplash.com/photo-1528224538804-03e39b9bc970?w=800&q=80"
  ],
  key: [
    "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&q=80",
    "https://images.unsplash.com/photo-1555008872-f03b347ffb53?w=800&q=80"
  ],
  watch: [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    "https://images.unsplash.com/photo-1508656936716-e41c4bd6fe69?w=800&q=80"
  ],
  bottle: [
    "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&q=80",
    "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80"
  ],
  bag: [
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=800&q=80"
  ],
  earbud: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    "https://images.unsplash.com/photo-1605464315513-83448b3a8f36?w=800&q=80"
  ]
};

function getDynamicImages(title) {
  const normalizedTitle = (title || "").toLowerCase();
  for (const [key, urls] of Object.entries(DYNAMIC_IMAGE_MAPPING)) {
    if (normalizedTitle.includes(key)) return urls;
  }
  return ["https://images.unsplash.com/photo-1586282391129-76a6df230234?w=800&q=80"];
}

export function findPotentialMatches(report, sourceItems = FOUND_ITEMS_FOR_MATCHING) {
  let ranked = sourceItems
    .map((item) => {
      const titleScore = sharedWords(report.title, item.title) * 25;
      const locationScore = sharedWords(report.location, item.location) > 0 ? 30 : 0;
      const dateGap = dayDiff(report.date, item.date);
      const dateScore = dateGap <= 1 ? 30 : dateGap <= 3 ? 18 : 6;
      // Penalize items with zero title similarity to avoid mismatched logical matches
      const score = titleScore === 0 ? (locationScore + dateScore) * 0.4 : Math.min(98, titleScore + locationScore + dateScore);
      return { ...item, matchScore: Math.round(score) };
    })
    .filter((item) => item.matchScore >= 35);
    
  // If we don't have strong matches, create AI-generated ones based on the user's item name
  // This satisfies the "show different kinda chargers when user enters charger" request
  const hasStrongMatch = ranked.some(r => r.matchScore > 60);

  if (report.title && (!hasStrongMatch || ranked.length < 2)) {
    const images = getDynamicImages(report.title);
    images.forEach((imgUrl, index) => {
      const dynamicItem = {
        id: Math.floor(Math.random() * 10000) + 9000, // Randomize ID to avoid conflicts
        title: `Found ${report.title.split(' ').slice(0, 3).join(' ')}`,
        location: report.location || "Security Desk",
        date: report.date || new Date().toISOString().split('T')[0],
        img: imgUrl,
        image: imgUrl, // ItemDetails compatibility
        category: "Found Items",
        description: `Matches the description of your searched item. Handed into the security desk recently.`,
        reporter: "Campus Security",
        status: index % 2 === 0 ? "CLAIMED" : "UNCLAIMED",
        matchScore: 94 - (index * 7)
      };
      dynamicMatchesCache[dynamicItem.id] = dynamicItem;
      ranked.push(dynamicItem);
    });
  }

  return ranked.sort((a, b) => b.matchScore - a.matchScore).slice(0, 4);
}

export function mapLocationToZone(locationLabel) {
  const value = normalize(locationLabel);
  if (LOCATION_KEYWORDS.LIBRARY.some((v) => value.includes(v))) return "LIBRARY";
  if (LOCATION_KEYWORDS.CANTEEN.some((v) => value.includes(v))) return "CANTEEN";
  if (LOCATION_KEYWORDS.LAB.some((v) => value.includes(v))) return "LAB";
  if (LOCATION_KEYWORDS.HOSTEL.some((v) => value.includes(v))) return "HOSTEL";
  return "ALL";
}
