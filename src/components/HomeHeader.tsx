import { VStack, HStack, Text, Heading } from "native-base";
import { UserPhoto } from "./UserPhoto";

export function HomeHeader() {
  return (
    <HStack bg="gray.600" pt={16} pb={5} px={8} alignItems="center">
      <UserPhoto 
        source={{ uri: 'http://github.com/exodogurgel.png' }}
        alt="Imagem do usuário"
        size={16}
        mr={4}
      />

      <VStack>
        <Text color="gray.100" fontSize="md">
          olá,
        </Text>

        <Heading color="gray.100" fontSize="md">
          Êxodo
        </Heading>
      </VStack>
    </HStack>
  )
}