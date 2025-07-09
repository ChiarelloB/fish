import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from '../layout/Header';
import Navigation from '../layout/Navigation';
import VideoBackground from '../layout/VideoBackground';
import Aquarium from './Aquarium';
import Fishing from './Fishing';
import Inventory from './Inventory';
import Shop from './Shop';
import Auctions from './Auctions';
import Admin from './Admin';
import Events from './Events';
import { GameProvider } from '../../contexts/GameContext';

const GameLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState('aquarium');

  const renderContent = () => {
    switch (activeTab) {
      case 'aquarium':
        return <Aquarium />;
      case 'fishing':
        return <Fishing />;
      case 'inventory':
        return <Inventory />;
      case 'shop':
        return <Shop />;
      case 'auctions':
        return <Auctions />;
      case 'admin':
        return <Admin />;
      case 'events':
        return <Events />;
      default:
        return <Aquarium />;
    }
  };

  return (
    <GameProvider>
      <div className="min-h-screen bg-gray-50 relative">
        <VideoBackground />
        <div className="relative z-20">
          <Header />
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
          <main className="max-w-7xl mx-auto">
            {renderContent()}
          </main>
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </GameProvider>
  );
};

export default GameLayout;