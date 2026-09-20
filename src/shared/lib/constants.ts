export const ROUTES = {
  HOME: '/',
  SKILL: '/skill/:id',
  PROFILE: '/profile',
  PROFILE_REQUESTS: '/profile/requests',
  PROFILE_EXCHANGES: '/profile/exchanges', 
  PROFILE_FAVORITES: '/profile/favorites', 
  PROFILE_SKILLS: '/profile/skills', 
  PROFILE_PERSONAL: '/profile/personal',
  FAVORITES: '/favorites',
  CREATE: '/create',
  LOGIN: '/login',

  REGISTER: '/register',
  REGISTER_ACCOUNT: '/register/account',
  REGISTER_USER: '/register/user',
  REGISTER_SKILL: '/register/skill',

  REGISTER_STEP_1: '/register/1',
  REGISTER_STEP_2: '/register/2',
  REGISTER_STEP_3: '/register/3',

  REGISTER_USER_TYPO: '/rigister/user',

  SERVER_ERROR: '/500',
  NOT_FOUND_ERROR: '/404',
} as const

export const SKILL_CATEGORIES = [
  'Программирование',
  'Дизайн',
  'Языки',
  'Музыка',
  'Спорт',
  'Кулинария',
  'Фото и видео',
  'Бизнес',
  'Другое',
] as const

export const LOCAL_STORAGE_KEYS = {
  AUTH_USER: 'skillswap_auth_user',
  FAVORITES: 'skillswap_favorites',
  REQUESTS: 'skillswap_requests',
  THEME: 'skillswap_theme',
  REGISTRATION_DRAFT: 'skillswap_registration_draft',
} as const
