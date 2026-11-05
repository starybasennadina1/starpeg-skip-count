/**
 * SPACE_COSMOS preset copy with the StarpegSkipCount accent overrides.
 * Rule #11b: the `name` field stays exactly as in preset.ts.
 */
export const theme = {
  name: 'space-cosmos',

  colors: {
    bg: '#10183A',
    bgDeep: '#0A102A',
    bgInk: '#04081A',
    surface: '#1B2656',
    surfaceAlt: '#2B3768',

    primary: '#8EA8FF',
    primaryDeep: '#6C84E8',

    accent: '#FFD166',
    accentDeep: '#F5B942',

    text: '#F2F4FF',
    textSecondary: '#A8B4E0',
    textMuted: '#6E7CB0',

    success: '#7FE0C0',
    warn: '#E58A5C',

    nebulaBlue: '#4169E1',
    nebulaPurple: '#7B2FBE',
    nebulaDeep: '#2B3768',

    border: 'rgba(142,168,255,0.22)',
    borderStrong: 'rgba(142,168,255,0.38)',
    glass: 'rgba(43,55,104,0.55)',
    glassSoft: 'rgba(142,168,255,0.10)',
  },

  gradients: {
    cta: ['#8EA8FF', '#6C84E8'] as const,
    gold: ['#FFD166', '#F5B942'] as const,
    sheet: ['rgba(27,38,86,0.94)', 'rgba(16,24,58,0.99)'] as const,
    board: ['rgba(27,38,86,0.55)', 'rgba(16,24,58,0.40)'] as const,
    rule: ['rgba(255,209,102,0.16)', 'rgba(255,209,102,0.06)'] as const,
    bar: ['#8EA8FF', '#FFD166'] as const,
  },

  /** 6 typographic levels — never a single weight (design rules). */
  type: {
    hero: { fontSize: 38, fontWeight: '800' as const, letterSpacing: 5 },
    title: { fontSize: 26, fontWeight: '800' as const, letterSpacing: 3 },
    section: { fontSize: 20, fontWeight: '800' as const, letterSpacing: 1.5 },
    body: { fontSize: 14, fontWeight: '500' as const, letterSpacing: 0.3 },
    label: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 2 },
    caption: { fontSize: 9.5, fontWeight: '600' as const, letterSpacing: 3 },
  },

  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 36 },

  radius: { sm: 8, md: 12, lg: 18, xl: 24, pill: 999 },

  glow: {
    primary: {
      shadowColor: '#8EA8FF',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.55,
      shadowRadius: 20,
      elevation: 12,
    },
    gold: {
      shadowColor: '#FFD166',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.45,
      shadowRadius: 18,
      elevation: 10,
    },
    soft: {
      shadowColor: '#4169E1',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 6,
    },
  },

  anim: {
    entry: { tension: 50, friction: 9 },
    press: { tension: 300, friction: 12 },
    logo: { tension: 38, friction: 7 },
  },
} as const;

export type Theme = typeof theme;
export default theme;
