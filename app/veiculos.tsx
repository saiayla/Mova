import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Importa a função do script (assumindo que está um nível acima, na raiz)
import { BASE_URL, excluirVeiculo } from "./script";

// Define o tipo do Veículo
type Veiculo = {
  id_veiculo: number;
  placa: string;
  modelo: string;
  cor: string;
  passageiros_maximos: number;
  chassi: string;
};

export default function VeiculosScreen() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ATENÇÃO: 'localhost' não funciona em emuladores/dispositivos.
  // Use 10.0.2.2 para o emulador Android ou o IP da sua máquina.
  //   const BASE_URL = "http://10.0.2.2:3000";

  useEffect(() => {
    async function fetchVeiculos() {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Erro", "Usuário não autenticado.");
          router.replace("/login"); // Use replace para login
          return;
        }

        const response = await fetch(`${BASE_URL}/veiculo`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const msg = await response.json(); // Tente .json() primeiro
          throw new Error(msg.message || "Erro ao buscar veículos");
        }

        const data = await response.json();
        setVeiculos(data);
      } catch (error) {
        console.error("Erro ao buscar veículos:", error);
        Alert.alert(
          "Erro",
          (error as Error).message || "Não foi possível carregar os veículos."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchVeiculos();
  }, []); // O array vazio [] garante que rode uma vez

  // Função corrigida para confirmar e atualizar o estado
  const handleExcluir = async (id: number) => {
    Alert.alert(
      "Excluir Veículo",
      "Tem certeza que quer excluir este veículo?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            // Passa o setVeiculos para o script poder atualizar a lista
            await excluirVeiculo(id, setVeiculos);
          },
        },
      ]
    );
  };

  // Tela de Loading
  if (loading) {
    return (
      <LinearGradient
        colors={["#1974F3", "#85E0FA"]}
        style={{ flex: 1 }} // style={styles.gradientBackground}
      >
        <SafeAreaView
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingTop: Platform.OS === "android" ? 25 : 0,
          }} // style={styles.safeArea + loading}
        >
          <ActivityIndicator size="large" color="#FFFFFF" />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Tela Principal
  return (
    <LinearGradient
      colors={["#1974F3", "#85E0FA"]}
      style={{ flex: 1 }} // style={styles.gradientBackground}
    >
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: Platform.OS === "android" ? 25 : 0,
        }} // style={styles.safeArea}
      >
        <StatusBar barStyle="light-content" />

        {/* Botão de Voltar */}
        <TouchableOpacity
          onPress={() => router.replace("/motoristaConfig")}
          style={{
            position: "absolute",
            top: Platform.OS === "android" ? 35 : 10,
            left: 20,
            zIndex: 1,
          }} // style={styles.backButton}
        >
          <Ionicons name="arrow-back-circle" size={40} color="white" />
        </TouchableOpacity>

        {/* Container Principal */}
        <View
          style={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 60,
          }} // style={styles.scrollContainer}
        >
          {/* Card Branco */}
          <View
            style={{
              width: "90%",
              backgroundColor: "#FFFFFF",
              borderRadius: 20,
              padding: 25,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 10,
              elevation: 10,
            }} // style={styles.formContainer}
          >
            {/* Título */}
            <Text
              style={{
                fontSize: 26,
                fontWeight: "bold",
                color: "#333",
                marginBottom: 25,
              }} // style={styles.dashboardTitle}
            >
              Meus Veículos
            </Text>

            {veiculos.length === 0 ? (
              <Text
                style={{
                  fontSize: 16,
                  color: "#555",
                  textAlign: "center",
                  marginTop: 20, // Adicionado para espaçamento
                }} // style={styles.dashboardSubtitle}
              >
                Nenhum veículo cadastrado.
              </Text>
            ) : (
              <FlatList
                data={veiculos}
                keyExtractor={(item) =>
                  item.id_veiculo?.toString() || item.placa
                }
                style={{ width: "100%", maxHeight: "70%" }} // Limita a altura da lista
                renderItem={({ item }) => (
                  // Card do Veículo
                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "#F7F8FA",
                      paddingHorizontal: 15,
                      paddingVertical: 18,
                      borderRadius: 10,
                      marginBottom: 10,
                    }} // style={[styles.dashboardButton, localStyles.vehicleCard]}
                  >
                    <Ionicons
                      name="car-sport-outline"
                      size={24}
                      style={{ marginRight: 15, color: "#1F7AF3" }} // style={styles.dashboardButtonIcon}
                    />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          color: "#333",
                        }} // style={localStyles.vehiclePlaca}
                      >
                        {item.placa}
                      </Text>
                      <Text
                        style={{ fontSize: 13, color: "#555" }} // style={localStyles.vehicleModel}
                      >
                        {item.modelo} - {item.cor} ({item.passageiros_maximos}{" "}
                        lugares)
                      </Text>
                    </View>
                    {/* Botão de Excluir */}
                    <TouchableOpacity
                      style={{ padding: 5, marginLeft: 10 }} // style={localStyles.deleteButton}
                      onPress={() => handleExcluir(item.id_veiculo)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={22}
                        color="#D94343"
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
            )}

            {/* Botão de Novo Veículo */}
            <TouchableOpacity
              style={{
                width: "100%",
                height: 50,
                backgroundColor: "#1F7AF3",
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
                shadowColor: "#1F7AF3",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
                elevation: 6,
              }} // style={[styles.loginButton, { marginTop: 20 }]}
              onPress={() => router.push("/registroVeiculo")}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontWeight: "bold",
                  fontSize: 16,
                }} // style={styles.buttonText}
              >
                Adicionar Novo Veículo
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
