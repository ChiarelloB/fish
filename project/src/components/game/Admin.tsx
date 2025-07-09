import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Fish, Package, Gavel, BarChart3, Users, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const Admin: React.FC = () => {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'fish' | 'items' | 'auctions' | 'users' | 'events' | 'settings'>('dashboard');

  // Verificar se é admin
  const isAdmin = userProfile?.email === 'take@take.com';

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
    { label: 'Usuários Ativos', value: '1,234', change: '+12%', color: 'text-blue-600' },
    { label: 'Peixes Criados', value: '5,678', change: '+8%', color: 'text-green-600' },
    { label: 'Leilões Ativos', value: '23', change: '+15%', color: 'text-purple-600' },
    { label: 'Algas Totais', value: '2.5M', change: '+5%', color: 'text-yellow-600' }
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
          {/* Stats Grid */}
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

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Atividade Recente</h3>
            <div className="space-y-4">
              {[
                { action: 'Novo usuário registrado', user: 'FishLover123', time: '2 min atrás' },
                { action: 'Peixe lendário pescado', user: 'AquaMaster', time: '5 min atrás' },
                { action: 'Leilão finalizado', user: 'DeepSea', time: '10 min atrás' },
                { action: 'Evento "Tempestade" ativado', user: 'Sistema', time: '15 min atrás' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">por {activity.user}</p>
                  </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fish Management */}
      {activeTab === 'fish' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Gerenciar Peixes</h3>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Adicionar Peixe
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">ID</th>
                  <th className="text-left py-3 px-4">Nome</th>
                  <th className="text-left py-3 px-4">Raridade</th>
                  <th className="text-left py-3 px-4">Algas/Hora</th>
                  <th className="text-left py-3 px-4">Proprietário</th>
                  <th className="text-left py-3 px-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 1001, name: 'Peixe Dourado', rarity: 'Lendário', algae: 150, owner: 'AquaMaster' },
                  { id: 1002, name: 'Peixe Cristal', rarity: 'Épico', algae: 80, owner: 'DeepSea' },
                  { id: 1003, name: 'Peixe Comum', rarity: 'Comum', algae: 10, owner: 'Newbie' }
                ].map((fish) => (
                  <tr key={fish.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">#{fish.id}</td>
                    <td className="py-3 px-4">{fish.name}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {fish.rarity}
                      </span>
                    </td>
                    <td className="py-3 px-4">{fish.algae}</td>
                    <td className="py-3 px-4">{fish.owner}</td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:text-blue-800 mr-2">Editar</button>
                      <button className="text-red-600 hover:text-red-800">Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Items Management */}
      {activeTab === 'items' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Gerenciar Itens da Loja</h3>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Adicionar Item
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Vara Básica', type: 'Vara', price: 0, image: '🎣' },
              { name: 'Ração Premium', type: 'Comida', price: 150, image: '🍃' },
              { name: 'Ovo Lendário', type: 'Ovo', price: 8000, image: '👑' }
            ].map((item, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="text-center mb-4">
                  <div className="text-3xl mb-2">{item.image}</div>
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-sm text-gray-600">{item.type}</p>
                  <p className="font-bold text-green-600">{item.price} Algas</p>
                </div>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
                    Editar
                  </button>
                  <button className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors">
                    Excluir
                  </button>
                </div>
              </div>
            ))}
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

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Configurações de Eventos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Intervalo entre Eventos (minutos)
                </label>
                <input
                  type="number"
                  defaultValue={30}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chance de Mutação (%)
                </label>
                <input
                  type="number"
                  defaultValue={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
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
                  Intervalo de Fome (minutos)
                </label>
                <input
                  type="number"
                  defaultValue={30}
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

      {/* Other tabs placeholder */}
      {['auctions', 'users'].includes(activeTab) && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {activeTab === 'auctions' ? 'Gerenciar Leilões' : 'Gerenciar Usuários'}
          </h3>
          <div className="text-center py-12 text-gray-500">
            <Settings className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p>Funcionalidade em desenvolvimento</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;