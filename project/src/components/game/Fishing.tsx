import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Fish, Coins, Activity } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';

const Fishing: React.FC = () => {
  const { fish, fishing, algas, inventory } = useGame();
  const [selectedRod, setSelectedRod] = useState<string>('');

  const rods = inventory.filter(item => item.type === 'rod');

  const handleFish = () => {
    if (selectedRod) {
      fish(selectedRod);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Área de Pesca</h2>
        <p className="text-gray-600">Use suas varas para pescar peixes únicos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fishing Area */}
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-8 text-white">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🌊</div>
            <h3 className="text-2xl font-bold mb-2">Águas Profundas</h3>
            <p className="text-blue-100">Onde os peixes mais raros se escondem</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white/10 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Coins className="w-5 h-5 text-yellow-400" />
                <span>Custo por tentativa</span>
              </div>
              <span className="font-bold">10 Algas</span>
            </div>

            <div className="flex items-center justify-between bg-white/10 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-green-400" />
                <span>Suas algas</span>
              </div>
              <span className="font-bold">{algas.toLocaleString()}</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFish}
              disabled={fishing || algas < 10 || !selectedRod}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {fishing ? (
                <div className="flex items-center justify-center space-x-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Fish className="w-5 h-5" />
                  </motion.div>
                  <span>Pescando...</span>
                </div>
              ) : (
                'Pescar'
              )}
            </motion.button>
          </div>
        </div>

        {/* Rod Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Suas Varas</h3>
          
          {rods.length > 0 ? (
            <div className="space-y-3">
              {rods.map((rod) => (
                <motion.div
                  key={rod.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedRod(rod.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedRod === rod.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{rod.image}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{rod.name}</h4>
                      <p className="text-sm text-gray-600">{rod.description}</p>
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      Qtd: {rod.quantity}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Fish className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>Você não possui varas de pesca</p>
              <p className="text-sm">Visite a loja para comprar uma</p>
            </div>
          )}
        </div>
      </div>

      {/* Fishing Tips */}
      <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Dicas de Pesca</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-blue-600 font-semibold mb-2">Chances de Drop</div>
            <div className="text-sm text-gray-700">
              • Comida: 60%<br />
              • Peixe: 0.8%<br />
              • Nada: 39.2%
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-green-600 font-semibold mb-2">Raridades</div>
            <div className="text-sm text-gray-700">
              • Comum: 50%<br />
              • Raro: 12%<br />
              • Lendário: 3%
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="text-yellow-600 font-semibold mb-2">Mutações</div>
            <div className="text-sm text-gray-700">
              • Físicas: +2 algas/h<br />
              • Elementais: +5 algas/h<br />
              • Especiais: +10 algas/h
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fishing;