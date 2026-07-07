// ─── Mock Data for Nexa App ────────────────────────────────────────────────

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
  level: number;
  rank?: string;
}

export interface LFGPost {
  id: string;
  user: User;
  game: string;
  gameColor: string;
  gameEmoji: string;
  gameCover: string;
  description: string;
  lookingFor: string;
  platform: string[];
  playersNeeded: number;
  playtime: string;
  timestamp: string;
  tags: string[];
  likes: number;
  comments: number;
  behaviorScore: number;
}

export interface Group {
  id: string;
  name: string;
  tag: string;
  description: string;
  game: string;
  gameEmoji: string;
  members: number;
  maxMembers: number;
  isOpen: boolean;
  rank: string;
  banner: string;
  activity: 'very active' | 'active' | 'moderate';
}

export interface Message {
  id: string;
  user: User;
  lastMessage: string;
  timestamp: string;
  unread: number;
  isGroup?: boolean;
}

export interface Clip {
  id: string;
  thumbnail: string;
  game: string;
  views: string;
  duration: string;
  title: string;
}

// ─── Mock Users ────────────────────────────────────────────────────────────
export const MOCK_USERS: User[] = [
  { id: 'u1', username: 'wyseria',    displayName: 'Wyseria',    avatar: '/avatars/wyseria.png',   status: 'online',  level: 42, rank: 'Diamond' },
  { id: 'u2', username: 'voxel_rex',  displayName: 'VoxelRex',   avatar: '/avatars/user2.png',     status: 'online',  level: 38, rank: 'Platinum' },
  { id: 'u3', username: 'lunara99',   displayName: 'Lunara',     avatar: '/avatars/user3.png',     status: 'away',    level: 55, rank: 'Radiant' },
  { id: 'u4', username: 'zephyr_x',  displayName: 'ZephyrX',    avatar: '/avatars/user4.png',     status: 'offline', level: 29, rank: 'Gold' },
  { id: 'u5', username: 'nyx_blade',  displayName: 'NyxBlade',   avatar: '/avatars/user5.png',     status: 'online',  level: 61, rank: 'Immortal' },
  { id: 'u6', username: 'solara_v',   displayName: 'SolaraV',    avatar: '/avatars/user6.png',     status: 'online',  level: 33, rank: 'Silver' },
];

// Profile data for logged-in user
export const MY_PROFILE: User & {
  bio: string;
  banner: string;
  favoriteGames: { name: string; emoji: string; hours: number; badge: string }[];
  accounts: { platform: string; id: string; verified: boolean; icon: string }[];
  stats: { label: string; value: string }[];
} = {
  id: 'u1',
  username: 'wyseria',
  displayName: 'Wyseria',
  avatar: '/avatars/wyseria.png',
  status: 'online',
  level: 42,
  rank: 'Diamond',
  bio: 'Casual-competitive gamer 🎮 | Cozy game enthusiast & FPS sweat | Always down to vibe or sweat it out 💜',
  banner: '/banners/wyseria-banner.png',
  favoriteGames: [
    { name: 'Valorant',              emoji: '🔫', hours: 1240, badge: 'badge-valorant' },
    { name: 'Stardew Valley',        emoji: '🌱', hours: 380,  badge: 'badge-stardew'  },
    { name: 'Detroit: Become Human', emoji: '🤖', hours: 95,   badge: 'badge-detroit'  },
  ],
  accounts: [
    { platform: 'Steam',      id: 'wyseria_steam',   verified: true,  icon: '🎮' },
    { platform: 'Epic Games', id: 'wyseria.epic',    verified: true,  icon: '⚡' },
    { platform: 'Discord',    id: 'wyseria#0001',    verified: true,  icon: '💬' },
    { platform: 'Riot ID',    id: 'wyseria#NEXUS',   verified: true,  icon: '🔫' },
  ],
  stats: [
    { label: 'Posts',    value: '48'    },
    { label: 'Matches',  value: '1.2K'  },
    { label: 'Friends',  value: '234'   },
    { label: 'Groups',   value: '7'     },
  ],
};

// ─── Mock LFG Posts ────────────────────────────────────────────────────────
export const MOCK_LFG_POSTS: LFGPost[] = [
  {
    id: 'p1',
    user: MOCK_USERS[1],
    game: 'Valorant',
    gameColor: '#ff4655',
    gameEmoji: '🔫',
    gameCover: '/valorant.jpg',
    description: 'Plat 2 looking for 2 more to rank up tonight. Chill vibes only, comms preferred but not required. Let\'s grind to Diamond 🔥',
    lookingFor: '2 DPS / Support',
    platform: ['PC'],
    playersNeeded: 2,
    playtime: 'Tonight 9PM EST',
    timestamp: '5m ago',
    tags: ['Ranked', 'Chill', 'Comms'],
    likes: 12,
    comments: 4,
    behaviorScore: 9,
  },
  {
    id: 'p2',
    user: MOCK_USERS[2],
    game: 'The Witcher 3',
    gameColor: '#c8973a',
    gameEmoji: '⚔️',
    gameCover: 'https://cdn.akamai.steamstatic.com/steam/apps/292030/header.jpg',
    description: 'Starting a new NG+ run on Death March — looking for someone to discuss builds, quests, and lore. Would love to do a guided playthrough together over voice 🧙',
    lookingFor: '1 Co-explorer',
    platform: ['PC', 'PS5'],
    playersNeeded: 1,
    playtime: 'Weekends 3–6PM',
    timestamp: '23m ago',
    tags: ['Story', 'Co-op', 'NG+'],
    likes: 34,
    comments: 11,
    behaviorScore: 10,
  },
  {
    id: 'p3',
    user: MOCK_USERS[4],
    game: 'Detroit: Become Human',
    gameColor: '#3b82f6',
    gameEmoji: '🤖',
    gameCover: 'https://cdn.akamai.steamstatic.com/steam/apps/1222140/header.jpg',
    description: 'First playthrough — already messed up the Markus story. Anyone want to experience this masterpiece together? All spoilers forbidden, I will cry.',
    lookingFor: '1–2 Story partners',
    platform: ['PC', 'PS4'],
    playersNeeded: 2,
    playtime: 'Right now — desperate',
    timestamp: '1h ago',
    tags: ['Story', 'No Spoilers', 'Chill'],
    likes: 89,
    comments: 27,
    behaviorScore: 3,
  },
  {
    id: 'p4',
    user: MOCK_USERS[5],
    game: 'Red Dead Redemption 2',
    gameColor: '#b45309',
    gameEmoji: '🤠',
    gameCover: 'https://cdn.akamai.steamstatic.com/steam/apps/1174180/header.jpg',
    description: 'Online posse recruiting — trader missions, bounty hunting, moonshiner runs. Serious players only, mic required. The West won\'t tame itself 🌄',
    lookingFor: 'Posse members (3+)',
    platform: ['PC', 'PS5'],
    playersNeeded: 3,
    playtime: 'Open schedule',
    timestamp: '2h ago',
    tags: ['Online', 'Missions', 'Serious'],
    likes: 56,
    comments: 18,
    behaviorScore: 8,
  },
  {
    id: 'p5',
    user: MOCK_USERS[3],
    game: 'Cyberpunk 2077',
    gameColor: '#f9e000',
    gameEmoji: '🌆',
    gameCover: 'https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg',
    description: 'Running Phantom Liberty on hardest difficulty. Need a squad for co-op companion missions. Night City awaits — corpo build preferred 🟡',
    lookingFor: '1–2 Netrunners',
    platform: ['PC'],
    playersNeeded: 2,
    playtime: 'Daily 7–11PM',
    timestamp: '3h ago',
    tags: ['Phantom Liberty', 'Hard Mode', 'Builds'],
    likes: 21,
    comments: 9,
    behaviorScore: 7,
  },
];


// ─── Mock Groups ──────────────────────────────────────────────────────────
export const MOCK_GROUPS: Group[] = [
  {
    id: 'g1',
    name: 'Neon Vanguard',
    tag: 'NVG',
    description: 'Competitive Valorant clan pushing for Radiant. Daily scrims, VOD reviews, and a supportive community.',
    game: 'Valorant',
    gameEmoji: '🔫',
    members: 47,
    maxMembers: 50,
    isOpen: true,
    rank: 'Diamond+',
    banner: '#ff4655',
    activity: 'very active',
  },
  {
    id: 'g2',
    name: 'Cozy Corner',
    tag: 'CCR',
    description: 'Chill gaming collective. We play Stardew Valley, Animal Crossing, and other cozy games. No pressure, just fun!',
    game: 'Various',
    gameEmoji: '🌸',
    members: 128,
    maxMembers: 200,
    isOpen: true,
    rank: 'Any',
    banner: '#86d55c',
    activity: 'active',
  },
  {
    id: 'g3',
    name: 'Phantom Protocol',
    tag: 'PHNT',
    description: 'Elite tactical squad. We participate in community tournaments and have a dedicated practice schedule.',
    game: 'CS2',
    gameEmoji: '💥',
    members: 29,
    maxMembers: 30,
    isOpen: false,
    rank: 'Faceit Level 8+',
    banner: '#ff6b00',
    activity: 'very active',
  },
  {
    id: 'g4',
    name: 'Pixel Forge',
    tag: 'PXL',
    description: 'Creative server builders and artists. We design worlds in Minecraft, Terraria, and more.',
    game: 'Minecraft',
    gameEmoji: '⛏️',
    members: 83,
    maxMembers: 100,
    isOpen: true,
    rank: 'Any',
    banner: '#7cb342',
    activity: 'moderate',
  },
];

// ─── Mock Messages ────────────────────────────────────────────────────────
export const MOCK_MESSAGES: Message[] = [
  { id: 'm1', user: MOCK_USERS[2], lastMessage: 'gg that game was insane lmao 💀',          timestamp: '2m',   unread: 3  },
  { id: 'm2', user: MOCK_USERS[1], lastMessage: 'are you down to rank tonight?',             timestamp: '15m',  unread: 1  },
  { id: 'm3', user: MOCK_USERS[4], lastMessage: 'I sent you the server IP already',         timestamp: '1h',   unread: 0  },
  { id: 'm4', user: MOCK_USERS[5], lastMessage: 'Thanks for the help with Malenia!! 🙏',    timestamp: '3h',   unread: 0  },
  { id: 'm5', user: MOCK_USERS[3], lastMessage: 'neon vanguard scrim tomorrow 8pm?',        timestamp: '5h',   unread: 0  },
];

// ─── Mock Clips ───────────────────────────────────────────────────────────
export const MOCK_CLIPS: Clip[] = [
  { id: 'c1', thumbnail: '/clips/clip1.jpg', game: 'Valorant',      views: '4.2K', duration: '0:32', title: '4K with Chamber on Ascent' },
  { id: 'c2', thumbnail: '/clips/clip2.jpg', game: 'Stardew Valley', views: '1.1K', duration: '1:04', title: 'Year 5 farm tour ✨' },
  { id: 'c3', thumbnail: '/clips/clip3.jpg', game: 'Valorant',      views: '8.7K', duration: '0:18', title: 'Ace on Bind 🔥' },
  { id: 'c4', thumbnail: '/clips/clip4.jpg', game: 'Detroit',       views: '650',  duration: '2:15', title: 'Connor route speedrun' },
  { id: 'c5', thumbnail: '/clips/clip5.jpg', game: 'Valorant',      views: '2.3K', duration: '0:45', title: 'Sage wall clutch' },
  { id: 'c6', thumbnail: '/clips/clip6.jpg', game: 'Stardew Valley', views: '890',  duration: '0:55', title: 'Heart scene with Abigail 💜' },
];
