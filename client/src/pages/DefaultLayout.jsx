import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { Banner } from '../components/home/Banner';

const DefaultLayout = () => {
  const { pathname } = useLocation();
  const showHomeBanner = pathname === '/';

  return (
    <>
      {showHomeBanner && <Banner />}
      <Header />
      <Outlet />
    </>
  );
};

export default DefaultLayout;
