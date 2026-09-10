import { ErrorState } from '@/shared/ui/ErrorState'
import errorImage from './assets/error404.png'

export default function NotFoundPage() {
  return (
    <main>
      <ErrorState illustration={errorImage} title='Страница не найдена' description='К сожалению, эта страница недоступна. Вернитесь на главную страницу или попробуйте позже'/>
    </main>
  )
}
