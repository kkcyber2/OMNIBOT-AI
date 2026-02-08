
import React from 'react';
import { 
  MessageSquare, 
  Instagram, 
  Facebook, 
  Send, 
  Mail, 
  Smartphone,
  LayoutDashboard,
  Settings,
  Users,
  Zap,
  BarChart3,
  CreditCard,
  Image as ImageIcon,
  Mic,
  Cpu
} from 'lucide-react';
import { Platform, PricingTier } from './types';

export const PLATFORM_CONFIGS = {
  [Platform.WHATSAPP]: { icon: <MessageSquare className="w-5 h-5" />, color: 'bg-green-500', hover: 'hover:bg-green-600' },
  [Platform.INSTAGRAM]: { icon: <Instagram className="w-5 h-5" />, color: 'bg-pink-500', hover: 'hover:bg-pink-600' },
  [Platform.FACEBOOK]: { icon: <Facebook className="w-5 h-5" />, color: 'bg-blue-600', hover: 'hover:bg-blue-700' },
  [Platform.TELEGRAM]: { icon: <Send className="w-5 h-5" />, color: 'bg-sky-500', hover: 'hover:bg-sky-600' },
  [Platform.EMAIL]: { icon: <Mail className="w-5 h-5" />, color: 'bg-slate-700', hover: 'hover:bg-slate-800' },
  [Platform.SMS]: { icon: <Smartphone className="w-5 h-5" />, color: 'bg-indigo-500', hover: 'hover:bg-indigo-600' },
};

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter Node',
    price: 97,
    features: ['2 Platforms', '1,000 Conversations', 'Basic Gemini-3 Flash', 'Standard Dashboard'],
    limitPlatforms: 2,
    limitConversations: 1000,
    limitCreative: 10,
    hasAdvancedAI: false
  },
  {
    id: 'pro',
    name: 'Pro Elite',
    price: 297,
    features: ['All Platforms', '5,000 Conversations', 'Full Sentiment Analysis', 'Neural Image Gen', 'Live Voice Node'],
    limitPlatforms: 6,
    limitConversations: 5000,
    limitCreative: 50,
    hasAdvancedAI: true
  },
  {
    id: 'enterprise',
    name: 'Neural Enterprise',
    price: 997,
    features: ['Unlimited Scale', 'Custom Gemini Fine-tuning', 'White-label Command Center', 'Priority Neural Routing'],
    limitPlatforms: 10,
    limitConversations: 999999,
    limitCreative: 1000,
    hasAdvancedAI: true
  }
];

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'chats', label: 'Neural Inbox', icon: <MessageSquare className="w-5 h-5" /> },
  { id: 'creative', label: 'Asset Lab', icon: <ImageIcon className="w-5 h-5" /> },
  { id: 'live', label: 'Voice Node', icon: <Mic className="w-5 h-5" /> },
  { id: 'automations', label: 'Flow Designer', icon: <Cpu className="w-5 h-5" /> },
  { id: 'analytics', label: 'Strategic Matrix', icon: <BarChart3 className="w-5 h-5" /> },
  { id: 'customers', label: 'Vector CRM', icon: <Users className="w-5 h-5" /> },
  { id: 'settings', label: 'Core Matrix', icon: <Settings className="w-5 h-5" /> },
];
