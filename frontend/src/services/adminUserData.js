// Initial mock seed users matching the application's actual users
export const INITIAL_ADMIN_USERS = [
  {
    id: 'USR-101',
    name: 'Alexander Vance',
    email: 'alex.vance@wayflow.internal',
    role: 'Admin',
    facility: 'Regional HQ - Colombo',
    phone: '+94 11 234 5678',
    status: 'Active',
    lastActive: 'Just now',
    avatar: 'AV',
    joinedDate: '15 Jan 2025',
  },
  {
    id: 'USR-102',
    name: 'Kasun Fernando',
    email: 'kasun.fernando@wayflow.internal',
    role: 'Dispatcher',
    facility: 'Central Planning Hub',
    phone: '+94 77 123 4567',
    status: 'Active',
    lastActive: '5 mins ago',
    avatar: 'KF',
    joinedDate: '02 Feb 2025',
  },
  {
    id: 'USR-103',
    name: 'Rohan Jayawardena',
    email: 'rohan.j@wayflow.internal',
    role: 'Dispatcher',
    facility: 'Peliyagoda DC',
    phone: '+94 77 998 1122',
    status: 'Active',
    lastActive: '18 mins ago',
    avatar: 'RJ',
    joinedDate: '18 Feb 2025',
  },
  {
    id: 'USR-104',
    name: 'Sarah Perera',
    email: 'sarah.perera@wayflow.internal',
    role: 'Store Manager',
    facility: 'Colombo 05 Store',
    phone: '+94 71 890 2234',
    status: 'Active',
    lastActive: '2 mins ago',
    avatar: 'SP',
    joinedDate: '10 Mar 2025',
  },
  {
    id: 'USR-105',
    name: 'Nimali Rathnayake',
    email: 'nimali.r@wayflow.internal',
    role: 'Store Manager',
    facility: 'Kandy Central Outlet',
    phone: '+94 72 901 3345',
    status: 'Active',
    lastActive: '1 hour ago',
    avatar: 'NR',
    joinedDate: '22 Apr 2025',
  },
  {
    id: 'USR-106',
    name: 'Jordan Davis',
    email: 'jordan.davis@wayflow.internal',
    role: 'Loader',
    facility: 'Peliyagoda DC - Bay 02',
    phone: '+94 77 342 1092',
    status: 'Active',
    lastActive: '12 mins ago',
    avatar: 'JD',
    joinedDate: '05 May 2025',
  },
  {
    id: 'USR-107',
    name: 'Praveen Wickrama',
    email: 'praveen.w@wayflow.internal',
    role: 'Loader',
    facility: 'Colombo Central DC',
    phone: '+94 75 443 2190',
    status: 'Active',
    lastActive: '45 mins ago',
    avatar: 'PW',
    joinedDate: '14 Jun 2025',
  },
  {
    id: 'USR-108',
    name: 'Marcus Vance',
    email: 'marcus.vance@wayflow.internal',
    role: 'Driver',
    facility: 'West Hub Fleet (Heavy Refrigerated)',
    phone: '+94 76 554 9912',
    status: 'Active',
    lastActive: 'Live on route TR-024',
    avatar: 'MV',
    joinedDate: '19 Jul 2025',
  },
  {
    id: 'USR-109',
    name: 'Dinesh Silva',
    email: 'dinesh.silva@wayflow.internal',
    role: 'Driver',
    facility: 'Colombo Logistics Fleet (14T Dry)',
    phone: '+94 70 887 6543',
    status: 'Active',
    lastActive: '3 hours ago',
    avatar: 'DS',
    joinedDate: '29 Aug 2025',
  },
  {
    id: 'USR-110',
    name: 'Chamara Perera',
    email: 'chamara.p@wayflow.internal',
    role: 'Driver',
    facility: 'South Coastal Hub (Frozen)',
    phone: '+94 78 667 8901',
    status: 'Inactive',
    lastActive: '2 days ago',
    avatar: 'CP',
    joinedDate: '08 Nov 2025',
  },
]

const STORAGE_KEY = 'wayflow_admin_users'

export function getStoredUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ADMIN_USERS))
      return INITIAL_ADMIN_USERS
    }
    return JSON.parse(raw)
  } catch (err) {
    console.error('Failed to load stored admin users', err)
    return INITIAL_ADMIN_USERS
  }
}

export function saveStoredUsers(users) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
  } catch (err) {
    console.error('Failed to save admin users', err)
  }
}

export function getRoleColor(role) {
  switch (role) {
    case 'Admin':
      return { bg: 'rgba(244, 63, 94, 0.15)', text: '#fb7185', border: 'rgba(244, 63, 94, 0.35)' }
    case 'Dispatcher':
      return { bg: 'rgba(59, 130, 246, 0.15)', text: '#60a5fa', border: 'rgba(59, 130, 246, 0.35)' }
    case 'Store Manager':
      return { bg: 'rgba(168, 85, 247, 0.15)', text: '#c084fc', border: 'rgba(168, 85, 247, 0.35)' }
    case 'Loader':
      return { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.35)' }
    case 'Driver':
      return { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399', border: 'rgba(16, 185, 129, 0.35)' }
    default:
      return { bg: 'rgba(148, 163, 184, 0.15)', text: '#cbd5e1', border: 'rgba(148, 163, 184, 0.35)' }
  }
}

export function getStatusColor(status) {
  switch (status) {
    case 'Active':
      return { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399', dot: '#10b981' }
    case 'Inactive':
      return { bg: 'rgba(148, 163, 184, 0.15)', text: '#94a3b8', dot: '#64748b' }
    case 'Suspended':
      return { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', dot: '#ef4444' }
    default:
      return { bg: 'rgba(148, 163, 184, 0.15)', text: '#94a3b8', dot: '#64748b' }
  }
}
