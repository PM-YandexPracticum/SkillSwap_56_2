import { Button, ButtonLink } from '../Button'
import styles from './ErrorState.module.css'

export type ErrorStateProps = {
  illustration: string
  title: string
  description: string
  onReport?: () => void
}

export const ErrorState = ({ illustration, title, description, onReport } : ErrorStateProps) => {
  return (
    <div className={styles.root}>
      <div className={styles.imageContainer}>
        <img src={illustration} alt=''/>
      </div>
      <div className={styles.state}>
        <div className={styles.info}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>{description}</p>
        </div>
        <div className={styles.actions}>
          <Button variant='secondary' fullWidth onClick={onReport}>Сообщить об ошибке</Button>
          <ButtonLink to='/' fullWidth>На главную</ButtonLink>
        </div>
      </div>
    </div>
  )
}
