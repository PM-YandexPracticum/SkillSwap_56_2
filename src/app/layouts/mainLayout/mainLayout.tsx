import { Outlet, useLocation } from 'react-router-dom'
import { Header } from '@/widgets/Header';
import { Footer } from '@/widgets/Footer';
import { Container, type ContainerPadding } from '@/shared/ui/Container';
import styles from './mainLayout.module.css';

type MainLayoutProps = {
  paddingLayout?: ContainerPadding
};

export function MainLayout({ paddingLayout = 'default' }: MainLayoutProps) {
  const location = useLocation()
  return (
    <div className={styles.page}>
      {/* Шапка и подвал на всю ширину, вне контейнера — свой Container у каждого внутри */}
      <Header />
      <Container padding={paddingLayout} className={styles.content}>
        {location.state?.registrationSuccess && <p role="status">Регистрация успешно завершена</p>}
        <Outlet />
      </Container>
      <Footer />
    </div>
  )
}
