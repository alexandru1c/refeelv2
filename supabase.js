import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://okyahoemcxyhqtrrbrmf.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9reWFob2VtY3h5aHF0cnJicm1mIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMDIzOTU5MywiZXhwIjoyMDQ1ODE1NTkzfQ.ViWSIBLMaZr2rZRG-vn0LEmCH8Xo7GoohEvJZWCYgEM'; // Replace with your Supabase anon key

export const supabase = createClient(supabaseUrl, supabaseKey);
