
export enum Platform {
  WHATSAPP = 'WhatsApp',
  INSTAGRAM = 'Instagram',
  FACEBOOK = 'Facebook',
  TELEGRAM = 'Telegram',
  EMAIL = 'Email',
  SMS = 'SMS'
}

export enum Sentiment {
  POSITIVE = 'Positive',
  NEUTRAL = 'Neutral',
  NEGATIVE = 'Negative',
  URGENT = 'Urgent',
  SPONSOR = 'Sponsor',
  VIP = 'VIP'
}

export interface Usage {
  conversations: number;
  images: number;
  videos: number;
  lastUpdated: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  tierId: 'starter' | 'pro' | 'enterprise';
  usage: Usage;
}

export interface BusinessOrder {
  id: string;
  items: string[];
  total: number;
  status: 'pending' | 'shipped' | 'delivered';
  timestamp: Date;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  platform: Platform;
  content: string;
  timestamp: Date;
  sentiment: Sentiment;
  isAiResponse: boolean;
  mediaUrl?: string;
  mediaType?: 'image' | 'audio' | 'video';
  actionTaken?: string; 
}

// Added isSponsor property to resolve "Object literal may only specify known properties" error in mockData.ts
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastPlatform: Platform;
  totalConversations: number;
  tags: string[];
  lastInteraction: Date;
  ltv: number;
  isSponsor?: boolean;
}

export interface PricingTier {
  id: 'starter' | 'pro' | 'enterprise';
  name: string;
  price: number;
  features: string[];
  limitPlatforms: number;
  limitConversations: number;
  limitCreative: number;
  hasAdvancedAI: boolean;
}

export interface AnalyticsData {
  date: string;
  conversations: number;
  conversions: number;
  revenue: number;
  hoursSaved: number;
}

export interface FlowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition';
  label: string;
  position: { x: number; y: number };
}
