export interface CategoryData {
  id?: string;
  name: string;
  slug?: string | null;
  description?: string | null;
  icon?: string | null;
  isActive?: boolean;
  /** Cantidad de creadores asociados (viene del backend). */
  creatorsCount?: number;
}
