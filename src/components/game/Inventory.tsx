import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Fish, Utensils, Zap, Clock, AlertCircle } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import { EGG_TEMPLATES, RARITY_COLORS } from '../../data/gameData';
import toast from 'react-hot-toast';

interface EggWithCooldown extends any {
  hatchTime: number;
  startedHatching?: Date;
  canHatch: boolean;
  timeRemaining?: number;
}

const Inventory: React.FC = () => {
  const { inventory, hatchEgg } = useGame();
  const [activeTab, setActiveTab] = useState<'all' | 'food' | 'rod' | 'egg'>('all');
  const [eggsWithCooldown, setEggsWithCooldown] = useState<EggWithCooldown[]>([]);

  useEffect(() => {
    // Simular ovos com cooldown baseado nos templates
    const mockEggsWithCooldown = EGG_TEMPLATES.slice(0, 5).map((eggTemplate, index) => {
      const startedHatching = index < 2 ? new Date(Date.now() - (eggTemplate.hatchTime * 60 * 1000 * 0.3)) : undefined;
      const timeRemaining = startedHatching 
        ? Math.max(0, (eggTemplate.hatchTime * 60 * 1000) - (Date.now() - startedHatching.getTime()))
        : eggTemplate.hatchTime * 60 * 1000;

      return {
        id: `egg_${index}`,
        name: eggTemplate.name,
        type: 'egg',
        quantity: 1,
        image: eggTemplate.image,
        description: eggTemplate.description,
        rarity: eggTemplate.rarity,
        hatchTime: eggTemplate.hatchTime,
        startedHatching,
        canHatch: timeRemaining <= 0,
        timeRemaining: timeRemaining > 0 ? timeRemaining : 0
      };
    });

    setEggsWithCooldown(mockEggsWithCooldown);

    // Atualizar cooldowns a cada segundo
    const interval = setInterval(() => {
      setEggsWithCooldown(prev => prev.map(egg => {
        if (!egg.startedHatching) return egg;
        
        const timeRemaining = Math.max(0, (egg.hatchTime * 60 * 1000) - (Date.now() - egg.startedHatching.getTime()));
        return {
          ...egg,
          timeRemaining,
          canHatch: timeRemaining <= 0
        };
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'all', label: 'Todos', icon: Package },
    { id: 'food', label: 'Comidas', icon: Utensils },
    { id: 'rod', label: 'Varas', icon: Fish },
    { id: 'egg', label: 'Ovos', icon: Zap }
  ];

  const filteredInventory = activeTab === 'all' 
    ? [...inventory, ...eggsWithCooldown]
    : activeTab === 'egg'
    ? eggsWithCooldown
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

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const startHatching = (eggId: string) => {
    setEggsWithCooldown(prev => prev.map(egg => 
      egg.id === eggId 
        ? { ...egg, startedHatching: new Date(), canHatch: false }
        : egg
    ));
    toast.success('Ovo começou a chocar!');
  };

  const handleHatchEgg = async (eggId: string, eggName: string) => {
    try {
      const newFish = await hatchEgg(eggId);
      if (newFish) {
        // Remover ovo da lista
        setEggsWithCooldown(prev => prev.filter(egg => egg.id !== eggId));
        toast.success(`🐠 ${newFish.name} nasceu do ${eggName}!`);
      }
    } catch (error) {
      toast.error('Erro ao chocar o ovo');
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
            const count = tab.id === 'all' 
              ? inventory.length + eggsWithCooldown.length
              : tab.id === 'egg'
              ? eggsWithCooldown.length
              : inventory.filter(item => item.type === tab.id).length;

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
                  {count}
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
              
              {item.rarity && (
                <div className="mb-2">
                  <span className={`inline-block px-2 py-1 rounded-full text-white text-xs font-medium ${RARITY_COLORS[item.rarity as keyof typeof RARITY_COLORS]}`}>
                    {item.rarity}
                  </span>
                </div>
              )}
              
              <p className="text-sm text-gray-600 mb-3">{item.description}</p>
              
              <div className="flex items-center justify-between mb-3">
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
                <div className="space-y-2">
                  {!item.startedHatching ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => startHatching(item.id)}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 rounded-lg transition-all flex items-center justify-center space-x-2"
                    >
                      <Clock className="w-4 h-4" />
                      <span>Iniciar Chocagem</span>
                    </motion.button>
                  ) : item.canHatch ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleHatchEgg(item.id, item.name)}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 rounded-lg transition-all flex items-center justify-center space-x-2"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Chocar Agora!</span>
                    </motion.button>
                  ) : (
                    <div className="space-y-2">
                      <div className="bg-orange-100 border border-orange-200 rounded-lg p-2">
                        <div className="flex items-center space-x-1 mb-1">
                          <AlertCircle className="w-4 h-4 text-orange-600" />
                          <span className="text-xs font-medium text-orange-800">Chocando...</span>
                        </div>
                        <div className="text-xs text-orange-700 font-mono">
                          {formatTime(item.timeRemaining)}
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-orange-400 to-yellow-400 h-2 rounded-full transition-all duration-1000"
                          style={{ 
                            width: `${Math.max(0, 100 - (item.timeRemaining / (item.hatchTime * 60 * 1000)) * 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {item.hatchTime && (
                    <div className="text-xs text-gray-500">
                      Tempo total: {item.hatchTime} min
                    </div>
                  )}
                </div>
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

      {/* Cooldown Info */}
      {activeTab === 'egg' && (
        <div className="mt-6 bg-blue-50 rounded-xl p-6">
          <h4 className="text-lg font-bold text-blue-900 mb-3">🥚 Sistema de Chocagem</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-800">
            <div>
              <p className="font-medium mb-2">Como Funciona:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Clique em "Iniciar Chocagem" para começar</li>
                <li>Aguarde o tempo necessário baseado na raridade</li>
                <li>Ovos mais raros demoram mais para chocar</li>
                <li>Não é possível cancelar a chocagem</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-2">Tempos de Chocagem:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Comum: 5 minutos</li>
                <li>Incomum: 10 minutos</li>
                <li>Raro: 20 minutos</li>
                <li>Épico: 45 minutos</li>
                <li>Lendário: 90 minutos</li>
                <li>Mítico: 3 horas</li>
                <li>Ancestral: 6 horas</li>
                <li>Divino: 12 horas</li>
                <li>Cósmico: 24 horas</li>
                <li>Transcendente: 48 horas</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;