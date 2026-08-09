import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowLeft } from 'lucide-react';

import { useAppSelector } from '../redux/store.js';
import { getPost } from '../services/postServices.js';
import { useDeletePost } from '../hooks/useDeletePost.js';
import generateTextFromHTML from '../utils/generateTextFromHTML.js';
import generateSlug from '../utils/generateSlug.js';
import postImage from '../assets/images/pages/home-page.png';

// Components
import Loading from './Loading.jsx';
import DeletePostModal from '../components/DeletePostModal.jsx';
import PostComments from '../components/PostComments';

// New Redesign Components
import PostHeader from '../components/PostDetails/PostHeader';
import PostTabs from '../components/PostDetails/PostTabs';
import PostContent from '../components/PostDetails/PostContent';
import PostVotingAndShare from '../components/PostDetails/PostVotingAndShare';
import PostAuthorCard from '../components/PostDetails/Sidebar/PostAuthorCard';
import ExperienceHighlightsCard from '../components/PostDetails/Sidebar/ExperienceHighlightsCard';
import SimilarExperiencesCard from '../components/PostDetails/Sidebar/SimilarExperiencesCard';
import PopularTagsCard from '../components/PostDetails/Sidebar/PopularTagsCard';
import PracticePromoCard from '../components/PostDetails/Sidebar/PracticePromoCard';

function PostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector((state) => state.userState.user);
  
  const [activeTab, setActiveTab] = useState('experience');

  const {
    isDeleteModalOpen,
    deleteDetails,
    openDeleteModal,
    closeDeleteModal,
    mutate,
    isLoading: isDeleting
  } = useDeletePost(['post', id]);

  const postQuery = useQuery({
    queryKey: ['post', id],
    queryFn: () => getPost(id),
    staleTime: 0 // Changed from 30 mins to force refresh during development
  });

  useEffect(() => {
    if (postQuery.data && location.hash) {
      // Delay slightly to ensure comments are rendered
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('bg-yellow-50', 'dark:bg-yellow-900/20', 'transition-colors', 'duration-1000');
          setTimeout(() => {
            element.classList.remove('bg-yellow-50', 'dark:bg-yellow-900/20');
          }, 3000);
        }
      }, 500);
    }
  }, [postQuery.data, location.hash]);

  if (postQuery.isLoading) {
    return <Loading />;
  }
  if (postQuery.isError) {
    return <h3 className="text-center mt-10 text-red-500">Error occurred while fetching post</h3>;
  }

  const authorId = postQuery.data?.postAuthorId;
  const isEditable = user?.userId === authorId || user?.isAdmin;
  const post = postQuery.data;

  if (!id) {
    navigate('/');
    return <h1>Post Id not found!!</h1>;
  }

  if (!post) {
    return <h3 className="text-center mt-10">No data available</h3>;
  }

  return (
    <>
      <Helmet>
        <title>{`${post.title || post.company} | Interview Experience`}</title>
        <meta
          name="description"
          content={`${post.postType} titled "${post.title}" specially for GSMCOE on Interview Experience. ${generateTextFromHTML(post.content || '')}`}
        />
        <meta name="twitter:card" content={postImage} />
        <meta name="twitter:title" content={`${post.title || post.company} | Interview Experience`} />
        <meta
          name="twitter:description"
          content={`${post.postType} titled "${post.title}" specially for GSMCOE on Interview Experience. ${generateTextFromHTML(post.content || '')}`}
        />
        <meta name="twitter:image" content={postImage} />
        <meta property="og:title" content={`${post.title || post.company} | Interview Experience`} />
        <meta
          property="og:description"
          content={`${post.postType} titled "${post.title}" specially for GSMCOE on Interview Experience. ${generateTextFromHTML(post.content || '')}`}
        />
        <meta property="og:image" content={postImage} />
        <meta
          property="og:url"
          content={`${import.meta.env.REACT_APP_BASE_CLIENT_URL}/post/${id}/${generateSlug(post.title || post.company || '')}`}
        />
        <meta property="og:type" content="article" />
      </Helmet>

      {isDeleteModalOpen && (
        <DeletePostModal
          postDetails={deleteDetails}
          onClose={closeDeleteModal}
          mutate={mutate}
          isLoading={isDeleting}
        />
      )}

      {/* Main Page Background */}
      <div className="bg-gray-50 min-h-screen pt-4 pb-12">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-12">
          
          {/* Back Button */}
          <Link to="/" className="inline-flex items-center gap-2 text-primary font-bold text-[15px] mb-4 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-4 h-4" />
            Back to posts
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-4">
            
            {/* Left Column (Main Content) - 5 cols */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-lg border border-gray-100 p-6 sm:p-8">
                <PostHeader post={post} postId={id} isEditable={isEditable} openDeleteModal={openDeleteModal} />
                <PostTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                <PostContent activeTab={activeTab} post={post} />
                <PostVotingAndShare post={post} />
                <PostComments postId={id} />
                
              </div>
            </div>

            {/* Right Column (Sidebar) - 2 cols */}
            <div className="lg:col-span-2 flex flex-col gap-0 sticky top-4 h-fit">
              <PostAuthorCard post={post} />
              <ExperienceHighlightsCard post={post} />
              <SimilarExperiencesCard postId={id} />
              <PopularTagsCard post={post} />
              <PracticePromoCard />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default PostPage;
