import { ReactNode } from "react";
import styles from "./Tag.module.css";
import type {TagTone} from "./types"

interface TagProps {
    children: ReactNode;
    tone?: TagTone;
}


export const Tag = ({ children, tone = 'neutral' }: TagProps) => {
    return (
        <span className={`${styles.tag} ${styles[tone]}`} title={String(children)}>
            <span className={styles.text}>{children}</span>
        </span>
    )
}