import { Image } from './image.model';

export interface Variant {
  id?: number;
  value: string;
  SKU?: string;
  imageId: number | null;
  image?: Image | null;
}
