import { Outlet, useLocation } from 'react-router-dom';
import Header from '../../components/common/Header';
import { Banner } from '../../components/home/Banner';
import FloatingChatButton from '../../components/chat/FloatingChatButton';

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
