import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Coins, Package, Fish, Utensils, Zap } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import { useAuth } from '../../contexts/AuthContext';
import { EGG_TEMPLATES, RARITY_COLORS } from '../../data/gameData';
import toast from 'react-hot-toast';

interface ShopItem {
  id: string;
  name: string;
  type: 'rod' | 'food' | 'egg';
  price: number;
  image: string;
  description: string;
  rarity?: string;
  multiplier?: number;
  hatchTime?: number;
}

const Shop: React.FC = () => {
  const { algas, updateAlgas } = useGame();
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'rods' | 'food' | 'eggs' | 'algae'>('rods');

  const shopItems: Record<string, ShopItem[]> = {
    rods: [
      { id: 'rod-1', name: 'Vara Básica', type: 'rod', price: 0, image: '🎣', description: 'Vara de pesca básica gratuita', multiplier: 1.0 },
      { id: 'rod-2', name: 'Vara de Bambu', type: 'rod', price: 500, image: '🎋', description: 'Vara mais resistente com 20% mais chance', multiplier: 1.2 },
      { id: 'rod-3', name: 'Vara de Fibra', type: 'rod', price: 1500, image: '🏹', description: 'Vara moderna com 50% mais chance', multiplier: 1.5 },
      { id: 'rod-4', name: 'Vara Eletrônica', type: 'rod', price: 5000, image: '⚡', description: 'Tecnologia avançada, dobra as chances', multiplier: 2.0 },
      { id: 'rod-5', name: 'Vara Mágica', type: 'rod', price: 15000, image: '🪄', description: 'Vara encantada com poderes especiais', multiplier: 2.5 },
      { id: 'rod-6', name: 'Vara Lendária', type: 'rod', price: 50000, image: '🌟', description: 'A vara mais poderosa do oceano', multiplier: 3.0 }
    ],
    food: [
      { id: 'food-1', name: 'Ração Comum', type: 'food', price: 50, image: '🌿', description: 'Alimento básico para peixes', multiplier: 1.0 },
      { id: 'food-2', name: 'Ração Premium', type: 'food', price: 150, image: '🍃', description: 'Ração de qualidade superior', multiplier: 1.5 },
      { id: 'food-3', name: 'Ração Especial', type: 'food', price: 300, image: '🌱', description: 'Ração com nutrientes especiais', multiplier: 2.0 },
      { id: 'food-4', name: 'Ração Dourada', type: 'food', price: 800, image: '✨', description: 'Ração premium com boost triplo', multiplier: 3.0 },
      { id: 'food-5', name: 'Ração Divina', type: 'food', price: 2000, image: '🌟', description: 'A melhor ração possível', multiplier: 5.0 }
    ],
    eggs: EGG_TEMPLATES.map(egg => ({
      id: egg.id,
      name: egg.name,
      type: 'egg' as const,
      price: egg.price,
      image: egg.image,
      description: egg.description,
      rarity: egg.rarity,
      hatchTime: egg.hatchTime
    }))
  };

  const algaePackages = [
    { name: "Pacote Iniciante", algae: 1000, price: "R$ 10,00", bonus: "🎁 Vara Grátis" },
    { name: "Pacote Aventureiro", algae: 5000, price: "R$ 40,00", bonus: "🎁 Ovo Raro Grátis" },
    { name: "Pacote Explorador", algae: 12000, price: "R$ 80,00", bonus: "🎁 Vara Premium" },
    { name: "Pacote Mestre", algae: 25000, price: "R$ 150,00", bonus: "🎁 Ovo Épico Grátis" },
    { name: "Pacote Lendário", algae: 50000, price: "R$ 250,00", bonus: "🎁 Kit Completo" }
  ];

  const tabs = [
    { id: 'rods', label: 'Varas', icon: Fish },
    { id: 'food', label: 'Comidas', icon: Utensils },
    { id: 'eggs', label: 'Ovos', icon: Zap },
    { id: 'algae', label: 'Algas', icon: Coins }
  ];

  const handlePurchase = async (item: ShopItem) => {
    if (algas < item.price) {
      toast.error('Algas insuficientes!');
      return;
    }

    try {
      await updateAlgas(-item.price);
      toast.success(`${item.name} comprado com sucesso!`);
    } catch (error) {
      toast.error('Erro ao comprar item');
    }
  };

  const handleAlgaePackagePurchase = (packageItem: any) => {
    const message = `Olá! Gostaria de comprar o ${packageItem.name} por ${packageItem.price}. Meu usuário é: ${userProfile?.username}`;
    const whatsappUrl = `https://wa.me/5554981273136?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Loja AquaNFT</h2>
        <p className="text-gray-600">Compre itens para melhorar sua experiência de pesca</p>
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

      {/* Shop Items */}
      {activeTab !== 'algae' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shopItems[activeTab]?.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
            >
              <div className="text-center mb-4">
                <div className="text-4xl mb-3">{item.image}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                
                {item.rarity && (
                  <div className={`inline-block px-3 py-1 rounded-full text-white text-xs font-medium ${RARITY_COLORS[item.rarity as keyof typeof RARITY_COLORS]} mb-3`}>
                    {item.rarity}
                  </div>
                )}
                
                {item.multiplier && (
                  <div className="text-sm text-green-600 font-medium mb-3">
                    Multiplicador: {item.multiplier}x
                  </div>
                )}

                {item.hatchTime && (
                  <div className="text-sm text-blue-600 font-medium mb-3">
                    Tempo de chocagem: {item.hatchTime} min
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Coins className="w-4 h-4 text-yellow-500" />
                  <span className="font-bold text-lg">{item.price.toLocaleString()}</span>
                </div>
                {item.price === 0 && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    GRÁTIS
                  </span>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePurchase(item)}
                disabled={algas < item.price}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Comprar</span>
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Algae Packages */}
      {activeTab === 'algae' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
            <h3 className="text-2xl font-bold mb-2">💰 Pacotes de Algas Premium</h3>
            <p className="text-green-100">Compre algas com dinheiro real via WhatsApp</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {algaePackages.map((packageItem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border-2 border-green-200"
              >
                <div className="text-center mb-4">
                  <div className="text-4xl mb-3">💎</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{packageItem.name}</h3>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {packageItem.algae.toLocaleString()} Algas
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mb-3">
                    {packageItem.price}
                  </div>
                  <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    {packageItem.bonus}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAlgaePackagePurchase(packageItem)}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center space-x-2"
                >
                  <Package className="w-4 h-4" />
                  <span>Comprar via WhatsApp</span>
                </motion.button>
              </motion.div>
            ))}
          </div>

          <div className="bg-blue-50 rounded-xl p-6">
            <h4 className="text-lg font-bold text-blue-900 mb-3">📱 Como Comprar:</h4>
            <ol className="list-decimal list-inside space-y-2 text-blue-800">
              <li>Clique no pacote desejado</li>
              <li>Você será redirecionado para o WhatsApp</li>
              <li>Envie a mensagem automática</li>
              <li>Aguarde o contato do administrador</li>
              <li>Realize o pagamento via PIX</li>
              <li>Suas algas serão adicionadas em até 24h</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;