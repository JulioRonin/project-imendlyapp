export const MOCK_PROVIDERS = [
  { 
    id: '1', 
    name: 'Juan Pérez', 
    category: 'Electricista', 
    price: 450, 
    rating: 4.8, 
    reviews: 124, 
    zones: ['Norte', 'Centro'], 
    verified: true,
    experience: 10,
    lat: 25.6800,
    lng: -100.3800,
    about: "Especialista en instalaciones eléctricas residenciales y reparación de cortos circuitos.",
    portfolio: [1, 2, 3],
    services: [
      { name: 'Mantenimiento de AC', price: 450 },
      { name: 'Instalación básica', price: 450 },
      { name: 'Revisión de cableado', price: 600 },
    ]
  },
  { 
    id: '2', 
    name: 'María García', 
    category: 'Plomería', 
    price: 380, 
    rating: 4.9, 
    reviews: 89, 
    zones: ['Sur', 'Poniente'], 
    verified: true,
    experience: 8,
    lat: 25.6500,
    lng: -100.4200,
    about: "Experta en detección de fugas y mantenimiento preventivo de tuberías.",
    portfolio: [1, 2],
    services: [
      { name: 'Cambio de válvula', price: 380 },
      { name: 'Destape de drenaje', price: 550 },
    ]
  },
  { 
    id: '3', 
    name: 'Carlos Ruíz', 
    category: 'Pintura', 
    price: 300, 
    rating: 4.5, 
    reviews: 56, 
    zones: ['Centro'], 
    verified: false,
    experience: 15,
    lat: 25.7500,
    lng: -100.3000,
    about: "Pintura decorativa e impermeable para interiores y exteriores.",
    portfolio: [1, 2, 3, 4],
    services: [
      { name: 'Pintura m2', price: 120 },
      { name: 'Resanado de muros', price: 250 },
    ]
  },
  { 
    id: '4', 
    name: 'Elena Torres', 
    category: 'Climas/AC', 
    price: 550, 
    rating: 5.0, 
    reviews: 42, 
    zones: ['Oriente', 'Sur'], 
    verified: true,
    experience: 6,
    lat: 25.8500,
    lng: -100.2000,
    about: "Mantenimiento y carga de gas para aires acondicionados residenciales.",
    portfolio: [1, 2],
    services: [
      { name: 'Mantenimiento de AC', price: 550 },
      { name: 'Carga de Gas', price: 850 },
    ]
  },
];

export const MOCK_STATS = {
  escrow: '$124,500',
  dailyServices: '42',
  newProviders: '8',
  avgTicket: '$840 MXN'
};

export const MOCK_DISPUTES = [
  { id: 'DP-0021', title: 'Disputa de Pago #DP-0021', description: 'El cliente reclama que el electricista no terminó la instalación del tablero principal.', severity: 'CRITICAL' }
];
