import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { lazy, Suspense } from 'react'

import { AuthLayout } from '@/app/layouts/AuthLayout'
import { MainLayout } from '@/app/layouts/mainLayout'
import { RegistrationLayout } from '@/app/layouts/RegistrationLayout'
import { ProtectedRoute } from '@/features/auth'
import { RegistrationProvider } from '@/features/auth/registration'

import { ROUTES } from '@/shared/lib/constants'
import { Spinner } from '@/shared/ui/Spinner'
import LightBulbIllustration from '@/shared/ui/icons/assets/light-bulb.svg?react'

const CatalogPage = lazy(() => import('@/pages/CatalogPage'))

const SkillPage = lazy(() => import('@/pages/SkillPage'))

const ProfilePage = lazy(() => import('@/pages/ProfilePage'))

const ProfilePersonalPage = lazy(() => import('@/pages/ProfilePersonalPage'))

const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'))

const CreateSkillPage = lazy(() => import('@/pages/CreateSkillPage'))

const LoginPage = lazy(() => import('@/pages/LoginPage'))

const RegisterAccountPage = lazy(() => import('@/pages/RegisterAccountPage'))

const RegisterUserPage = lazy(() => import('@/pages/RegisterUserPage'))

const RegisterSkillPage = lazy(() => import('@/pages/RegisterSkillPage'))

const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

const ServerErrorPage = lazy(() => import('@/pages/ServerErrorPage'))

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Spinner fullPage />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path={ROUTES.HOME} element={<CatalogPage />} />

            <Route path={ROUTES.SKILL} element={<SkillPage />} />

            <Route path={ROUTES.FAVORITES} element={<FavoritesPage />} />

            <Route element={<ProtectedRoute />}>
  <Route path={ROUTES.PROFILE} element={<ProfilePage />}>
    <Route index element={<Navigate to={ROUTES.PROFILE_PERSONAL} replace />} />

    <Route path={ROUTES.PROFILE_REQUESTS} element={<div>Раздел в разработке</div>} />

    <Route path={ROUTES.PROFILE_EXCHANGES} element={<div>Раздел в разработке</div>} />

    <Route path={ROUTES.PROFILE_FAVORITES} element={<FavoritesPage />} />

    <Route path={ROUTES.PROFILE_SKILLS} element={<div>Раздел в разработке</div>} />

    <Route path={ROUTES.PROFILE_PERSONAL} element={<ProfilePersonalPage />} />
  </Route>
</Route>

            <Route path={ROUTES.CREATE} element={<CreateSkillPage />} />
          </Route>

          {/* Страница входа */}
          <Route
            element={
              <AuthLayout
                current={1}
                total={3}
                info={{
                  illustration: LightBulbIllustration,

                  title: 'Добро пожаловать в SkillSwap!',

                  description:
                    'Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми',
                }}
              />
            }
          >
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          </Route>

          {/* Регистрация */}
          <Route element={<RegistrationProvider />}>
            {/* /register → первый шаг */}
            <Route
              path={ROUTES.REGISTER}
              element={<Navigate to={ROUTES.REGISTER_ACCOUNT} replace />}
            />

            {/* Алиасы для acceptance */}
            <Route
              path={ROUTES.REGISTER_STEP_1}
              element={<Navigate to={ROUTES.REGISTER_ACCOUNT} replace />}
            />

            <Route
              path={ROUTES.REGISTER_STEP_2}
              element={<Navigate to={ROUTES.REGISTER_USER} replace />}
            />

            <Route
              path={ROUTES.REGISTER_STEP_3}
              element={<Navigate to={ROUTES.REGISTER_SKILL} replace />}
            />

            {/* В ТЗ есть /rigister/user */}
            <Route
              path={ROUTES.REGISTER_USER_TYPO}
              element={<Navigate to={ROUTES.REGISTER_USER} replace />}
            />

            <Route element={<RegistrationLayout />}>
              <Route path={ROUTES.REGISTER_ACCOUNT} element={<RegisterAccountPage />} />

              <Route path={ROUTES.REGISTER_USER} element={<RegisterUserPage />} />

              <Route path={ROUTES.REGISTER_SKILL} element={<RegisterSkillPage />} />
            </Route>
          </Route>

          <Route element={<MainLayout paddingLayout="error" />}>
            <Route path={ROUTES.NOT_FOUND_ERROR} element={<NotFoundPage />} />

            <Route path={ROUTES.SERVER_ERROR} element={<ServerErrorPage />} />

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
