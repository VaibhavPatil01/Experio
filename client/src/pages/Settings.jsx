import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Settings, KeyRound, Palette, Trash2, AlertTriangle } from 'lucide-react';
import { useAppSelector } from '../redux/store.js';

function SettingsPage() {
  const user = useAppSelector((state) => state.userState.user);
  
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [selectedThemeColor, setSelectedThemeColor] = useState('green'); // default

  const handlePasswordChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Helmet>
        <title>Settings | Interview Experience</title>
        <meta name="description" content="Manage your account settings and preferences" />
      </Helmet>
      
      <div className="min-h-screen py-8 px-4 dark:bg-[#121212]">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-start justify-between mb-8 gap-6 sm:gap-4">
            <div className="flex flex-col gap-6 w-full sm:max-w-2xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-500 flex items-center justify-center shrink-0">
                  <Settings className="w-8 h-8" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Manage your account preferences and application appearance.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-10">
            
            {/* Update Password Section */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <KeyRound className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Change Password</h3>
              </div>
              <form className="max-w-md flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwords.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                    placeholder="••••••••"
                  />
                </div>
                <div className="mt-2">
                  <button type="submit" className="bg-primary hover:bg-primary/95 text-white font-semibold py-3 px-6 rounded-xl transition-colors">
                    Update Password
                  </button>
                </div>
              </form>
            </div>

            <hr className="border-gray-200 dark:border-gray-800" />

            {/* Appearance Section */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Palette className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Appearance</h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Select a theme color for the application.
              </p>
              <div className="flex gap-4">
                {/* Green Option */}
                <button 
                  onClick={() => setSelectedThemeColor('green')}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all shadow-sm ${selectedThemeColor === 'green' ? 'border-green-600 bg-green-50 dark:bg-green-900/10' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600'}`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#00a63e]"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Green</span>
                </button>
                
                {/* Blue Option */}
                <button 
                  onClick={() => setSelectedThemeColor('blue')}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all shadow-sm ${selectedThemeColor === 'blue' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/10' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600'}`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#2563eb]"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Blue</span>
                </button>

                {/* Red Option */}
                <button 
                  onClick={() => setSelectedThemeColor('red')}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all shadow-sm ${selectedThemeColor === 'red' ? 'border-red-600 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600'}`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#dc2626]"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Red</span>
                </button>
              </div>
            </div>

            <hr className="border-gray-200 dark:border-gray-800" />

            {/* Danger Zone Section */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-bold text-red-600 dark:text-red-400">Danger Zone</h3>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-2xl bg-red-50/50 dark:bg-red-900/10 p-5 rounded-lg border border-red-100 dark:border-red-900/30">
                <div>
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Delete Account</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                    Once you delete your account, there is no going back. All your data, profile information, and posts will be permanently deleted.
                  </p>
                </div>
                <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white dark:bg-gray-900 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 rounded-lg font-medium transition-colors shrink-0 shadow-sm">
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default SettingsPage;
