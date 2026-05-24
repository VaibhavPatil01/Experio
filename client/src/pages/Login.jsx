import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import * as Yup from 'yup';
import { Helmet } from 'react-helmet';
import ForgetPasswordModal from '../components/ForgetPasswordModal';
import { assets } from '../assets/assets.js';
import { loginUser, registerUser } from '../services/userServices.js';
import { BASE_API_URL } from '../services/serverConfig.js';
import { setLocalStorage } from '../utils/localStorage.js';
import loginPageImage from '../assets/images/pages/login.png';

function Login() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const isSignupPage = pathname === '/register';
  const formTitle = isSignupPage ? 'Sign Up' : 'Login';
  const pageDescription = isSignupPage
    ? 'Create your account to get started.'
    : 'Welcome back! Please enter your details.';
  const authSpacing = {
    formWrapperPadding: isSignupPage ? 'py-4' : 'py-10',
    headingMargin: isSignupPage ? 'mb-4' : 'mb-6',
    dividerMargin: isSignupPage ? 'my-4' : 'my-6',
    formGap: isSignupPage ? 'space-y-4' : 'space-y-5',
    footerMargin: isSignupPage ? 'mt-4' : 'mt-6'
  };

  const [showPassword, setShowPassword] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const { mutate, isLoading } = useMutation({
    mutationFn: (values) => {
      if (!isSignupPage) {
        return loginUser(values.email, values.password);
      }

      return registerUser({
        username: values.name,
        email: values.email,
        password: values.password,
        isAdmin: false,
        branch: 'Other',
        passingYear: new Date().getFullYear().toString(),
        designation: 'Student',
        about: 'Profile details pending'
      });
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Something went wrong'),
    onSuccess: (data) => {
      if (isSignupPage) {
        toast.success(data.message || 'Account created successfully');
        navigate('/login');
        return;
      }

      setLocalStorage('token', data.token);
      queryClient.refetchQueries(['user-status']);
      navigate(searchParams.get('redirect') || '/');
    }
  });

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '' },
    validationSchema: Yup.object({
      name: isSignupPage
        ? Yup.string().max(30, 'Must be 30 characters or less').required('Required')
        : Yup.string(),
      email: Yup.string().email('Invalid Email Address').required('Required'),
      password: Yup.string()
        .min(8, 'Must be at least 8 characters')
        .max(20, 'Must be 20 characters or less')
        .required('Required')
    }),
    onSubmit: mutate
  });

  const redirectURLOnLogin = searchParams.get('redirect') || '/';

  const handleGoogleSignIn = () => {
    setLocalStorage('google-login-redirect', redirectURLOnLogin);
    window.open(`${BASE_API_URL}/user/auth/google/callback`, '_self');
  };

  const getFieldError = (fieldName, label) =>
    formik.touched[fieldName] && formik.errors[fieldName] ? formik.errors[fieldName] : label;

  return (
    <>
      <Helmet>
        <title>User {formTitle} | Interview Experience</title>
        <meta
          name="description"
          content={`User ${formTitle} Page for Interview Experience GSMCOE Website`}
        />
        <meta name="twitter:card" content={loginPageImage} />
        <meta name="twitter:title" content={`User ${formTitle} | Interview Experience`} />
        <meta
          name="twitter:description"
          content={`User ${formTitle} Page for Interview Experience GSMCOE Website`}
        />
        <meta name="twitter:image" content={loginPageImage} />
        <meta property="og:title" content={`User ${formTitle} | Interview Experience`} />
        <meta
          property="og:description"
          content={`User ${formTitle} Page for Interview Experience GSMCOE Website`}
        />
        <meta property="og:image" content={loginPageImage} />
        <meta
          property="og:url"
          content={`${import.meta.env.REACT_APP_BASE_CLIENT_URL}${isSignupPage ? '/register' : '/login'}`}
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <main className="h-screen overflow-hidden bg-white">
        <div className="grid h-full min-h-0 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <section className="flex h-full min-h-0 flex-col px-5 py-6 sm:px-8 lg:px-12">
            <Link to="/" className="inline-flex w-fit" aria-label="Go to homepage">
              <img
                src={assets.logogreenblackpng}
                alt="Interview Experience"
                className="h-10 sm:h-12"
              />
            </Link>

            <div
              className={`mx-auto flex w-full max-w-md flex-1 flex-col justify-center ${authSpacing.formWrapperPadding} lg:ml-auto lg:mr-0 lg:translate-x-15`}
            >
              <div className={`${authSpacing.headingMargin} text-center`}>
                <h1 className="text-3xl font-bold text-slate-950">{formTitle}</h1>
                <p className="mt-2 text-sm text-slate-500">{pageDescription}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="flex h-12 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    loading="lazy"
                    alt=""
                    className="h-5 w-5"
                  />
                  Google
                </button>
                <button
                  type="button"
                  onClick={() => toast.error('Facebook login is not available yet')}
                  className="flex h-12 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                >
                  <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="" className="h-5 w-5" />
                  GitHub
                </button>
              </div>

              <div
                className={`${authSpacing.dividerMargin} flex items-center gap-4 text-xs text-slate-400`}
              >
                <span className="h-px flex-1 bg-slate-200" />
                <span>or with email</span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>

              <form onSubmit={formik.handleSubmit} className={authSpacing.formGap}>
                {isSignupPage && (
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-950">
                      {getFieldError('name', 'Name')}
                      <span className="text-red-500"> *</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`h-13 w-full rounded-md border bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 ${
                        formik.touched.name && formik.errors.name
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                          : 'border-slate-200'
                      }`}
                      aria-label="Name"
                      autoComplete="name"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-950">
                    {getFieldError('email', 'Work Email')}
                    <span className="text-red-500"> *</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="johndoe@mail.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`h-13 w-full rounded-md border bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 ${
                      formik.touched.email && formik.errors.email
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                        : 'border-slate-200'
                    }`}
                    aria-label="Email"
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-slate-950"
                  >
                    {getFieldError('password', 'Password')}
                    <span className="text-red-500"> *</span>
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="At least 8 character"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`h-13 w-full rounded-md border bg-white px-4 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 ${
                        formik.touched.password && formik.errors.password
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                          : 'border-slate-200'
                      }`}
                      aria-label="Password"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((currentValue) => !currentValue)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-slate-400 transition hover:text-primary"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                    </button>
                  </div>
                </div>

                {!isSignupPage && (
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <label className="flex cursor-pointer items-center gap-2 text-slate-600">
                      <input
                        type="checkbox"
                        name="remember"
                        className="h-4 w-4 rounded border-slate-300 accent-primary"
                      />
                      <span>Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setModalOpen(true)}
                      className="font-semibold text-primary hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="h-13 w-full cursor-pointer rounded-md bg-primary text-sm font-semibold text-white transition hover:bg-primary/95 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {isLoading ? `${isSignupPage ? 'Signing up' : 'Logging in'}...` : formTitle}
                </button>
              </form>

              {modalOpen && <ForgetPasswordModal closeModalCallback={() => setModalOpen(false)} />}

              <p className={`${authSpacing.footerMargin} text-center text-sm text-slate-950`}>
                {isSignupPage ? 'Already have an account?' : "Don't have an account?"}
                <Link
                  to={isSignupPage ? '/login' : '/register'}
                  className="ml-1 font-semibold text-primary hover:underline"
                >
                  {isSignupPage ? 'Login' : 'Sign Up'}
                </Link>
              </p>
            </div>
          </section>

          <div className="hidden  p-5 lg:block">
            <div className="flex h-full items-center justify-center overflow-hidden rounded-lg ">
              <img
                src={assets.loginpagegreenlogo}
                alt="Login illustration"
                className="h-130 w-130 object-cover"
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Login;
