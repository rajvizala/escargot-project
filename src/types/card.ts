export type Occasion =
  | 'birthday'
  | 'sympathy'
  | 'congrats'
  | 'friendship'
  | 'funny'
  | 'love';

export interface Card {
  id: string;
  title: string;
  artist: string;
  occasion: Occasion;
  imageUrl: string;
  isRemixable: boolean;
  alt: string;
}

export type Tone = 'funny' | 'sincere' | 'sarcastic';

export interface RemixResult {
  remixedImage: string; // base64
  remixId: string;
  processingMs: number;
}
