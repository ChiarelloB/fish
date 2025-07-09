import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { collection, doc, getDocs, setDoc, updateDoc, onSnapshot, increment } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';
import { Fish, InventoryItem, AquariumSlot, FishRarity } from '../types/game';
import toast from 'react-hot-toast';

interface GameContextType {
  inventory: InventoryItem[];
  aquarium: AquariumSlot[];
  algas: number;
  fishing: boolean;
  fish: (rodId: string) => Promise<void>;
  addFishToAquarium: (fish: Fish, position: number) => Promise<void>;
  removeFishFromAquarium: (position: number) => Promise<void>;
  updateAlgas: (amount: number) => Promise<void>;
  generateFish: () => Fish;
  hatchEgg: (eggId: string) => Promise<Fish | null>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

const RARITY_CHANCES: Record<FishRarity, number> = {
  'Comum': 50,
  'Incomum': 25,
  'Raro': 12,
  'Épico': 7,
  'Lendário': 3,
  'Mítico': 1.5,
  'Ancestral': 0.8,
  'Divino': 0.4,
  'Cósmico': 0.2,
  'Transcendente': 0.1
};

const RARITY_MULTIPLIERS: Record<FishRarity, number> = {
  'Comum': 1,
  'Incomum': 1.5,
  'Raro': 2,
  'Épico': 3,
  'Lendário': 5,
  'Mítico': 8,
  'Ancestral': 12,
  'Divino': 20,
  'Cósmico': 35,
  'Transcendente': 50
};

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const { user, userProfile } = useAuth();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [aquarium, setAquarium] = useState<AquariumSlot[]>([]);
  const [algas, setAlgas] = useState(0);
  const [fishing, setFishing] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Load inventory
    const loadInventory = async () => {
      const inventoryRef = collection(db, 'users', user.uid, 'inventory');
      const snapshot = await getDocs(inventoryRef);
      const items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as InventoryItem));
      setInventory(items);
    };

    // Load aquarium
    const loadAquarium = async () => {
      const aquariumRef = collection(db, 'users', user.uid, 'aquarium');
      const snapshot = await getDocs(aquariumRef);
      const slots = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as AquariumSlot));
      
      // Initialize empty slots if none exist
      if (slots.length === 0) {
        const emptySlots: AquariumSlot[] = [];
        for (let i = 0; i < 24; i++) {
          emptySlots.push({ id: i.toString(), fish: null, position: i });
        }
        setAquarium(emptySlots);
      } else {
        setAquarium(slots.sort((a, b) => a.position - b.position));
      }
    };

    loadInventory();
    loadAquarium();

    // Listen for algas changes
    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) {
        setAlgas(doc.data().algas || 0);
      }
    });

    return unsubscribe;
  }, [user]);

  const generateFish = (): Fish => {
    const rarities = Object.keys(RARITY_CHANCES) as FishRarity[];
    const random = Math.random() * 100;
    let cumulative = 0;
    let selectedRarity: FishRarity = 'Comum';

    for (const rarity of rarities) {
      cumulative += RARITY_CHANCES[rarity];
      if (random <= cumulative) {
        selectedRarity = rarity;
        break;
      }
    }

    const fishNames = [
      'Peixe Dourado', 'Peixe Azul', 'Peixe Vermelho', 'Peixe Verde',
      'Peixe Prateado', 'Peixe Cristal', 'Peixe Arco-íris', 'Peixe Sombra'
    ];

    const mutations = [];
    const mutationChance = Math.random();
    if (mutationChance < 0.3) {
      mutations.push({ name: 'Escamas Douradas', type: 'Física' as const, bonus: 2 });
    }
    if (mutationChance < 0.1) {
      mutations.push({ name: 'Fogo Interior', type: 'Elemental' as const, bonus: 5 });
    }

    const baseAlgas = RARITY_MULTIPLIERS[selectedRarity] * 10;
    const mutationBonus = mutations.reduce((sum, mutation) => sum + mutation.bonus, 0);

    return {
      id: Math.floor(Math.random() * 10000) + 1,
      name: fishNames[Math.floor(Math.random() * fishNames.length)],
      rarity: selectedRarity,
      mutations,
      ownerId: user?.uid || '',
      createdAt: new Date(),
      image: '🐠',
      algas_per_hour: baseAlgas + mutationBonus
    };
  };

  const generateFishFromEgg = (eggType: string): Fish => {
    const eggRarityBonus: Record<string, number> = {
      'Ovo Comum': 1.0,
      'Ovo Raro': 1.5,
      'Ovo Épico': 2.0,
      'Ovo Lendário': 3.0,
      'Ovo Transcendente': 5.0
    };

    const rarities = Object.keys(RARITY_CHANCES) as FishRarity[];
    const bonus = eggRarityBonus[eggType] || 1.0;
    
    // Aumentar chances de raridades maiores baseado no tipo do ovo
    const adjustedChances = { ...RARITY_CHANCES };
    if (bonus > 1) {
      // Redistribuir chances para favorecer raridades maiores
      adjustedChances['Lendário'] *= bonus;
      adjustedChances['Épico'] *= bonus * 0.8;
      adjustedChances['Raro'] *= bonus * 0.6;
      adjustedChances['Comum'] *= 0.5;
    }

    const random = Math.random() * 100;
    let cumulative = 0;
    let selectedRarity: FishRarity = 'Comum';

    for (const rarity of rarities) {
      cumulative += adjustedChances[rarity];
      if (random <= cumulative) {
        selectedRarity = rarity;
        break;
      }
    }

    const fishNames = [
      'Peixe Dourado', 'Peixe Azul', 'Peixe Vermelho', 'Peixe Verde',
      'Peixe Prateado', 'Peixe Cristal', 'Peixe Arco-íris', 'Peixe Sombra',
      'Peixe Lunar', 'Peixe Solar', 'Peixe Estelar', 'Peixe Cósmico'
    ];

    const mutations = [];
    const mutationChance = Math.random();
    
    // Ovos têm maior chance de mutação
    const eggMutationBonus = bonus * 0.1;
    if (mutationChance < (0.3 + eggMutationBonus)) {
      mutations.push({ name: 'Escamas Douradas', type: 'Física' as const, bonus: 2 });
    }
    if (mutationChance < (0.15 + eggMutationBonus)) {
      mutations.push({ name: 'Fogo Interior', type: 'Elemental' as const, bonus: 5 });
    }
    if (mutationChance < (0.05 + eggMutationBonus)) {
      mutations.push({ name: 'Aura Mística', type: 'Especial' as const, bonus: 10 });
    }

    const baseAlgas = RARITY_MULTIPLIERS[selectedRarity] * 10;
    const mutationBonus = mutations.reduce((sum, mutation) => sum + mutation.bonus, 0);

    return {
      id: Math.floor(Math.random() * 10000) + 1,
      name: fishNames[Math.floor(Math.random() * fishNames.length)],
      rarity: selectedRarity,
      mutations,
      ownerId: user?.uid || '',
      createdAt: new Date(),
      image: '🐠',
      algas_per_hour: baseAlgas + mutationBonus
    };
  };

  const hatchEgg = async (eggId: string): Promise<Fish | null> => {
    if (!user) return null;

    try {
      // Encontrar o ovo no inventário
      const egg = inventory.find(item => item.id === eggId && item.type === 'egg');
      if (!egg) {
        throw new Error('Ovo não encontrado');
      }

      // Gerar peixe baseado no tipo do ovo
      const newFish = generateFishFromEgg(egg.name);
      
      // Simular tempo de chocagem
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Adicionar peixe ao inventário como item temporário
      const fishItem: InventoryItem = {
        id: newFish.id.toString(),
        name: newFish.name,
        type: 'food', // Temporariamente como food até ter sistema de peixes
        quantity: 1,
        image: newFish.image,
        description: `${newFish.rarity} - ${newFish.algas_per_hour} algas/hora${newFish.mutations.length > 0 ? ` - ${newFish.mutations.length} mutação(ões)` : ''}`
      };
      
      // Remover ovo do inventário
      const updatedInventory = inventory.map(item => 
        item.id === eggId 
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ).filter(item => item.quantity > 0);
      
      // Adicionar peixe ao inventário
      updatedInventory.push(fishItem);
      setInventory(updatedInventory);
      
      // Salvar no Firebase (simulado)
      await setDoc(doc(db, 'users', user.uid, 'inventory', fishItem.id), fishItem);
      
      return newFish;
    } catch (error) {
      console.error('Erro ao chocar ovo:', error);
      throw error;
    }
  };

  const fish = async (rodId: string) => {
    if (!user || fishing || algas < 10) return;

    setFishing(true);
    
    try {
      // Deduct algas
      await updateDoc(doc(db, 'users', user.uid), {
        algas: increment(-10)
      });

      // Simulate fishing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const random = Math.random() * 100;
      
      if (random < 0.8) {
        // Caught a fish!
        const newFish = generateFish();
        toast.success(`Você pescou um ${newFish.name} (${newFish.rarity})!`);
        
        // Add to inventory temporarily (would normally go to fish collection)
        const fishItem: InventoryItem = {
          id: newFish.id.toString(),
          name: newFish.name,
          type: 'food',
          quantity: 1,
          image: newFish.image,
          description: `${newFish.rarity} - ${newFish.algas_per_hour} algas/hora`
        };
        
        await setDoc(doc(db, 'users', user.uid, 'inventory', fishItem.id), fishItem);
        setInventory(prev => [...prev, fishItem]);
      } else if (random < 60) {
        // Caught food
        toast.success('Você pescou comida!');
        const foodItem: InventoryItem = {
          id: Date.now().toString(),
          name: 'Alga Comum',
          type: 'food',
          quantity: 1,
          image: '🌿',
          description: 'Alimento básico para peixes'
        };
        
        await setDoc(doc(db, 'users', user.uid, 'inventory', foodItem.id), foodItem);
        setInventory(prev => [...prev, foodItem]);
      } else {
        // Caught nothing
        toast.error('Você não pescou nada desta vez...');
      }
    } catch (error) {
      toast.error('Erro ao pescar. Tente novamente.');
    } finally {
      setFishing(false);
    }
  };

  const addFishToAquarium = async (fish: Fish, position: number) => {
    if (!user || position < 0 || position >= 24) return;

    const slot: AquariumSlot = {
      id: position.toString(),
      fish,
      position
    };

    await setDoc(doc(db, 'users', user.uid, 'aquarium', position.toString()), slot);
    
    setAquarium(prev => {
      const newAquarium = [...prev];
      newAquarium[position] = slot;
      return newAquarium;
    });
  };

  const removeFishFromAquarium = async (position: number) => {
    if (!user || position < 0 || position >= 24) return;

    const slot: AquariumSlot = {
      id: position.toString(),
      fish: null,
      position
    };

    await setDoc(doc(db, 'users', user.uid, 'aquarium', position.toString()), slot);
    
    setAquarium(prev => {
      const newAquarium = [...prev];
      newAquarium[position] = slot;
      return newAquarium;
    });
  };

  const updateAlgas = async (amount: number) => {
    if (!user) return;

    await updateDoc(doc(db, 'users', user.uid), {
      algas: increment(amount)
    });
  };

  const value = {
    inventory,
    aquarium,
    algas,
    fishing,
    fish,
    addFishToAquarium,
    removeFishFromAquarium,
    updateAlgas,
    generateFish,
    hatchEgg
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};