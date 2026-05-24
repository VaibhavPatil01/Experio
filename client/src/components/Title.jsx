import React from 'react';
import { useAppSelector } from '../redux/store.js';

const Title = ({ title, description }) => {

  const theme = useAppSelector((state) => state.themeState.theme);

  return (
    <div className="text-center mt-6 text-slate-700 dark:text-slate-200 dark:bg-black">
      <h2 className="text-3xl sm:text-4xl font-medium">{title}</h2>
      <p className="max-sm max-w-2xl mt-4 text-slate-500 dark:text-gray-400">{description}</p>
    </div>
  );
};

export default Title;
