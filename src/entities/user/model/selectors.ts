import { createSelector } from '@reduxjs/toolkit'

import type { User } from '@/shared/types'
import type { RootState } from '@/store'

import { byCreatedAtDesc, byLikesDesc } from '../lib/comparators'
import type { CatalogFilters } from './filters'

const selectUsersState = (state: RootState) => state.users

export const selectUsers = createSelector([selectUsersState], (state) => state.users)

export const selectUsersStatus = createSelector([selectUsersState], (state) => state.status)

export const selectUsersError = createSelector([selectUsersState], (state) => state.error)

export const selectUsersVisible = createSelector([selectUsersState], (state) => state.visible)

export const selectPopular = createSelector([selectUsers], (users: User[]) =>
  [...users].sort(byLikesDesc).slice(0, 3),
)

export const selectPopularAll = createSelector([selectUsers], (users: User[]) =>
  [...users].sort(byLikesDesc),
)

export const selectNew = createSelector([selectUsers], (users: User[]) =>
  [...users].sort(byCreatedAtDesc).slice(0, 3),
)

export const selectNewAll = createSelector([selectUsers], (users: User[]) =>
  [...users].sort(byCreatedAtDesc),
)

export const selectRecommended = createSelector(
  [selectUsers, selectUsersVisible],
  (users: User[], visible: number) => users.slice(0, visible),
)

export const selectFilteredUsers = (state: RootState, filters: CatalogFilters): User[] => {
  const users = selectUsers(state)

  return users.filter((user) => {
    if (filters.gender !== 'any' && user.gender !== filters.gender) {
      return false
    }

    if (filters.cities.length > 0 && !filters.cities.includes(user.cityId)) {
      return false
    }

    let userSkillIds: string[] = []
    if (filters.type === 'teach') {
      userSkillIds = [user.teachSkill.id]
    } else if (filters.type === 'learn') {
      userSkillIds = user.learnSkills.map((skill) => skill.id)
    } else {
      userSkillIds = [user.teachSkill.id, ...user.learnSkills.map((skill) => skill.id)]
    }

    if (filters.skills.length > 0) {
      const hasSkill = filters.skills.some((skillId) => userSkillIds.includes(skillId))
      if (!hasSkill) {
        return false
      }
    }

    return true
  })
}

export const selectHasMore = (state: RootState, filters?: CatalogFilters): boolean => {
  const visible = selectUsersVisible(state)
  const users = filters ? selectFilteredUsers(state, filters) : selectUsers(state)
  return visible < users.length
}
