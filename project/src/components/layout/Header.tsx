import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, User, Coins } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useGame } from '../../contexts/GameContext';

const Header: React.FC = () => {
  const { userProfile, logout } = useAuth();
  const { algas } = useGame();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-gradient-to-r from-blue-800/90 to-blue-900/90 backdrop-blur-sm shadow-lg p-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">🐠</div>
          <div>
            <h1 className="text-2xl font-bold text-white">AquaNFT</h1>
            <p className="text-blue-200 text-sm">Peixes únicos e valiosos</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 bg-blue-700 rounded-full px-4 py-2">
            <Coins className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-semibold">{algas.toLocaleString()}</span>
            <span className="text-blue-200 text-sm">Algas</span>
          </div>

          <div className="flex items-center space-x-2 text-white">
            <User className="w-5 h-5" />
            <span className="font-medium">{userProfile?.username}</span>
          </div>

          <button
            onClick={logout}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;