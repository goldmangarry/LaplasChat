import { Badge, Flex, Link, Text, VStack } from '@chakra-ui/react';
import { MessageCircle, Image, Video } from 'lucide-react';

const navItems = [
  { name: 'Chat', icon: MessageCircle, active: true },
  { name: 'Image', icon: Image, soon: true },
  { name: 'Video', icon: Video, soon: true },
];

const Navigation = () => {
  return (
    <VStack as="nav" gap={1} align="stretch" width="100%">
      {navItems.map((item) => (
        <Link
          key={item.name}
          href="#"
          _hover={{ textDecoration: 'none' }}
          pointerEvents={item.soon ? 'none' : 'auto'}
        >
          <Flex
            align="center"
            p={2}
            borderRadius="lg"
            bg={item.active ? '#f5f5f5' : 'transparent'}
            _hover={{ bg: '#f5f5f5' }}
            opacity={item.soon ? 0.4 : 1}
            cursor={item.soon ? 'not-allowed' : 'pointer'}
          >
            <item.icon size={16} style={{ marginRight: '12px', color: item.active ? '#24262d' : '#606679' }} />
            <Text fontWeight="400" color={item.active ? '#24262d' : '#606679'}>
              {item.name}
            </Text>
            {item.soon && (
              <Badge ml="auto" colorScheme="pink">
                soon
              </Badge>
            )}
          </Flex>
        </Link>
      ))}
    </VStack>
  );
};

export default Navigation;