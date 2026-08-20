import { Toaster } from 'react-hot-toast';
import Loading from './pages/Loading';
import Error from './pages/Error';
import useUserStatus from './hooks/useUserStatus';
import useThemeInit from './hooks/useThemeInit';
import ScrollToTop from './components/common/ScrollToTop';
import AppRoutes from './routes/AppRoutes';

const App = () => {
  useThemeInit();
  const { isLoading, isError } = useUserStatus();

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error />;
  }

  return (
    <>
      <ScrollToTop />
      <AppRoutes />
      <Toaster position="top-right" containerStyle={{ top: 80, zIndex: 100000 }} />
    </>
  );
};

export default App;
