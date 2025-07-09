// Dados do jogo - Peixes, Ovos e Mutações
export interface FishTemplate {
  id: string;
  name: string;
  rarity: string;
  baseAlgae: number;
  image: string;
  description: string;
  spawnChance: number;
}

export interface EggTemplate {
  id: string;
  name: string;
  rarity: string;
  price: number;
  image: string;
  description: string;
  hatchTime: number; // em minutos
  rarityBonus: Record<string, number>;
}

export interface MutationTemplate {
  id: string;
  name: string;
  type: 'Física' | 'Elemental' | 'Especial' | 'Mística' | 'Cósmica';
  rarity: string;
  bonus: number;
  description: string;
  chance: number;
}

export const FISH_TEMPLATES: FishTemplate[] = [
  // Comuns (40%)
  { id: 'f1', name: 'Peixe Dourado', rarity: 'Comum', baseAlgae: 10, image: '🐠', description: 'Um peixe dourado comum', spawnChance: 8 },
  { id: 'f2', name: 'Peixe Azul', rarity: 'Comum', baseAlgae: 12, image: '🐟', description: 'Peixe azul das águas rasas', spawnChance: 8 },
  { id: 'f3', name: 'Peixe Verde', rarity: 'Comum', baseAlgae: 11, image: '🐡', description: 'Peixe verde herbívoro', spawnChance: 8 },
  { id: 'f4', name: 'Peixe Vermelho', rarity: 'Comum', baseAlgae: 13, image: '🔴', description: 'Peixe vermelho vibrante', spawnChance: 8 },
  { id: 'f5', name: 'Peixe Prateado', rarity: 'Comum', baseAlgae: 14, image: '⚪', description: 'Peixe com escamas prateadas', spawnChance: 8 },
  
  // Incomuns (25%)
  { id: 'f6', name: 'Peixe Listrado', rarity: 'Incomum', baseAlgae: 20, image: '🦓', description: 'Peixe com listras únicas', spawnChance: 5 },
  { id: 'f7', name: 'Peixe Neon', rarity: 'Incomum', baseAlgae: 22, image: '💡', description: 'Peixe que brilha no escuro', spawnChance: 5 },
  { id: 'f8', name: 'Peixe Tropical', rarity: 'Incomum', baseAlgae: 25, image: '🌺', description: 'Peixe das águas tropicais', spawnChance: 5 },
  { id: 'f9', name: 'Peixe Coral', rarity: 'Incomum', baseAlgae: 23, image: '🪸', description: 'Peixe que vive nos corais', spawnChance: 5 },
  { id: 'f10', name: 'Peixe Espinho', rarity: 'Incomum', baseAlgae: 24, image: '🦔', description: 'Peixe com espinhos defensivos', spawnChance: 5 },
  
  // Raros (20%)
  { id: 'f11', name: 'Peixe Cristal', rarity: 'Raro', baseAlgae: 40, image: '💎', description: 'Peixe com corpo cristalino', spawnChance: 4 },
  { id: 'f12', name: 'Peixe Arco-íris', rarity: 'Raro', baseAlgae: 45, image: '🌈', description: 'Peixe multicolorido', spawnChance: 4 },
  { id: 'f13', name: 'Peixe Elétrico', rarity: 'Raro', baseAlgae: 42, image: '⚡', description: 'Peixe que gera eletricidade', spawnChance: 4 },
  { id: 'f14', name: 'Peixe Fantasma', rarity: 'Raro', baseAlgae: 38, image: '👻', description: 'Peixe semi-transparente', spawnChance: 4 },
  { id: 'f15', name: 'Peixe Lunar', rarity: 'Raro', baseAlgae: 43, image: '🌙', description: 'Peixe que brilha como a lua', spawnChance: 4 },
  
  // Épicos (10%)
  { id: 'f16', name: 'Peixe Dragão', rarity: 'Épico', baseAlgae: 80, image: '🐉', description: 'Peixe com características de dragão', spawnChance: 2 },
  { id: 'f17', name: 'Peixe Fênix', rarity: 'Épico', baseAlgae: 85, image: '🔥', description: 'Peixe que renasce das cinzas', spawnChance: 2 },
  { id: 'f18', name: 'Peixe Gelo', rarity: 'Épico', baseAlgae: 75, image: '❄️', description: 'Peixe das águas congeladas', spawnChance: 2 },
  { id: 'f19', name: 'Peixe Tempestade', rarity: 'Épico', baseAlgae: 82, image: '⛈️', description: 'Peixe que controla tempestades', spawnChance: 2 },
  { id: 'f20', name: 'Peixe Sombra', rarity: 'Épico', baseAlgae: 78, image: '🌑', description: 'Peixe das profundezas sombrias', spawnChance: 2 },
  
  // Lendários (3%)
  { id: 'f21', name: 'Peixe Dourado Ancestral', rarity: 'Lendário', baseAlgae: 150, image: '👑', description: 'Lendário peixe dourado ancestral', spawnChance: 0.6 },
  { id: 'f22', name: 'Peixe Cósmico', rarity: 'Lendário', baseAlgae: 160, image: '🌌', description: 'Peixe das galáxias distantes', spawnChance: 0.6 },
  { id: 'f23', name: 'Peixe Divino', rarity: 'Lendário', baseAlgae: 170, image: '✨', description: 'Peixe abençoado pelos deuses', spawnChance: 0.6 },
  { id: 'f24', name: 'Peixe Temporal', rarity: 'Lendário', baseAlgae: 155, image: '⏰', description: 'Peixe que manipula o tempo', spawnChance: 0.6 },
  { id: 'f25', name: 'Peixe Estelar', rarity: 'Lendário', baseAlgae: 165, image: '⭐', description: 'Peixe nascido das estrelas', spawnChance: 0.6 },
  
  // Míticos (1.5%)
  { id: 'f26', name: 'Leviatã Jovem', rarity: 'Mítico', baseAlgae: 250, image: '🐋', description: 'Jovem leviatã dos oceanos', spawnChance: 0.3 },
  { id: 'f27', name: 'Kraken Bebê', rarity: 'Mítico', baseAlgae: 260, image: '🐙', description: 'Filhote do lendário Kraken', spawnChance: 0.3 },
  { id: 'f28', name: 'Peixe Primordial', rarity: 'Mítico', baseAlgae: 270, image: '🦕', description: 'Peixe da era primordial', spawnChance: 0.3 },
  { id: 'f29', name: 'Peixe Void', rarity: 'Mítico', baseAlgae: 255, image: '🕳️', description: 'Peixe do vazio cósmico', spawnChance: 0.3 },
  { id: 'f30', name: 'Peixe Infinito', rarity: 'Mítico', baseAlgae: 280, image: '♾️', description: 'Peixe que transcende limites', spawnChance: 0.3 },
  
  // Ancestrais (0.8%)
  { id: 'f31', name: 'Guardião Aquático', rarity: 'Ancestral', baseAlgae: 400, image: '🛡️', description: 'Guardião ancestral dos mares', spawnChance: 0.16 },
  { id: 'f32', name: 'Peixe Oráculo', rarity: 'Ancestral', baseAlgae: 420, image: '🔮', description: 'Peixe que vê o futuro', spawnChance: 0.16 },
  { id: 'f33', name: 'Peixe Titã', rarity: 'Ancestral', baseAlgae: 450, image: '⚔️', description: 'Titã dos oceanos antigos', spawnChance: 0.16 },
  { id: 'f34', name: 'Peixe Espírito', rarity: 'Ancestral', baseAlgae: 430, image: '👼', description: 'Espírito guardião marinho', spawnChance: 0.16 },
  { id: 'f35', name: 'Peixe Eterno', rarity: 'Ancestral', baseAlgae: 440, image: '🔄', description: 'Peixe que vive eternamente', spawnChance: 0.16 },
  
  // Divinos (0.4%)
  { id: 'f36', name: 'Poseidon Jovem', rarity: 'Divino', baseAlgae: 600, image: '🔱', description: 'Jovem deus dos mares', spawnChance: 0.08 },
  { id: 'f37', name: 'Peixe Criador', rarity: 'Divino', baseAlgae: 650, image: '🌍', description: 'Peixe que criou os oceanos', spawnChance: 0.08 },
  { id: 'f38', name: 'Peixe Supremo', rarity: 'Divino', baseAlgae: 700, image: '👑', description: 'O supremo entre todos os peixes', spawnChance: 0.08 },
  { id: 'f39', name: 'Peixe Celestial', rarity: 'Divino', baseAlgae: 620, image: '☁️', description: 'Peixe dos céus divinos', spawnChance: 0.08 },
  { id: 'f40', name: 'Peixe Absoluto', rarity: 'Divino', baseAlgae: 680, image: '💫', description: 'Poder absoluto em forma de peixe', spawnChance: 0.08 },
  
  // Cósmicos (0.2%)
  { id: 'f41', name: 'Peixe Multiversal', rarity: 'Cósmico', baseAlgae: 1000, image: '🌐', description: 'Peixe que existe em múltiplos universos', spawnChance: 0.04 },
  { id: 'f42', name: 'Peixe Quântico', rarity: 'Cósmico', baseAlgae: 1100, image: '⚛️', description: 'Peixe que manipula a realidade quântica', spawnChance: 0.04 },
  { id: 'f43', name: 'Peixe Dimensional', rarity: 'Cósmico', baseAlgae: 1200, image: '🌀', description: 'Peixe que viaja entre dimensões', spawnChance: 0.04 },
  { id: 'f44', name: 'Peixe Singularidade', rarity: 'Cósmico', baseAlgae: 1150, image: '🕳️', description: 'Peixe nascido de um buraco negro', spawnChance: 0.04 },
  { id: 'f45', name: 'Peixe Omnipotente', rarity: 'Cósmico', baseAlgae: 1300, image: '🔥', description: 'Peixe com poder omnipotente', spawnChance: 0.04 },
  
  // Transcendentes (0.1%)
  { id: 'f46', name: 'Alpha Omega', rarity: 'Transcendente', baseAlgae: 2000, image: '🅰️', description: 'O primeiro e último peixe', spawnChance: 0.02 },
  { id: 'f47', name: 'Peixe Conceitual', rarity: 'Transcendente', baseAlgae: 2200, image: '💭', description: 'Peixe que existe apenas como conceito', spawnChance: 0.02 },
  { id: 'f48', name: 'Peixe Narrativo', rarity: 'Transcendente', baseAlgae: 2500, image: '📖', description: 'Peixe que controla a narrativa da realidade', spawnChance: 0.02 },
  { id: 'f49', name: 'Peixe Meta', rarity: 'Transcendente', baseAlgae: 2300, image: '🎭', description: 'Peixe que transcende a própria existência', spawnChance: 0.02 },
  { id: 'f50', name: 'O Peixe', rarity: 'Transcendente', baseAlgae: 3000, image: '🌟', description: 'Simplesmente... O Peixe', spawnChance: 0.02 }
];

export const EGG_TEMPLATES: EggTemplate[] = [
  {
    id: 'egg1',
    name: 'Ovo Comum',
    rarity: 'Comum',
    price: 200,
    image: '🥚',
    description: 'Ovo básico com peixes comuns',
    hatchTime: 5,
    rarityBonus: { 'Comum': 60, 'Incomum': 30, 'Raro': 10 }
  },
  {
    id: 'egg2',
    name: 'Ovo Dourado',
    rarity: 'Incomum',
    price: 500,
    image: '🟡',
    description: 'Ovo dourado com melhores chances',
    hatchTime: 10,
    rarityBonus: { 'Comum': 40, 'Incomum': 40, 'Raro': 20 }
  },
  {
    id: 'egg3',
    name: 'Ovo Cristal',
    rarity: 'Raro',
    price: 1200,
    image: '💎',
    description: 'Ovo cristalino com peixes raros',
    hatchTime: 20,
    rarityBonus: { 'Incomum': 30, 'Raro': 50, 'Épico': 20 }
  },
  {
    id: 'egg4',
    name: 'Ovo Élfico',
    rarity: 'Épico',
    price: 3000,
    image: '🧝',
    description: 'Ovo mágico dos elfos marinhos',
    hatchTime: 45,
    rarityBonus: { 'Raro': 30, 'Épico': 50, 'Lendário': 20 }
  },
  {
    id: 'egg5',
    name: 'Ovo Dragão',
    rarity: 'Lendário',
    price: 8000,
    image: '🐉',
    description: 'Ovo de dragão marinho lendário',
    hatchTime: 90,
    rarityBonus: { 'Épico': 30, 'Lendário': 50, 'Mítico': 20 }
  },
  {
    id: 'egg6',
    name: 'Ovo Cósmico',
    rarity: 'Mítico',
    price: 20000,
    image: '🌌',
    description: 'Ovo das galáxias distantes',
    hatchTime: 180,
    rarityBonus: { 'Lendário': 30, 'Mítico': 50, 'Ancestral': 20 }
  },
  {
    id: 'egg7',
    name: 'Ovo Primordial',
    rarity: 'Ancestral',
    price: 50000,
    image: '🦕',
    description: 'Ovo da era primordial',
    hatchTime: 360,
    rarityBonus: { 'Mítico': 30, 'Ancestral': 50, 'Divino': 20 }
  },
  {
    id: 'egg8',
    name: 'Ovo Divino',
    rarity: 'Divino',
    price: 100000,
    image: '✨',
    description: 'Ovo abençoado pelos deuses',
    hatchTime: 720,
    rarityBonus: { 'Ancestral': 30, 'Divino': 50, 'Cósmico': 20 }
  },
  {
    id: 'egg9',
    name: 'Ovo Quântico',
    rarity: 'Cósmico',
    price: 250000,
    image: '⚛️',
    description: 'Ovo que existe em múltiplas realidades',
    hatchTime: 1440,
    rarityBonus: { 'Divino': 30, 'Cósmico': 50, 'Transcendente': 20 }
  },
  {
    id: 'egg10',
    name: 'Ovo Transcendente',
    rarity: 'Transcendente',
    price: 500000,
    image: '🌟',
    description: 'O ovo supremo que transcende a realidade',
    hatchTime: 2880,
    rarityBonus: { 'Cósmico': 30, 'Transcendente': 70 }
  }
];

export const MUTATION_TEMPLATES: MutationTemplate[] = [
  // Físicas (40%)
  { id: 'm1', name: 'Escamas Douradas', type: 'Física', rarity: 'Comum', bonus: 2, description: 'Escamas que brilham como ouro', chance: 8 },
  { id: 'm2', name: 'Nadadeiras Grandes', type: 'Física', rarity: 'Comum', bonus: 3, description: 'Nadadeiras maiores que o normal', chance: 8 },
  { id: 'm3', name: 'Cauda Dupla', type: 'Física', rarity: 'Incomum', bonus: 5, description: 'Duas caudas em vez de uma', chance: 6 },
  { id: 'm4', name: 'Olhos Cristalinos', type: 'Física', rarity: 'Incomum', bonus: 4, description: 'Olhos transparentes como cristal', chance: 6 },
  { id: 'm5', name: 'Espinhos Venenosos', type: 'Física', rarity: 'Raro', bonus: 8, description: 'Espinhos que secretam veneno', chance: 4 },
  { id: 'm6', name: 'Barbatanas Luminosas', type: 'Física', rarity: 'Raro', bonus: 7, description: 'Barbatanas que emitem luz', chance: 4 },
  { id: 'm7', name: 'Corpo Translúcido', type: 'Física', rarity: 'Épico', bonus: 12, description: 'Corpo semi-transparente', chance: 2 },
  { id: 'm8', name: 'Escamas Metálicas', type: 'Física', rarity: 'Épico', bonus: 15, description: 'Escamas duras como metal', chance: 2 },
  { id: 'm9', name: 'Forma Cambiante', type: 'Física', rarity: 'Lendário', bonus: 25, description: 'Pode mudar de forma', chance: 0.6 },
  { id: 'm10', name: 'Regeneração', type: 'Física', rarity: 'Lendário', bonus: 30, description: 'Regenera partes do corpo', chance: 0.6 },
  
  // Elementais (25%)
  { id: 'm11', name: 'Aura de Fogo', type: 'Elemental', rarity: 'Comum', bonus: 5, description: 'Emana calor constante', chance: 5 },
  { id: 'm12', name: 'Respiração Aquática', type: 'Elemental', rarity: 'Comum', bonus: 4, description: 'Purifica a água ao redor', chance: 5 },
  { id: 'm13', name: 'Controle de Gelo', type: 'Elemental', rarity: 'Incomum', bonus: 8, description: 'Pode congelar a água', chance: 4 },
  { id: 'm14', name: 'Choque Elétrico', type: 'Elemental', rarity: 'Incomum', bonus: 9, description: 'Gera descargas elétricas', chance: 4 },
  { id: 'm15', name: 'Manipulação de Correntes', type: 'Elemental', rarity: 'Raro', bonus: 15, description: 'Controla correntes marítimas', chance: 3 },
  { id: 'm16', name: 'Tempestade Pessoal', type: 'Elemental', rarity: 'Épico', bonus: 25, description: 'Cria tempestades ao redor', chance: 1.5 },
  { id: 'm17', name: 'Domínio Elemental', type: 'Elemental', rarity: 'Lendário', bonus: 40, description: 'Controla todos os elementos', chance: 0.5 },
  
  // Especiais (20%)
  { id: 'm18', name: 'Bioluminescência', type: 'Especial', rarity: 'Comum', bonus: 6, description: 'Brilha no escuro', chance: 4 },
  { id: 'm19', name: 'Ecolocalização', type: 'Especial', rarity: 'Incomum', bonus: 10, description: 'Navega por ondas sonoras', chance: 3 },
  { id: 'm20', name: 'Camuflagem', type: 'Especial', rarity: 'Raro', bonus: 18, description: 'Torna-se invisível', chance: 2.5 },
  { id: 'm21', name: 'Telepatia', type: 'Especial', rarity: 'Épico', bonus: 30, description: 'Comunica-se mentalmente', chance: 1.2 },
  { id: 'm22', name: 'Premonição', type: 'Especial', rarity: 'Lendário', bonus: 50, description: 'Vê o futuro próximo', chance: 0.3 },
  
  // Místicas (10%)
  { id: 'm23', name: 'Aura Mística', type: 'Mística', rarity: 'Incomum', bonus: 12, description: 'Emana energia mística', chance: 2 },
  { id: 'm24', name: 'Benção Ancestral', type: 'Mística', rarity: 'Raro', bonus: 20, description: 'Abençoado pelos ancestrais', chance: 1.5 },
  { id: 'm25', name: 'Conexão Espiritual', type: 'Mística', rarity: 'Épico', bonus: 35, description: 'Conectado ao mundo espiritual', chance: 1 },
  { id: 'm26', name: 'Transcendência', type: 'Mística', rarity: 'Lendário', bonus: 60, description: 'Transcende limitações físicas', chance: 0.2 },
  { id: 'm27', name: 'Iluminação Divina', type: 'Mística', rarity: 'Mítico', bonus: 100, description: 'Alcançou a iluminação', chance: 0.1 },
  
  // Cósmicas (5%)
  { id: 'm28', name: 'Energia Estelar', type: 'Cósmica', rarity: 'Raro', bonus: 25, description: 'Alimenta-se de energia estelar', chance: 1 },
  { id: 'm29', name: 'Viagem Dimensional', type: 'Cósmica', rarity: 'Épico', bonus: 45, description: 'Pode viajar entre dimensões', chance: 0.8 },
  { id: 'm30', name: 'Manipulação Temporal', type: 'Cósmica', rarity: 'Lendário', bonus: 80, description: 'Controla o fluxo do tempo', chance: 0.3 },
  { id: 'm31', name: 'Onipresença', type: 'Cósmica', rarity: 'Mítico', bonus: 150, description: 'Existe em múltiplos lugares', chance: 0.1 },
  { id: 'm32', name: 'Criação de Realidade', type: 'Cósmica', rarity: 'Ancestral', bonus: 250, description: 'Pode criar novas realidades', chance: 0.05 },
  { id: 'm33', name: 'Omnisciência', type: 'Cósmica', rarity: 'Divino', bonus: 400, description: 'Conhece tudo que existe', chance: 0.02 },
  { id: 'm34', name: 'Omnipotência', type: 'Cósmica', rarity: 'Cósmico', bonus: 600, description: 'Poder ilimitado', chance: 0.01 },
  { id: 'm35', name: 'Existência Absoluta', type: 'Cósmica', rarity: 'Transcendente', bonus: 1000, description: 'Existência além da compreensão', chance: 0.005 },
  
  // Mutações Únicas Adicionais
  { id: 'm36', name: 'Escamas Arco-íris', type: 'Física', rarity: 'Raro', bonus: 10, description: 'Escamas que mudam de cor', chance: 3 },
  { id: 'm37', name: 'Respiração de Bolhas', type: 'Elemental', rarity: 'Comum', bonus: 3, description: 'Cria bolhas mágicas', chance: 4 },
  { id: 'm38', name: 'Magnetismo', type: 'Especial', rarity: 'Épico', bonus: 28, description: 'Atrai objetos metálicos', chance: 1 },
  { id: 'm39', name: 'Duplicação', type: 'Mística', rarity: 'Mítico', bonus: 120, description: 'Pode se duplicar', chance: 0.08 },
  { id: 'm40', name: 'Absorção de Energia', type: 'Cósmica', rarity: 'Lendário', bonus: 70, description: 'Absorve energia do ambiente', chance: 0.25 },
  { id: 'm41', name: 'Cura Regenerativa', type: 'Física', rarity: 'Épico', bonus: 20, description: 'Cura ferimentos rapidamente', chance: 1.5 },
  { id: 'm42', name: 'Controle Gravitacional', type: 'Cósmica', rarity: 'Ancestral', bonus: 300, description: 'Manipula a gravidade', chance: 0.03 },
  { id: 'm43', name: 'Fase Espectral', type: 'Mística', rarity: 'Lendário', bonus: 55, description: 'Pode se tornar intangível', chance: 0.15 },
  { id: 'm44', name: 'Multiplicação Celular', type: 'Física', rarity: 'Mítico', bonus: 90, description: 'Células se multiplicam rapidamente', chance: 0.06 },
  { id: 'm45', name: 'Harmonia Universal', type: 'Cósmica', rarity: 'Transcendente', bonus: 800, description: 'Em harmonia com o universo', chance: 0.002 },
  { id: 'm46', name: 'Escamas de Diamante', type: 'Física', rarity: 'Lendário', bonus: 35, description: 'Escamas duras como diamante', chance: 0.4 },
  { id: 'm47', name: 'Sopro Congelante', type: 'Elemental', rarity: 'Raro', bonus: 16, description: 'Congela tudo que toca', chance: 2.5 },
  { id: 'm48', name: 'Visão Raio-X', type: 'Especial', rarity: 'Épico', bonus: 32, description: 'Vê através de objetos', chance: 0.9 },
  { id: 'm49', name: 'Alma Gêmea', type: 'Mística', rarity: 'Divino', bonus: 500, description: 'Conectado a outra alma', chance: 0.015 },
  { id: 'm50', name: 'Singularidade Pessoal', type: 'Cósmica', rarity: 'Cósmico', bonus: 750, description: 'É uma singularidade viva', chance: 0.008 }
];

export const RARITY_COLORS = {
  'Comum': 'bg-gray-400',
  'Incomum': 'bg-green-400',
  'Raro': 'bg-blue-400',
  'Épico': 'bg-purple-400',
  'Lendário': 'bg-yellow-400',
  'Mítico': 'bg-red-400',
  'Ancestral': 'bg-orange-400',
  'Divino': 'bg-pink-400',
  'Cósmico': 'bg-indigo-400',
  'Transcendente': 'bg-gradient-to-r from-purple-400 to-pink-400'
};