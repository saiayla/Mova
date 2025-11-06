import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { globalStyles as styles } from './style';

export default function VeiculosCadastrados() {
    type Veiculo = {
        id_veiculo: number;
        placa: string;
        modelo: string;
        cor: string;
        usuario: string;
        passageiros_maximos: number;
        chassi: string;
    };

    const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const BASE_URL = 'http://localhost:3000';

    useEffect(() => {
        async function fetchVeiculos() {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    Alert.alert('Erro', 'Usuário não autenticado.');
                    router.push('/login');
                    return;
                }

                const response = await fetch(`${BASE_URL}/veiculo`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const msg = await response.text();
                    throw new Error(msg || 'Erro ao buscar veículos');
                }

                const data = await response.json();
                setVeiculos(data);
            } catch (error) {
                console.error('Erro ao buscar veículos:', error);
                Alert.alert('Erro', 'Não foi possível carregar os veículos.');
            } finally {
                setLoading(false);
            }
        }

        fetchVeiculos();
    }, []);

    if (loading) return <ActivityIndicator size="large" color="#000" style={{ flex: 1, justifyContent: 'center' }} />;

    return (
        <View style={[styles.container, { paddingTop: 50 }]}>
            <Text style={styles.title3}>Veículos</Text>

            {veiculos.length === 0 ? (
                <Text style={{ marginTop: 20 }}>Nenhum veículo cadastrado.</Text>
            ) : (
                <FlatList
                    data={veiculos}
                    keyExtractor={(item) => item.id_veiculo?.toString() || item.placa}
                    renderItem={({ item }) => (
                        <View style={{
                            backgroundColor: '#f0f0f0',
                            borderRadius: 10,
                            padding: 15,
                            marginVertical: 8,
                            width: '100%',
                        }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.modelo}</Text>
                            <Text>Placa: {item.placa}</Text>
                            <Text>Cor: {item.cor}</Text>
                            <Text>Tipo: {item.usuario}</Text>
                            <Text>Capacidade: {item.passageiros_maximos}</Text>
                            <Text>Chassi: {item.chassi}</Text>
                        </View>
                    )}
                />
            )}

            <TouchableOpacity
                style={[styles.Button, { marginTop: 20, alignItems: 'center' }]}
                onPress={() => router.push('/registroVeiculo')}
            >
                <Text style={styles.buttonText}>Novo Veículo</Text>
            </TouchableOpacity>
        </View>
    );
}
