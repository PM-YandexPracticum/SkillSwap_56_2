import { ErrorState } from '@/shared/ui/ErrorState'
import errorImage from './assets/error500.png'

export default function ServerErrorPage() {
  return (
    <main>
      <ErrorState illustration={errorImage} title='На сервере произошла ошибка' description='Попробуйте позже или вернитесь на главную страницу'/>
    </main>
  )
}
