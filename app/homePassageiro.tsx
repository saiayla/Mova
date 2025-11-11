import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage"; // 3. Importado
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BASE_URL } from "./script"; // 4. Caminho corrigido

// Pega a altura da tela para o mapa
const { height } = Dimensions.get("window");

// 5. Definido o tipo Viagem (necessário para a busca)
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

export default function HomePassageiro() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [region, setRegion] = useState<Region | undefined>(undefined);
  const [partida, setPartida] = useState("Universidade Vila Velha");
  const [destino, setDestino] = useState("R. Cristóvão Colombo, 479");

  // 6. Estados de 'loading' e 'vans' adicionados
  const [loading, setLoading] = useState(false);
  const [vans, setVans] = useState<Viagem[]>([]); // Para exibir marcadores no mapa

  // 7. Removido o useEffect do Keyboard.addListener (não é mais necessário)

  // 8. Função de busca CORRIGIDA (baseada na nossa conversa anterior)
  const handleBuscarViagens = async () => {
    if (!partida || !destino) {
      Alert.alert("Erro", "Por favor, preencha a partida e o destino.");
      return;
    }
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Erro", "Você não está logado.");
        router.replace("/login");
        setLoading(false);
        return;
      }

      // 9. Rota corrigida para 'viagens' (plural)
      const response = await fetch(`${BASE_URL}/viagens`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Erro ao buscar viagens.");
      }

      const todasViagens: Viagem[] = await response.json();

      // 10. Lógica de filtro (exemplo simples)
      const partidaLower = partida.toLowerCase();
      const destinoLower = destino.toLowerCase();

      const viagensFiltradas = todasViagens.filter((viagem) => {
        const localSaidaLower = viagem.local_saida.toLowerCase();
        const localChegadaLower = viagem.local_chegada.toLowerCase();
        // Lógica de filtro simples (pode ser melhorada)
        return (
          localSaidaLower.includes(partidaLower) &&
          localChegadaLower.includes(destinoLower)
        );
      });

      if (viagensFiltradas.length === 0) {
        Alert.alert(
          "Nenhuma Viagem",
          "Nenhuma viagem encontrada para essa rota."
        );
      } else {
        // 11. Navega para a tela de resultados com os dados
        router.push({
          pathname: "/viagensResult",
          params: { viagens: JSON.stringify(viagensFiltradas) },
        });
        console.log("viagensFiltradas", viagensFiltradas);
      }
    } catch (err) {
      console.error(err);
      Alert.alert(
        "Erro",
        (err as Error).message || "Não foi possível buscar as viagens."
      );
    } finally {
      setLoading(false);
    }
  };

  // Efeito para buscar a localização do usuário
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão negada",
          "Para usar esta funcionalidade, precisamos da sua localização."
        );
        setRegion({
          latitude: -20.355,
          longitude: -40.29,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        });
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        });
      } catch (error) {
        console.error("Erro ao buscar localização: ", error);
        Alert.alert("Erro", "Não foi possível obter sua localização.");
      }
    })();
  }, []);

  return (
    // 12. KeyboardAvoidingView CORRIGIDO (como estava na versão anterior)
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      //   keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -StatusBar.currentHeight}
    >
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />

        {/* --- O MAPA --- */}
        <MapView
          style={styles.map}
          region={region}
          showsUserLocation
          loadingEnabled
        >
          {region && (
            <Marker
              coordinate={{
                latitude: region.latitude,
                longitude: region.longitude,
              }}
              title="Sua Localização"
            />
          )}
          {/* TODO: Mapear as 'vans' (viagensFiltradas) aqui como Markers */}
        </MapView>

        {/* --- CARD INFERIOR --- */}
        {/* 13. Removido { marginBottom: keyboardHeight } */}
        <View style={styles.bottomSheet}>
          {/* 14. Adicionado ScrollView para o teclado funcionar */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.title}>Procure sua Van</Text>
            {/* Container dos Inputs de Localização */}
            <View style={styles.locationInputContainer}>
              {/* Linha de "Partida" */}
              <View style={styles.inputRow}>
                <Ionicons
                  name="radio-button-off"
                  size={20}
                  color="#555"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  value={partida}
                  onChangeText={setPartida}
                  placeholder="Local de partida"
                  placeholderTextColor="#888"
                />
              </View>

              {/* Linha pontilhada de conexão */}
              <View style={styles.connectorLine} />

              {/* Linha de "Destino" */}
              <View style={styles.inputRow}>
                <Ionicons
                  name="location-sharp"
                  size={20}
                  color="#555"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  value={destino}
                  onChangeText={setDestino}
                  placeholder="Local de destino"
                  placeholderTextColor="#888"
                />
              </View>
            </View>
            Botão de Horário (Exemplo)
            {/* <TouchableOpacity style={styles.timeButton}>
              <Ionicons
                name="time-outline"
                size={20}
                color="#333"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.timeButtonText}>Leave Now</Text>
              <Ionicons
                name="chevron-down"
                size={16}
                color="#333"
                style={{ marginLeft: 5 }}
              />
            </TouchableOpacity> */}
            {/* Botão de Buscar */}
            <TouchableOpacity
              style={styles.searchButton}
              // 15. onPress corrigido e loading adicionado
              onPress={handleBuscarViagens}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.searchButtonText}>Buscar</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Botão de Perfil Flutuante */}
        <TouchableOpacity
          style={[styles.profileButton, { top: insets.top + 10 }]}
          onPress={() => router.push("/passageiroConfig")} // Mude para a rota correta do perfil
        >
          <Ionicons name="person-circle-outline" size={32} color="#333" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// OS ESTILOS PERMANECEM OS MESMOS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    width: "100%",
    height: height * 0.65,
  },
  bottomSheet: {
    // flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 25,
    marginTop: -20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  locationInputContainer: {
    position: "relative",
    marginBottom: 15,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  connectorLine: {
    position: "absolute",
    left: 24,
    top: 45,
    height: 30,
    width: 1,
    borderLeftWidth: 1,
    borderLeftColor: "#999",
    borderStyle: "dashed",
  },
  timeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  timeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  searchButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  searchButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  profileButton: {
    position: "absolute",
    left: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
});
