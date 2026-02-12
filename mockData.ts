
import { Platform, Sentiment, Message, Customer, AnalyticsData } from './types';

export const INITIAL_CUSTOMERS: Customer[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', phone: '+123456789', lastPlatform: Platform.WHATSAPP, totalConversations: 12, tags: ['VIP', 'Interested'], lastInteraction: new Date(), ltv: 2450 },
  { id: '2', name: 'RedBull Partnerships', email: 'media@redbull.com', phone: '+987654321', lastPlatform: Platform.INSTAGRAM, totalConversations: 5, tags: ['Sponsor', 'Urgent'], lastInteraction: new Date(Date.now() - 3600000), isSponsor: true, ltv: 15000 },
  { id: '3', name: 'Charlie Davis', email: 'charlie@gmail.com', phone: '+1122334455', lastPlatform: Platform.EMAIL, totalConversations: 2, tags: ['Inquiry'], lastInteraction: new Date(Date.now() - 86400000), ltv: 450 },
];

export const INITIAL_MESSAGES: Message[] = [
  { 
    id: 'm1', 
    senderId: '2', 
    senderName: 'RedBull Partnerships', 
    platform: Platform.INSTAGRAM, 
    content: "Hey Sarah! We saw your latest campaign and would love to discuss a $10k sponsorship deal for our next launch. Do you have a media kit?", 
    timestamp: new Date(Date.now() - 10000), 
    sentiment: Sentiment.SPONSOR, 
    isAiResponse: false,
    mediaUrl: 'https://picsum.photos/seed/sponsor/400/300'
  },
  { 
    id: 'm2', 
    senderId: 'ai', 
    senderName: 'OmniBot', 
    platform: Platform.INSTAGRAM, 
    content: "Hello RedBull Team! Sarah would be thrilled. I've automatically prioritized this and notified her directly. Would you like me to send her standard media kit PDF in the meantime?", 
    timestamp: new Date(Date.now() - 5000), 
    sentiment: Sentiment.POSITIVE, 
    isAiResponse: true 
  },
];

export interface ExtendedAnalyticsData extends AnalyticsData {
  whatsapp: number;
  instagram: number;
  email: number;
  other: number;
}

export const MOCK_ANALYTICS: ExtendedAnalyticsData[] = [
  { date: 'Mon', conversations: 120, conversions: 15, revenue: 1500, hoursSaved: 12, whatsapp: 50, instagram: 40, email: 20, other: 10 },
  { date: 'Tue', conversations: 145, conversions: 22, revenue: 2200, hoursSaved: 14, whatsapp: 60, instagram: 45, email: 30, other: 10 },
  { date: 'Wed', conversations: 130, conversions: 18, revenue: 1800, hoursSaved: 11, whatsapp: 55, instagram: 35, email: 25, other: 15 },
  { date: 'Thu', conversations: 190, conversions: 35, revenue: 3500, hoursSaved: 22, whatsapp: 80, instagram: 60, email: 40, other: 10 },
  { date: 'Fri', conversations: 250, conversions: 48, revenue: 4800, hoursSaved: 28, whatsapp: 100, instagram: 80, email: 50, other: 20 },
  { date: 'Sat', conversations: 180, conversions: 30, revenue: 3000, hoursSaved: 20, whatsapp: 70, instagram: 60, email: 40, other: 10 },
  { date: 'Sun', conversations: 150, conversions: 25, revenue: 2500, hoursSaved: 15, whatsapp: 60, instagram: 50, email: 30, other: 10 },
];
