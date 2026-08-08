import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { searchUser } from '../services/userServices.js';
import { Helmet } from 'react-helmet';
import { Users, ArrowUp, Search, Calendar } from 'lucide-react';
import userListImage from '../assets/images/pages/user-list.png';

function UserSearch() {
  const [search, setSearch] = useState('');

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['users', search],
    getNextPageParam: (prevData) => prevData.page.nextPage,
    queryFn: ({ pageParam = 1, signal }) => searchUser(search, pageParam, 15, signal)
  });

  useEffect(() => {
    let fetching = false;

    const onScroll = async () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      if (!fetching && scrollHeight - scrollTop <= clientHeight * 1.5) {
        fetching = true;
        if (hasNextPage) {
          await fetchNextPage();
        }
        fetching = false;
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [fetchNextPage, hasNextPage]);

  function handleSearchInputChange(e) {
    setSearch(e.target.value);
  }

  const isEmpty = data?.pages[0]?.data.length === 0;

  return (
    <>
      <Helmet>
        <title>User List | Interview Experience</title>
        <meta
          name="description"
          content="Search seniors and alumni and connect with them on Interview Experience GSMCOE"
        />
        <meta name="twitter:card" content={userListImage} />
        <meta name="twitter:title" content="User List | Interview Experience" />
        <meta
          name="twitter:description"
          content="Search seniors and alumni and connect with them on Interview Experience GSMCOE"
        />
        <meta name="twitter:image" content={userListImage} />

        <meta property="og:title" content="User List | Interview Experience" />
        <meta
          property="og:description"
          content="Search seniors and alumni and connect with them on Interview Experience GSMCOE"
        />
        <meta property="og:image" content={userListImage} />
        <meta
          property="og:url"
          content={`${import.meta.env.REACT_APP_BASE_CLIENT_URL}/user/search`}
        />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="min-h-screen py-8 px-4 dark:bg-[#121212]">
        <div className="max-w-7xl mx-auto">

          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-start justify-between mb-8 gap-6 sm:gap-4">

            {/* Left Column: Title & Search */}
            <div className="flex flex-col gap-6 w-full sm:max-w-2xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary flex items-center justify-center shrink-0">
                  <Users className="w-8 h-8" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Browse and manage all users on the platform.</p>
                </div>
              </div>

              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-700 py-3.5 pl-11 pr-4 bg-gray-50 dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary focus:bg-white dark:focus:bg-[#252525] transition-all"
                  placeholder="Search users by name, branch, designation..."
                  onChange={handleSearchInputChange}
                />
              </div>
            </div>

            {/* Right Column: Stats */}
            <div className="flex flex-col sm:items-end w-full sm:w-auto">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-0.5">Total Users</div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white leading-tight mb-1">
                {data?.pages[0]?.totalUsers !== undefined 
                  ? data.pages[0].totalUsers.toLocaleString() 
                  : "..."}
              </div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Registered students & alumni
              </div>
            </div>
          </div>

          {isEmpty && !isLoading && (
            <div className="mb-8 pt-6 text-center text-gray-600">
              <p>-- No User found --</p>
            </div>
          )}

          {!isEmpty && !isLoading && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-md text-left bg-white shadow-md rounded-lg overflow-hidden ">
                  <thead className="bg-primary text-white">
                    <tr>
                      <th className="p-4 pl-7">User</th>
                      <th className="p-4 hidden md:table-cell">Designation</th>
                      <th className="p-4 hidden md:table-cell">Joined On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.pages
                      .flatMap((page) => page.data)
                      .map((user) => (
                        <tr
                          key={user._id}
                          className="hover:bg-blue-50 transition duration-150 even:bg-gray-50 border-b border-gray-100 last:border-0"
                        >
                          <td className="px-4 py-2 pl-7">
                            <Link
                              to={`/profile/${user._id}`}
                              className="flex items-center gap-3 group"
                            >
                              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0 border border-gray-200">
                                {user.profilePicture ? (
                                  <img 
                                    src={user.profilePicture} 
                                    alt={user.username} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-lg">
                                    {user.username?.charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                  {user.username}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {user.email}
                                </span>
                              </div>
                            </Link>
                          </td>
                          <td className="px-4 py-2 hidden md:table-cell text-gray-600">
                            {(() => {
                              const primaryExp = user.workExperiences?.find(exp => exp.isCurrentlyWorking) || user.workExperiences?.[0];
                              const designationToDisplay = primaryExp?.jobTitle || (user.designation !== 'NA' ? user.designation : null);
                              if (designationToDisplay) {
                                return designationToDisplay;
                              }
                              return <span className="text-gray-400 italic">Student</span>;
                            })()}
                          </td>
                          <td className="px-4 py-2 hidden md:table-cell text-gray-600">
                            {user.createdAt ? (
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span>
                                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">Unknown</span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <div className="text-center mt-6 text-gray-600">
                {isFetchingNextPage || isLoading ? (
                  <p>Loading more users...</p>
                ) : (
                  <p>— Nothing More to Load —</p>
                )}
              </div>
            </>
          )}
        </div>
      </div></>
  );
}

export default UserSearch;
