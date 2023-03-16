import { View } from 'react-native'
import {useFonts, Roboto_400Regular, Roboto_700Bold} from '@expo-google-fonts/roboto'
import { StatusBar } from 'react-native';
import { NativeBaseProvider } from 'native-base';
import { Loading } from '@components/Loading';

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })

  return (
    <NativeBaseProvider>
      <StatusBar 
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      
      {fontsLoaded ? <View /> : <Loading />}
    </NativeBaseProvider>
  );
}