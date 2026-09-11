import styles from './InfoCard.module.css'

export interface InfoCardProps {
  illustration: string
  title: string
  description: string
}

export const InfoCard = ({ illustration, title, description }: InfoCardProps) => (
  <article className={styles.card}>
    <img className={styles.illustration} src={illustration} alt="" aria-hidden="true" />
    <h2 className={styles.title}>{title}</h2>
    <p className={styles.description}>{description}</p>
  </article>
)
