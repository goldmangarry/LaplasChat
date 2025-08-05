import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useUserStore } from '@/core/store/user'
import { Container, Spinner, Text, Stack } from '@chakra-ui/react'

export const Route = createFileRoute('/auth/oauth/callback/google')({
  component: GoogleOAuthCallback,
})

function GoogleOAuthCallback() {
  const navigate = useNavigate()
  const { login } = useUserStore()

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Parse tokens from URL hash
        const hash = window.location.hash.substring(1)
        const params = new URLSearchParams(hash)
        
        const accessToken = params.get('access_token')
        const refreshToken = params.get('refresh_token')
        
        if (!accessToken || !refreshToken) {
          throw new Error('Missing tokens in callback URL')
        }

        // Decode JWT to get user info
        const payload = JSON.parse(atob(accessToken.split('.')[1]))
        
        // Create user object from JWT payload
        const user = {
          id: payload.sub,
          email: payload.email,
          first_name: payload.user_metadata?.first_name || '',
          last_name: payload.user_metadata?.last_name || '',
          avatar_url: payload.user_metadata?.avatar_url || payload.user_metadata?.picture || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        // Login user with tokens
        login(accessToken, refreshToken, user)

        // Clear the hash from URL
        window.history.replaceState(null, '', window.location.pathname)

        // Redirect to main page
        navigate({ to: '/' })
      } catch (error) {
        console.error('OAuth callback failed:', error)
        // Redirect to login with error
        navigate({ 
          to: '/login',
          search: { error: 'oauth_failed' }
        })
      }
    }

    handleOAuthCallback()
  }, [navigate, login])

  return (
    <Container maxW="md" py={{ base: '12', md: '24' }}>
      <Stack gap="4" align="center" textAlign="center">
        <Spinner size="lg" colorScheme="teal" />
        <Text fontSize="lg">Completing sign in...</Text>
        <Text fontSize="sm" color="gray.500">
          Please wait while we finish setting up your account.
        </Text>
      </Stack>
    </Container>
  )
}