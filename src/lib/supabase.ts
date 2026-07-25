import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eksgbhvlmlrrsgxqjyqw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrc2diaHZsbWxycnNneHFqeXF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4OTMxNTYsImV4cCI6MjEwMDQ2OTE1Nn0.0y2c5NcKI1lRbvT4E1HF-Hk6mRNyeRQkfE_abFgMPvE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
