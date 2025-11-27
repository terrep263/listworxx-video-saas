// Template Library for ListWorxx
// Pre-designed templates with colors, fonts, and style settings

export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  colors: {
    titleBg: string;
    titleText: string;
    itemBg: string;
    itemText: string;
    background: string;
  };
  fonts: {
    titleSize: number;
    itemSize: number;
  };
  style: {
    titlePadding: number;
    itemPadding: number;
  };
}

export const templates: Template[] = [
  {
    id: 'corporate-blue',
    name: 'Corporate Blue',
    category: 'Professional',
    description: 'Clean and professional design for business content',
    colors: {
      titleBg: '#1E3A8A',
      titleText: '#FFFFFF',
      itemBg: '#FFFFFF',
      itemText: '#1F2937',
      background: '#F3F4F6',
    },
    fonts: {
      titleSize: 100,
      itemSize: 60,
    },
    style: {
      titlePadding: 40,
      itemPadding: 40,
    },
  },
  {
    id: 'vibrant-gradient',
    name: 'Vibrant Gradient',
    category: 'Creative',
    description: 'Bold gradients for eye-catching social media content',
    colors: {
      titleBg: '#EC4899',
      titleText: '#FFFFFF',
      itemBg: '#FFFFFF',
      itemText: '#1F2937',
      background: '#FDF2F8',
    },
    fonts: {
      titleSize: 110,
      itemSize: 60,
    },
    style: {
      titlePadding: 45,
      itemPadding: 40,
    },
  },
  {
    id: 'golden-luxury',
    name: 'Golden Luxury',
    category: 'Luxury',
    description: 'Elegant gold and black for premium brands',
    colors: {
      titleBg: '#D4AF37',
      titleText: '#000000',
      itemBg: '#FFFFFF',
      itemText: '#1F2937',
      background: '#1F2937',
    },
    fonts: {
      titleSize: 105,
      itemSize: 60,
    },
    style: {
      titlePadding: 50,
      itemPadding: 40,
    },
  },
  {
    id: 'neon-nights',
    name: 'Neon Nights',
    category: 'Trendy',
    description: 'Modern neon colors perfect for TikTok and Reels',
    colors: {
      titleBg: '#8B5CF6',
      titleText: '#FFFFFF',
      itemBg: '#FFFFFF',
      itemText: '#1F2937',
      background: '#1F2937',
    },
    fonts: {
      titleSize: 115,
      itemSize: 60,
    },
    style: {
      titlePadding: 40,
      itemPadding: 40,
    },
  },
  {
    id: 'calm-wellness',
    name: 'Calm Wellness',
    category: 'Wellness',
    description: 'Soothing pastels for health and wellness content',
    colors: {
      titleBg: '#10B981',
      titleText: '#FFFFFF',
      itemBg: '#FFFFFF',
      itemText: '#1F2937',
      background: '#ECFDF5',
    },
    fonts: {
      titleSize: 95,
      itemSize: 60,
    },
    style: {
      titlePadding: 40,
      itemPadding: 40,
    },
  },
  {
    id: 'real-estate-pro',
    name: 'Real Estate Pro',
    category: 'Real Estate',
    description: 'Professional design for property listings',
    colors: {
      titleBg: '#0F172A',
      titleText: '#FFFFFF',
      itemBg: '#FFFFFF',
      itemText: '#1F2937',
      background: '#E2E8F0',
    },
    fonts: {
      titleSize: 100,
      itemSize: 60,
    },
    style: {
      titlePadding: 45,
      itemPadding: 40,
    },
  },
  {
    id: 'tech-modern',
    name: 'Tech Modern',
    category: 'Technology',
    description: 'Sleek design for tech reviews and tutorials',
    colors: {
      titleBg: '#06B6D4',
      titleText: '#FFFFFF',
      itemBg: '#FFFFFF',
      itemText: '#1F2937',
      background: '#0F172A',
    },
    fonts: {
      titleSize: 105,
      itemSize: 60,
    },
    style: {
      titlePadding: 40,
      itemPadding: 40,
    },
  },
  {
    id: 'food-delicious',
    name: 'Food Delicious',
    category: 'Food',
    description: 'Warm and appetizing for food content',
    colors: {
      titleBg: '#F59E0B',
      titleText: '#FFFFFF',
      itemBg: '#FFFFFF',
      itemText: '#1F2937',
      background: '#FEF3C7',
    },
    fonts: {
      titleSize: 100,
      itemSize: 60,
    },
    style: {
      titlePadding: 40,
      itemPadding: 40,
    },
  },
];

/**
 * Get all unique categories from templates
 */
export function getCategories(): string[] {
  const categories = templates.map((t) => t.category);
  return ['All', ...Array.from(new Set(categories))];
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string): Template | undefined {
  return templates.find((t) => t.id === id);
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: string): Template[] {
  if (category === 'All') {
    return templates;
  }
  return templates.filter((t) => t.category === category);
}
