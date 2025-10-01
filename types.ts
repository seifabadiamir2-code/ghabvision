export type ProductType = 'mdf' | 'frame';
export type CoverType = 'glass' | 'plexiglas' | 'none';
export type FrameMaterial = 'pvc' | 'metal';
export type PvcTexture = 'smooth-matte' | 'smooth-glossy' | 'fine-lines' | 'textured';

export interface FrameSize {
  value: string;
  label: string;
  aspectRatio: number;
}

export interface UserInfo {
  name: string;
  phone: string;
  notes: string;
}

export interface DesignState {
  productType: ProductType;
  imageSrc: string | null;
  imagePosition: { x: number; y: number };
  imageZoom: number;
  frameSizePresetValue: string;
  customWidth: number; // in cm
  customHeight: number; // in cm
  frameColor: string;
  frameMaterial: FrameMaterial;
  pvcTexture: PvcTexture;
  frameWidth: number; // in pixels for preview
  coverType: CoverType;
}