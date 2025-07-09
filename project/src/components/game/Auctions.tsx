import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gavel, Clock, TrendingUp, Fish, Coins, Plus } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface Auction {
  id: string;
  fish: {
    id: number;
    name: string;
    rarity: string;
    image: string;
    algas_per_hour: number;
    mutations: any[];
  };
  seller: string;
  startingBid: number;
  currentBid: number;
  currentBidder: string | null;
  endTime: Date;
  isActive: boolean;
}

const Auctions: React.FC = () => {
  const { algas, updateAlgas } = useGame();
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'active' | 'create' | 'history'>('active');
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [selectedFish, setSelectedFish] = useState<any>(null);
  const [startingBid, setStartingBid] = useState<number>(100);

  // Mock auctions data
  useEffect(() => {
    const mockAuctions: Auction[] = [
      {
        id: '1',
        fish: {
          id: 1001,
          name: 'Peixe Dourado Místico',
          rarity: 'Lendário',
          image: '🐠',
          algas_per_hour: 150,
          mutations: [{ name: 'Brilho Dourado', type: 'Especial' }]
        },
        seller: 'AquaMaster',
        startingBid: 5000,
        currentBid: 7500,
        currentBidder: 'FishCollector',
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 horas
        isActive: true
      },
      {
        id: '2',
        fish: {
          id: 1002,
          name: 'Peixe Cristal',
          rarity: 'Épico',
          image: '🐟',
          algas_per_hour: 80,
          mutations: [{ name: 'Escamas Cristalinas', type: 'Física' }]
        },
        seller: 'DeepSea',
        startingBid: 2000,
        currentBid: 2000,
        currentBidder: null,
        endTime: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 horas
        isActive: true
      },
      {
        id: '3',
        fish: {
          id: 1003,
          name: 'Peixe Arco-íris',
          rarity: 'Raro',
          image: '🌈',
          algas_per_hour: 45,
          mutations: []
        },
        seller: 'RainbowFisher',
        startingBid: 800,
        currentBid: 1200,
        currentBidder: 'ColorLover',
        endTime: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hora
        isActive: true
      }
    ];
    setAuctions(mockAuctions);
  }, []);

  const getRarityColor = (rarity: string) => {
    const colors = {
      'Comum': 'bg-gray-400',
      'Incomum': 'bg-green-400',
      'Raro': 'bg-blue-400',
      'Épico': 'bg-purple-400',
      'Lendário': 'bg-yellow-400',
      'Mítico': 'bg-red-400',
      'Ancestral': 'bg-gray-300',
      'Divino': 'bg-gradient-to-r from-red-400 to-yellow-400',
      'Cósmico': 'bg-gradient-to-r from-purple-400 to-blue-400',
      'Transcendente': 'bg-gradient-to-r from-blue-400 to-green-400'
    };
    return colors[rarity as keyof typeof colors] || 'bg-gray-400';
  };

  const formatTimeRemaining = (endTime: Date) => {
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();
    
    if (diff <= 0) return 'Finalizado';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const handleBid = async (auctionId: string, currentBid: number) => {
    const minBid = Math.floor(currentBid * 1.1); // 10% acima do lance atual
    
    if (algas < minBid) {
      toast.error('Algas insuficientes para dar lance!');
      return;
    }

    try {
      // Simular lance
      setAuctions(prev => prev.map(auction => 
        auction.id === auctionId 
          ? { ...auction, currentBid: minBid, currentBidder: userProfile?.username || 'Você' }
          : auction
      ));
      
      toast.success(`Lance de ${minBid.toLocaleString()} algas realizado!`);
    } catch (error) {
      toast.error('Erro ao dar lance');
    }
  };

  const tabs = [
    { id: 'active', label: 'Leilões Ativos', icon: Gavel },
    { id: 'create', label: 'Criar Leilão', icon: Plus },
    { id: 'history', label: 'Histórico', icon: Clock }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Casa de Leilões</h2>
        <p className="text-gray-600">Compre e venda peixes únicos em leilões ao vivo</p>
        <div className="flex items-center space-x-2 mt-4 bg-blue-50 rounded-lg p-3">
          <Coins className="w-5 h-5 text-yellow-500" />
          <span className="font-semibold text-gray-900">Suas Algas: {algas.toLocaleString()}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg mb-6">
        <div className="flex border-b">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Auctions */}
      {activeTab === 'active' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {auctions.filter(auction => auction.isActive).map((auction, index) => (
            <motion.div
              key={auction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
            >
              <div className="text-center mb-4">
                <div className="text-4xl mb-3">{auction.fish.image}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{auction.fish.name}</h3>
                <div className="flex justify-center mb-2">
                  <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getRarityColor(auction.fish.rarity)}`}>
                    {auction.fish.rarity}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  #{auction.fish.id} • {auction.fish.algas_per_hour} algas/h
                </div>
                <div className="text-xs text-gray-500">
                  Vendedor: {auction.seller}
                </div>
              </div>

              {auction.fish.mutations.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Mutações:</h4>
                  {auction.fish.mutations.map((mutation, idx) => (
                    <div key={idx} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs mb-1">
                      {mutation.name} ({mutation.type})
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Lance Inicial:</span>
                  <span className="font-semibold">{auction.startingBid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Lance Atual:</span>
                  <span className="font-bold text-green-600">{auction.currentBid.toLocaleString()}</span>
                </div>
                {auction.currentBidder && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Maior Lance:</span>
                    <span className="text-sm font-medium">{auction.currentBidder}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tempo Restante:</span>
                  <span className="font-semibold text-red-600 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatTimeRemaining(auction.endTime)}
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleBid(auction.id, auction.currentBid)}
                disabled={algas < Math.floor(auction.currentBid * 1.1)}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Dar Lance ({Math.floor(auction.currentBid * 1.1).toLocaleString()})</span>
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Auction */}
      {activeTab === 'create' && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Criar Novo Leilão</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecionar Peixe
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Fish className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">Selecione um peixe do seu aquário</p>
                  <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Escolher Peixe
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lance Inicial (Algas)
                </label>
                <input
                  type="number"
                  value={startingBid}
                  onChange={(e) => setStartingBid(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Digite o lance inicial"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duração do Leilão
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="1">1 hora</option>
                  <option value="6">6 horas</option>
                  <option value="12">12 horas</option>
                  <option value="24">24 horas</option>
                </select>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center space-x-2"
              >
                <Gavel className="w-5 h-5" />
                <span>Criar Leilão</span>
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* History */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Histórico de Leilões</h3>
          <div className="text-center py-12 text-gray-500">
            <Clock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p>Nenhum leilão no histórico ainda</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auctions;