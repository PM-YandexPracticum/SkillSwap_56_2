import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ROUTES } from '@/shared/lib/constants'
import { AuthLayout } from '@/app/layouts/AuthLayout'
import { MainLayout } from '@/app/layouts/mainLayout'
import lightBulbIllustration from '@/shared/ui/icons/assets/light-bulb.svg'

// Lazy-загрузка страниц — каждая страница грузится только при переходе на неё
const CatalogPage = lazy(() => import('@/pages/CatalogPage'))
const SkillPage = lazy(() => import('@/pages/SkillPage'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'))
const CreateSkillPage = lazy(() => import('@/pages/CreateSkillPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Загрузка...</div>}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path={ROUTES.HOME} element={<CatalogPage />} />
            <Route path={ROUTES.SKILL} element={<SkillPage />} />
            <Route path={ROUTES.FAVORITES} element={<FavoritesPage />} />
            {/* Защищённые маршруты — добавь PrivateRoute обёртку */}
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
            <Route path={ROUTES.CREATE} element={<CreateSkillPage />} />
            </Route>

            <Route
              element={
                <AuthLayout
                  current={1}
                  total={3}
                  info={{
                    illustration: lightBulbIllustration,
                    title: 'Добро пожаловать в SkillSwap!',
                    description:
                      'Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми',
                  }}
                />
              }
            >
              <Route path={ROUTES.LOGIN} element={<LoginPage />} />
              <Route path={ROUTES.REGISTER} element={<LoginPage />} />
            </Route>

            <Route element={<MainLayout paddingLayout="error" />}>
              <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
