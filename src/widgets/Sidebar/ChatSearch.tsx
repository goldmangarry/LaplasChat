import { Input, InputGroup } from "@chakra-ui/react";
import { Search } from "lucide-react";

export const ChatSearch = () => {
  return (
    <InputGroup color='gray.800' startElement={<Search color='gray.800' size={16} />}>
    <Input placeholder="Search for chats..." size='sm' variant='outline' color='gray.800' />
    </InputGroup>
  );
};