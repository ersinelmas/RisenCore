import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar'; // Navbar'ı import et
import styles from './MainLayout.module.css';

function MainLayout() {
  return (
    <div className={styles.mainLayout}>
      <Sidebar />
      
      <div className={styles.hideOnDesktop}>
        <Navbar />
      </div>

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;