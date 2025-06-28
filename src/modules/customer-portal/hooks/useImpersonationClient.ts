import { useSearchParams } from 'react-router-dom'
import { useClientPortalAccounts } from '@/modules/client-portal/hooks/useClientPortalAccounts'

export function useImpersonationClient() {
  const [searchParams] = useSearchParams()
  const clientId = searchParams.get("impersonateClientId")
  
  // Use the hook from client-portal module to get client data
  const { client, loading, error } = useClientPortalAccounts(clientId || undefined)
  
  return {
    client,
    loading,
    error,
    isImpersonating: !!clientId
  }
}