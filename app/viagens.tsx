import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Text, View } from "react-native";
import { globalStyles as styles } from "./style";

type Viagem = {
  id_viagem: number;
  local_saida: string;
  local_chegada: string;
  horario_partida: string;
  valor_por_km: number;
  vagas_maximas: number;
  placa_veiculo: string;
  modelo: string;
};

export default function MinhasViagens() {
  const [viagens, setViagens] = useState<Viagem[]>([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://172.20.10.4:3000";

  useEffect(() => {
    async function carregarViagens() {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Erro", "Usuário não autenticado.");
          return;
        }

        const response = await fetch(`${BASE_URL}/viagens`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Erro ao buscar viagens");

        setViagens(data);
      } catch (error) {
        console.error("Erro ao carregar viagens:", error);
        Alert.alert("Erro", "Falha ao buscar viagens");
      } finally {
        setLoading(false);
      }
    }

    carregarViagens();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (viagens.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title3}>Nenhuma viagem encontrada</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title3}>Minhas Viagens</Text>

      <FlatList
        data={viagens}
        keyExtractor={(item) => item.id_viagem.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "#F8FAFF",
              padding: 15,
              borderRadius: 15,
              marginVertical: 8,
              borderWidth: 1,
              borderColor: "#E6EEF8",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>{item.modelo} ({item.placa_veiculo})</Text>
            <Text>Origem: {item.local_saida}</Text>
            <Text>Destino: {item.local_chegada}</Text>
            <Text>Partida: {item.horario_partida}</Text>
            <Text>Vagas: {item.vagas_maximas}</Text>
            <Text>Valor/km: R$ {item.valor_por_km.toFixed(2)}</Text>
          </View>
        )}
      />
    </View>
  );
}
