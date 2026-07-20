// src/data/mockData.js
//
// All fake data + a thin async "api" facade live here. Every screen calls
// the api.* functions below instead of importing the raw arrays directly.
// That means swapping mock data for real network calls later is a one-file
// change: keep the function names/signatures, replace the bodies with
// fetch()/axios calls, done.

export const SERVICE_CATEGORIES = [
  { id: 'plumbing', label: 'Plumbing', icon: 'water-pump' },
  { id: 'electrical', label: 'Electrical', icon: 'flash' },
  { id: 'cleaning', label: 'Cleaning', icon: 'broom' },
  { id: 'landscaping', label: 'Landscaping', icon: 'tree' },
  { id: 'painting', label: 'Painting', icon: 'format-paint' },
  { id: 'other', label: 'Other', icon: 'dots-horizontal' },
];

export const PROFESSIONALS = [
  {
    id: 'p1',
    name: 'Marcus Reid',
    service: 'Plumbing',
    title: 'Master Plumber',
    skills: ['LEAK REPAIR', 'PIPE FITTING'],
    rating: 4.9,
    reviews: 128,
    experience: '8 yrs experience',
    rate: 45,
    avatar: 'https://i.pravatar.cc/150?img=12',
    verified: true,
    licensed: true,
    insured: true,
    about:
      'Licensed plumber specializing in leak repair, pipe installation and bathroom remodels. I show up on time and leave the job site spotless.',
    location: 'Delhi NCR',
    portfolio: [
      'https://picsum.photos/seed/plumb1/300/300',
      'https://picsum.photos/seed/plumb2/300/300',
      'https://picsum.photos/seed/plumb3/300/300',
    ],
    reviewsList: [
      { id: 'r1', name: 'Anita S.', rating: 5, text: 'Fixed our leak in under an hour. Very professional.' },
      { id: 'r2', name: 'Rohit K.', rating: 5, text: 'Great communication, fair pricing.' },
    ],
  },
  {
    id: 'p2',
    name: 'Elena Cruz',
    service: 'Electrical',
    title: 'Licensed Electrician',
    skills: ['WIRING', 'SMART HOME'],
    rating: 4.8,
    reviews: 96,
    experience: '6 yrs experience',
    rate: 50,
    avatar: 'https://i.pravatar.cc/150?img=32',
    verified: true,
    licensed: true,
    insured: true,
    about:
      'Certified electrician handling wiring, panel upgrades and smart-home installs. Safety-first approach on every job.',
    location: 'Delhi NCR',
    portfolio: [
      'https://picsum.photos/seed/elec1/300/300',
      'https://picsum.photos/seed/elec2/300/300',
    ],
    reviewsList: [
      { id: 'r3', name: 'Priya M.', rating: 5, text: 'Rewired our kitchen safely and quickly.' },
    ],
  },
  {
    id: 'p3',
    name: 'Daniel Okafor',
    service: 'Carpentry',
    title: 'Master Carpenter',
    skills: ['CABINETRY', 'FURNITURE'],
    rating: 4.7,
    reviews: 74,
    experience: '10 yrs experience',
    rate: 40,
    avatar: 'https://i.pravatar.cc/150?img=15',
    verified: true,
    licensed: true,
    insured: true,
    about: 'Custom carpentry, furniture repair, and built-in cabinetry. Every project treated like it were my own home.',
    location: 'Delhi NCR',
    portfolio: ['https://picsum.photos/seed/carp1/300/300'],
    reviewsList: [],
  },
  {
    id: 'p4',
    name: 'Sofia Bianchi',
    service: 'Painting',
    title: 'Interior Painter',
    skills: ['COLOR MATCHING', 'EXTERIOR'],
    rating: 4.9,
    reviews: 152,
    experience: '5 yrs experience',
    rate: 35,
    avatar: 'https://i.pravatar.cc/150?img=48',
    verified: true,
    licensed: true,
    insured: true,
    about: 'Interior & exterior painting with an eye for clean lines and color matching.',
    location: 'Delhi NCR',
    portfolio: ['https://picsum.photos/seed/paint1/300/300', 'https://picsum.photos/seed/paint2/300/300'],
    reviewsList: [],
  },
];

// Posted jobs, grouped loosely by status. Each references a professional id
// once a quote/assignment happens.
export const JOBS = [
  {
    id: 'j1',
    title: 'Leaking kitchen faucet',
    category: 'Plumbing',
    status: 'Opened',
    tab: 'active',
    postedAt: '2 hours ago',
    quotesCount: 3,
    address: '221B Baker Street, Delhi',
  },
  {
    id: 'j2',
    title: 'Rewire living room outlets',
    category: 'Electrical',
    status: 'Assigned',
    tab: 'active',
    postedAt: '1 day ago',
    proId: 'p2',
    address: '12 Nehru Place, Delhi',
  },
  {
    id: 'j3',
    title: 'Repaint bedroom walls',
    category: 'Painting',
    status: 'Assigned',
    tab: 'active',
    postedAt: '3 days ago',
    proId: 'p4',
    address: '45 Lodhi Road, Delhi',
  },
  {
    id: 'j4',
    title: 'Fix squeaky cabinet hinges',
    category: 'Carpentry',
    status: 'Completed',
    tab: 'completed',
    postedAt: '2 weeks ago',
    proId: 'p3',
    address: '8 Green Park, Delhi',
    completedAt: 'Jun 28',
  },
  {
    id: 'j5',
    title: 'Bathroom pipe replacement',
    category: 'Plumbing',
    status: 'Completed',
    tab: 'completed',
    postedAt: '1 month ago',
    proId: 'p1',
    address: '221B Baker Street, Delhi',
    completedAt: 'Jun 10',
  },
  {
    id: 'j6',
    title: 'Garden hedge trimming',
    category: 'Landscaping',
    status: 'Cancelled',
    tab: 'completed',
    postedAt: '1 month ago',
    address: '3 Vasant Vihar, Delhi',
    completedAt: 'Jun 5',
  },
];

// Chat threads. Each thread's `messages` array carries a mix of `text` and
// `quote` message types (see ChatThreadScreen for rendering).
export const CHATS = [
  {
    id: 'c1',
    proId: 'p1',
    lastMessage: 'Sounds good, I can start Thursday morning.',
    lastMessageAt: '9:41 AM',
    unread: 2,
    messages: [
      { id: 'm1', type: 'text', from: 'pro', text: 'Hi! I saw your job post for the kitchen faucet leak.', time: '9:12 AM' },
      { id: 'm2', type: 'text', from: 'me', text: 'Hey Marcus, yes — its been dripping for a few days now.', time: '9:15 AM' },
      {
        id: 'm3',
        type: 'quote',
        from: 'pro',
        time: '9:20 AM',
        quote: { service: 'Plumbing repair', price: 65, eta: 'Thu, 10:00 AM', note: 'Includes parts + labor, 1hr estimated' },
      },
      { id: 'm4', type: 'text', from: 'me', text: 'That works for me, thank you!', time: '9:38 AM' },
      { id: 'm5', type: 'text', from: 'pro', text: 'Sounds good, I can start Thursday morning.', time: '9:41 AM' },
    ],
  },
  {
    id: 'c2',
    proId: 'p2',
    lastMessage: 'I\u2019ll bring the new breaker panel tomorrow.',
    lastMessageAt: 'Yesterday',
    unread: 0,
    messages: [
      { id: 'm6', type: 'text', from: 'pro', text: 'Job\u2019s on track, just confirming the outlet count.', time: 'Yesterday' },
      { id: 'm7', type: 'text', from: 'me', text: 'Its 6 outlets total, 2 in the living room.', time: 'Yesterday' },
      { id: 'm8', type: 'text', from: 'pro', text: 'I\u2019ll bring the new breaker panel tomorrow.', time: 'Yesterday' },
    ],
  },
  {
    id: 'c3',
    proId: 'p3',
    lastMessage: 'Thanks for the great review!',
    lastMessageAt: 'Jun 28',
    unread: 0,
    messages: [
      { id: 'm9', type: 'text', from: 'pro', text: 'All done \u2014 hinges shouldn\u2019t squeak anymore.', time: 'Jun 28' },
      { id: 'm10', type: 'text', from: 'me', text: 'Perfect, thank you!', time: 'Jun 28' },
      { id: 'm11', type: 'text', from: 'pro', text: 'Thanks for the great review!', time: 'Jun 28' },
    ],
  },
  {
    id: 'c4',
    proId: 'p4',
    lastMessage: 'Sending over paint swatch options now.',
    lastMessageAt: 'Jun 20',
    unread: 1,
    messages: [
      { id: 'm12', type: 'text', from: 'pro', text: 'Sending over paint swatch options now.', time: 'Jun 20' },
    ],
  },
];

// -----------------------------------------------------------------------
// API facade — swap the bodies for real fetch()/axios calls later; keep
// these names + shapes and every screen keeps working unchanged.
// -----------------------------------------------------------------------
const delay = (ms = 250) => new Promise((res) => setTimeout(res, ms));

export const api = {
  async getCategories() {
    await delay(100);
    return SERVICE_CATEGORIES;
  },
  async getProfessionals({ service } = {}) {
    await delay();
    if (!service) return PROFESSIONALS;
    return PROFESSIONALS.filter((p) => p.service.toLowerCase() === service.toLowerCase());
  },
  async getProfessionalById(id) {
    await delay();
    return PROFESSIONALS.find((p) => p.id === id) || null;
  },
  async getJobs() {
    await delay();
    return JOBS;
  },
  async getChats() {
    await delay();
    return CHATS;
  },
  async getChatById(id) {
    await delay();
    return CHATS.find((c) => c.id === id) || null;
  },
  async getChatByProId(proId) {
    // Used when arriving from a Pro Profile's "Message" button, which only
    // knows the pro's id, not an existing chat id.
    await delay();
    return CHATS.find((c) => c.proId === proId) || null;
  },
  async sendMessage(chatId, text) {
    // Mock "send": appends to the in-memory array so the thread updates
    // immediately. A real backend would POST and return the saved message.
    await delay(150);
    const chat = CHATS.find((c) => c.id === chatId);
    if (!chat) return null;
    const message = { id: `m${Date.now()}`, type: 'text', from: 'me', text, time: 'Now' };
    chat.messages.push(message);
    chat.lastMessage = text;
    chat.lastMessageAt = 'Now';
    return message;
  },
  async postJob(jobPayload) {
    // Real backend would POST this and return the created job.
    await delay(400);
    return { id: `j${Date.now()}`, status: 'Opened', tab: 'active', quotesCount: 0, ...jobPayload };
  },
  async login(identifier, password) {
    // Real backend would verify credentials and return a session/user.
    // Mock: any well-formed identifier + password succeeds.
    await delay(400);
    const isEmail = identifier.includes('@');
    return {
      id: 'u1',
      name: 'John Doe',
      email: isEmail ? identifier : 'john@example.com',
      phone: isEmail ? '' : identifier,
    };
  },
  async signup(payload) {
    // Real backend would create the account and return the created user.
    await delay(400);
    return { id: `u${Date.now()}`, ...payload };
  },
  async updateProfile(payload) {
    // Real backend would PATCH the account and return the updated user.
    await delay(700);
    return { ...payload };
  },
};

export default api;
