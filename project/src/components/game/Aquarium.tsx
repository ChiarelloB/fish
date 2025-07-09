import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Fish } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';

const Aquarium: React.FC = () => {
  const { aquarium, addFishToAquarium, removeFishFromAquarium } = useGame();

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

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Seu Aquário</h2>
        <p className="text-gray-600">Gerencie seus peixes e maximize a produção de algas</p>
      </div>

      <div className="grid grid-cols-6 gap-4 mb-6">
        {Array.from({ length: 24 }, (_, index) => {
          const slot = aquarium.find(s => s.position === index);
          const fish = slot?.fish;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02 }}
              className="aspect-square bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 hover:border-blue-300 transition-all cursor-pointer relative overflow-hidden"
            >
              {fish ? (
                <div className="p-3 h-full flex flex-col justify-between">
                  <div className="text-2xl text-center mb-1">{fish.image}</div>
                  <div className="text-center">
                    <div className="text-xs font-medium text-gray-700 mb-1">
                      #{fish.id}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full text-white ${getRarityColor(fish.rarity)}`}>
                      {fish.rarity}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {fish.algas_per_hour}/h
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <Plus className="w-8 h-8 text-blue-400" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Estatísticas do Aquário</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Fish className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">Peixes</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {aquarium.filter(slot => slot.fish).length}/24
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-green-600 font-medium">Produção/Hora</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {aquarium.reduce((sum, slot) => sum + (slot.fish?.algas_per_hour || 0), 0)}
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-yellow-600 font-medium">Valor Total</span>
            </div>
            <div className="text-2xl font-bold text-yellow-600">
              {aquarium.reduce((sum, slot) => sum + (slot.fish?.algas_per_hour || 0) * 24, 0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aquarium;