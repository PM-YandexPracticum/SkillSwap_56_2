import { Outlet } from 'react-router-dom';
import styles from './mainLayout.module.css';

type MainLayoutPadding = 'default' | 'auth' | 'error';

type MainLayoutProps = {
  paddingLayout?: MainLayoutPadding
};

export function MainLayout({ paddingLayout = 'default' }: MainLayoutProps) {
  return (
    <div className={styles.page}>
      {/* пока нет header, он должен быть на всю ширину, вне .container */}
      <div className={`${styles.container} ${styles[paddingLayout]}`}>
        <Outlet />
      </div>
    </div>
  )
}