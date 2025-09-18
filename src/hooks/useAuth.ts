import { useSession } from "next-auth/react"

export function useAuth() {
  const { data: session, status } = useSession()

  return {
    user: session?.user,
    accessToken: session?.accessToken,
    expires: session?.expires,
    isAuthenticated: !!session?.user,
    isLoading: status === "loading",
  }
}

export function useToken() {
  const { accessToken } = useAuth()
  
  return {
    token: accessToken,
    authorizationHeader: accessToken 
      ? `Bearer ${accessToken}` 
      : null,
  }
}
