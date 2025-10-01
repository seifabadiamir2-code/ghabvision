import React, { forwardRef, useState, useRef, MouseEvent, useMemo } from 'react';
import { DesignState } from '../types';
import { FRAME_SIZES } from '../constants';

interface CanvasProps {
  design: DesignState;
  updateDesign: <K extends keyof DesignState>(key: K, value: DesignState[K]) => void;
  viewMode: 'closeup' | 'onwall';
}

const Canvas = forwardRef<HTMLDivElement, CanvasProps>(({ design, updateDesign, viewMode }, ref) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);
  
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!design.imageSrc) return;
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    if (imageContainerRef.current) imageContainerRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !imageContainerRef.current) return;
    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;
    const containerRect = imageContainerRef.current.getBoundingClientRect();
    const newX = design.imagePosition.x + (dx / containerRect.width) * 100;
    const newY = design.imagePosition.y + (dy / containerRect.height) * 100;
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    updateDesign('imagePosition', { x: Math.max(0, Math.min(100, newX)), y: Math.max(0, Math.min(100, newY)) });
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
    if (imageContainerRef.current) imageContainerRef.current.style.cursor = 'grab';
  };
  
  const aspectRatio = useMemo(() => {
    if (design.customWidth > 0 && design.customHeight > 0) {
        return design.customWidth / design.customHeight;
    }
    const preset = FRAME_SIZES.find(s => s.value === design.frameSizePresetValue);
    return preset ? preset.aspectRatio : 2/3;
  }, [design.customWidth, design.customHeight, design.frameSizePresetValue]);

  const frameStyle: React.CSSProperties = useMemo(() => {
    const baseStyle: React.CSSProperties = {
      padding: `${design.frameWidth}px`,
      backgroundColor: design.frameColor,
      boxShadow: '0 10px 20px -5px rgba(0,0,0,0.2), inset 0 2px 4px rgba(0,0,0,0.15)',
      transition: 'all 0.3s ease-in-out',
    };

    if (design.productType === 'frame') {
        if (design.frameMaterial === 'metal') {
            return {
                ...baseStyle,
                backgroundImage: `linear-gradient(145deg, rgba(255,255,255,0.2), rgba(0,0,0,0.2)), linear-gradient(to right, ${design.frameColor}, #888, ${design.frameColor})`,
                backgroundBlendMode: 'overlay',
                backgroundSize: '200% 100%',
            };
        }
        
        // PVC styles
        let pvcStyle: React.CSSProperties = { ...baseStyle };
        switch(design.pvcTexture) {
            case 'smooth-glossy':
                pvcStyle.backgroundImage = `linear-gradient(135deg, rgba(255,255,255,0.25) 5%, rgba(255,255,255,0) 40%)`;
                break;
            case 'fine-lines':
                pvcStyle.backgroundImage = `repeating-linear-gradient(90deg, rgba(0,0,0,0.03), rgba(0,0,0,0.03) 1px, transparent 1px, transparent 4px)`;
                break;
            case 'textured':
                 pvcStyle.backgroundImage = `url('data:image/svg+xml,%3Csvg width="6" height="6" viewBox="0 0 6 6" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23000000" fill-opacity="0.05" fill-rule="evenodd"%3E%3Cpath d="M5 0h1L0 6V5zM6 5v1H5z"/%3E%3C/g%3E%3C/svg%3E')`;
                break;
            case 'smooth-matte':
            default:
                pvcStyle.backgroundImage = `linear-gradient(145deg, rgba(255,255,255,0.05), rgba(0,0,0,0.1))`;
                break;
        }
        return pvcStyle;
    }

    // MDF style
    return {
        padding: '0',
        backgroundColor: 'transparent'
    };
  }, [design.frameWidth, design.frameColor, design.productType, design.frameMaterial, design.pvcTexture]);


  const imageStyle: React.CSSProperties = {
    backgroundImage: `url(${design.imageSrc})`,
    backgroundSize: 'cover',
    backgroundPosition: `${design.imagePosition.x}% ${design.imagePosition.y}%`,
    boxShadow: design.productType === 'mdf' ? '0 25px 50px -12px rgba(0,0,0,0.35)' : 'inset 0px 0px 10px rgba(0,0,0,0.2)',
  };

  const FrameComponent = (
     <div
        ref={ref}
        style={{
          ...frameStyle,
          width: '100%',
          aspectRatio: aspectRatio.toString(),
        }}
      >
        <div
          ref={imageContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className="w-full h-full bg-gray-300 bg-center bg-no-repeat overflow-hidden relative"
          style={{ 
            ...imageStyle, 
            cursor: design.imageSrc ? 'grab' : 'default' 
          }}
        >
          {design.coverType === 'glass' && design.productType === 'frame' && (
             <div className="absolute inset-0 pointer-events-none opacity-80" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.35) 0%, transparent 50%)' }}></div>
          )}
          {!design.imageSrc && (
            <label htmlFor="image-upload" className="w-full h-full flex flex-col items-center justify-center text-gray-500 text-center p-4 cursor-pointer hover:bg-gray-200/50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span>برای شروع، اینجا کلیک کنید یا یک عکس از منوی تنظیمات آپلود کنید.</span>
            </label>
          )}
        </div>
      </div>
  );

  if (viewMode === 'onwall') {
      return (
          <div 
            className="w-full h-full flex items-center justify-center p-4 bg-cover bg-center rounded-lg transition-all duration-300"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=2080&auto=format&fit=crop')" }}
          >
              <div style={{ transform: 'scale(0.5) perspective(1200px) rotateY(-15deg) rotateX(3deg)'}} className="max-w-xl shadow-2xl transition-transform duration-500">
                {FrameComponent}
              </div>
          </div>
      )
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-4 transition-all duration-300">
      <div className="w-full max-w-[70vh]" style={{ filter: 'drop-shadow(0 15px 15px rgba(0,0,0,0.1))' }}>
        {FrameComponent}
      </div>
    </div>
  );
});

export default Canvas;