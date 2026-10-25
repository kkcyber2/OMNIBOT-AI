/**
 * Quota arithmetic, kept free of React and localStorage so it can be tested
 * directly. The store is a thin wrapper around these functions.
 */
import type { PricingTier } from '../../types';

export type UsageKind = 'conversation' | 'creative';

export interface UsageData {
  conversations: number;
  creative: number;
  lastReset: string; // ISO date string
}

/** First instant of the current month, as an ISO string. */
export function getFirstDayOfMonth(now: Date = new Date()): string {
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}

/** A fresh usage record for the current month. */
export function getInitialUsage(now: Date = new Date()): UsageData {
  return { conversations: 0, creative: 0, lastReset: getFirstDayOfMonth(now) };
}

/** True when the stored reset date belongs to an earlier month or year. */
export function shouldResetMonthly(lastReset: string, now: Date = new Date()): boolean {
  const last = new Date(lastReset);
  if (Number.isNaN(last.getTime())) return true; // unparseable state is stale
  return last.getFullYear() !== now.getFullYear() || last.getMonth() !== now.getMonth();
}

/** The counter for a given kind. */
export function countFor(usage: UsageData, kind: UsageKind): number {
  return kind === 'conversation' ? usage.conversations : usage.creative;
}

/** The tier limit for a given kind. */
export function limitFor(tier: PricingTier, kind: UsageKind): number {
  return kind === 'conversation' ? tier.limitConversations : tier.limitCreative;
}

/**
 * Add one to the given counter, rolling over to a new month first if needed.
 *
 * The rollover must still count the action that triggered it: resetting and
 * returning without incrementing lost the first generation of every month.
 */
export function incrementUsage(
  usage: UsageData,
  kind: UsageKind,
  now: Date = new Date(),
): UsageData {
  const base = shouldResetMonthly(usage.lastReset, now) ? getInitialUsage(now) : usage;
  return {
    ...base,
    conversations: kind === 'conversation' ? base.conversations + 1 : base.conversations,
    creative: kind === 'creative' ? base.creative + 1 : base.creative,
  };
}

/** Usage of a kind counts against the tier while it is below the limit. */
export function isWithinLimits(usage: UsageData, tier: PricingTier): boolean {
  return usage.conversations < tier.limitConversations && usage.creative < tier.limitCreative;
}

/** Remaining allowance, never negative. */
export function getRemaining(usage: UsageData, kind: UsageKind, tier: PricingTier): number {
  return Math.max(0, limitFor(tier, kind) - countFor(usage, kind));
}

/** Percentage used, clamped to 0..100. A zero limit reports 0. */
export function getUsagePercentage(usage: UsageData, kind: UsageKind, tier: PricingTier): number {
  const limit = limitFor(tier, kind);
  if (limit <= 0) return 0;
  const pct = (countFor(usage, kind) / limit) * 100;
  return Math.min(100, Math.max(0, pct));
}
