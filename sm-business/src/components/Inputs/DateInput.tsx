import { Box, Flex, Switch, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { Input, InputProps } from './Input';

interface DateInputProps {
  inputProps: InputProps;
}
 
export const DateInput: React.FC<DateInputProps> = ({ inputProps }) => {
  const [isDateInterval, setIsDateInterval] = useState(false);

  return (
    <Box w="100%">
      {!isDateInterval 
        ? (
          <Input 
            {...inputProps}
            label="Data"
            name="date"
            type="date"
            w="100%"          
          />
        )
        : (
          <Flex gap="2" w="100%">
            <Input 
              {...inputProps}
              label="Data inicial"
              name="startDate"
              type="date"
            />
            <Input 
              {...inputProps}
              label="Data final"
              name="endDate"
              type="date"
            />
          </Flex>
        )
      }

      <Flex alignItems="center" gap="2">
        <Text as="span" fontSize="sm">
          Intervalo de datas
        </Text>
        <Switch
          isChecked={isDateInterval} 
          onChange={(e) => setIsDateInterval(e.target.checked)}
        />
      </Flex>
    </Box>
  );
}

