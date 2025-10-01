import React, { useState } from 'react';
import HomePage from './components/HomePage';
import DesignPage from './components/DesignPage';
import ProductSelectionPage from './components/ProductSelectionPage';
import { ProductType } from './types';

type Page = 'home' | 'product-selection' | 'design';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('home');
  const [productType, setProductType] = useState<ProductType>('frame');

  const handleStart = () => setPage('product-selection');

  const handleProductSelect = (type: ProductType) => {
    setProductType(type);
    setPage('design');
  };
  
  const handleBackToHome = () => setPage('home');

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <HomePage onStart={handleStart} />;
      case 'product-selection':
        return <ProductSelectionPage onSelect={handleProductSelect} onBack={handleBackToHome} />;
      case 'design':
        return <DesignPage productType={productType} onBack={() => setPage('product-selection')} />;
      default:
        return <HomePage onStart={handleStart} />;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen text-gray-800">
      {renderPage()}
    </div>
  );
};

export default App;
