import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Heading, VStack, SectionList, Text, useToast } from "native-base";

import { HistoryByDayDTO } from "@dtos/HistoryByDayDTO";

import { api } from "@services/axios";
import { AppError } from "@utils/AppError";

import { Loading } from "@components/Loading";
import { HistoryCard } from "@components/HistoryCard";
import { ScreenHeader } from "@components/ScreenHeader";

export function History() {
  const [isLoadHistory, setIsLoadHistory] = useState(true)
  const [exercises, setExercises] = useState<HistoryByDayDTO[]>([]);

  const toast = useToast()

  async function fetchHistory() {
    try {      
      setIsLoadHistory(true)
      const historyResponse = await api.get('/history')
      setExercises(historyResponse.data)

    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível carregar o histórico.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoadHistory(false)
    }
  }

  useFocusEffect(useCallback(() => {
    fetchHistory()
  }, []))
  
  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico"/>

      {isLoadHistory ? (
        <Loading />
      ) : (
          <SectionList 
          sections={exercises}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <HistoryCard data={item} />
          )}
          renderSectionHeader={({ section }) => (
            <Heading color="gray.200" fontSize="md" mt={10} mb={3} fontFamily="heading">
              {section.title}
            </Heading>
          )}
          px={8}
          contentContainerStyle={exercises.length === 0 && { flex: 1, justifyContent: 'center' }}
          ListEmptyComponent={() => (
            <Text color="gray.100" textAlign="center">
              Não há exercícios registrados ainda. {'\n'}
              Vamos fazer exercícios hoje?
            </Text>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </VStack>
  )
}