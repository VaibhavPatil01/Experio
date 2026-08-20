import { FaGithubSquare } from 'react-icons/fa'; 
import { FaLinkedin } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ProfileLeftSide from '../components/users/ProfileLeftSide';
import ProfileRightSide from '../components/users/ProfileRightSide';
import { useAppSelector } from '../redux/store.js';
import { getUserProfileStats } from '../services/userServices.js';
import { Helmet } from 'react-helmet';
import { assets } from '../assets/assets';

const ProfilePage = () => {
  const { id } = useParams();

  // Get the data related to the profile
  const profileQuery = useQuery({
    queryKey: ['profile', id],
    queryFn: () => getUserProfileStats(id)
  });
  const streakQuery = useQuery({ queryKey: ['streak', id], queryFn: () => getStreak(id) });

  // Used to check if the profile belongs to the user
  const user = useAppSelector((state) => state.userState.user);
  const isEditable = user && id === user?.userId;

  // TODO: Add good loading and error elements
  if (profileQuery.isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          height: '100vh',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {' '}
      </div>
    );
  }

  if (profileQuery.isError) {
    return (
      <div
        style={{
          display: 'flex',
          height: '100vh',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <h1>Error</h1>
      </div>
    );
  }

  // Extracting query data
  const profileData = profileQuery.data;
  const profilePostStats = profileData.postData[0];
  const votes = profilePostStats.upVoteCount - profilePostStats.downVoteCount;

  return (
    <>
    <Helmet>
        <title>
          {`${profileData.username}'s Profile | Experio`}
        </title>
        <meta
          name="description"
          content={`${profileData.username}'s Profile at Interview Experience. Check their posts and also view their bookmarked posts`}
        />
        <meta name="twitter:card" content={assets.profilePageImage} />
        <meta
          name="twitter:title"
          content={`${profileData.username}'s Profile | Experio`}
        />
        <meta
          name="twitter:description"
          content={`${profileData.username}'s Profile at Interview Experience. Check their posts and also view their bookmarked posts`}
        />
        <meta name="twitter:image" content={assets.profilePageImage} />

        <meta
          property="og:title"
          content={`${profileData.username}'s Profile | Experio`}
        />
        <meta
          property="og:description"
          content={`${profileData.username}'s Profile at Interview Experience. Check their posts and also view their bookmarked posts`}
        />
        <meta property="og:image" content={assets.profilePageImage} />
        <meta
          property="og:url"
          content={`${import.meta.env.REACT_APP_BASE_CLIENT_URL}/profile/${id}`}
        />
        <meta property="og:type" content="website" />
      </Helmet>
    <div className="pt-4 pb-4 lg:pt-8 lg:pb-8 min-h-screen">
      <div className="lg:flex max-w-[1200px] mx-auto gap-6 px-4">
        <div className="w-full lg:w-[340px] shrink-0">
          <ProfileLeftSide profileData={profileData} isEditable={isEditable} />
        </div>
        <div className="flex-1 min-w-0 mt-4 lg:mt-0">
          <ProfileRightSide profileData={profileData} isEditable={isEditable} />
        </div>
      </div>
    </div>
    </>
  );
};

export default ProfilePage;
