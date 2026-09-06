import styles from './Stepper.module.css';

interface StepperProps {
    current: number;
    total: number;
}

export const Stepper = ({ current, total }: StepperProps) => {
    const steps = Array.from({ length: total });
    
    return (
        <div className={styles.container}>
            <p className={styles.label}>Шаг {current} из {total}</p>
            <div className={styles.track}>
                {steps.map((_, index) => (
                    <div key={index} className={`${styles.step} ${index < current ? styles.stepActive : ''}`}></div>
                ))}
            </div>
        </div> 
    )
}