import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { BASE_URL } from "./script";

const { height } = Dimensions.get("window");

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

  // REMOVIDO: const [partida, setPartida] ... (Não é mais necessário para a busca)
  const [destino, setDestino] = useState(""); // Inicia vazio para o usuário digitar

  const [loading, setLoading] = useState(false);
  const [vans, setVans] = useState<Viagem[]>([]);

  const handleBuscarViagens = async () => {
    // 1. Validação: Verifica apenas o destino
    if (!destino) {
      Alert.alert("Atenção", "Por favor, informe para onde você quer ir.");
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

      const response = await fetch(`${BASE_URL}/viagens/todas`, {
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

      // 2. Filtro: Compara apenas o Destino (local_chegada)
      const destinoLower = destino.toLowerCase();

      const viagensFiltradas = todasViagens.filter((viagem) => {
        const localChegadaLower = viagem.local_chegada.toLowerCase();

        // Verifica se o destino digitado está contido no local de chegada da viagem
        return localChegadaLower.includes(destinoLower);
      });

      console.log("viagensFiltradas", viagensFiltradas);

      if (viagensFiltradas.length === 0) {
        Alert.alert(
          "Nenhuma Viagem",
          `Nenhuma viagem encontrada com destino para "${destino}".`
        );
      } else {
        router.replace({
          pathname: "/viagensResult",
          params: { viagens: JSON.stringify(viagensFiltradas) },
        });
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

  // Efeito para buscar a localização do usuário (Mantido para o Mapa)
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
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
      }
    })();
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
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
        </MapView>

        {/* --- CARD INFERIOR --- */}
        <View style={styles.bottomSheet}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.title}>Para onde vamos?</Text>

            <View style={styles.locationInputContainer}>
              {/* REMOVIDO O INPUT DE PARTIDA E A LINHA PONTILHADA */}

              {/* Input Único de Destino */}
              <View style={styles.inputRow}>
                <Ionicons
                  name="search" // Mudei o ícone para lupa para indicar busca
                  size={22}
                  color="#1974F3" // Azul destaque
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  value={destino}
                  onChangeText={setDestino}
                  placeholder="Digite o destino final (ex: Ufes)"
                  placeholderTextColor="#888"
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Botão de Buscar */}
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleBuscarViagens}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.searchButtonText}>Buscar Viagens</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Botão de Perfil Flutuante */}
        <TouchableOpacity
          style={[styles.profileButton, { top: insets.top + 10 }]}
          onPress={() => router.push("/passageiroConfig")}
        >
          <Ionicons name="person-circle-outline" size={32} color="#333" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

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
    flex: 1, // Garante que o fundo branco vá até o fim da tela
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  locationInputContainer: {
    marginBottom: 15,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15, // Aumentei um pouco para ficar mais confortável
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  searchButton: {
    backgroundColor: "#1974F3", // Azul mais vibrante
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    // marginTop: 10,
    // shadowColor: "#1974F3",
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.3,
    // shadowRadius: 5,
    // elevation: 5,
  },
  searchButtonText: {
    color: "white",
    fontSize: 18,
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
