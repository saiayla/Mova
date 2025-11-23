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
import { useRouter } from "expo-router"; 
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height } = Dimensions.get("window");

export default function HomePassageiro() {
  const insets = useSafeAreaInsets();
  const router = useRouter(); 

  const [region, setRegion] = useState<Region | undefined>(undefined);
  const [partida, setPartida] = useState("Universidade Vila Velha");
  const [destino, setDestino] = useState("R. Cristóvão Colombo, 479");

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
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* --- O MAPA --- */}
      <MapView
        style={styles.map}
        region={region} 
        showsUserLocation={true} 
        loadingEnabled={true} 
      >
        {/*adicionar um marcador */}
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
        {/* <TouchableOpacity
          style={styles.searchButton}
          onPress={() => Alert.alert("Busca", "Buscando Vans...")}
        >
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity> */}
      </View>

      {/* --- MUDANÇA --- */}
      {/* Botão de Perfil */}
      {/*  DEPOIS do MapView e do bottomSheet, mas antes do fim do container */}
      {/*'insets.top'  */}
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
    backgroundColor: "#fff", 
  },
  map: {
    width: "100%",
    height: height * 0.65, 
  },
  bottomSheet: {
    flex: 1, 
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 25,
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
    paddingVertical: 6,
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
  searchButton: {
    backgroundColor: "#007AFF", 
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 20,
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
