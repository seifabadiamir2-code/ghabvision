import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DesignState, UserInfo, ProductType } from '../types';
import Sidebar from './Sidebar';
import Canvas from './Canvas';
import { FRAME_SIZES, FRAME_MATERIALS, COVER_TYPES, PRODUCT_TYPES, ADMIN_PHONE_NUMBER_WITH_COUNTRY_CODE, ADMIN_PHONE_NUMBER, ADMIN_INSTAGRAM_ID } from '../constants';

// Type assertion for the html-to-image library loaded from CDN
declare const htmlToImage: any;

// --- SVG Icons ---
const LoadingSpinner = () => <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
const ZoomIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>;
const WallIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const CheckoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const WhatsappIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 mr-2"><path fill="currentColor" d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zM12.04 20.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31c-.82-1.31-1.26-2.83-1.26-4.38 0-4.54 3.69-8.23 8.24-8.23 4.54 0 8.23 3.69 8.23 8.23 0 4.54-3.69 8.23-8.24 8.23zm4.52-6.14c-.25-.12-1.47-.72-1.7-.82-.23-.09-.39-.12-.56.12-.17.25-.64.82-.79.98-.15.17-.29.19-.54.06-.25-.12-1.06-.39-2.02-1.25-.75-.67-1.25-1.49-1.4-1.74-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.09-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.42-.14 0-.3 0-.46 0-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.76 2.68 4.27 3.77 2.51 1.08 2.51.72 2.96.69.45-.03 1.47-.6 1.67-1.18.21-.58.21-1.08.15-1.18-.07-.1-.23-.16-.48-.28z"/></svg>;
const TelegramIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 mr-2"><path fill="currentColor" d="M9.78 18.65l.28-4.23l7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3L3.64 12c-.88-.25-.89-.86.2-1.18l15.97-5.52c.72-.27 1.33.17 1.14.95l-3.54 16.51c-.21.84-1.02 1.03-1.56.63l-5.32-3.92l-2.51 2.38c-.23.22-.41.4-.69.4z"/></svg>;
const RubikaIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 mr-2"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm3.71 6.71l-2.42 2.42l-1.29-1.29l-1.29 1.29l1.29 1.29l-2.42 2.42l-1.29-1.29l-1.29 1.29l1.29 1.29l-1.29 1.29l2.58 2.58l1.29-1.29l1.29 1.29l2.42-2.42l1.29 1.29l1.29-1.29l-1.29-1.29l2.42-2.42l1.29 1.29l1.29-1.29l-1.29-1.29l-2.58-2.58l-1.29 1.29z"/></svg>;
const SMSIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="w-6 h-6 mr-2"><path fill="currentColor" d="M18 2a2 2 0 012 2v12a2 2 0 01-2 2H2a2 2 0 01-2-2V4a2 2 0 012-2h16zM5 14h10a1 1 0 000-2H5a1 1 0 000 2zm0-4h10a1 1 0 000-2H5a1 1 0 000 2zm0-4h4a1 1 0 100-2H5a1 1 0 100 2z"/></svg>;


// --- Modal Components ---
const UserInfoModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (userInfo: UserInfo) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
    const [userInfo, setUserInfo] = useState<UserInfo>({ name: '', phone: '', notes: '' });

    const handleSubmit = () => {
        if (!userInfo.name || !userInfo.phone) {
            alert('لطفاً نام و شماره تماس را وارد کنید.');
            return;
        }
        onSubmit(userInfo);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md animate-fade-in-up">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">اطلاعات سفارش‌دهنده</h2>
                <div className="space-y-4">
                    <input type="text" placeholder="نام و نام خانوادگی*" value={userInfo.name} onChange={e => setUserInfo(p => ({ ...p, name: e.target.value }))} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 transition" />
                    <input type="tel" placeholder="شماره تماس*" value={userInfo.phone} onChange={e => setUserInfo(p => ({ ...p, phone: e.target.value }))} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 transition" />
                    <textarea placeholder="توضیحات اضافه (اختیاری)" value={userInfo.notes} onChange={e => setUserInfo(p => ({ ...p, notes: e.target.value }))} className="w-full p-3 border border-gray-300 rounded-md h-24 resize-none focus:ring-2 focus:ring-indigo-500 transition" />
                </div>
                <div className="mt-6 flex gap-3">
                    <button onClick={onClose} className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors">انصراف</button>
                    <button onClick={handleSubmit} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors">تایید و ادامه</button>
                </div>
            </div>
        </div>
    );
};

const ShareModal: React.FC<{
    order: { image: string; message: string } | null;
    onClose: () => void;
}> = ({ order, onClose }) => {
    if (!order) return null;
    const { image, message } = order;

    const downloadImage = () => {
        const link = document.createElement('a');
        link.download = `ghabvision-order-${new Date().getTime()}.png`;
        link.href = image;
        link.click();
    };
    
    const copyToClipboard = () => {
        navigator.clipboard.writeText(decodeURIComponent(message)).then(() => alert('متن سفارش کپی شد!'));
    };
    
    const rubikaLink = `https://rubika.ir/share/url?url=&text=${message}`;

    const ShareButton: React.FC<{ icon: React.ReactNode; text: string; href: string; color: string; isExternal?: boolean; onClick?: () => void;}> = ({ icon, text, href, color, isExternal = true, onClick }) => (
        <a href={href} {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })} onClick={onClick} className={`flex items-center justify-center w-full ${color} text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105`}>
            {icon}
            <span>{text}</span>
        </a>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md text-center animate-fade-in-up">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">سفارش شما آماده ارسال است</h2>
                <p className="text-gray-600 mb-4 text-sm">برای تکمیل، تصویر را دانلود و متن را کپی کرده، سپس از طریق پیام‌رسان دلخواه برای ما ارسال کنید.</p>
                <img src={image} alt="پیش‌نمایش سفارش" className="w-full h-auto rounded-md mb-4 border-2 border-gray-200" />
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <button onClick={downloadImage} className="bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105">۱. دانلود تصویر</button>
                    <button onClick={copyToClipboard} className="bg-gray-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-700 transition-transform transform hover:scale-105">۲. کپی متن</button>
                </div>
                <div className="space-y-3">
                   <h3 className="font-semibold text-gray-700">۳. ارسال برای ما:</h3>
                   <ShareButton icon={<WhatsappIcon />} text="ارسال با واتساپ" href={`https://wa.me/${ADMIN_PHONE_NUMBER_WITH_COUNTRY_CODE}?text=${message}`} color="bg-green-500 hover:bg-green-600" />
                   <ShareButton icon={<TelegramIcon />} text="ارسال با تلگرام" href={`https://t.me/share/url?url=&text=${message}`} color="bg-sky-500 hover:bg-sky-600" />
                   <ShareButton icon={<RubikaIcon />} text="ارسال با روبیکا" href={rubikaLink} color="bg-purple-500 hover:bg-purple-600" />
                   <ShareButton icon={<SMSIcon />} text="ارسال با پیامک (SMS)" href={`sms:${ADMIN_PHONE_NUMBER}?&body=${message}`} color="bg-orange-500 hover:bg-orange-600" isExternal={false} />
                </div>
                <button onClick={onClose} className="mt-6 text-gray-500 hover:text-gray-800 font-semibold transition-colors">بستن</button>
            </div>
        </div>
    );
};

// --- Social Links Component ---
const SocialLinks = () => {
    const iconStyle = "w-6 h-6 text-gray-500 hover:text-indigo-600 transition-colors";
    const ghabvisionId = ADMIN_INSTAGRAM_ID;
    
    return (
        <div className="absolute bottom-4 left-4 flex flex-col gap-4 z-10 bg-white/50 backdrop-blur-sm p-2 rounded-xl">
             <a href={`https://instagram.com/${ghabvisionId}`} target="_blank" rel="noopener noreferrer" title="Instagram" className={iconStyle}>
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.802c-3.14 0-3.483.01-4.698.067-2.428.11-3.645 1.321-3.755 3.755-.057 1.215-.067 1.558-.067 4.698s.01 3.483.067 4.698c.11 2.433 1.328 3.645 3.755 3.755 1.215.057 1.558.067 4.698.067s3.483-.01 4.698-.067c2.428-.11 3.645-1.321 3.755-3.755.057-1.215.067-1.558.067-4.698s-.01-3.483-.067-4.698c-.11-2.433-1.328-3.645-3.755-3.755-1.215-.057-1.558-.067-4.698-.067zm0 4.639c-2.404 0-4.35 1.946-4.35 4.35s1.946 4.35 4.35 4.35 4.35-1.946 4.35-4.35-1.946-4.35-4.35-4.35zm0 7.218c-1.583 0-2.868-1.285-2.868-2.868s1.285-2.868 2.868-2.868 2.868 1.285 2.868 2.868-1.285 2.868-2.868 2.868zm4.965-7.737c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25z"/></svg>
            </a>
            <a href={`https://youtube.com/@${ghabvisionId}`} target="_blank" rel="noopener noreferrer" title="YouTube" className={iconStyle}>
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.582 7.354c-.22-.81-.883-1.473-1.693-1.693C18.23 5.25 12 5.25 12 5.25s-6.23 0-7.889.411c-.81.22-1.473.883-1.693 1.693C2.007 8.973 2 12 2 12s.007 3.027.418 4.646c.22.81.883 1.473 1.693 1.693C5.77 18.75 12 18.75 12 18.75s6.23 0 7.889-.411c.81-.22 1.473-.883 1.693-1.693C21.993 15.027 22 12 22 12s-.007-3.027-.418-4.646zM9.75 14.885V9.115l4.998 2.885-4.998 2.885z"/></svg>
            </a>
            <a href={`https://t.me/${ghabvisionId}`} target="_blank" rel="noopener noreferrer" title="Telegram" className={iconStyle}>
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 2L11 13l-4 4-2-8 2-2 11-8zM22 2l-3 20-6-6-4-4L22 2z"/></svg>
            </a>
            <a href="https://ghabvision.com" target="_blank" rel="noopener noreferrer" title="Website" className={iconStyle}>
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
            </a>
        </div>
    );
};


// --- Main DesignPage Component ---

interface DesignPageProps {
  productType: ProductType;
  onBack: () => void;
}

const DesignPage: React.FC<DesignPageProps> = ({ productType, onBack }) => {
  const [design, setDesign] = useState<DesignState>({
    productType: productType,
    imageSrc: null,
    imagePosition: { x: 50, y: 50 },
    imageZoom: 1,
    frameSizePresetValue: FRAME_SIZES[1].value, // Default to A4
    customWidth: 21,
    customHeight: 29.7,
    frameColor: '#111827',
    frameMaterial: 'pvc',
    pvcTexture: 'smooth-matte',
    frameWidth: 30,
    coverType: 'glass',
  });
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'closeup' | 'onwall'>('closeup');
  const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState(false);
  const [finalOrder, setFinalOrder] = useState<{ image: string; message: string } | null>(null);
  
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const savedDesign = localStorage.getItem('ghabvision_design');
      if (savedDesign) {
        const parsed = JSON.parse(savedDesign);
        if(parsed.productType === productType) {
            setDesign(d => ({ ...d, ...parsed }));
        } else {
            updateDesign('productType', productType);
        }
      } else {
        updateDesign('productType', productType);
      }
    } catch(e) { console.error("Failed to load design", e); }
  }, [productType]);
  
  useEffect(() => {
    try {
      localStorage.setItem('ghabvision_design', JSON.stringify(design));
    } catch(e) { console.error("Failed to save design", e); }
  }, [design]);

  const updateDesign = useCallback(<K extends keyof DesignState>(key: K, value: DesignState[K]) => {
    setDesign(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleGenerateOrder = async (userInfo: UserInfo) => {
    setIsUserInfoModalOpen(false);
    if (!canvasRef.current || !design.imageSrc) return;
    
    setIsLoading(true);
    const currentView = viewMode;
    setViewMode('closeup');
    
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const dataUrl = await htmlToImage.toPng(canvasRef.current, { quality: 0.95, pixelRatio: 2 });
      
      const productLabel = PRODUCT_TYPES.find(p => p.value === design.productType)?.label || '';
      const sizeLabel = `${design.customWidth} × ${design.customHeight} سانتی‌متر`;
      const coverLabel = COVER_TYPES.find(c => c.value === design.coverType)?.label || '';
      const materialLabel = FRAME_MATERIALS.find(m => m.value === design.frameMaterial)?.label || '';
      
      const message = `
--- سفارش جدید قاب ویژن ---
نام مشتری: ${userInfo.name}
شماره تماس: ${userInfo.phone}
---
نوع محصول: ${productLabel}
سایز: ${sizeLabel}
${design.productType === 'frame' ? `جنس قاب: ${materialLabel}` : ''}
${design.productType === 'frame' ? `رنگ قاب: ${design.frameColor}` : ''}
${design.productType === 'frame' ? `پهنای قاب: ${design.frameWidth / 10} سانتی‌متر` : ''}
${design.productType === 'frame' ? `نوع پوشش: ${coverLabel}` : ''}
---
توضیحات:
${userInfo.notes || 'ندارد'}
      `.trim().replace(/\n\s*\n/g, '\n');

      setFinalOrder({ image: dataUrl, message: encodeURIComponent(message) });

    } catch (error) {
      console.error('oops, something went wrong!', error);
      alert('خطا در ایجاد تصویر. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsLoading(false);
      setViewMode(currentView);
    }
  };


  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-200">
       <UserInfoModal isOpen={isUserInfoModalOpen} onClose={() => setIsUserInfoModalOpen(false)} onSubmit={handleGenerateOrder} />
       <ShareModal order={finalOrder} onClose={() => setFinalOrder(null)} />

      {/* --- Sidebar --- */}
      <div className={`fixed md:relative top-0 right-0 h-full w-80 md:w-96 bg-white shadow-xl z-20 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0`}>
        <Sidebar design={design} updateDesign={updateDesign} />
        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden absolute top-4 left-4 text-gray-500 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        <button onClick={onBack} className="absolute top-4 left-4 hidden md:flex items-center justify-center text-gray-500 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg></button>
      </div>

      {/* --- Main Canvas Area --- */}
      <main className="flex-1 flex flex-col items-center justify-between p-2 sm:p-4 h-full relative">
        <SocialLinks />
        <div className="w-full flex-grow flex items-center justify-center">
            <Canvas ref={canvasRef} design={design} updateDesign={updateDesign} viewMode={viewMode} />
        </div>
        <div className="w-full flex flex-col items-center gap-4 p-4">
            <div className="bg-white/60 backdrop-blur-lg p-2 rounded-xl shadow-md flex items-center gap-2">
                <button onClick={() => setViewMode('closeup')} className={`flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200 ${viewMode === 'closeup' ? 'bg-indigo-600 text-white shadow-md' : 'bg-transparent text-gray-700 hover:bg-gray-200'}`}><ZoomIcon /> نمای نزدیک</button>
                <button onClick={() => setViewMode('onwall')} className={`flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200 ${viewMode === 'onwall' ? 'bg-indigo-600 text-white shadow-md' : 'bg-transparent text-gray-700 hover:bg-gray-200'}`}><WallIcon /> روی دیوار</button>
            </div>
             <button onClick={() => setIsUserInfoModalOpen(true)} disabled={isLoading || !design.imageSrc} className="w-full max-w-sm bg-green-600 text-white font-bold py-4 px-4 rounded-xl hover:bg-green-700 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center shadow-lg hover:shadow-xl">
                {isLoading ? <LoadingSpinner /> : <>تکمیل سفارش و ارسال <CheckoutIcon /></>}
            </button>
        </div>
      </main>

      {/* --- Mobile Sidebar Toggle --- */}
      <button onClick={() => setIsSidebarOpen(true)} className="md:hidden fixed bottom-4 right-4 bg-indigo-600 text-white p-4 rounded-full shadow-lg z-10 animate-pulse-slow"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg></button>
    </div>
  );
};

export default DesignPage;