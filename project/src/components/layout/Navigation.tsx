import React from 'react';
import { motion } from 'framer-motion';
import { Home, Fish, ShoppingBag, Gavel, Package, Settings, Zap } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'aquarium', label: 'Aquário', icon: Home },
    { id: 'fishing', label: 'Pescar', icon: Fish },
    { id: 'shop', label: 'Loja', icon: ShoppingBag },
    { id: 'auctions', label: 'Leilões', icon: Gavel },
    { id: 'inventory', label: 'Inventário', icon: Package },
    { id: 'events', label: 'Eventos', icon: Zap },
    { id: 'admin', label: 'Admin', icon: Settings }
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-sm shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-2 px-4 py-4 font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;