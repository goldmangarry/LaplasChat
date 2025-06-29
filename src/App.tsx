import { Box, Grid } from '@chakra-ui/react'
import { Sidebar } from './components/layout'

function App() {
  return (
    <Grid 
      templateColumns="300px 1fr" 
      height="100vh" 
      bg="white"
    >
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <Box bg="white">
        Main Content
      </Box>
    </Grid>
  )
}

export default App
