import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://krjvsnszudrupipbnaen.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyanZzbnN6dWRydXBpcGJuYWVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4ODQ1NzcsImV4cCI6MjA4MDQ2MDU3N30.KyGghtO8r73ZP5xyQJdjpaPPtJJ-vuDeHpMxS9HBixY';

// Default anonymous client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to create an authenticated client using Clerk JWT
export const createClerkSupabaseClient = (clerkToken: string): SupabaseClient => {
  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${clerkToken}`,
      },
    },
  });
};
