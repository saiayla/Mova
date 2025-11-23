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
import { BASE_URL, excluirVeiculo } from "./script";

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

  useEffect(() => {
    async function fetchVeiculos() {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Erro", "Usuário não autenticado.");
          router.replace("/login");
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
          const msg = await response.json(); 
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
  }, []); 

  const handleExcluir = async (placa: string) => {
    Alert.alert(
      "Excluir Veículo",
      "Tem certeza que quer excluir este veículo?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            await excluirVeiculo(placa, setVeiculos);
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <LinearGradient
        colors={["#1974F3", "#85E0FA"]}
        style={{ flex: 1 }} 
      >
        <SafeAreaView
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingTop: Platform.OS === "android" ? 25 : 0,
          }} 
        >
          <ActivityIndicator size="large" color="#FFFFFF" />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#1974F3", "#85E0FA"]}
      style={{ flex: 1 }} 
    >
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: Platform.OS === "android" ? 25 : 0,
        }} 
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
          }}
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
          }} 
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
            }} 
          >
            {/* Título */}
            <Text
              style={{
                fontSize: 26,
                fontWeight: "bold",
                color: "#333",
                marginBottom: 25,
              }} 
            >
              Meus Veículos
            </Text>

            {veiculos.length === 0 ? (
              <Text
                style={{
                  fontSize: 16,
                  color: "#555",
                  textAlign: "center",
                  marginTop: 20, 
                }} 
              >
                Nenhum veículo cadastrado.
              </Text>
            ) : (
              <FlatList
                data={veiculos}
                keyExtractor={(item) =>
                  item.id_veiculo?.toString() || item.placa
                }
                style={{ width: "100%", maxHeight: "70%" }} 
                renderItem={({ item }) => (
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
                    }} 
                  >
                    <Ionicons
                      name="car-sport-outline"
                      size={24}
                      style={{ marginRight: 15, color: "#1F7AF3" }} 
                    />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          color: "#333",
                        }} 
                      >
                        {item.placa}
                      </Text>
                      <Text
                        style={{ fontSize: 13, color: "#555" }} 
                      >
                        {item.modelo} - {item.cor} ({item.passageiros_maximos}{" "}
                        lugares)
                      </Text>
                    </View>
                    {/* Botão de Excluir */}
                    <TouchableOpacity
                      style={{ padding: 5, marginLeft: 10 }} 
                      onPress={() => handleExcluir(item.placa)}
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
              }} 
              onPress={() => router.push("/registroVeiculo")}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontWeight: "bold",
                  fontSize: 16,
                }} 
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
