import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/store'
import type { User } from '@/shared/types'
import type { CatalogFilters } from '@/widgets/FiltersBar'

const selectUsersState = (state: RootState) => state.users

export const selectUsers = createSelector([selectUsersState], (state) => state.users)

export const selectUsersStatus = createSelector([selectUsersState], (state) => state.status)

export const selectUsersError = createSelector([selectUsersState], (state) => state.error)

export const selectUsersVisible = createSelector([selectUsersState], (state) => state.visible)

export const selectPopular = createSelector([selectUsers], (users: User[]) =>
  [...users].sort((a, b) => b.likesCount - a.likesCount).slice(0, 3),
)

export const selectNew = createSelector([selectUsers], (users: User[]) =>
  [...users]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3),
)

export const selectRecommended = createSelector(
  [selectUsers, selectUsersVisible],
  (users: User[], visible: number) => users.slice(0, visible),
)



// фильтры

export const selectFilteredUsers = (state: RootState, filters: CatalogFilters): User[] => {
  const users = selectUsers(state)

  return users.filter((user) => {
  
    // провекра пола 
    if (filters.gender !== 'any' && user.gender !== filters.gender) {
      return false
    }
// проверка города
    if (filters.cities.length > 0 && !filters.cities.includes(user.cityId)) {
      return false
    }

  // провекра  типа
    let userSkillIds: string[] = []
    if (filters.type === 'teach') {
      userSkillIds = user.teachSkill ? [user.teachSkill.id] : []
    } else if (filters.type === 'learn') {
      userSkillIds = user.learnSkills.map((skill) => skill.id)
    } else {
      userSkillIds = [
        ...(user.teachSkill ? [user.teachSkill.id] : []),
        ...user.learnSkills.map((skill) => skill.id),
      ]
    }

// проверка  навыков
    if (filters.skills.length > 0) {
      const hasSkill = filters.skills.some((skillId) => userSkillIds.includes(skillId))
      if (!hasSkill) {
        return false
      }
    }

    return true
  })
}

// проверка для кнопки показать еще
export const selectHasMore = (state: RootState, filters: CatalogFilters): boolean => {
  const visible = selectUsersVisible(state)
  const filteredUsers = selectFilteredUsers(state, filters)
  return visible < filteredUsers.length
}