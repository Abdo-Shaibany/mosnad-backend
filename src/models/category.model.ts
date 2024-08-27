export interface Category {
  id: number;
  text: string;
  productCount?: number;
  Product?: any
  deletedAt: Date | null; createdAt: Date; updatedAt: Date;
}
