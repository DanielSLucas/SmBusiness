import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react';
import { ChakraProvider, Flex } from '@chakra-ui/react';
import { QueryClientProvider } from 'react-query';

import { queryClient } from '../services/queryClient';
import { theme } from '../styles/theme';
import '../styles/global.css';

export default function App({ 
  Component, 
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <Flex
          flex="1"
          height="100vh"
          width="100vw"
          direction="column"
          overflowX="hidden"        
        >
          <SessionProvider session={session}>
            <Component {...pageProps} />
          </SessionProvider>
        </Flex>
      </ChakraProvider>
    </QueryClientProvider>
  )
}
