import { Button, Icon } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";

interface NewMovementButtonProps {
  onClick: () => void;
}

export const NewMovementButton: React.FC<NewMovementButtonProps> = ({ onClick }) => {  
  return (
    <Button 
      colorScheme="yellow"
      size="sm"
      position="absolute"
      zIndex={2}
      right={1}
      top={1}
      onClick={onClick} 
    >
      <Icon as={FiPlus} fontWeight="bold"/>
    </Button>
  );
}
