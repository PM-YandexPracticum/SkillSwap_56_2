import { Outlet } from 'react-router-dom';
import { Footer } from '@/widgets/Footer';
import { Container, type ContainerPadding } from '@/shared/ui/Container';
import styles from './mainLayout.module.css';

type MainLayoutProps = {
  paddingLayout?: ContainerPadding
};

export function MainLayout({ paddingLayout = 'default' }: MainLayoutProps) {
  return (
    <div className={styles.page}>
      {/* пока нет header, он должен быть на всю ширину, вне контейнера */}
      <Container padding={paddingLayout} className={styles.content}>
        <Outlet />
      </Container>
      <Footer />
    </div>
  )
}
