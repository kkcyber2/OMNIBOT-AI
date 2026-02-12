import { supabase } from '../lib/supabaseClient';
import type { Message } from '../../types';

export interface DbResponse<T> {
  data: T | null;
  error: Error | null;
}

/**
 * Save a message to the database
 */
export const saveMessage = async (message: Message): Promise<DbResponse<Message>> => {
  try {
    const { data, error } = await supabase.from('messages').insert([
      {
        id: message.id,
        sender_id: message.senderId,
        sender_name: message.senderName,
        platform: message.platform,
        content: message.content,
        timestamp: message.timestamp,
        sentiment: message.sentiment || 'neutral',
      },
    ]).select().single();

    if (error) {
      console.error('[dbService] saveMessage failed:', error.message);
      return { data: null, error };
    }

    console.log('[dbService] Message saved:', message.id);
    return { data: message, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('[dbService] saveMessage exception:', error.message);
    return { data: null, error };
  }
};

/**
 * Get all messages for a customer
 */
export const getMessagesForCustomer = async (customerId: string): Promise<DbResponse<Message[]>> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('sender_id', customerId)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('[dbService] getMessagesForCustomer failed:', error.message);
      return { data: null, error };
    }

    const messages: Message[] = (data || []).map((row: any) => ({
      id: row.id,
      senderId: row.sender_id,
      senderName: row.sender_name,
      platform: row.platform,
      content: row.content,
      timestamp: new Date(row.timestamp),
      sentiment: row.sentiment,
    }));

    console.log(`[dbService] Retrieved ${messages.length} messages for customer ${customerId}`);
    return { data: messages, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('[dbService] getMessagesForCustomer exception:', error.message);
    return { data: null, error };
  }
};

/**
 * Update user usage (conversations, images, etc)
 */
export const updateUsage = async (
  userId: string,
  type: 'conversation' | 'image' | 'video'
): Promise<DbResponse<{ updated: boolean }>> => {
  try {
    const columnMap = {
      conversation: 'conversation_count',
      image: 'image_count',
      video: 'video_count',
    };

    const column = columnMap[type];

    // First, get current usage
    const { data: userData, error: fetchError } = await supabase
      .from('user_usage')
      .select(column)
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 = no rows returned (which is OK for first time)
      console.error('[dbService] updateUsage fetch failed:', fetchError.message);
      return { data: null, error: fetchError };
    }

    const currentCount = userData ? userData[column] || 0 : 0;

    // Update or insert usage record
    const { data, error } = await supabase
      .from('user_usage')
      .upsert(
        {
          user_id: userId,
          [column]: currentCount + 1,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )
      .select()
      .single();

    if (error) {
      console.error('[dbService] updateUsage failed:', error.message);
      return { data: null, error };
    }

    console.log(`[dbService] Updated ${type} usage for user ${userId}`);
    return { data: { updated: true }, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('[dbService] updateUsage exception:', error.message);
    return { data: null, error };
  }
};

/**
 * Save or update a customer profile
 */
export const saveCustomerProfile = async (profile: {
  id: string;
  name: string;
  email: string;
  platform: string;
}): Promise<DbResponse<{ saved: boolean }>> => {
  try {
    const { error } = await supabase.from('customer_profiles').upsert(
      {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        platform: profile.platform,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

    if (error) {
      console.error('[dbService] saveCustomerProfile failed:', error.message);
      return { data: null, error };
    }

    console.log('[dbService] Customer profile saved:', profile.id);
    return { data: { saved: true }, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('[dbService] saveCustomerProfile exception:', error.message);
    return { data: null, error };
  }
};

/**
 * Get customer profile
 */
export const getCustomerProfile = async (customerId: string) => {
  try {
    const { data, error } = await supabase
      .from('customer_profiles')
      .select('*')
      .eq('id', customerId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('[dbService] getCustomerProfile failed:', error.message);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('[dbService] getCustomerProfile exception:', error.message);
    return { data: null, error };
  }
};
