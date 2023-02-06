import { extendTheme, StyleFunctionProps, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: true,  
};

export const theme = extendTheme({ 
  config, 
  styles: {
    global: (props: StyleFunctionProps) => ({
      'html, body': {
        backgroundColor: props.colorMode === 'dark' ? 'gray.900' : 'gray.50'
      }
    })
  }
});
