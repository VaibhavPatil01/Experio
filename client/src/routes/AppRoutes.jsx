import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Loading from '../pages/Loading';
import NotFound from '../pages/NotFound';
import DefaultLayout from '../pages/DefaultLayout';
import GoogleTokenSetter from '../pages/GoogleTokenSetter';
import GithubTokenSetter from '../pages/GithubTokenSetter';
import AuthRouteLayout from '../pages/AuthRouteLayout';

// Lazily importing pages
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Events = lazy(() => import('../pages/Events'));
const PostForm = lazy(() => import('../pages/PostForm'));
const PostList = lazy(() => import('../pages/PostList'));
const PostPage = lazy(() => import('../pages/PostPage'));
const Settings = lazy(() => import('../pages/Settings'));
const Assistant = lazy(() => import('../pages/Assistant'));
const UserSearch = lazy(() => import('../pages/UserSearch'));
const ProfileEdit = lazy(() => import('../pages/ProfileEdit'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const AIResumeMaker = lazy(() => import('../pages/AIResumeMaker'));
const AIMockInterview = lazy(() => import('../pages/AIMockInterview'));
const AIResumeAnalyser = lazy(() => import('../pages/AIResumeAnalyser'));

const AppRoutes = () => {
  return (
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
          <Route path="/token/github/:token" element={<GithubTokenSetter />} />
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
  );
};

export default AppRoutes;
