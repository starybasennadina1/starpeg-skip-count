export const SPACE_COSMOS = {
  name: 'space-cosmos',

  colors: {
    bg: {
      primary: '#050510',       // almost black with blue
      secondary: '#0A0A20',
      tertiary: '#10103A',
      accent: '#0A1628',
    },
    space: {
      blue: '#4169E1',         // royal blue
      purple: '#7B2FBE',
      nebula: '#C471ED',
      star: '#FFF8DC',
      comet: '#00CED1',
      mars: '#E8533F',
    },
    text: {
      primary: '#E8E0FF',
      secondary: '#6A6A9A',
      accent: '#C471ED',
      muted: '#3A3A6A',
      star: '#FFF8DC',
    },
    ui: {
      border: '#1A1A4A',
      divider: '#12123A',
      overlay: 'rgba(5, 5, 16, 0.85)',
      glass: 'rgba(10, 10, 32, 0.8)',
    },
  },

  gradients: {
    primary: ['#4169E1', '#7B2FBE'],
    surface: ['#0A0A20', '#10103A'],
    button: ['#7B2FBE', '#C471ED'],
    reward: ['#FFF8DC', '#FFD700'],
    header: ['#050510', '#0A1628'],
    nebula: ['#4169E1', '#7B2FBE', '#C471ED'],
    aurora: ['#00CED1', '#4169E1', '#7B2FBE'],
  },

  typography: {
    hero: { fontSize: 42, fontWeight: '300' as const, letterSpacing: 6 },   // thin, cosmic
    title: { fontSize: 24, fontWeight: '500' as const, letterSpacing: 3 },
    subtitle: { fontSize: 15, fontWeight: '400' as const, letterSpacing: 2 },
    body: { fontSize: 14, fontWeight: '400' as const, letterSpacing: 0.3 },
    caption: { fontSize: 11, fontWeight: '500' as const, letterSpacing: 2 },
    button: { fontSize: 13, fontWeight: '600' as const, letterSpacing: 4, textTransform: 'uppercase' as const },
    score: { fontSize: 36, fontWeight: '600' as const, letterSpacing: 1 },
  },

  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 36, xxl: 56 },

  radius: {
    sm: 6,
    md: 10,
    lg: 16,
    xl: 24,
    pill: 100,
  },

  shadows: {
    card: {
      shadowColor: '#4169E1',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 6,
    },
    button: {
      shadowColor: '#7B2FBE',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 10,
    },
  },

  animation: {
    spring: { tension: 60, friction: 12 },     // smooth, weightless
    bounce: { tension: 80, friction: 10 },
    smooth: { duration: 500 },
    slow: { duration: 1000 },
  },
};

// ============================================================
// WARM_EARTHY — sand/cream/sage/terracotta, for farm/lifestyle/finance/utility
// ============================================================
