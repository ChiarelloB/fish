import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Clock, Star, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

interface GameEvent {
  id: string;
  name: string;
  description: string;
  type: 'common' | 'rare' | 'legendary';
  effect: 'mutation' | 'algae_boost' | 'rare_spawn';
  duration: number;
  animationType: string;
  backgroundColor: string;
  particleEffect: string;
  isActive: boolean;
  startTime?: Date;
}

const Events: React.FC = () => {
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [nextEventTime, setNextEventTime] = useState<Date>(new Date(Date.now() + 30 * 60 * 1000));
  const [timeUntilNext, setTimeUntilNext] = useState<string>('');

  const events: GameEvent[] = [
    // Common Events (70%)
    {
      id: 'light_rain',
      name: 'Chuva Leve',
      description: 'Uma chuva suave aumenta a felicidade dos peixes',
      type: 'common',
      effect: 'algae_boost',
      duration: 5,
      animationType: 'light_rain',
      backgroundColor: '#4A90E2',
      particleEffect: 'rain_drops',
      isActive: false
    },
    {
      id: 'ocean_breeze',
      name: 'Brisa Marinha',
      description: 'Ventos suaves trazem nutrientes para o oceano',
      type: 'common',
      effect: 'algae_boost',
      duration: 5,
      animationType: 'ocean_breeze',
      backgroundColor: '#5CB3CC',
      particleEffect: 'wind_particles',
      isActive: false
    },
    {
      id: 'sunshine',
      name: 'Sol Radiante',
      description: 'Luz solar fortalece o ecossistema aquático',
      type: 'common',
      effect: 'algae_boost',
      duration: 5,
      animationType: 'sunshine',
      backgroundColor: '#FFD700',
      particleEffect: 'sun_rays',
      isActive: false
    },
    // Rare Events (25%)
    {
      id: 'lightning_storm',
      name: 'Tempestade Elétrica',
      description: 'Raios carregam os peixes de energia mística',
      type: 'rare',
      effect: 'mutation',
      duration: 5,
      animationType: 'lightning_storm',
      backgroundColor: '#4B0082',
      particleEffect: 'lightning_bolts',
      isActive: false
    },
    {
      id: 'golden_tide',
      name: 'Maré Dourada',
      description: 'Águas místicas dobram a produção de algas',
      type: 'rare',
      effect: 'algae_boost',
      duration: 5,
      animationType: 'golden_tide',
      backgroundColor: '#DAA520',
      particleEffect: 'golden_particles',
      isActive: false
    },
    {
      id: 'meteor_shower',
      name: 'Chuva de Meteoros',
      description: 'Meteoritos caem no oceano causando mutações',
      type: 'rare',
      effect: 'mutation',
      duration: 5,
      animationType: 'meteor_shower',
      backgroundColor: '#191970',
      particleEffect: 'falling_stars',
      isActive: false
    },
    // Legendary Events (5%)
    {
      id: 'solar_eclipse',
      name: 'Eclipse Solar',
      description: 'Fenômeno cósmico desperta poderes ancestrais',
      type: 'legendary',
      effect: 'mutation',
      duration: 5,
      animationType: 'solar_eclipse',
      backgroundColor: '#000000',
      particleEffect: 'eclipse_corona',
      isActive: false
    },
    {
      id: 'aurora_borealis',
      name: 'Aurora Boreal',
      description: 'Luzes mágicas transformam os peixes',
      type: 'legendary',
      effect: 'mutation',
      duration: 5,
      animationType: 'aurora_borealis',
      backgroundColor: '#00FF7F',
      particleEffect: 'aurora_waves',
      isActive: false
    },
    {
      id: 'dimensional_rift',
      name: 'Fenda Dimensional',
      description: 'Portal para outras dimensões se abre',
      type: 'legendary',
      effect: 'mutation',
      duration: 5,
      animationType: 'dimensional_rift',
      backgroundColor: '#8A2BE2',
      particleEffect: 'portal_energy',
      isActive: false
    }
  ];

  const triggerRandomEvent = () => {
    const eventRoll = Math.random();
    let selectedTier: 'common' | 'rare' | 'legendary';
    
    if (eventRoll < 0.05) {
      selectedTier = 'legendary'; // 5%
    } else if (eventRoll < 0.30) {
      selectedTier = 'rare'; // 25%
    } else {
      selectedTier = 'common'; // 70%
    }
    
    const tierEvents = events.filter(event => event.type === selectedTier);
    const selectedEvent = tierEvents[Math.floor(Math.random() * tierEvents.length)];
    
    if (selectedEvent) {
      const eventWithTime = {
        ...selectedEvent,
        isActive: true,
        startTime: new Date()
      };
      
      setCurrentEvent(eventWithTime);
      
      // Show notification
      const typeEmoji = selectedTier === 'legendary' ? '🌟' : selectedTier === 'rare' ? '⚡' : '🌊';
      toast.success(`${typeEmoji} ${selectedEvent.name} ativado!`, {
        duration: 5000,
        style: {
          background: selectedEvent.backgroundColor,
          color: 'white',
        },
      });
      
      // Apply event effects
      if (selectedEvent.effect === 'mutation') {
        // Simulate mutation effect
        setTimeout(() => {
          toast.success('🧬 Um dos seus peixes sofreu uma mutação!');
        }, 2000);
      }
      
      // End event after duration
      setTimeout(() => {
        setCurrentEvent(null);
        setNextEventTime(new Date(Date.now() + 30 * 60 * 1000)); // Next event in 30 minutes
      }, selectedEvent.duration * 60 * 1000);
    }
  };

  // Update countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = nextEventTime.getTime() - now.getTime();
      
      if (diff <= 0 && !currentEvent) {
        triggerRandomEvent();
      } else {
        const minutes = Math.floor(diff / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeUntilNext(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [nextEventTime, currentEvent]);

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'legendary': return 'text-yellow-400 bg-yellow-100';
      case 'rare': return 'text-purple-400 bg-purple-100';
      case 'common': return 'text-blue-400 bg-blue-100';
      default: return 'text-gray-400 bg-gray-100';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'legendary': return Star;
      case 'rare': return Zap;
      case 'common': return Sparkles;
      default: return Clock;
    }
  };

  return (
    <>
      {/* Event Overlay */}
      <AnimatePresence>
        {currentEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 pointer-events-none"
            style={{ backgroundColor: currentEvent.backgroundColor }}
          >
            {/* Lightning Effect */}
            {currentEvent.animationType === 'lightning_storm' && (
              <div className="absolute inset-0">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 bg-white opacity-80"
                    style={{
                      left: `${20 + i * 20}%`,
                      height: '100%',
                      background: 'linear-gradient(to bottom, transparent, #fff, transparent)'
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      scaleY: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 0.2,
                      repeat: Infinity,
                      delay: i * 0.1
                    }}
                  />
                ))}
              </div>
            )}

            {/* Aurora Effect */}
            {currentEvent.animationType === 'aurora_borealis' && (
              <div className="absolute inset-0">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-full h-24 opacity-40"
                    style={{
                      top: `${20 + i * 20}%`,
                      background: `linear-gradient(90deg, transparent, ${currentEvent.backgroundColor}, transparent)`
                    }}
                    animate={{
                      x: [-100, 100, -100],
                      scaleY: [1, 1.2, 1]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: i * 1
                    }}
                  />
                ))}
              </div>
            )}

            {/* Meteor Shower Effect */}
            {currentEvent.animationType === 'meteor_shower' && (
              <div className="absolute inset-0">
                {[...Array(10)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-12 bg-white opacity-80"
                    style={{
                      left: `${Math.random() * 100}%`,
                      background: 'linear-gradient(to bottom, #fff, transparent)'
                    }}
                    animate={{
                      y: [-50, window.innerHeight + 50],
                      x: [0, 50]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3
                    }}
                  />
                ))}
              </div>
            )}

            {/* Golden Tide Effect */}
            {currentEvent.animationType === 'golden_tide' && (
              <motion.div
                className="absolute bottom-0 left-0 w-full h-1/3 opacity-50"
                style={{
                  background: 'linear-gradient(45deg, #FFD700, #FFA500)'
                }}
                animate={{
                  y: [0, -20, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity
                }}
              />
            )}

            {/* Particles */}
            <div className="absolute inset-0">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full opacity-60"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: Math.random() * 3
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Events Panel */}
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Centro de Eventos</h2>
          <p className="text-gray-600">Eventos especiais que afetam todo o oceano</p>
        </div>

        {/* Current Event */}
        {currentEvent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white mb-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-3xl">🌊</div>
              <div>
                <h3 className="text-2xl font-bold">{currentEvent.name}</h3>
                <p className="text-purple-100">{currentEvent.description}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEventTypeColor(currentEvent.type)}`}>
                  {currentEvent.type.toUpperCase()}
                </span>
                <span className="text-purple-100">
                  Efeito: {currentEvent.effect === 'mutation' ? 'Mutação' : 'Boost de Algas'}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm text-purple-100">Evento Ativo</div>
                <div className="text-lg font-bold">⚡ EM ANDAMENTO</div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="text-center">
              <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Próximo Evento</h3>
              <p className="text-gray-600 mb-4">O oceano está calmo... por enquanto</p>
              <div className="text-3xl font-bold text-blue-600">{timeUntilNext}</div>
              <p className="text-sm text-gray-500 mt-2">Tempo restante</p>
            </div>
          </div>
        )}

        {/* Event History */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Tipos de Eventos</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Common Events */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Sparkles className="w-5 h-5 text-blue-500" />
                <h4 className="font-semibold text-blue-900">Eventos Comuns</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">70% de chance • Boost de algas</p>
              <div className="space-y-2">
                {events.filter(e => e.type === 'common').map(event => (
                  <div key={event.id} className="text-xs bg-blue-50 text-blue-800 px-2 py-1 rounded">
                    {event.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Rare Events */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Zap className="w-5 h-5 text-purple-500" />
                <h4 className="font-semibold text-purple-900">Eventos Raros</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">25% de chance • Mutações</p>
              <div className="space-y-2">
                {events.filter(e => e.type === 'rare').map(event => (
                  <div key={event.id} className="text-xs bg-purple-50 text-purple-800 px-2 py-1 rounded">
                    {event.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Legendary Events */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Star className="w-5 h-5 text-yellow-500" />
                <h4 className="font-semibold text-yellow-900">Eventos Lendários</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">5% de chance • Mutações especiais</p>
              <div className="space-y-2">
                {events.filter(e => e.type === 'legendary').map(event => (
                  <div key={event.id} className="text-xs bg-yellow-50 text-yellow-800 px-2 py-1 rounded">
                    {event.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Events;