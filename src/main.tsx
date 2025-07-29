import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import './index.css'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const system = createSystem(defaultConfig)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={system}>
      <RouterProvider router={router} />
    </ChakraProvider>
  </StrictMode>,
)
