import type { ReactNode } from 'react';
import styles from './CardAreaSkill.module.css';
import { RoundImage } from '../../../../shared/ui/RoundImage';

interface CardAreaSkillProps {
  title: string;
  skills: string[];
  bgColor: string;
  icon: ReactNode;
}

export const CardAreaSkill = ({ title, skills, bgColor, icon }: CardAreaSkillProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <RoundImage 
          bgColor={bgColor} 
          icon={icon} 
          alt={title} 
          size="smd" 
        />
        <h3 className={styles.title}>{title}</h3>
      </div>

      <ul className={styles.list}>
        {skills.map((skill) => (
          <li key={skill} className={styles.listItem}>
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
};