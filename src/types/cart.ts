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
  addToCart: (livro: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
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
