import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { globalStyles as styles } from './style';

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.Button} onPress={() => router.push('/veiculos')}>
        <Text style={{ color: '#fff', fontSize: 18 }}>Veículos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.Button} onPress={() => router.push('/criarViagem')}>
        <Text style={{ color: '#fff', fontSize: 18 }}>Viagens</Text>
      </TouchableOpacity>
    </View>
  );
}
