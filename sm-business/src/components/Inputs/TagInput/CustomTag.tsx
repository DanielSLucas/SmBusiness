import { Tag, TagLabel, TagCloseButton, Button, Icon } from "@chakra-ui/react";
import { IconType } from "react-icons";

interface CustomTagProps {
  size?: "sm" | "md" | "lg";
  colorScheme?: 'yellow' | 'green' | 'gray';
  tag: {
    name: string;
    selected: boolean;
  };
  labelButton?: boolean;
  onLabelButtonClick?: () => void;
  closeButton?: boolean;
  OnCloseButtonClick?: () => void;
  rightIcon?: IconType;
}

export const CustomTag: React.FC<CustomTagProps> = ({
  size = "md",
  colorScheme = 'gray',
  tag,
  labelButton = false,
  onLabelButtonClick = () => {},
  closeButton = false,
  OnCloseButtonClick = () => {},
  rightIcon,
}) => {
  return (
    <Tag key={tag.name} colorScheme={colorScheme} size={size} _hover={{ filter: 'brightness(1.1)' }}>
      {rightIcon && <Icon as={rightIcon} mr="1" />}
      <TagLabel>
        {labelButton
          ? (
            <Button 
              variant="unstyled" 
              justifyContent="flex-start" 
              size="xs" 
              onClick={onLabelButtonClick}
            >
              {tag.name}
            </Button>
          ) : tag.name
        }        
      </TagLabel>
      {closeButton && <TagCloseButton onClick={OnCloseButtonClick}/>}
    </Tag>
  );
}
