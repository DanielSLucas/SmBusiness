import { Flex, Switch, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { Input, InputProps } from './Input';

interface DateInputProps {
  props: InputProps;
}
 
export const DateInput: React.FC<DateInputProps> = ({ props }) => {
  const [isDateInterval, setIsDateInterval] = useState(false);

  return (
    <>
      {!isDateInterval 
        ? (
          <Input 
            {...props}
            label="Data"
            name="date"
            type="date"            
          />
        )
        : (
          <Flex gap="2" w="100%">
            <Input 
              {...props}
              label="Data inicial"
              name="startDate"
              type="date"
            />
            <Input 
              {...props}
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
    </>
  );
}

