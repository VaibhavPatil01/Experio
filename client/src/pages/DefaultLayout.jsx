import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { Banner } from '../components/home/Banner';

const DefaultLayout = () => {
  const { pathname } = useLocation();
  const showHomeBanner = pathname === '/';
  const hideHeader = pathname === '/login' || pathname === '/register';

  return (
    <>
      {showHomeBanner && <Banner />}
      {!hideHeader && <Header />}
      <Outlet />
    </>
  );
};

export default DefaultLayout;
