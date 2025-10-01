import React from 'react';
import { ProductType } from '../types';

interface ProductSelectionPageProps {
  onSelect: (type: ProductType) => void;
  onBack: () => void;
}

// FIX: Replaced `JSX.Element` with `React.ReactNode` to resolve the "Cannot find namespace 'JSX'" error.
const ProductCard: React.FC<{ title: string; description: string; icon: React.ReactNode; onClick: () => void }> = ({ title, description, icon, onClick }) => (
    <button onClick={onClick} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 text-center w-full max-w-sm transform hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-indigo-300">
        <div className="flex items-center justify-center h-24 w-24 rounded-full bg-indigo-100 text-indigo-600 mx-auto mb-6">
            {icon}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
    </button>
);


const ProductSelectionPage: React.FC<ProductSelectionPageProps> = ({ onSelect, onBack }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 relative">
        <button onClick={onBack} className="absolute top-6 left-6 text-gray-500 hover:text-indigo-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
                محصول خود را انتخاب کنید
            </h1>
            <p className="text-lg text-gray-500">
                برای شروع، انتخاب کنید که می‌خواهید عکس خود را قاب کنید یا روی شاسی چاپ کنید.
            </p>
        </div>
      <div className="flex flex-col md:flex-row gap-8">
        <ProductCard 
            title="ساخت قاب عکس"
            description="عکس خود را با قابی زیبا و سفارشی ماندگار کنید. شامل چاپ و قاب."
            onClick={() => onSelect('frame')}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
        />
        <ProductCard 
            title="چاپ روی تخته شاسی"
            description="چاپ مستقیم عکس شما روی تخته شاسی با کیفیت بالا و ظاهری مدرن."
            onClick={() => onSelect('mdf')}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9.5V18a2 2 0 002 2h14a2 2 0 002-2V9.5M3 9.5l.5-2.5h17l.5 2.5M3 9.5L12 3l9 6.5" /></svg>}
        />
      </div>
    </div>
  );
};

export default ProductSelectionPage;