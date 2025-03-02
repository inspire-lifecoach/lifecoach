
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bizyqxovwmvrvhpijvkw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpenlxeG92d212cnZocGlqdmt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4ODEyODIsImV4cCI6MjA1NjQ1NzI4Mn0.AzUNx_tRDLEptrL3EKnhwiGoXTUdcp5cn0YLZCgxLhQ";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
