export const statsCards = [
  {
    id: 1,
    icon: 'Users',
    iconBg: '#D4F3F0',
    iconColor: '#0F7A78',
    metric: '24,512',
    label: 'Total Users',
    growth: '+12%',
    growthPositive: true,
  },
  {
    id: 2,
    icon: 'ChefHat',
    iconBg: '#FDEEE8',
    iconColor: '#C47A5C',
    metric: '1,842',
    label: 'Total Chefs',
    growth: '+8.4%',
    growthPositive: true,
  },
  {
    id: 3,
    icon: 'UtensilsCrossed',
    iconBg: '#F0EEEC',
    iconColor: '#8A8A8A',
    metric: '8,903',
    label: 'Total Meals',
    sublabel: 'Active listings',
    growth: null,
  },
  {
    id: 4,
    icon: 'ShoppingBag',
    iconBg: '#F3E8E2',
    iconColor: '#A55632',
    metric: '112,430',
    label: 'Total Orders',
    growth: '+21%',
    growthPositive: true,
  },
]

export const ordersChartData = [
  { day: 'MON', completed: 42, pending: 18 },
  { day: 'TUE', completed: 58, pending: 22 },
  { day: 'WED', completed: 35, pending: 15 },
  { day: 'THU', completed: 75, pending: 30 },
  { day: 'FRI', completed: 90, pending: 35 },
  { day: 'SAT', completed: 68, pending: 25 },
  { day: 'SUN', completed: 48, pending: 20 },
]

export const topChefs = [
  {
    id: 1,
    name: "Amine's Kitchen",
    category: 'Traditional Moroccan',
    orders: 342,
    progress: 85,
    initials: 'AK',
    color: '#A55632',
  },
  {
    id: 2,
    name: 'Laila Bakes',
    category: 'Artisan Pastries',
    orders: 289,
    progress: 75,
    initials: 'LB',
    color: '#0F7A78',
  },
  {
    id: 3,
    name: 'Chef Omar',
    category: 'Lebanese Classics',
    orders: 215,
    progress: 60,
    initials: 'CO',
    color: '#C47A5C',
  },
]

export const acquisitionData = [
  { month: 'January', activeUsers: 3200, chefPartners: 180 },
  { month: 'February', activeUsers: 5800, chefPartners: 310 },
  { month: 'March', activeUsers: 8400, chefPartners: 520 },
  { month: 'April', activeUsers: 13500, chefPartners: 890 },
  { month: 'May', activeUsers: 19200, chefPartners: 1340 },
  { month: 'June', activeUsers: 24512, chefPartners: 1842 },
]

export const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { id: 'chefs', label: 'Chefs', icon: 'ChefHat' },
  { id: 'users', label: 'Users', icon: 'Users' },
  { id: 'orders', label: 'Orders', icon: 'ShoppingBag' },
  { id: 'moderation', label: 'Moderation', icon: 'Shield' },
]
