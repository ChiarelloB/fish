import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Fish, Utensils, Zap, Play } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import toast from 'react-hot-toast';

const Inventory: React.FC = () => {
  const { inventory, hatchEgg } = useGame();
  const [activeTab, setActiveTab] = useState<'all' | 'food' | 'rod' | 'egg'>('all');
  const [hatchingEgg, setHatchingEgg] = useState<string | null>(null);

  const tabs = [
    { id: 'all', label: 'Todos', icon: Package },
    { id: 'food', label: 'Comidas', icon: Utensils },
    { id: 'rod', label: 'Varas', icon: Fish },
    { id: 'egg', label: 'Ovos', icon: Zap }
  ];

  const filteredInventory = activeTab === 'all' 
    ? inventory 
    : inventory.filter(item => item.type === activeTab);

  const getItemBorderColor = (type: string) => {
    switch (type) {
      case 'food': return 'border-green-400';
      case 'rod': return 'border-blue-400';
      case 'egg': return 'border-yellow-400';
      default: return 'border-gray-400';
    }
  };

  const getItemBgColor = (type: string) => {
    switch (type) {
      case 'food': return 'bg-green-50';
      case 'rod': return 'bg-blue-50';
      case 'egg': return 'bg-yellow-50';
      default: return 'bg-gray-50';
    }
  };

  const handleHatchEgg = async (eggId: string, eggName: string) => {
    setHatchingEgg(eggId);
    
    try {
      const newFish = await hatchEgg(eggId);
      if (newFish) {
        toast.success(`🐠 ${newFish.name} nasceu do ${eggName}!`);
      }
    } catch (error) {
      toast.error('Erro ao chocar o ovo');
    } finally {
      setHatchingEgg(null);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Inventário</h2>
        <p className="text-gray-600">Gerencie seus itens e equipamentos</p>
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
                <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                  {tab.id === 'all' ? inventory.length : inventory.filter(item => item.type === tab.id).length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredInventory.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${getItemBgColor(item.type)} rounded-xl border-2 ${getItemBorderColor(item.type)} p-4 hover:shadow-lg transition-all cursor-pointer`}
          >
            <div className="text-center">
              <div className="text-4xl mb-3">{item.image}</div>
              <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{item.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Qtd: {item.quantity}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full text-white ${
                  item.type === 'food' ? 'bg-green-500' :
                  item.type === 'rod' ? 'bg-blue-500' :
                  item.type === 'egg' ? 'bg-yellow-500' : 'bg-gray-500'
                }`}>
                  {item.type === 'food' ? 'Comida' :
                   item.type === 'rod' ? 'Vara' :
                   item.type === 'egg' ? 'Ovo' : 'Item'}
                </span>
              </div>
              
              {item.type === 'egg' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleHatchEgg(item.id, item.name)}
                  disabled={hatchingEgg === item.id}
                  className="w-full mt-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {hatchingEgg === item.id ? (
                    <div className="flex items-center space-x-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Zap className="w-4 h-4" />
                      </motion.div>
                      <span>Chocando...</span>
                    </div>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Chocar</span>
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredInventory.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Inventário vazio</h3>
          <p className="text-gray-500">
            {activeTab === 'all' 
              ? 'Você não possui itens no inventário'
              : `Você não possui ${
                  activeTab === 'food' ? 'comidas' :
                  activeTab === 'rod' ? 'varas' :
                  activeTab === 'egg' ? 'ovos' : 'itens'
                } no inventário`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Inventory;