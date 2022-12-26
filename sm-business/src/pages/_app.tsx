import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react';
import { ChakraProvider, Flex } from '@chakra-ui/react';

import { theme } from '../styles/theme';
import '../styles/global.css';

export default function App({ 
  Component, 
  pageProps: { session, ...pageProps },
}: AppProps) {
  
  return (
    <ChakraProvider theme={theme}>
      <Flex
        flex="1"
        height="100vh"
        width="100vw"
        direction="column"        
      >
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      </Flex>
    </ChakraProvider>
  )
}
