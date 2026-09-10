import { ErrorState } from '@/shared/ui/ErrorState'
import errorImage from './assets/error404.png'

export default function NotFoundPage() {
  const handleReport = () => {
    console.log('Сообщение об ошибке')
  }

  return (
    <main>
      <ErrorState onReport={handleReport} illustration={errorImage} title='Страница не найдена' description='К сожалению, эта страница недоступна. Вернитесь на главную страницу или попробуйте позже'/>
    </main>
  )
}
