import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
// --- MUDANÇA ---
// Importe o hook 'useSafeAreaInsets'
import { useRouter } from "expo-router"; // <-- MUDANÇA: Adicionado para o botão funcionar
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Pega a altura da tela para o mapa
const { height } = Dimensions.get("window");

export default function HomePassageiro() {
  // --- MUDANÇA ---
  // Pega o valor dos "insets" (área segura, ex: notch)
  const insets = useSafeAreaInsets();
  const router = useRouter(); // <-- MUDANÇA: Adicionado para o botão funcionar

  // Estado para a região do mapa (localização do usuário)
  const [region, setRegion] = useState<Region | undefined>(undefined);

  // Estados para os campos de input
  const [partida, setPartida] = useState("Universidade Vila Velha");
  const [destino, setDestino] = useState("R. Cristóvão Colombo, 479");

  // Efeito para buscar a localização do usuário ao abrir a tela
  useEffect(() => {
    (async () => {
      // 1. Pede permissão para acessar a localização
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permissão negada",
          "Para usar esta funcionalidade, precisamos da sua localização."
        );
        // Define uma localização padrão (Ex: Vila Velha) se a permissão for negada
        setRegion({
          latitude: -20.355,
          longitude: -40.29,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        });
        return;
      }

      // 2. Pega a localização atual
      try {
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced, // Precisão balanceada para performance
        });

        // 3. Define a região do mapa para a localização do usuário
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.04, // Zoom do mapa
          longitudeDelta: 0.04, // Zoom do mapa
        });
      } catch (error) {
        console.error("Erro ao buscar localização: ", error);
        Alert.alert("Erro", "Não foi possível obter sua localização.");
      }
    })();
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  return (
    // --- MUDANÇA ---
    // Removemos a SafeAreaView daqui e usamos um View normal
    // para o mapa ir de ponta a ponta
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* --- O MAPA --- */}
      <MapView
        style={styles.map}
        region={region} // O mapa será focado na região do usuário
        showsUserLocation={true} // Mostra o "ponto azul" da localização
        loadingEnabled={true} // Mostra um indicador de loading
      >
        {/* Você pode adicionar um marcador se quiser, como na imagem */}
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
        <Text style={styles.title}>Area do motorista</Text>

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

        {/* Botão de Buscar */}
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => Alert.alert("Busca", "Buscando Vans...")}
        >
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {/* --- MUDANÇA --- */}
      {/* Botão de Perfil Flutuante */}
      {/* Ele fica DEPOIS do MapView e do bottomSheet, mas antes do fim do container */}
      {/* Usamos o 'insets.top' para ele não ficar embaixo da barra de status */}
      <TouchableOpacity
        style={[styles.profileButton, { top: insets.top + 10 }]}
        onPress={() => router.replace("/motoristaConfig")} // Mude para a rota correta do perfil
      >
        <Ionicons name="person-circle-outline" size={32} color="#333" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Fundo padrão
  },
  map: {
    width: "100%",
    height: height * 0.65, // O mapa ocupa 65% da altura da tela
  },
  bottomSheet: {
    flex: 1, // Ocupa o restante do espaço (35%)
    // height: "35%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 25,
    marginTop: -20, // Puxa o card para cima, sobrepondo o mapa
    // Sombra para destacar o card
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
    position: "relative", // Necessário para a linha pontilhada
    marginBottom: 15,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 6,
    marginBottom: 10, // Espaço entre os inputs
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
    left: 24, // Alinhado com os ícones
    top: 45, // Posição vertical entre os inputs
    height: 30, // Altura da linha
    width: 1,
    borderLeftWidth: 1,
    borderLeftColor: "#999",
    borderStyle: "dashed",
  },
  // Removi o timeButton que estava comentado
  searchButton: {
    backgroundColor: "#007AFF", // Azul (padrão Apple/Google)
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    // --- MUDANÇA ---
    // Adicionei a margem aqui, já que o card não é mais um ScrollView
    marginHorizontal: 20,
    marginBottom: 20,
  },
  searchButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  // --- MUDANÇA ---
  // Estilo para o novo botão de perfil flutuante
  profileButton: {
    position: "absolute",
    left: 20, // <-- ALTERADO DE 'right: 20' PARA 'left: 20'
    width: 50,
    height: 50,
    borderRadius: 25, // Metade do width/height para ser circular
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Sombra para Android
    zIndex: 10, // Garante que ele fique sobre tudo
  },
});
