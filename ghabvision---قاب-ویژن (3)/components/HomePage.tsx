import React from 'react';
import { ADMIN_INSTAGRAM_ID } from '../constants';

interface HomePageProps {
  onStart: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="bg-white/70 backdrop-blur-xl p-10 rounded-2xl shadow-2xl max-w-2xl">
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-500">
          قاب ویژن
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-10">
          اثر هنری خود را در قابی بی‌نظیر ماندگار کنید
        </p>
        <button
          onClick={onStart}
          className="bg-indigo-600 text-white font-bold text-xl px-16 py-4 rounded-xl shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300 transform hover:scale-105"
        >
          شروع طراحی
        </button>
      </div>
       <footer className="absolute bottom-4 text-gray-500 text-sm">
          <a href={`https://instagram.com/${ADMIN_INSTAGRAM_ID}`} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">
              @{ADMIN_INSTAGRAM_ID} | GhabVision
          </a>
      </footer>
    </div>
  );
};

export default HomePage;
