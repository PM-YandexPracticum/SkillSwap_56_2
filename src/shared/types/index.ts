// ─── Skill ───────────────────────────────────────────────
export type SkillType = 'teach' | 'learn'

export interface Skill {
  id: string
  title: string
  description: string
  type: SkillType
  category: string
  tags: string[]
  imageUrl: string | null
  authorId: string
  createdAt: string
}

// Категории и навыки из public/db/skills.json — дерево для фильтров и форм
export interface SkillOption {
  id: string
  title: string
}

export interface SkillCategory {
  id: string
  title: string
  skills: SkillOption[]
}

// ─── City ────────────────────────────────────────────────
export interface City {
  id: string
  title: string
}

// ─── User ────────────────────────────────────────────────
export type Gender = 'male' | 'female'

export interface UserSkill {
  id: string
  title: string
  category: string
}

export interface User {
  id: string
  name: string
  email: string
  city: string
  birthDate: string
  avatarUrl: string | null
  createdAt: string
  likesCount: number
  teachSkill: UserSkill
  learnSkills: UserSkill[]
  favorites: string[]
}

// ─── Request ─────────────────────────────────────────────
export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'inProgress' | 'done'

export interface SwapRequest {
  id: string
  skillId: string
  fromUserId: string
  toUserId: string
  status: RequestStatus
  createdAt: string
  updatedAt: string
}

// ─── Auth ────────────────────────────────────────────────
export interface AuthUser {
  id: string
  name: string
  email: string
  token: string
  birthDate?: string
  gender?: Gender
  city?: string
  about?: string
  avatarUrl?: string | null
}
