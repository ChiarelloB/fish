export interface Fish {
  id: number;
  name: string;
  rarity: FishRarity;
  mutations: Mutation[];
  ownerId: string;
  createdAt: Date;
  image: string;
  algas_per_hour: number;
}

export type FishRarity = 
  | 'Comum' 
  | 'Incomum' 
  | 'Raro' 
  | 'Épico' 
  | 'Lendário' 
  | 'Mítico' 
  | 'Ancestral' 
  | 'Divino' 
  | 'Cósmico' 
  | 'Transcendente';

export interface Mutation {
  name: string;
  type: 'Física' | 'Elemental' | 'Especial';
  bonus: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  username: string;
  algas: number;
  createdAt: Date;
}

export interface InventoryItem {
  id: string;
  name: string;
  type: 'food' | 'rod' | 'egg';
  quantity: number;
  image: string;
  description: string;
}

export interface AquariumSlot {
  id: string;
  fish: Fish | null;
  position: number;
}

export interface Auction {
  id: string;
  fish: Fish;
  startPrice: number;
  currentPrice: number;
  endTime: Date;
  highestBidder: string | null;
  active: boolean;
}