import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://ropeldysyiqopixcrffy.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcGVsZHlzeWlxb3BpeGNyZmZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4Mzc4ODYsImV4cCI6MjA5NjQxMzg4Nn0.ByjdvPzNLr-fawtrm__gSOigd3A5BnG9safovY5S8Dk',
  },
};

export default nextConfig;
