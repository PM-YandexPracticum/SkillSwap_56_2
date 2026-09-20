import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface FavoritesState {
  ids: string[]
}

export const initialState: FavoritesState = {
  ids: [],
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<string>) {
      const id = action.payload

      state.ids = state.ids.includes(id)
        ? state.ids.filter((favoriteId) => favoriteId !== id)
        : [...state.ids, id]
    },
  },
})

export const { toggleFavorite } = favoritesSlice.actions
export default favoritesSlice.reducer
