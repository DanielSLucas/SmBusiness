import { Box, Card, CardBody, Flex, Heading, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { toBRL } from "../utils/toBRL";

interface ValueCardProps {
  title: string;
  value: string;
  color: 'green' | 'red' | 'blue';
  icon?: IconType
}

export const ValueCard: React.FC<ValueCardProps> = ({ title, value, color, icon }) => {
  
  const backgroundColor = useColorModeValue(`${color}.100`, `${color}.300`);
  const fontColor = `${color}.700`;

  return (
    <Card bg={backgroundColor} size="sm">
      <CardBody p="4">        
        <Flex alignItems="center" mb="2" justifyContent="space-between">
          <Heading size="md" as="h2">{title}</Heading>
          <Box>
            {icon && <Icon as={icon} color={fontColor}/>}            
          </Box>
        </Flex>
        
        <Text fontWeight="bold" color={fontColor}>
          {toBRL(value)}
        </Text>
      </CardBody>
    </Card>
  );
}

