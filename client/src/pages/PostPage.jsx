import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
          <Link to="/" className="inline-flex items-center gap-2 text-primary font-bold text-sm mb-6 hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Back to posts
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-4">
            
            {/* Left Column (Main Content) - 8 cols */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-lg border border-gray-100 p-6 sm:p-8">
                <PostHeader post={post} postId={id} />
                <PostTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                <PostContent activeTab={activeTab} post={post} />
                <PostVotingAndShare post={post} />
                <PostComments postId={id} />
                
                {/* Admin/Author Edit/Delete Controls */}
                {isEditable && (
                  <div className="mt-8 pt-6 border-t border-gray-200 flex gap-4">
                    <Link
                      to={`/post/edit/${id}`}
                      className="px-6 py-2 rounded-lg border border-primary text-primary font-medium hover:bg-primary/5 transition-colors"
                    >
                      Edit Post
                    </Link>
                    <button
                      onClick={() => openDeleteModal({ id, title: post.title })}
                      className="px-6 py-2 rounded-lg bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column (Sidebar) - 4 cols */}
            <div className="lg:col-span-4 flex flex-col gap-0 sticky top-4 h-fit">
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
