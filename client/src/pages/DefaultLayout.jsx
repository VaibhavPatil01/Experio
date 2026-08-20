import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { Banner } from '../components/home/Banner';
import FloatingChatButton from '../components/FloatingChatButton';

const DefaultLayout = () => {
  const { pathname } = useLocation();
  const showHomeBanner = pathname === '/';

  return (
    <>
      {showHomeBanner && <Banner />}
      <Header />
      <Outlet />
      <FloatingChatButton />
    </>
  );
};

export default DefaultLayout;
