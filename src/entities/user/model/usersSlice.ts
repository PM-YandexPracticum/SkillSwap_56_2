import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { User } from '@/shared/types'
import { fetchUsers } from '@/api/users'
import type { RootState } from '@/store'

export const INITIAL_VISIBLE = 6
export const VISIBLE_STEP = 6

const DEFAULT_ERROR = 'Не удалось загрузить пользователей'

export const loadUsers = createAsyncThunk<User[], void, { state: RootState; rejectValue: string }>(
  'users/loadUsers',
  async (_, { getState, rejectWithValue }) => {
    // Уже загружено — отдаём из стора, в сеть не идём.
    // Проверяем users, а не status: pending успевает перевести status в 'loading'
    // до вызова этого колбэка, а users при этом не трогает.
    const { users } = getState().users
    if (users.length > 0) return users

    try {
      return await fetchUsers()
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : DEFAULT_ERROR)
    }
  },
  {
    // Дедуп только параллельных вызовов: StrictMode монтирует эффект дважды.
    // Статусы idle / failed / succeeded диспатч пропускают, поэтому повтор после
    // ошибки работает, а unwrap() не падает с ConditionError.
    condition: (_, { getState }) => getState().users.status !== 'loading',
  },
)

export interface UsersState {
  users: User[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  visible: number
}

const initialState: UsersState = {
  users: [],
  status: 'idle',
  error: null,
  visible: INITIAL_VISIBLE,
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    showMore(state) {
      if (state.visible >= state.users.length) return
      state.visible = Math.min(state.visible + VISIBLE_STEP, state.users.length)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUsers.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loadUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.status = 'succeeded'
        state.users = action.payload
        state.error = null
        state.visible = INITIAL_VISIBLE
      })
      .addCase(loadUsers.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? action.error.message ?? DEFAULT_ERROR
      })
  },
})

export const { showMore } = usersSlice.actions
export default usersSlice.reducer
