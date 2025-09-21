import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase values
const supabaseUrl = 'https://mcmfmuiyycuozulrxyam.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbWZtdWl5eWN1b3p1bHJ4eWFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0MzI1MzMsImV4cCI6MjA3NDAwODUzM30.nKTr5jJe9Ea5qGyT6RM4Ukh43vFRHNxSMwNCpzSD43M'

export const supabase = createClient(supabaseUrl, supabaseKey)
