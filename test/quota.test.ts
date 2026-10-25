import { describe, expect, it } from 'vitest';
import {
  getInitialUsage,
  getRemaining,
  getUsagePercentage,
  incrementUsage,
  isWithinLimits,
  shouldResetMonthly,
} from '../src/lib/quota';
import type { PricingTier } from '../types';

const tier = (conversations: number, creative: number): PricingTier => ({
  id: 'starter',
  name: 'Starter',
  price: 0,
  features: [],
  limitPlatforms: 1,
  limitConversations: conversations,
  limitCreative: creative,
  hasAdvancedAI: false,
});

const usage = (conversations: number, creative: number, lastReset = '2026-10-01T00:00:00.000Z') => ({
  conversations,
  creative,
  lastReset,
});

describe('month rollover', () => {
  it('does not reset within the same month', () => {
    const now = new Date(2026, 9, 20); // 20 Oct 2026
    expect(shouldResetMonthly('2026-10-01T00:00:00.000Z', now)).toBe(false);
  });

  it('resets when the stored month is earlier in the same year', () => {
    const now = new Date(2026, 9, 2);
    expect(shouldResetMonthly('2026-09-01T00:00:00.000Z', now)).toBe(true);
  });

  it('resets when the stored year is earlier', () => {
    const now = new Date(2026, 0, 2);
    expect(shouldResetMonthly('2025-12-01T00:00:00.000Z', now)).toBe(true);
  });

  it('treats unparseable state as stale', () => {
    expect(shouldResetMonthly('not-a-date', new Date(2026, 9, 2))).toBe(true);
  });
});

describe('incrementUsage', () => {
  it('adds one to the conversation counter', () => {
    const next = incrementUsage(usage(3, 0), 'conversation');
    expect(next.conversations).toBe(4);
    expect(next.creative).toBe(0);
  });

  it('adds one to the creative counter', () => {
    const next = incrementUsage(usage(0, 2), 'creative');
    expect(next.creative).toBe(3);
    expect(next.conversations).toBe(0);
  });

  it('still counts the action that triggers a monthly rollover', () => {
    // Regression: the store used to reset and return without incrementing, so
    // the first generation of every month was silently free and uncounted.
    const stale = usage(40, 12, '2026-09-01T00:00:00.000Z');
    const next = incrementUsage(stale, 'conversation', new Date(2026, 9, 1));
    expect(next.conversations).toBe(1);
    expect(next.creative).toBe(0);
    expect(next.lastReset).toContain('2026-10');
  });

  it('resets the other counter on rollover too', () => {
    const stale = usage(40, 12, '2026-09-01T00:00:00.000Z');
    const next = incrementUsage(stale, 'creative', new Date(2026, 9, 1));
    expect(next.conversations).toBe(0);
    expect(next.creative).toBe(1);
  });

  it('does not mutate the input object', () => {
    const original = usage(5, 5);
    incrementUsage(original, 'conversation');
    expect(original.conversations).toBe(5);
  });
});

describe('isWithinLimits', () => {
  it('is true while both counters are below their limits', () => {
    expect(isWithinLimits(usage(9, 9), tier(10, 10))).toBe(true);
  });

  it('is false once conversations reach the limit', () => {
    expect(isWithinLimits(usage(10, 0), tier(10, 10))).toBe(false);
  });

  it('is false once creative reaches its limit', () => {
    expect(isWithinLimits(usage(0, 10), tier(10, 10))).toBe(false);
  });

  it('is false when either counter exceeds its limit', () => {
    expect(isWithinLimits(usage(99, 1), tier(10, 10))).toBe(false);
  });
});

describe('getRemaining', () => {
  it('reports the difference to the limit', () => {
    expect(getRemaining(usage(3, 0), 'conversation', tier(10, 5))).toBe(7);
    expect(getRemaining(usage(0, 2), 'creative', tier(10, 5))).toBe(3);
  });

  it('never reports a negative remainder', () => {
    expect(getRemaining(usage(50, 0), 'conversation', tier(10, 5))).toBe(0);
  });
});

describe('getUsagePercentage', () => {
  it('reports the fraction used', () => {
    expect(getUsagePercentage(usage(5, 0), 'conversation', tier(10, 10))).toBe(50);
  });

  it('clamps at 100 when over the limit', () => {
    expect(getUsagePercentage(usage(500, 0), 'conversation', tier(10, 10))).toBe(100);
  });

  it('returns 0 for a zero limit instead of dividing by zero', () => {
    expect(getUsagePercentage(usage(5, 0), 'conversation', tier(0, 10))).toBe(0);
  });

  it('never returns a negative percentage', () => {
    expect(getUsagePercentage(usage(-5, 0), 'conversation', tier(10, 10))).toBe(0);
  });
});

describe('getInitialUsage', () => {
  it('starts both counters at zero', () => {
    const init = getInitialUsage(new Date(2026, 9, 15));
    expect(init.conversations).toBe(0);
    expect(init.creative).toBe(0);
  });

  it('stamps the first day of the given month', () => {
    expect(getInitialUsage(new Date(2026, 9, 15)).lastReset).toContain('2026-10-01');
  });
});
