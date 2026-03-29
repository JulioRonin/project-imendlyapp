export const MOCK_PROVIDERS = [
  { 
    id: '1', 
    name: 'Juan Pérez', 
    category: 'Electricidad', 
    price: 450, 
    rating: 4.8, 
    reviews: 124, 
    zones: ['Norte', 'Centro'], 
    is_verified: true,
    experience: 10,
    image: '/assets/electrician.png',
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
    is_verified: true,
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
    is_verified: false,
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
    is_verified: true,
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
  { 
    id: '5', 
    name: 'Indigo hand made clothing', 
    category: 'Moda y costura', 
    price: 110, 
    rating: 4.9, 
    reviews: 32, 
    zones: ['Centro', 'Sur'], 
    is_verified: true,
    experience: 12,
    image: '/logos/logo 02.jpg',
    lat: 25.6700,
    lng: -100.3900,
    about: "Taller boutique de costura. Vestidos a medida, ajustes y diseño personalizado de alta costura.",
    services: [
      { name: 'Vestido a medida', price: 2500 },
      { name: 'Bastillas/Dobladillos', price: 150 },
      { name: 'Cambio de Zipper', price: 200 },
      { name: 'Ajuste personalizado', price: 350 },
      { name: 'Pinzas', price: 100 },
      { name: 'Diseño y confección', price: 5000 },
    ],
    portfolio: [
      { image: '/assets/indigo_portfolio_1.png', title: 'Vestido de Mezclilla Boutique' },
      { image: '/assets/indigo_portfolio_2.png', title: 'Detalle de Costura y Zipper' },
    ],
    reviewData: [
      { user: 'Valeria S.', rating: 5, comment: 'Excelente trabajo con mi vestido de graduación. El ajuste fue perfecto y la tela es de gran calidad.', date: '21 Mar 2026', photo: '/assets/indigo_review_2.png' },
      { user: 'Ricardo M.', rating: 4.8, comment: 'Muy profesional. El ajuste de mi traje quedó impecable, como si fuera de diseñador.', date: '15 Mar 2026', photo: '/assets/indigo_review_1.png' },
    ]
  },
  { 
    id: '6', 
    name: 'Elite Detailers', 
    category: 'Carwash', 
    price: 350, 
    rating: 5.0, 
    reviews: 56, 
    zones: ['Norte', 'San Pedro'], 
    is_verified: true,
    experience: 7,
    image: '/assets/carwash_boutique.png',
    lat: 25.6600,
    lng: -100.4100,
    about: "Estética automotriz de alta gama. Especialistas en detallado, recubrimientos cerámicos y limpieza profunda de interiores con productos premium.",
    services: [
      { name: 'Lavado Premium (Exterior/Interior)', price: 350 },
      { name: 'Detallado de Interiores (Deep Clean)', price: 1200 },
      { name: 'Encerado Alta Brillo', price: 850 },
      { name: 'Limpieza de Motor a vapor', price: 600 },
      { name: 'Recubrimiento Cerámico (Ceramic Pro)', price: 4500 },
      { name: 'Pulido de Faros', price: 500 },
    ],
    portfolio: [
      { image: '/assets/carwash_portfolio_1.png', title: 'Acabado Espejo en Negro' },
      { image: '/assets/carwash_portfolio_2.png', title: 'Detallado de Tablero y Piel' },
    ],
    reviewData: [
      { user: 'Sofía L.', rating: 5, comment: 'Mi auto quedó como nuevo. La atención al detalle en el interior es impresionante, no dejaron ni una mota de polvo.', date: '25 Mar 2026', photo: '/assets/carwash_review_1.png' },
      { user: 'Marcos R.', rating: 5, comment: 'Puntualidad y profesionalismo. El acabado del pulido es increíble. Recomendado 100%.', date: '20 Mar 2026', photo: '/assets/carwash_review_1.png' },
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
