import { lazy, Suspense, useEffect, useState } from 'react';
import ChatbotModal from './components/ChatbotModal';
import { Route, Routes, useLocation } from 'react-router-dom';
import Loading from './pages/Loading';
import { Toaster } from 'react-hot-toast';
import NotFound from './pages/NotFound';
import DefaultLayout from './pages/DefaultLayout';
import useUserStatus from './hooks/useUserStatus.js';
import Error from './pages/Error.jsx';
import GoogleTokenSetter from './pages/GoogleTokenSetter.jsx';
import Events from './pages/Events.jsx';
import AuthRouteLayout from './pages/AuthRouteLayout.jsx';
import { useAppSelector } from './redux/store.js';

// Lazily importing pages
const Home = lazy(() => import('./pages/Home'));
const AIMockInterview = lazy(() => import('./pages/AIMockInterview'));
const AIResumeAnalyser = lazy(() => import('./pages/AIResumeAnalyser'));
const AIResumeMaker = lazy(() => import('./pages/AIResumeMaker'));
const PostForm = lazy(() => import('./pages/PostForm'));
const PostList = lazy(() => import('./pages/PostList'));
const PostPage = lazy(() => import('./pages/PostPage'));
const ProfileEdit = lazy(() => import('./pages/ProfileEdit'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const UserSearch = lazy(() => import('./pages/UserSearch'));
const Login = lazy(() => import('./pages/Login'));
const Assistant = lazy(() => import('./pages/Assistant'));
const Settings = lazy(() => import('./pages/Settings'));

const App = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { pathname } = useLocation();
  const { isLoading, isError } = useUserStatus();
  const theme = useAppSelector((state) => state.themeState.theme);

  // Scroll to top when the url changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Load primary theme color on mount
  useEffect(() => {
    const savedColor = localStorage.getItem('primaryColor') || 'green';
    const colorHex = savedColor === 'green' ? '#00a63e' : '#002E7D';
    const dullColorHex = savedColor === 'green' ? '#dcfce7' : '#4586f5';
    document.documentElement.style.setProperty('--color-primary', colorHex);
    document.documentElement.style.setProperty('--color-primary-dull', dullColorHex);
  }, []);

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login />} />
          <Route path="/reset-password/:token" element={<Login />} />
          <Route element={<DefaultLayout />}>
            <Route index element={<Home />} />
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/ai-resume-maker" element={<AIResumeMaker />} />
            <Route path="/resume" element={<AIResumeAnalyser />} />
            <Route path="/ai-mock-interview" element={<AIMockInterview />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/posts" element={<PostList />} />
            <Route path="/token/google/:token" element={<GoogleTokenSetter />} />
            <Route path="/user/search" element={<UserSearch />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route element={<AuthRouteLayout />}>
              <Route path="/post" element={<PostForm />} />
              <Route path="/profile/edit" element={<ProfileEdit />} />
              <Route path="/post/:id" element={<PostPage />} />
              <Route path="/post/:id/:slug" element={<PostPage />} />
              <Route path="/post/edit/:id" element={<PostForm />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster position="top-right" containerStyle={{ top: 80, zIndex: 100000 }} />
      <style>
        {`
          @keyframes chat-wave {
            0% { transform: translateY(0); }
            30% { transform: translateY(-3px); }
            60%, 100% { transform: translateY(0); }
          }
          .group:hover .dot-1 {
            animation: chat-wave 1s ease-in-out 1;
            animation-delay: 0s;
          }
          .group:hover .dot-2 {
            animation: chat-wave 1s ease-in-out 1;
            animation-delay: 0.15s;
          }
          .group:hover .dot-3 {
            animation: chat-wave 1s ease-in-out 1;
            animation-delay: 0.3s;
          }
        `}
      </style>
      {!isChatOpen && pathname !== '/assistant' && (
        <div 
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 w-[60px] h-[60px] bg-primary rounded-full flex items-center justify-center cursor-pointer z-[9999] transition-all duration-300 shadow-xl text-primary group"
        >
          <svg 
            color="inherit" 
            viewBox="0 0 32 32" 
            className="w-8 h-8"
          >
            {/* Solid White Bubble (always visible) */}
            <path fill="#FFFFFF" d="M12.63,26.46H8.83a6.61,6.61,0,0,1-6.65-6.07,89.05,89.05,0,0,1,0-11.2A6.5,6.5,0,0,1,8.23,3.25a121.62,121.62,0,0,1,15.51,0A6.51,6.51,0,0,1,29.8,9.19a77.53,77.53,0,0,1,0,11.2,6.61,6.61,0,0,1-6.66,6.07H19.48L12.63,31V26.46"></path>
            
            {/* Inner Cutout (visible normally, hidden on hover) */}
            <path fill="currentColor" className="transition-opacity duration-300 opacity-100 group-hover:opacity-0" d="M19.57,21.68h3.67a2.08,2.08,0,0,0,2.11-1.81,89.86,89.86,0,0,0,0-10.38,1.9,1.9,0,0,0-1.84-1.74,113.15,113.15,0,0,0-15,0A1.9,1.9,0,0,0,6.71,9.49a74.92,74.92,0,0,0-.06,10.38,2,2,0,0,0,2.1,1.81h3.81V26.5Z"></path>

            {/* Three Dots (hidden normally, visible on hover) */}
            <g fill="currentColor" className="transition-opacity duration-300 opacity-0 group-hover:opacity-100">
              <circle cx="10" cy="14.5" r="1.8" className="dot-1" />
              <circle cx="16" cy="14.5" r="1.8" className="dot-2" />
              <circle cx="22" cy="14.5" r="1.8" className="dot-3" />
            </g>
          </svg>
        </div>
      )}

      {pathname !== '/assistant' && (
        <ChatbotModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      )}
    </>
  );
};

export default App;
