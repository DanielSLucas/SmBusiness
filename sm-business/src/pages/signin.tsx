import { Button, Flex, Heading } from "@chakra-ui/react";
import { signIn } from "next-auth/react";

export default function SignIn() {   
  return (
    <Flex
      flex="1"
      justifyContent="center"
      alignItems="center"
    >
      <Flex direction="column" alignItems="center">
        <Heading>Login</Heading>
        <Button onClick={() => signIn('google')} colorScheme="orange" mt="4">
          With Google
        </Button>
      </Flex>
    </Flex>
  )
}
