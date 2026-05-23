// import React from 'react';
// import { assets, posts } from '../assets/assets.js'; // adjust path if needed
// import TopPostSkeleton from './TopPostSkeleton';
// import { useNavigate } from 'react-router-dom';
// import { useQuery } from '@tanstack/react-query';
// import { getMostViewedPosts } from '../services/postServices.js';
// import LoginRequiredModal from '../components/LoginRequiredModal.jsx';

// const TopPosts = () => {
//   const navigate = useNavigate();
//   const [isModalOpen, setIsModalOpen] = React.useState(false);
//   const [redirectUrl, setRedirectUrl] = React.useState('');

//   const { data, isLoading } = useQuery({
//     queryKey: ['most-viewed-posts'],
//     queryFn: () => getMostViewedPosts(5)
//   });

//   if (isLoading) {
//     return <p className="text-center"> Loading... </p>;
//   }

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   const openModal = (url) => {
//     setRedirectUrl(url);
//     setIsModalOpen(true);
//   };

//   return (
//     <>
//       {isModalOpen && (
//         <LoginRequiredModal redirecUrl={redirectUrl} closeModalCallback={closeModal} />
//       )}
//       <section className="px-6 md:px-16 lg:px-24 xl:px-32 py-12 ">
//         <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 text-center ">
//           <span className="inline-block  pb-1 ">Top Interview Posts</span>
//         </h2>

//         <div className="flex flex-col gap-6">
//           {data?.data?.map((post) => (
//             <TopPostSkeleton key={post._id} post={post} openModal={openModal} />
//           ))}
//         </div>

//         <div className="mt-10 flex justify-center">
//           <button
//             onClick={() => navigate('/posts')}
//             className="flex items-center justify-center gap-2 px-6 py-2 border border-borderColor hover:bg-gray-50 rounded-md cursor-pointer"
//           >
//             Explore all posts
//             <img src={assets.arrow_icon} alt="arrow" />
//           </button>
//         </div>
//       </section>
//     </>
//   );
// };

// export default TopPosts;


import React from 'react';
import { assets, posts } from '../assets/assets.js'; // adjust path if needed
import TopPostSkeleton from './TopPostSkeleton';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMostViewedPosts } from '../services/postServices.js';
import LoginRequiredModal from '../components/LoginRequiredModal.jsx';
import Title from './Title.jsx';
import { Zap } from 'lucide-react';

const TopPosts = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [redirectUrl, setRedirectUrl] = React.useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['most-viewed-posts'],
    queryFn: () => getMostViewedPosts(5)
  });

  if (isLoading) {
    return <p className="text-center"> Loading... </p>;
  }

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModal = (url) => {
    setRedirectUrl(url);
    setIsModalOpen(true);
  };

  return (
    <>
      {isModalOpen && (
        <LoginRequiredModal redirecUrl={redirectUrl} closeModalCallback={closeModal} />
      )}
      <div id="testimonaials" className="flex flex-col items-center my-10 scroll-mt-12 ">
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-400/10 rounded-full px-6 py-1.5">
          <Zap width={14} />
          <span>Testimonials</span>
        </div>
        <Title
          title="Top Interview Posts"
          description="This is the dummy description for the testimonials section. It will be replaced with actual testimonials later."
        />
      </div>

        <div className="flex flex-col gap-6 px-6 md:px-16 lg:px-24 xl:px-38">
          {data?.data?.map((post) => (
            <TopPostSkeleton key={post._id} post={post} openModal={openModal} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={() => navigate('/posts')}
            className="flex items-center justify-center gap-2 px-6 py-2 border border-borderColor hover:bg-gray-50 rounded-md cursor-pointer"
          >
            Explore all posts
            <img src={assets.arrow_icon} alt="arrow" />
          </button>
        </div>
    </>
  );
};

export default TopPosts;
