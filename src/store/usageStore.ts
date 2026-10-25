import { create } from 'zustand';
import { PricingTier } from '../../types';
import {
  UsageData,
  UsageKind,
  getInitialUsage,
  incrementUsage,
  isWithinLimits as withinLimits,
  getRemaining as remaining,
  getUsagePercentage as usagePercentage,
  shouldResetMonthly,
} from '../lib/quota';

export type { UsageData } from '../lib/quota';

interface UsageStore {
  currentUsage: UsageData;
  increment: (type: UsageKind) => void;
  resetMonthly: () => void;
  isWithinLimits: (tier: PricingTier) => boolean;
  getRemaining: (type: UsageKind, tier: PricingTier) => number;
  getUsagePercentage: (type: UsageKind, tier: PricingTier) => number;
  loadFromStorage: () => void;
  saveToStorage: () => void;
}

const STORAGE_KEY = 'omnibot_usage_data';

export const useUsageStore = create<UsageStore>((set, get) => ({
  currentUsage: getInitialUsage(),

  increment: (type: UsageKind) => {
    // The rollover is handled inside incrementUsage, so the action that starts a
    // new month is still counted instead of being swallowed by the reset.
    set((state) => ({ currentUsage: incrementUsage(state.currentUsage, type) }));
    get().saveToStorage();
  },

  resetMonthly: () => {
    set({ currentUsage: getInitialUsage() });
    get().saveToStorage();
  },

  isWithinLimits: (tier: PricingTier) => withinLimits(get().currentUsage, tier),

  getRemaining: (type: UsageKind, tier: PricingTier) =>
    remaining(get().currentUsage, type, tier),

  getUsagePercentage: (type: UsageKind, tier: PricingTier) =>
    usagePercentage(get().currentUsage, type, tier),

  loadFromStorage: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;
      const usage = JSON.parse(stored) as UsageData;
      if (
        typeof usage?.conversations !== 'number' ||
        typeof usage?.creative !== 'number' ||
        typeof usage?.lastReset !== 'string'
      ) {
        // Corrupt or old-shape data: start clean rather than spread NaN.
        set({ currentUsage: getInitialUsage() });
        return;
      }
      set({
        currentUsage: shouldResetMonthly(usage.lastReset) ? getInitialUsage() : usage,
      });
    } catch (error) {
      console.error('[UsageStore] Failed to load from localStorage:', error);
      set({ currentUsage: getInitialUsage() });
    }
  },

  saveToStorage: () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(get().currentUsage));
    } catch (error) {
      console.error('[UsageStore] Failed to save to localStorage:', error);
    }
  },
}));

useUsageStore.getState().loadFromStorage();
