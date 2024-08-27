export interface Option {
  id?: number;
  text: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export interface CreateOption {
  id?: number;
  text: string;
}
