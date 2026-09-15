import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { User } from '@/shared/types'
import { fetchUsers } from '@/api/users'
import type { RootState } from '@/store'

export const loadUsers = createAsyncThunk<User[]>(
  'users/loadUsers',
  async () => fetchUsers(),
  {
    condition: (_, { getState }) => (getState() as RootState).users.status === 'idle',
  }
)

export interface UsersState {
  users: User[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  visible: number
}

const initialState: UsersState = {
  users: [],
  status: 'idle',
  visible: 6,
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    showMore(state) {
      state.visible += 6
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUsers.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(loadUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.status = 'succeeded'
        state.users = action.payload
      })
      .addCase(loadUsers.rejected, (state) => {
        state.status = 'failed'
      })
  },
})

export const { showMore } = usersSlice.actions
export default usersSlice.reducer
