import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import styles from './MainLayout.module.css';

function MainLayout() {
  return (
    <div className={styles.mainLayout}>
      <Sidebar />
      <main className={styles.content}>
        {/* Child routes will be rendered here */}
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;