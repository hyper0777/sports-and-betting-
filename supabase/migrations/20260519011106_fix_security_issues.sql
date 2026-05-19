/*
  # Fix Critical Security Issues

  1. Revoke SECURITY DEFINER Function Permissions
    - Revoke EXECUTE from admin and public roles on sensitive functions
    - Functions will only be callable by superuser/postgres role
    
  2. Add RLS Policies
    - `FOOTBALL-API-KEY`: Enable public read-only access (no sensitive data)
    - `api_keys_rapidapi`: Restrict to authenticated users accessing own keys

  3. Fix Function Search Paths
    - Set search_path explicitly for sensitive functions to prevent role-based mutable paths
*/

-- Revoke EXECUTE permissions from public and authenticated roles
REVOKE EXECUTE ON FUNCTION public.admin_create_api_key(text, text, text, text) FROM public, authenticated;
REVOKE EXECUTE ON FUNCTION public.admin_revoke_api_key(uuid) FROM public, authenticated;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM public, authenticated;

-- Fix search_path for SECURITY DEFINER functions
ALTER FUNCTION public.admin_create_api_key(text, text, text, text) SET search_path = public;
ALTER FUNCTION public.admin_revoke_api_key(uuid) SET search_path = public;
ALTER FUNCTION public.rls_auto_enable() SET search_path = public;

-- Add RLS policy for FOOTBALL-API-KEY table (read-only, no sensitive data)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'FOOTBALL-API-KEY' AND policyname = 'Public read access'
  ) THEN
    CREATE POLICY "Public read access"
      ON public."FOOTBALL-API-KEY"
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

-- Add RLS policies for api_keys_rapidapi table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'api_keys_rapidapi' AND policyname = 'Users can view own API keys'
  ) THEN
    CREATE POLICY "Users can view own API keys"
      ON public.api_keys_rapidapi
      FOR SELECT
      TO authenticated
      USING (auth.uid() = created_by);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'api_keys_rapidapi' AND policyname = 'Users can create own API keys'
  ) THEN
    CREATE POLICY "Users can create own API keys"
      ON public.api_keys_rapidapi
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = created_by);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'api_keys_rapidapi' AND policyname = 'Users can update own API keys'
  ) THEN
    CREATE POLICY "Users can update own API keys"
      ON public.api_keys_rapidapi
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = created_by)
      WITH CHECK (auth.uid() = created_by);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'api_keys_rapidapi' AND policyname = 'Users can delete own API keys'
  ) THEN
    CREATE POLICY "Users can delete own API keys"
      ON public.api_keys_rapidapi
      FOR DELETE
      TO authenticated
      USING (auth.uid() = created_by);
  END IF;
END $$;
