import React from 'react';
import { Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import penIcon from '../assets/images/icons/pen-svgrepo-com.svg';
import starIcon from '../assets/images/icons/star-06-svgrepo-com.svg';

const ProfileLeftSide = ({ profileData }) => {
  return (
    <div className="relative py-1 lg:sticky lg:top-20 h-fit flex flex-col gap-4">
      {/* Card 1: Main Profile Info */}
      <div className="bg-white rounded-md shadow-[0_1px_2px_rgba(0,0,0,0.02)] border border-gray-100 p-6">
        <div className="flex flex-col items-center text-center relative mb-6">
          <Link to="/profile/edit" className="absolute right-0 top-0 text-gray-500 hover:text-gray-700 transition-colors">
            <img src={penIcon} alt="edit" className="w-[22px] h-[22px] opacity-60 hover:opacity-100 transition-opacity" />
          </Link>
          <div className="w-[84px] h-[84px] rounded-full bg-black flex items-center justify-center text-white text-3xl font-bold mb-4">
            {profileData?.username ? profileData.username[0].toUpperCase() : 'V'}
          </div>

          <h2 className="text-[22px] font-bold text-gray-900 mb-1 leading-tight">
            {profileData?.username || 'Vaibhav Patil'}
          </h2>
          <p className="text-gray-500 text-[13px] font-semibold mb-3 tracking-wide uppercase">
            {profileData?.designation || 'NA'}
          </p>
          <p className="text-gray-900 font-medium text-[15px] mb-1">
            {profileData?.degree || 'Bachelor Of Technology (B.Tech/B.E)'}
          </p>
          <p className="text-gray-500 text-[14px] mb-1">
            {profileData?.branch || 'NA'} • {profileData?.passingYear || 'NA'}
          </p>
          <p className="text-gray-500 text-[14px]">
            {profileData?.location || 'Pune'}
          </p>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-gray-500 text-[13px] flex items-center gap-1.5">
            <img src={starIcon} alt="updated" className="w-[14px] h-[14px] opacity-60" />
            Profile last updated on: 18 Jul, 2026
          </p>
        </div>
      </div>

      {/* Card 2: Contact Info */}
      <div className="bg-white rounded-md shadow-[0_1px_2px_rgba(0,0,0,0.02)] border border-gray-100 p-6">
        <div className="flex items-center gap-3 text-gray-700 mb-4">
          <Phone className="w-5 h-5 text-emerald-600" />
          <span className="text-[15px]">{profileData?.phone || '+91 7249412825'}</span>
          <Link to="/profile/edit" className="ml-auto text-gray-400 hover:text-gray-600 transition-colors">
            <img src={penIcon} alt="edit" className="w-[18px] h-[18px] opacity-60 hover:opacity-100 transition-opacity" />
          </Link>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <Mail className="w-5 h-5 text-emerald-600" />
          <span className="text-[15px] truncate">{profileData?.email || 'vaibhavvpatil132@gmail.com'}</span>
        </div>
      </div>

      {/* Card 3: Profile Completion Score */}
      <div className="bg-white rounded-md shadow-[0_1px_2px_rgba(0,0,0,0.02)] border border-gray-100 p-6 flex items-center gap-4">
        <div className="relative flex items-center justify-center w-14 h-14 shrink-0">
          <svg className="w-14 h-14 transform -rotate-90">
            <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4.5" fill="transparent" className="text-gray-100" />
            <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4.5" fill="transparent" strokeDasharray={24 * 2 * Math.PI} strokeDashoffset="0" className="text-emerald-600" />
          </svg>
          <span className="absolute text-[13px] font-bold text-gray-900">100%</span>
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-[15px] mb-1">Profile score</h3>
          <p className="text-[13px] text-gray-500 leading-snug">
            Congratulations! Your profile is 100% complete and ready to impress recruiters.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileLeftSide;
