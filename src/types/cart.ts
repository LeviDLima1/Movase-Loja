export interface CartItem {
  id: number;
  titulo: string;
  autor: string;
  price: number;
  img1: string;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (livro: Omit<CartItem, 'quantity'>) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  total: number;
  itemCount: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  loading?: boolean;
  error?: string | null;
}

export interface UserAddress {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
}
