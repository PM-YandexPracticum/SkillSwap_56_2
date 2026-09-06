import styles from './Stepper.module.css'

interface StepperProps {
  current: number
  total: number
}

export const Stepper = ({ current, total }: StepperProps) => {
  const currentStep = Math.min(Math.max(current, 1), total)

  return (
    <div className={styles.container}>
      <p className={styles.label}>
        Шаг {currentStep} из {total}
      </p>
      <div className={styles.track}>
        {Array.from({ length: total }, (_, index) => (
          <div
            key={index}
            className={index < currentStep ? `${styles.step} ${styles.stepActive}` : styles.step}
          />
        ))}
      </div>
    </div>
  )
}
