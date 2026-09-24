import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { getAuthUser, subscribeAuthUser } from '@/features/auth/model/authUtils'
import { ROUTES } from '@/shared/lib/constants'

export const ProtectedRoute = () => {
  const location = useLocation()
  const [authUser, setAuthUser] = useState(getAuthUser)

  useEffect(() => subscribeAuthUser(() => setAuthUser(getAuthUser())), [])

  if (!authUser) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />
  }

  return <Outlet />
}