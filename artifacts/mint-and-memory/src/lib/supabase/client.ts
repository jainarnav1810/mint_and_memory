import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://apekkgqzdyxxgmxwpngp.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwZWtrZ3F6ZHl4eGdteHdwbmdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4MDM2NDAsImV4cCI6MjEwMjM3OTY0MH0.64P9alni3joPKWuRq6ji064UCbTDo2ZZSQ82p3pE6KE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
