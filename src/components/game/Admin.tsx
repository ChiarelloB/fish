import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Fish, Package, Gavel, BarChart3, Users, Zap, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FISH_TEMPLATES, EGG_TEMPLATES, MUTATION_TEMPLATES, RARITY_COLORS } from '../../data/gameData';
import toast from 'react-hot-toast';

interface User {
  uid: string;
  email: string;
  username: string;
  algas: number;
  createdAt: any;
}

interface Auction {
  id: string;
  fishId: string;
  fishName: string;
  fishRarity: string;
  sellerId: string;
  sellerName: string;
  startingBid: number;
  currentBid: number;
  currentBidder: string | null;
  endTime: any;
  isActive: boolean;
  createdAt: any;
}

const Admin: React.FC = () => {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'fish' | 'items' | 'auctions' | 'users' | 'events' | 'settings'>('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(false);

  // Verificar se é admin
  const isAdmin = userProfile?.email === 'take@take.com';

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
      loadAuctions();
    }
  }, [isAdmin]);

  const loadUsers = async () => {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      const usersData = snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      } as User));
      setUsers(usersData.sort((a, b) => b.createdAt?.toDate() - a.createdAt?.toDate()));
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  const loadAuctions = async () => {
    try {
      const auctionsRef = collection(db, 'auctions');
      const snapshot = await getDocs(auctionsRef);
      const auctionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Auction));
      setAuctions(auctionsData.sort((a, b) => b.createdAt?.toDate() - a.createdAt?.toDate()));
    } catch (error) {
      console.error('Erro ao carregar leilões:', error);
    }
  };

  const addFishToDatabase = async (fishTemplate: any) => {
    setLoading(true);
    try {
      const fishId = `fish_${Date.now()}`;
      await setDoc(doc(db, 'fish_templates', fishId), {
        ...fishTemplate,
        id: fishId,
        createdAt: new Date()
      });
      toast.success('Peixe adicionado com sucesso!');
    } catch (error) {
      toast.error('Erro ao adicionar peixe');
    } finally {
      setLoading(false);
    }
  };

  const addItemToShop = async (item: any) => {
    setLoading(true);
    try {
      const itemId = `item_${Date.now()}`;
      await setDoc(doc(db, 'shop_items', itemId), {
        ...item,
        id: itemId,
        createdAt: new Date()
      });
      toast.success('Item adicionado à loja!');
    } catch (error) {
      toast.error('Erro ao adicionar item');
    } finally {
      setLoading(false);
    }
  };

  const updateUserAlgas = async (userId: string, newAmount: number) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        algas: newAmount
      });
      toast.success('Algas atualizadas!');
      loadUsers();
    } catch (error) {
      toast.error('Erro ao atualizar algas');
    }
  };

  const endAuction = async (auctionId: string) => {
    try {
      await updateDoc(doc(db, 'auctions', auctionId), {
        isActive: false,
        endedAt: new Date()
      });
      toast.success('Leilão finalizado!');
      loadAuctions();
    } catch (error) {
      toast.error('Erro ao finalizar leilão');
    }
  };

  const deleteAuction = async (auctionId: string) => {
    try {
      await deleteDoc(doc(db, 'auctions', auctionId));
      toast.success('Leilão removido!');
      loadAuctions();
    } catch (error) {
      toast.error('Erro ao remover leilão');
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">Acesso Negado</h2>
          <p className="text-red-600">Você não tem permissão para acessar o painel administrativo.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'fish', label: 'Peixes', icon: Fish },
    { id: 'items', label: 'Itens', icon: Package },
    { id: 'auctions', label: 'Leilões', icon: Gavel },
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'events', label: 'Eventos', icon: Zap },
    { id: 'settings', label: 'Configurações', icon: Settings }
  ];

  const stats = [
    { label: 'Usuários Totais', value: users.length.toString(), change: '+12%', color: 'text-blue-600' },
    { label: 'Leilões Ativos', value: auctions.filter(a => a.isActive).length.toString(), change: '+8%', color: 'text-green-600' },
    { label: 'Peixes Disponíveis', value: FISH_TEMPLATES.length.toString(), change: '+15%', color: 'text-purple-600' },
    { label: 'Tipos de Ovos', value: EGG_TEMPLATES.length.toString(), change: '+5%', color: 'text-yellow-600' }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Painel Administrativo</h2>
        <p className="text-gray-600">Gerencie todos os aspectos do AquaNFT</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg mb-6">
        <div className="flex border-b overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
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

      {/* Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className="text-sm text-green-600 font-medium">
                    {stat.change}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Usuários Recentes</h3>
            <div className="space-y-4">
              {users.slice(0, 5).map((user) => (
                <div key={user.uid} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">{user.username}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{user.algas?.toLocaleString()} algas</p>
                    <p className="text-sm text-gray-500">
                      {user.createdAt?.toDate?.()?.toLocaleDateString() || 'Data não disponível'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fish Management */}
      {activeTab === 'fish' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Gerenciar Peixes</h3>
              <button 
                onClick={() => {
                  const randomFish = FISH_TEMPLATES[Math.floor(Math.random() * FISH_TEMPLATES.length)];
                  addFishToDatabase(randomFish);
                }}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Peixe Aleatório</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {FISH_TEMPLATES.slice(0, 20).map((fish) => (
                <div key={fish.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="text-center mb-3">
                    <div className="text-3xl mb-2">{fish.image}</div>
                    <h4 className="font-semibold text-gray-900">{fish.name}</h4>
                    <span className={`inline-block px-2 py-1 rounded-full text-white text-xs font-medium ${RARITY_COLORS[fish.rarity as keyof typeof RARITY_COLORS]}`}>
                      {fish.rarity}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">{fish.baseAlgae} algas/h</p>
                    <p className="text-xs text-gray-500">{fish.spawnChance}% chance</p>
                  </div>
                  <button
                    onClick={() => addFishToDatabase(fish)}
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    Adicionar ao Jogo
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Mutações Disponíveis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {MUTATION_TEMPLATES.slice(0, 15).map((mutation) => (
                <div key={mutation.id} className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{mutation.name}</h4>
                  <span className={`inline-block px-2 py-1 rounded-full text-white text-xs font-medium ${RARITY_COLORS[mutation.rarity as keyof typeof RARITY_COLORS]} mb-2`}>
                    {mutation.rarity}
                  </span>
                  <p className="text-sm text-gray-600 mb-2">{mutation.description}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600 font-medium">+{mutation.bonus} algas/h</span>
                    <span className="text-blue-600">{mutation.chance}% chance</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Items Management */}
      {activeTab === 'items' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Gerenciar Itens da Loja</h3>
            <button 
              onClick={() => {
                const randomEgg = EGG_TEMPLATES[Math.floor(Math.random() * EGG_TEMPLATES.length)];
                addItemToShop(randomEgg);
              }}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Item Aleatório</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {EGG_TEMPLATES.map((egg) => (
              <div key={egg.id} className="border rounded-lg p-4">
                <div className="text-center mb-4">
                  <div className="text-3xl mb-2">{egg.image}</div>
                  <h4 className="font-semibold">{egg.name}</h4>
                  <span className={`inline-block px-2 py-1 rounded-full text-white text-xs font-medium ${RARITY_COLORS[egg.rarity as keyof typeof RARITY_COLORS]} mb-2`}>
                    {egg.rarity}
                  </span>
                  <p className="text-sm text-gray-600 mb-2">{egg.description}</p>
                  <p className="font-bold text-green-600">{egg.price.toLocaleString()} Algas</p>
                  <p className="text-xs text-gray-500">{egg.hatchTime} min para chocar</p>
                </div>
                <button
                  onClick={() => addItemToShop(egg)}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Adicionar à Loja
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Auctions Management */}
      {activeTab === 'auctions' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Gerenciar Leilões</h3>
            <div className="flex space-x-2">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                {auctions.filter(a => a.isActive).length} Ativos
              </span>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                {auctions.filter(a => !a.isActive).length} Finalizados
              </span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Peixe</th>
                  <th className="text-left py-3 px-4">Vendedor</th>
                  <th className="text-left py-3 px-4">Lance Inicial</th>
                  <th className="text-left py-3 px-4">Lance Atual</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {auctions.map((auction) => (
                  <tr key={auction.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">🐠</span>
                        <div>
                          <p className="font-medium">{auction.fishName}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${RARITY_COLORS[auction.fishRarity as keyof typeof RARITY_COLORS]}`}>
                            {auction.fishRarity}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{auction.sellerName}</td>
                    <td className="py-3 px-4">{auction.startingBid.toLocaleString()}</td>
                    <td className="py-3 px-4 font-semibold text-green-600">
                      {auction.currentBid.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        auction.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {auction.isActive ? 'Ativo' : 'Finalizado'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 p-1">
                          <Eye className="w-4 h-4" />
                        </button>
                        {auction.isActive && (
                          <button 
                            onClick={() => endAuction(auction.id)}
                            className="text-yellow-600 hover:text-yellow-800 p-1"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => deleteAuction(auction.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Gerenciar Usuários</h3>
            <div className="text-sm text-gray-600">
              Total: {users.length} usuários
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Usuário</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Algas</th>
                  <th className="text-left py-3 px-4">Cadastro</th>
                  <th className="text-left py-3 px-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.uid} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.username?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="font-medium">{user.username}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-green-600">
                          {user.algas?.toLocaleString() || '0'}
                        </span>
                        <button
                          onClick={() => {
                            const newAmount = prompt('Nova quantidade de algas:', user.algas?.toString() || '0');
                            if (newAmount && !isNaN(Number(newAmount))) {
                              updateUserAlgas(user.uid, Number(newAmount));
                            }
                          }}
                          className="text-blue-600 hover:text-blue-800 text-xs"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {user.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 p-1">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-yellow-600 hover:text-yellow-800 p-1">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Events Management */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Controle de Eventos</h3>
              <button 
                onClick={() => toast.success('Evento ativado manualmente!')}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Ativar Evento Manual
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Tempestade Elétrica', type: 'Raro', effect: 'Mutação', color: 'bg-purple-500' },
                { name: 'Chuva Dourada', type: 'Lendário', effect: 'Boost Algas', color: 'bg-yellow-500' },
                { name: 'Aurora Boreal', type: 'Lendário', effect: 'Mutação Especial', color: 'bg-green-500' }
              ].map((event, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className={`w-full h-2 ${event.color} rounded mb-3`}></div>
                  <h4 className="font-semibold mb-2">{event.name}</h4>
                  <p className="text-sm text-gray-600 mb-1">Tipo: {event.type}</p>
                  <p className="text-sm text-gray-600 mb-3">Efeito: {event.effect}</p>
                  <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
                    Ativar Agora
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Configurações do Sistema</h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chance de Pescar Peixe (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  defaultValue={0.8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custo Base de Pesca (Algas)
                </label>
                <input
                  type="number"
                  defaultValue={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cooldown de Leilão (horas)
                </label>
                <input
                  type="number"
                  defaultValue={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Multiplicador de Raridade Base
                </label>
                <input
                  type="number"
                  step="0.1"
                  defaultValue={1.0}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <button 
              onClick={() => toast.success('Configurações salvas!')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Salvar Configurações
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;