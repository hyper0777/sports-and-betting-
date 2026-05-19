/*
  # Revoke Anon Role Access to SECURITY DEFINER Functions

  1. Security Issue: Anon users can execute SECURITY DEFINER functions
     - These functions execute with elevated privileges (postgres role)
     - This is a critical privilege escalation vulnerability
     - Solution: Revoke EXECUTE permission from anon role
     
  2. Functions affected:
     - admin_create_api_key
     - admin_revoke_api_key
     - rls_auto_enable
*/

-- Revoke EXECUTE from anon role on all three functions
REVOKE EXECUTE ON FUNCTION public.admin_create_api_key(text, text, text, text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.admin_revoke_api_key(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon;

-- Ensure these functions can only be called by postgres/superuser
-- (Not by any application role: anon, authenticated, etc)
