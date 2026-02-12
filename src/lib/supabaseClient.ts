import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not set. Auth and database features will not work.');
  console.warn('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
}

export const supabase = createClient(
  supabaseUrl || 'https://eqvqlcbrnawdfoijrmne.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxdnFsY2JybmF3ZGZvaWpybW5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NzM2NTMsImV4cCI6MjA4NjE0OTY1M30.B1OJToySsAtIr7M6UT6Bqy8eiTcU9B7jSyrM-hrZg8Q'
);
