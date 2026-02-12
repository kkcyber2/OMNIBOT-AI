/**
 * USAGE TRACKING - APP.TSX INTEGRATION EXAMPLE
 * 
 * This file shows complete code snippets ready to be integrated into App.tsx
 * Copy the relevant sections into your components
 */

import React, { useState, useEffect } from 'react';
import { useUsageStore } from './src/store/usageStore';
import { UpgradeLimitModal, UsageBar, UsageHeaderWidget, UsageToast } from './src/components/UsageComponents';
import { PRICING_TIERS } from './constants';
import { PricingTier } from './types';

/**
 * ============================================================================
 * EXAMPLE 1: UnifiedInbox with usage checks
 * ============================================================================
 * 
 * This shows how to add usage limits to the chat component
 */

export const UnifiedInboxExample = () => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [limitExceededType, setLimitExceededType] = useState<'conversation' | 'creative'>('conversation');
  
  // ✅ Get usage data
  const { currentUsage, isWithinLimits } = useUsageStore();
  
  // TODO: Replace with actual user tier from Supabase
  const userTier: PricingTier = PRICING_TIERS[1]; // 'pro' tier for example

  const sendMessage = async (input: string) => {
    // ✅ CHECK LIMITS BEFORE CALLING AI
    if (!isWithinLimits(userTier)) {
      // Find which limit was exceeded
      if (currentUsage.conversations >= userTier.limitConversations) {
        setLimitExceededType('conversation');
      } else if (currentUsage.creative >= userTier.limitCreative) {
        setLimitExceededType('creative');
      }
      setShowUpgradeModal(true);
      return; // Don't proceed with API call
    }

    // Proceed with normal message sending
    // (usage will be tracked automatically in geminiService)
    console.log('Sending message:', input);
  };

  return (
    <div>
      {/* Your chat UI here */}
      
      {/* ✅ Add upgrade modal */}
      <UpgradeLimitModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        typeExceeded={limitExceededType}
        currentLimit={
          limitExceededType === 'conversation'
            ? userTier.limitConversations
            : userTier.limitCreative
        }
        nextTierName="Pro Elite"
        nextTierLimit={limitExceededType === 'conversation' ? 5000 : 50}
      />
    </div>
  );
};

/**
 * ============================================================================
 * EXAMPLE 2: MainLayout Header with usage widget
 * ============================================================================
 * 
 * This shows how to display usage in the header
 */

export const MainLayoutHeaderExample = () => {
  // ✅ Get usage data
  const { currentUsage } = useUsageStore();
  
  // TODO: Replace with actual user tier from Supabase
  const userTier: PricingTier = PRICING_TIERS[1];

  return (
    <header className="h-24 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-10 flex items-center justify-between">
      {/* Left side - logo/menu */}
      <div className="flex items-center gap-4">
        {/* Your logo and menu here */}
      </div>

      {/* Center - search (optional) */}
      <div className="flex-1 flex justify-center px-8">
        {/* Search input here */}
      </div>

      {/* Right side - widgets and user menu */}
      <div className="flex items-center gap-6">
        {/* ✅ Add usage widget - hidden on small screens */}
        <div className="hidden xl:block w-64">
          <UsageHeaderWidget tier={userTier} currentUsage={currentUsage} />
        </div>

        {/* Theme toggle, notifications, user menu, etc */}
        {/* Your existing header items */}
      </div>
    </header>
  );
};

/**
 * ============================================================================
 * EXAMPLE 3: DashboardView with usage stats
 * ============================================================================
 * 
 * This shows how to display usage bars on the dashboard
 */

export const DashboardViewExample = () => {
  // ✅ Get usage data
  const { currentUsage } = useUsageStore();
  
  // TODO: Replace with actual user tier
  const userTier: PricingTier = PRICING_TIERS[1];

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-16">
      <div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-8">
          Your Usage This Month
        </h1>

        {/* ✅ Usage cards with progress bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Conversation usage card */}
          <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6">
              Conversations
            </h3>
            <UsageBar
              type="conversation"
              tier={userTier}
              currentUsage={currentUsage.conversations}
              showLabel={true}
            />
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
              You have{' '}
              <span className="font-bold">
                {Math.max(0, userTier.limitConversations - currentUsage.conversations)}
              </span>{' '}
              conversations left this month
            </p>
          </div>

          {/* Creative usage card */}
          <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6">
              Creative Assets
            </h3>
            <UsageBar
              type="creative"
              tier={userTier}
              currentUsage={currentUsage.creative}
              showLabel={true}
            />
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
              You have{' '}
              <span className="font-bold">
                {Math.max(0, userTier.limitCreative - currentUsage.creative)}
              </span>{' '}
              assets left this month
            </p>
          </div>
        </div>

        {/* Upgrade suggestion if usage is high */}
        {(currentUsage.conversations > userTier.limitConversations * 0.8 ||
          currentUsage.creative > userTier.limitCreative * 0.8) && (
          <div className="mt-8 p-6 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl border border-indigo-200 dark:border-indigo-800">
            <p className="text-sm text-indigo-900 dark:text-indigo-100 font-bold mb-3">
              💡 You're using most of your monthly quota
            </p>
            <p className="text-sm text-indigo-800 dark:text-indigo-200 mb-4">
              Consider upgrading to a higher tier to get more conversations and creative assets.
            </p>
            <a
              href="/billing"
              className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all"
            >
              View Plans
            </a>
          </div>
        )}
      </div>

      {/* Rest of dashboard content */}
    </div>
  );
};

/**
 * ============================================================================
 * EXAMPLE 4: Creative Studio with usage checks
 * ============================================================================
 * 
 * This shows how to add checks before creative operations
 */

export const CreativeStudioExample = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'warning' | 'error'>('success');

  // ✅ Get usage data
  const { currentUsage, isWithinLimits, getRemaining } = useUsageStore();
  
  // TODO: Replace with actual user tier
  const userTier: PricingTier = PRICING_TIERS[1];

  const handleGenerateImage = async () => {
    // ✅ CHECK LIMITS
    if (!isWithinLimits(userTier)) {
      const remaining = getRemaining('creative', userTier);
      setToastMessage(
        remaining === 0
          ? 'You\'ve used all your creative assets for this month. Upgrade your plan to create more.'
          : `Only ${remaining} creative assets remaining.`
      );
      setToastType('error');
      setToastVisible(true);
      setShowUpgradeModal(true);
      return;
    }

    // Proceed with image generation
    setIsGenerating(true);
    try {
      // Call your image generation service
      // (usage will be tracked automatically)
      setToastMessage('✨ Image generated successfully!');
      setToastType('success');
    } catch (error) {
      setToastMessage('Failed to generate image. Please try again.');
      setToastType('error');
    } finally {
      setIsGenerating(false);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3000);
    }
  };

  return (
    <div className="p-10">
      {/* ✅ Show usage bar in creative studio */}
      <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl">
        <UsageBar
          type="creative"
          tier={userTier}
          currentUsage={currentUsage.creative}
          compact={false}
        />
      </div>

      {/* Image generation form */}
      <div className="max-w-2xl">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want to generate..."
          className="w-full p-4 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
          rows={4}
        />
        <button
          onClick={handleGenerateImage}
          disabled={isGenerating || !isWithinLimits(userTier)}
          className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isGenerating ? 'Generating...' : 'Generate Image'}
        </button>
      </div>

      {/* ✅ Show toast notification */}
      <div className="fixed bottom-8 left-8 right-8 md:left-auto md:w-96">
        <UsageToast isVisible={toastVisible} type={toastType} message={toastMessage} />
      </div>

      {/* ✅ Show upgrade modal */}
      <UpgradeLimitModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        typeExceeded="creative"
        currentLimit={userTier.limitCreative}
        nextTierName="Pro Elite"
        nextTierLimit={50}
      />
    </div>
  );
};

/**
 * ============================================================================
 * EXAMPLE 5: Helper function to get user tier from Supabase
 * ============================================================================
 * 
 * Use this when you have real user auth data
 */

export const useUserTier = (userId?: string): PricingTier => {
  const [tier, setTier] = useState<PricingTier>(PRICING_TIERS[0]); // Default to 'starter'

  useEffect(() => {
    if (!userId) return;

    // TODO: Fetch from Supabase
    const fetchUserTier = async () => {
      try {
        // const { data: profile } = await supabase
        //   .from('user_profiles')
        //   .select('billing_tier')
        //   .eq('user_id', userId)
        //   .single();
        
        // const tierId = profile?.billing_tier || 'starter';
        // const userTier = PRICING_TIERS.find(t => t.id === tierId) || PRICING_TIERS[0];
        // setTier(userTier);
      } catch (error) {
        console.error('Failed to fetch user tier:', error);
        setTier(PRICING_TIERS[0]); // Default to starter
      }
    };

    fetchUserTier();
  }, [userId]);

  return tier;
};

/**
 * ============================================================================
 * EXAMPLE 6: Usage stats component for /analytics or /settings page
 * ============================================================================
 */

export const UsageStatsPage = () => {
  const { currentUsage } = useUsageStore();
  const userTier: PricingTier = PRICING_TIERS[1];

  const conversationPercentage =
    (currentUsage.conversations / userTier.limitConversations) * 100;
  const creativePercentage = (currentUsage.creative / userTier.limitCreative) * 100;

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-12">
        Usage & Billing
      </h1>

      {/* Current plan */}
      <div className="mb-12 p-8 bg-gradient-to-r from-indigo-50 to-cyan-50 dark:from-indigo-900/30 dark:to-cyan-900/30 rounded-3xl border border-indigo-200 dark:border-indigo-800">
        <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
          Current Plan
        </p>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
          {userTier.name}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          ${userTier.price}/month
        </p>
        <a
          href="/billing"
          className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700"
        >
          Manage Plan
        </a>
      </div>

      {/* Usage breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Conversations */}
        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">
            Conversations
          </h3>
          <div className="mb-4">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                {currentUsage.conversations} of {userTier.limitConversations}
              </span>
              <span className="text-lg font-black text-slate-900 dark:text-white">
                {Math.round(conversationPercentage)}%
              </span>
            </div>
            <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 transition-all duration-300"
                style={{ width: `${conversationPercentage}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Reset on the 1st of next month
          </p>
        </div>

        {/* Creative assets */}
        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">
            Creative Assets
          </h3>
          <div className="mb-4">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                {currentUsage.creative} of {userTier.limitCreative}
              </span>
              <span className="text-lg font-black text-slate-900 dark:text-white">
                {Math.round(creativePercentage)}%
              </span>
            </div>
            <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-500 transition-all duration-300"
                style={{ width: `${creativePercentage}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Reset on the 1st of next month
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnifiedInboxExample;
