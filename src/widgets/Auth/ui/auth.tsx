import { Logo } from '@/shared/ui/Logo'
import {
  AbsoluteCenter,
  Box,
  Button,
  Center,
  Container,
  Field,
  Heading,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react'

export const LoginPage = () => (
  <Container maxW="md" py={{ base: '12', md: '24' }}>
    <Stack gap="8">
      <Center>
        <Box width="148px" height="40px">
        <img
          src="/assets/apilaplas-logo.svg"
          alt="apilaplas"
          width="148"
          height="40"
          style={{ width: '148px', height: '40px' }}
        />
      </Box>
      </Center>
      <Stack gap={{ base: '2', md: '3' }} textAlign="center">
        <Heading size={{ base: '2xl', md: '3xl' }}>Welcome</Heading>
      </Stack>
      <Stack gap="6">
        <Stack gap="5">
          <Field.Root>
            <Field.Label>Email</Field.Label>
            <Input type="email" />
          </Field.Root>
          <Field.Root>
            <Field.Label>Password</Field.Label>
            <Input type="password" />
          </Field.Root>
        </Stack>
        <Stack gap="3">
          <Button size="lg" colorScheme="teal">
            Sign in
          </Button>
        </Stack>
      </Stack>
    </Stack>
  </Container>
)
