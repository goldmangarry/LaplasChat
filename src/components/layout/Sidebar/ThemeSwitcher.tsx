import { Button, Flex } from '@chakra-ui/react';
import { useState } from 'react';

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState('dark');

  return (
    <Flex bg="gray.200" borderRadius="lg" p="2px" width="100%">
      <Button
        onClick={() => setTheme('light')}
        variant={theme === 'light' ? 'solid' : 'ghost'}
        colorScheme={theme === 'light' ? 'gray' : undefined}
        bg={theme === 'light' ? 'white' : 'transparent'}
        color={theme === 'light' ? 'black' : 'gray.500'}
        width="50%"
        size="sm"
      >
        Light
      </Button>
      <Button
        onClick={() => setTheme('dark')}
        variant={theme === 'dark' ? 'solid' : 'ghost'}
        colorScheme={theme === 'dark' ? 'gray' : undefined}
        bg={theme === 'dark' ? 'white' : 'transparent'}
        color={theme === 'dark' ? 'black' : 'gray.500'}
        width="50%"
        size="sm"
      >
        Dark
      </Button>
    </Flex>
  );
};

export default ThemeSwitcher;