/**
 * Design Tokens extracted from Figma
 * Agency Website Landing Page Design - Dark Theme (Community)
 * File: 5eCTMXWoQuLmlhm0A7n79P
 * 
 * This file contains all design tokens to ensure pixel-perfect consistency
 * across all components and pages.
 */

// ============================================================================
// COLORS
// ============================================================================

export const colors = {
  // Primary Colors
  primary: {
    yellow: '#FFDF00',        // fill_LKIBVB, fill_CE2G2E, fill_0DF6CH
    yellowHover: '#FFE933',   // Slightly lighter for hover states
    yellowActive: '#E6C900',  // Slightly darker for active states
  },
  
  // Background Colors
  background: {
    dark: '#151515',          // fill_PNF3YZ, fill_9RI08F, fill_4JL3CS
    surface: '#1B1B1B',       // fill_YYN347, fill_9KS6YE
    card: '#1B1B1B',
    blur: 'rgba(21, 21, 21, 0.5)',        // fill_ZPOHCX
    blurLight: 'rgba(21, 21, 21, 0.15)',  // fill_1KWY0I
  },
  
  // Text Colors
  text: {
    primary: '#FFFFFF',       // fill_OQW07F, fill_7106KF, fill_VBK0NX
    secondary: '#818181',     // fill_YKYJ6U, fill_O0NMJN
    dark: '#151515',          // fill_FYT0B2, fill_37Y9B6
    onYellow: '#151515',
  },
  
  // Border Colors
  border: {
    light: '#FFFFFF',
    yellow: '#FFDF00',
    dark: '#1B1B1B',
  },
  
  // Gradient Colors
  gradient: {
    yellow: 'linear-gradient(135deg, #FFDF00 0%, #FFE933 100%)',
    dark: 'linear-gradient(135deg, #151515 0%, #1B1B1B 100%)',
  },
  
  // Company Logos Colors (from Figma companies section)
  brand: {
    livechat: '#FE5000',
    sketch: '#FDB300',
    people: '#0068E5',
    metamask: '#E17726',
    draftbit: '#5A45FF',
    feedly: '#26A943',
    grammarly: '#4CA385',
    hellosign: '#00B3E6',
    jitter: '#FF4876',
    krisp: '#FF7E61',
  },
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const typography = {
  // Font Families
  fontFamily: {
    primary: 'Cabinet Grotesk, Inter, system-ui, sans-serif',
  },
  
  // Font Sizes (from Figma text styles)
  fontSize: {
    // Hero & Section Titles
    hero: '64px',             // style_1TSSKB, style_LJE4P1
    h1: '44px',               // style_G6V8YJ, style_VQJ6Y4, style_IVVLQV, style_KP5B2I, style_CNDOW4
    h2: '31.97px',            // style_YIAJ0M
    h3: '24px',               // style_HJOHL9, style_31KJQF, style_LA53I7
    h4: '20px',               // style_9MXQ71, style_SMCT3Q, style_PK0VIF, style_I3JA41, style_7QO1K2
    h5: '18px',               // style_5NYAUG, style_NY4R57, style_MFQC7X
    body: '16px',             // style_WQ6C35, style_CBMI69, style_2PUDKN
    small: '14px',            // style_YNYQXL
    tiny: '10.88px',          // style_8SKM0O
  },
  
  // Font Weights
  fontWeight: {
    regular: 500,
    medium: 500,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  
  // Line Heights (from Figma text styles)
  lineHeight: {
    hero: '0.9375',           // 93.75% - very tight for impact
    tight: '0.909',           // 90.9% - tight for headings
    snug: '1.24',             // 124%
    base: '1.25',             // 125%
    relaxed: '1.5',           // 150%
    loose: '1.556',           // 155.6%
    veryLoose: '1.8',         // 180% - for testimonials
  },
  
  // Text Transform
  textTransform: {
    uppercase: 'uppercase',
    capitalize: 'capitalize',
    none: 'none',
  },
} as const;

// ============================================================================
// SPACING
// ============================================================================

export const spacing = {
  // Section Padding (vertical)
  section: {
    vertical: '100px',        // Standard section spacing
    verticalSm: '50px',       // Mobile section spacing
  },
  
  // Container Padding (horizontal)
  container: {
    horizontal: '100px',      // Desktop
    horizontalMd: '50px',     // Tablet
    horizontalSm: '24px',     // Mobile
  },
  
  // Component Spacing
  component: {
    xs: '6px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '40px',
    '3xl': '56px',
    '4xl': '72px',
    '5xl': '100px',
  },
  
  // Grid Gaps
  grid: {
    sm: '16px',
    md: '20px',
    lg: '24px',
  },
} as const;

// ============================================================================
// LAYOUT DIMENSIONS
// ============================================================================

export const layout = {
  // Container Max Widths
  container: {
    default: '1240px',        // layout_VIOV6I
    wide: '1340px',           // Creative Process section
    narrow: '882px',          // Hero text content
    companies: '1587px',      // Companies section
  },
  
  // Component Dimensions
  hero: {
    width: '1340px',
    height: '805px',
    imageWidth: '920px',
    imageHeight: '579px',
  },
  
  service: {
    cardWidth: '400px',
    cardHeight: '300px',
    iconSize: '72px',
  },
  
  project: {
    cardWidth: '400px',
    cardHeight: '476px',
    imageHeight: '299px',
  },
  
  resource: {
    cardWidth: '295px',
    cardHeight: '318px',
    imageHeight: '241px',
  },
  
  stats: {
    cardWidth: '295px',
    cardHeight: '138px',
  },
  
  testimonial: {
    starSize: '31px',
    avatarSize: '59px',
  },
  
  header: {
    height: '56px',
  },
} as const;

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const borderRadius = {
  none: '0px',
  xs: '8px',
  sm: '16px',
  md: '24px',
  lg: '40px',
  full: '50px',
  circle: '50%',
  
  // Specific components
  card: '24px',
  button: '8px',
  badge: '50px',
  input: '8px',
  image: '16px',
  imageHero: '0px 40px 40px 0px',    // Top-right, bottom-right rounded
  imageCreative: '40px',              // With bottom-right square
} as const;

// ============================================================================
// SHADOWS
// ============================================================================

export const shadows = {
  // Card Shadow
  card: '0px 8px 100px rgba(88, 112, 120, 0.1)',           // s effect
  
  // Testimonial Shadow
  testimonial: '18.08px 18.08px 54.24px rgba(0, 0, 0, 0.25)',
  
  // Avatar Shadow
  avatar: '0px 0.91px 0.52px rgba(0, 0, 0, 0.15)',
  
  // None
  none: 'none',
} as const;

// ============================================================================
// EFFECTS
// ============================================================================

export const effects = {
  // Backdrop Blur
  blur: {
    sm: 'blur(12px)',
    md: 'blur(24px)',
    lg: 'blur(48px)',
  },
  
  // Transitions
  transition: {
    fast: '150ms ease-in-out',
    base: '200ms ease-in-out',
    slow: '300ms ease-in-out',
  },
  
  // Transforms
  transform: {
    hoverLift: 'translateY(-8px)',
    hoverLiftSm: 'translateY(-4px)',
  },
} as const;

// ============================================================================
// Z-INDEX
// ============================================================================

export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalBackdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
  header: 50,
} as const;

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const breakpoints = {
  xs: '480px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1440px',
} as const;

// ============================================================================
// COMPONENT-SPECIFIC TOKENS
// ============================================================================

export const components = {
  // Buttons
  button: {
    height: {
      sm: '40px',
      md: '56px',
      lg: '64px',
    },
    padding: {
      sm: '12px 24px',
      md: '18px 32px',
      lg: '24px 40px',
    },
  },
  
  // Badges
  badge: {
    height: '30px',
    padding: '6px 18px',
  },
  
  // Navigation
  navigation: {
    linkPadding: '12px',
    gap: '32px',
  },
  
  // Cards
  card: {
    padding: {
      sm: '16px',
      md: '24px',
      lg: '40px',
    },
  },
  
  // Stats
  stats: {
    numberSize: '44px',
    labelSize: '20px',
    borderBottom: '2px solid #FFFFFF',
  },
  
  // Companies Grid
  companies: {
    logoSize: '130px',
    logoPadding: '31.2px 41.6px',
  },
} as const;

// ============================================================================
// ANIMATION KEYFRAMES
// ============================================================================

export const animations = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  slideUp: {
    from: { transform: 'translateY(20px)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
  },
  scaleIn: {
    from: { transform: 'scale(0.95)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
  },
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get responsive spacing value
 */
export const getResponsiveSpacing = (size: keyof typeof spacing.component) => {
  return spacing.component[size];
};

/**
 * Get color with opacity
 */
export const colorWithOpacity = (color: string, opacity: number) => {
  // Convert hex to rgba
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * Get Tailwind class for color
 */
export const getTailwindColor = (colorPath: string) => {
  // Helper to convert our design tokens to Tailwind classes
  const colorMap: Record<string, string> = {
    'primary.yellow': 'bg-[#FFDF00]',
    'background.dark': 'bg-[#151515]',
    'background.surface': 'bg-[#1B1B1B]',
    'text.primary': 'text-white',
    'text.secondary': 'text-[#818181]',
  };
  return colorMap[colorPath] || '';
};

// ============================================================================
// EXPORT ALL
// ============================================================================

export const figmaTokens = {
  colors,
  typography,
  spacing,
  layout,
  borderRadius,
  shadows,
  effects,
  zIndex,
  breakpoints,
  components,
  animations,
} as const;

export default figmaTokens;
