import React, { useState, useCallback } from 'react';
import { DesignState, FrameMaterial, PvcTexture } from '../types';
import { FRAME_SIZES, FRAME_COLORS, COVER_TYPES, FRAME_MATERIALS, PVC_TEXTURES } from '../constants';

// AccordionItem component is now controlled by parent state
const AccordionItem: React.FC<{ title: string; children: React.ReactNode; isOpen: boolean; onToggle: () => void; }> = ({ title, children, isOpen, onToggle }) => {
    return (
        <div className="border-b border-gray-200">
            <button onClick={onToggle} className="w-full flex justify-between items-center p-4 text-right font-bold text-gray-800 hover:bg-gray-100 focus:outline-none transition-colors">
                <span>{title}</span>
                <svg className={`w-5 h-5 transition-transform transform text-gray-500 ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isOpen && <div className="p-4 bg-white space-y-5">{children}</div>}
        </div>
    );
};

const CheckmarkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);


interface SidebarProps {
  design: DesignState;
  updateDesign: <K extends keyof DesignState>(key: K, value: DesignState[K]) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ design, updateDesign }) => {
  const [openAccordion, setOpenAccordion] = useState<string>('UPLOAD');

  const handleToggle = (title: string) => {
    setOpenAccordion(prev => prev === title ? '' : title);
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateDesign('imageSrc', event.target?.result as string);
        if (design.productType === 'frame') {
            handleToggle('FRAME');
        } else {
            handleToggle('DIMENSIONS');
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  const handleSizeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    updateDesign('frameSizePresetValue', value);
    if(value !== 'custom') {
        const selectedSize = FRAME_SIZES.find(s => s.value === value);
        if (selectedSize) {
            const dims = selectedSize.label.match(/(\d+(\.\d+)?)\s*×\s*(\d+(\.\d+)?)/);
            if(dims) {
                const w = parseFloat(dims[1]);
                const h = parseFloat(dims[3]);
                updateDesign('customWidth', w);
                updateDesign('customHeight', h);
            }
        }
    }
  }, [updateDesign]);
  
  const handleCustomDimChange = useCallback((dim: 'width' | 'height', value: string) => {
      updateDesign('frameSizePresetValue', 'custom');
      updateDesign(dim === 'width' ? 'customWidth' : 'customHeight', parseFloat(value) || 0);
  }, [updateDesign]);

  const customSliderStyle = `
    input[type=range].custom-slider {
      -webkit-appearance: none;
      width: 100%;
      background: transparent;
    }
    input[type=range].custom-slider:focus {
      outline: none;
    }
    input[type=range].custom-slider::-webkit-slider-runnable-track {
      width: 100%;
      height: 8px;
      cursor: pointer;
      background: #ddd;
      border-radius: 5px;
    }
    input[type=range].custom-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      height: 20px;
      width: 20px;
      border-radius: 50%;
      background: #4f46e5;
      cursor: pointer;
      margin-top: -6px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }
     input[type=range].custom-slider::-moz-range-track {
      width: 100%;
      height: 8px;
      cursor: pointer;
      background: #ddd;
      border-radius: 5px;
    }
    input[type=range].custom-slider::-moz-range-thumb {
      height: 20px;
      width: 20px;
      border-radius: 50%;
      background: #4f46e5;
      cursor: pointer;
      border: none;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }
  `;

  return (
    <div className="h-full overflow-y-auto bg-gray-50 flex flex-col">
        <style>{customSliderStyle}</style>
        <div className="p-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">تنظیمات طراحی</h2>
            <p className="text-sm text-gray-500">{design.productType === 'frame' ? 'قاب عکس' : 'چاپ روی شاسی'}</p>
        </div>
        <div className="flex-grow">
            <AccordionItem title="۱. آپلود عکس" isOpen={openAccordion === 'UPLOAD'} onToggle={() => handleToggle('UPLOAD')}>
                <label htmlFor="image-upload" className="cursor-pointer w-full bg-indigo-600 text-white text-center font-semibold py-3 px-4 rounded-md hover:bg-indigo-700 transition-all duration-200 transform hover:scale-105 block shadow-md hover:shadow-lg">
                    انتخاب عکس
                </label>
                <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                <p className="text-xs text-gray-500 mt-2 text-center">عکس خود را برای قرار دادن در قاب انتخاب کنید.</p>
            </AccordionItem>
            
            <AccordionItem title="۲. ابعاد و سایز" isOpen={openAccordion === 'DIMENSIONS'} onToggle={() => handleToggle('DIMENSIONS')}>
                <div>
                    <label className="text-sm font-semibold text-gray-700">سایزهای استاندارد</label>
                    <select value={design.frameSizePresetValue} onChange={handleSizeChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                      {FRAME_SIZES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      <option value="custom">سایز دلخواه</option>
                    </select>
                </div>
                <div>
                     <label className="text-sm font-semibold text-gray-700">سایز دلخواه (سانتی‌متر)</label>
                     <div className="flex gap-2 mt-1">
                        <input type="number" placeholder="عرض" value={design.customWidth} onChange={e => handleCustomDimChange('width', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
                        <input type="number" placeholder="ارتفاع" value={design.customHeight} onChange={e => handleCustomDimChange('height', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
                     </div>
                </div>
            </AccordionItem>

            {design.productType === 'frame' && (
                <>
                    <AccordionItem title="۳. مشخصات قاب" isOpen={openAccordion === 'FRAME'} onToggle={() => handleToggle('FRAME')}>
                         <div>
                            <label className="text-sm font-semibold text-gray-700">جنس قاب</label>
                            <select value={design.frameMaterial} onChange={e => updateDesign('frameMaterial', e.target.value as FrameMaterial)} className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                              {FRAME_MATERIALS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                            </select>
                        </div>
                        {design.frameMaterial === 'pvc' && (
                            <div>
                                <label className="text-sm font-semibold text-gray-700">بافت قاب PVC</label>
                                <select value={design.pvcTexture} onChange={e => updateDesign('pvcTexture', e.target.value as PvcTexture)} className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                                  {PVC_TEXTURES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                </select>
                            </div>
                        )}
                        <div>
                            <label className="text-sm font-semibold text-gray-700">رنگ قاب</label>
                            <div className="mt-2 grid grid-cols-6 gap-2">
                            {FRAME_COLORS.map(color => (
                                <button
                                key={color}
                                onClick={() => updateDesign('frameColor', color)}
                                className={`w-full h-9 rounded-md border-2 transition-transform transform hover:scale-110 flex items-center justify-center ${design.frameColor === color ? 'ring-2 ring-offset-2 ring-indigo-500' : 'border-gray-300'}`}
                                style={{ backgroundColor: color }}
                                aria-label={`Select color ${color}`}
                                >
                                {design.frameColor === color && (
                                    <span className={['#FFFFFF', '#F9FAFB', '#F5F5F4', '#E7E5E4', '#D1D5DB'].includes(color) ? 'text-gray-900' : 'text-white'}>
                                        <CheckmarkIcon />
                                    </span>
                                )}
                                </button>
                            ))}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="frameWidth" className="text-sm font-semibold text-gray-700">پهنای قاب ({design.frameWidth / 10} سانتی‌متر)</label>
                            <input id="frameWidth" type="range" min="10" max="80" step="5" value={design.frameWidth} onChange={e => updateDesign('frameWidth', parseInt(e.target.value))} className="mt-2 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer custom-slider" />
                        </div>
                    </AccordionItem>
                    <AccordionItem title="۴. نوع پوشش" isOpen={openAccordion === 'COVER'} onToggle={() => handleToggle('COVER')}>
                        <label htmlFor="coverType" className="sr-only">نوع پوشش</label>
                        <select id="coverType" value={design.coverType} onChange={e => updateDesign('coverType', e.target.value as DesignState['coverType'])} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                        {COVER_TYPES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                    </AccordionItem>
                </>
            )}
        </div>
    </div>
  );
};

export default Sidebar;