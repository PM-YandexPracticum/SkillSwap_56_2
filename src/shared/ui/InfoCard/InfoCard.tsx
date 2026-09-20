import type {
  ComponentType,
  SVGProps,
} from 'react'

import styles from '@/shared/ui/InfoCard/InfoCard.module.css'

export type InfoCardIllustration = ComponentType<
  SVGProps<SVGSVGElement>
>

export interface InfoCardProps {
  illustration: InfoCardIllustration
  title: string
  description: string
}

export const InfoCard = ({
  illustration: Illustration,
  title,
  description,
}: InfoCardProps) => (
  <article className={styles.card}>
    <Illustration
      className={styles.illustration}
      aria-hidden="true"
    />
    <h2 className={styles.title}>
      {title}
    </h2>
    <p className={styles.description}>
      {description}
    </p>
  </article>
)
