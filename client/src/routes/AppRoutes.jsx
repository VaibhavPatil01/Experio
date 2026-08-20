import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Loading from '../pages/common/Loading';
import NotFound from '../pages/common/NotFound';
import DefaultLayout from '../pages/common/DefaultLayout';
import GoogleTokenSetter from '../pages/users/GoogleTokenSetter';
import GithubTokenSetter from '../pages/users/GithubTokenSetter';
import AuthRouteLayout from '../pages/users/AuthRouteLayout';

// Lazily importing pages
const Home = lazy(() => import('../pages/home/Home'));
const Login = lazy(() => import('../pages/users/Login'));
const Events = lazy(() => import('../pages/common/Events'));
const PostForm = lazy(() => import('../pages/posts/PostForm'));
const PostList = lazy(() => import('../pages/posts/PostList'));
const PostPage = lazy(() => import('../pages/posts/PostPage'));
const Settings = lazy(() => import('../pages/users/Settings'));
const Assistant = lazy(() => import('../pages/chat/Assistant'));
const UserSearch = lazy(() => import('../pages/users/UserSearch'));
const ProfileEdit = lazy(() => import('../pages/users/ProfileEdit'));
const ProfilePage = lazy(() => import('../pages/users/ProfilePage'));
const AIResumeMaker = lazy(() => import('../pages/resume/AIResumeMaker'));
const AIMockInterview = lazy(() => import('../pages/resume/AIMockInterview'));
const AIResumeAnalyser = lazy(() => import('../pages/resume/AIResumeAnalyser'));

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
