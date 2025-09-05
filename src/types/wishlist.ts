export interface WishlistItem {
  id: number;
  titulo: string;
  autor: string;
  price: number;
  img1: string;
  categoria: string;
  dataAdicionado: string;
  isbn?: string;
  editora?: string;
  anoPublicacao?: number;
  promocao?: boolean;
  novidade?: boolean;
  destaque?: boolean;
}

export interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (livro: Omit<WishlistItem, 'dataAdicionado'>) => Promise<void>;
  removeFromWishlist: (id: number) => Promise<void>;
  clearWishlist: () => Promise<void>;
  isInWishlist: (id: number) => boolean;
  itemCount: number;
  loading?: boolean;
  error?: string | null;
}

export interface WishlistResponse {
  success: boolean;
  data?: {
    items: WishlistItem[];
  };
  error?: string;
  message?: string;
}
