import favoritesReducer, { initialState, toggleFavorite } from './favoritesSlice'
import { selectFavoriteIds, selectIsFavorite } from './selectors'

describe('favoritesSlice', () => {
  test('возвращает начальное состояние', () => {
    expect(favoritesReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  test('добавляет id в избранное', () => {
    const state = favoritesReducer(initialState, toggleFavorite('user-1'))

    expect(state.ids).toEqual(['user-1'])
  })

  test('повторный toggle удаляет id', () => {
    const added = favoritesReducer(initialState, toggleFavorite('user-1'))
    const removed = favoritesReducer(added, toggleFavorite('user-1'))

    expect(removed.ids).toEqual([])
  })

  test('хранит несколько id и удаляет только нужный', () => {
    let state = favoritesReducer(initialState, toggleFavorite('user-1'))
    state = favoritesReducer(state, toggleFavorite('user-2'))
    state = favoritesReducer(state, toggleFavorite('user-1'))

    expect(state.ids).toEqual(['user-2'])
  })
})

describe('селекторы избранного', () => {
  const state = { favorites: { ids: ['user-1', 'user-2'] } }

  test('selectFavoriteIds возвращает список id', () => {
    expect(selectFavoriteIds(state)).toEqual(['user-1', 'user-2'])
  })

  test('selectIsFavorite проверяет наличие id', () => {
    expect(selectIsFavorite(state, 'user-1')).toBe(true)
    expect(selectIsFavorite(state, 'user-3')).toBe(false)
  })
})
