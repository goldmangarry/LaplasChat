import { Box, Flex } from '@chakra-ui/react'
import Sidebar from './components/layout/Sidebar/Sidebar';

function App() {
  return (
    <Flex height="100vh" bg="white">
      <Sidebar />
      <Box as="main" flex={1} p={6}>
        Main Content
      </Box>
    </Flex>
  )
}

export default App
