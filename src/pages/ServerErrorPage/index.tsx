import { ErrorState } from '@/shared/ui/ErrorState'
import errorImage from './assets/error500.png'

export default function ServerErrorPage() {
  const handleReport = () => {
    console.log('Сообщение об ошибке')
  }

  return (
    <main>
      <ErrorState onReport={handleReport} illustration={errorImage} title='На сервере произошла ошибка' description='Попробуйте позже или вернитесь на главную страницу'/>
    </main>
  )
}
