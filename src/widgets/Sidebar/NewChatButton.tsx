import { Button } from "@chakra-ui/react";
import { Plus } from "lucide-react";

export const NewChatButton = () => {
  return (
    <Button size='md' variant='solid' colorPalette='gray'>
        <Plus size={16} />
        Start new chat
    </Button>
  );
};