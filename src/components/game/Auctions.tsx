import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gavel, Clock, TrendingUp, Fish, Coins, Plus, AlertCircle } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import { useAuth } from '../../contexts/AuthContext';
import { collection, addDoc, getDocs, query, where, orderBy, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { RARITY_COLORS } from '../../data/gameData';
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
    createdAt: Date;
  };
  seller: string;
  sellerId: string;
  startingBid: number;
  currentBid: number;
  currentBidder: string | null;
  endTime: Date;
  isActive: boolean;
  createdAt: Date;
}

interface UserFish {
  id: string;
  name: string;
  rarity: string;
  image: string;
  algas_per_hour: number;
  mutations: any[];
  createdAt: Date;
  canAuction: boolean;
  cooldownEnd?: Date;
}

const Auctions: React.FC = () => {
  const { algas, updateAlgas } = useGame();
  const { userProfile, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'active' | 'create' | 'history'>('active');
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [userFish, setUserFish] = useState<UserFish[]>([]);
  const [selectedFish, setSelectedFish] = useState<UserFish | null>(null);
  const [startingBid, setStartingBid] = useState<number>(100);
  const [auctionDuration, setAuctionDuration] = useState<number>(24);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAuctions();
    if (user) {
      loadUserFish();
    }
  }, [user]);

  const loadAuctions = () => {
    const auctionsRef = collection(db, 'auctions');
    const q = query(auctionsRef, where('isActive', '==', true), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const auctionsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          endTime: data.endTime.toDate(),
          createdAt: data.createdAt.toDate(),
          fish: {
            ...data.fish,
            createdAt: data.fish.createdAt.toDate()
          }
        } as Auction;
      });
      setAuctions(auctionsData);
    });

    return unsubscribe;
  };

  const loadUserFish = async () => {
    if (!user) return;

    try {
      // Simular peixes do usuário (normalmente viria do inventário/aquário)
      const mockUserFish: UserFish[] = [
        {
          id: '1',
          name: 'Peixe Dourado',
          rarity: 'Lendário',
          image: '🐠',
          algas_per_hour: 150,
          mutations: [{ name: 'Escamas Douradas', type: 'Física' }],
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 horas atrás
          canAuction: true
        },
        {
          id: '2',
          name: 'Peixe Cristal',
          rarity: 'Épico',
          image: '💎',
          algas_per_hour: 80,
          mutations: [],
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
          canAuction: false,
          cooldownEnd: new Date(Date.now() + 3 * 60 * 60 * 1000) // 3 horas restantes
        },
        {
          id: '3',
          name: 'Peixe Arco-íris',
          rarity: 'Raro',
          image: '🌈',
          algas_per_hour: 45,
          mutations: [{ name: 'Cores Vibrantes', type: 'Especial' }],
          createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 horas atrás
          canAuction: true
        }
      ];

      setUserFish(mockUserFish);
    } catch (error) {
      console.error('Erro ao carregar peixes do usuário:', error);
    }
  };

  const formatTimeRemaining = (endTime: Date) => {
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();
    
    if (diff <= 0) return 'Finalizado';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatCooldownTime = (cooldownEnd: Date) => {
    const now = new Date();
    const diff = cooldownEnd.getTime() - now.getTime();
    
    if (diff <= 0) return null;
    
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

    setLoading(true);
    try {
      await updateDoc(doc(db, 'auctions', auctionId), {
        currentBid: minBid,
        currentBidder: userProfile?.username || 'Anônimo'
      });
      
      await updateAlgas(-minBid);
      toast.success(`Lance de ${minBid.toLocaleString()} algas realizado!`);
    } catch (error) {
      toast.error('Erro ao dar lance');
    } finally {
      setLoading(false);
    }
  };

  const createAuction = async () => {
    if (!selectedFish || !user || !userProfile) {
      toast.error('Selecione um peixe válido');
      return;
    }

    if (!selectedFish.canAuction) {
      toast.error('Este peixe ainda está em cooldown!');
      return;
    }

    if (startingBid < 50) {
      toast.error('Lance inicial deve ser pelo menos 50 algas');
      return;
    }

    setLoading(true);
    try {
      const endTime = new Date(Date.now() + auctionDuration * 60 * 60 * 1000);
      
      await addDoc(collection(db, 'auctions'), {
        fish: {
          id: selectedFish.id,
          name: selectedFish.name,
          rarity: selectedFish.rarity,
          image: selectedFish.image,
          algas_per_hour: selectedFish.algas_per_hour,
          mutations: selectedFish.mutations,
          createdAt: selectedFish.createdAt
        },
        seller: userProfile.username,
        sellerId: user.uid,
        startingBid,
        currentBid: startingBid,
        currentBidder: null,
        endTime,
        isActive: true,
        createdAt: new Date()
      });

      // Remover peixe do inventário do usuário (simulado)
      setUserFish(prev => prev.filter(fish => fish.id !== selectedFish.id));
      
      toast.success('Leilão criado com sucesso!');
      setSelectedFish(null);
      setStartingBid(100);
      setActiveTab('active');
    } catch (error) {
      toast.error('Erro ao criar leilão');
    } finally {
      setLoading(false);
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
          {auctions.map((auction, index) => (
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
                  <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${RARITY_COLORS[auction.fish.rarity as keyof typeof RARITY_COLORS]}`}>
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
                disabled={loading || algas < Math.floor(auction.currentBid * 1.1) || auction.sellerId === user?.uid}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <TrendingUp className="w-4 h-4" />
                <span>
                  {auction.sellerId === user?.uid 
                    ? 'Seu Leilão' 
                    : `Dar Lance (${Math.floor(auction.currentBid * 1.1).toLocaleString()})`
                  }
                </span>
              </motion.button>
            </motion.div>
          ))}
          
          {auctions.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Gavel className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum leilão ativo</h3>
              <p className="text-gray-500">Seja o primeiro a criar um leilão!</p>
            </div>
          )}
        </div>
      )}

      {/* Create Auction */}
      {activeTab === 'create' && (
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Fish Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Seus Peixes</h3>
              
              {userFish.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {userFish.map((fish) => {
                    const cooldownTime = fish.cooldownEnd ? formatCooldownTime(fish.cooldownEnd) : null;
                    
                    return (
                      <motion.div
                        key={fish.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => fish.canAuction && setSelectedFish(fish)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedFish?.id === fish.id
                            ? 'border-blue-500 bg-blue-50'
                            : fish.canAuction
                            ? 'border-gray-200 hover:border-gray-300'
                            : 'border-red-200 bg-red-50 cursor-not-allowed opacity-60'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-3xl">{fish.image}</div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-semibold text-gray-900">{fish.name}</h4>
                              <span className={`px-2 py-1 rounded-full text-white text-xs font-medium ${RARITY_COLORS[fish.rarity as keyof typeof RARITY_COLORS]}`}>
                                {fish.rarity}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{fish.algas_per_hour} algas/h</p>
                            {fish.mutations.length > 0 && (
                              <p className="text-xs text-purple-600">{fish.mutations.length} mutação(ões)</p>
                            )}
                            {!fish.canAuction && cooldownTime && (
                              <div className="flex items-center space-x-1 mt-2">
                                <AlertCircle className="w-4 h-4 text-red-500" />
                                <span className="text-xs text-red-600">Cooldown: {cooldownTime}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Fish className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Você não possui peixes para leiloar</p>
                </div>
              )}
            </div>

            {/* Auction Configuration */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Configurar Leilão</h3>
              
              {selectedFish ? (
                <div className="space-y-6">
                  {/* Selected Fish Preview */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Peixe Selecionado</h4>
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{selectedFish.image}</div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium">{selectedFish.name}</span>
                          <span className={`px-2 py-1 rounded-full text-white text-xs font-medium ${RARITY_COLORS[selectedFish.rarity as keyof typeof RARITY_COLORS]}`}>
                            {selectedFish.rarity}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{selectedFish.algas_per_hour} algas/h</p>
                      </div>
                    </div>
                  </div>

                  {/* Auction Settings */}
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
                      min="50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duração do Leilão
                    </label>
                    <select 
                      value={auctionDuration}
                      onChange={(e) => setAuctionDuration(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="1">1 hora</option>
                      <option value="6">6 horas</option>
                      <option value="12">12 horas</option>
                      <option value="24">24 horas</option>
                      <option value="48">48 horas</option>
                    </select>
                  </div>

                  {/* Warning */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-medium mb-1">Atenção:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>O peixe será removido do seu inventário</li>
                          <li>Você não pode cancelar o leilão após criá-lo</li>
                          <li>Taxa de 5% será cobrada sobre o valor final</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={createAuction}
                    disabled={loading || !selectedFish.canAuction}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <Gavel className="w-5 h-5" />
                    <span>{loading ? 'Criando...' : 'Criar Leilão'}</span>
                  </motion.button>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Fish className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Selecione um peixe para configurar o leilão</p>
                </div>
              )}
            </div>
          </div>

          {/* Cooldown Info */}
          <div className="mt-6 bg-blue-50 rounded-xl p-6">
            <h4 className="text-lg font-bold text-blue-900 mb-3">ℹ️ Sistema de Cooldown</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-800">
              <div>
                <p className="font-medium mb-2">Regras de Cooldown:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Peixes devem ter pelo menos 5 horas de vida</li>
                  <li>Após nascer, aguarde 5 horas para leiloar</li>
                  <li>Cooldown previne leilões imediatos</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-2">Tempo de Chocagem por Raridade:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Comum: 5 minutos</li>
                  <li>Raro: 20 minutos</li>
                  <li>Épico: 45 minutos</li>
                  <li>Lendário: 90 minutos</li>
                  <li>Transcendente: 48 horas</li>
                </ul>
              </div>
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