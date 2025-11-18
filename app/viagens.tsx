import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
import { BASE_URL } from "./script";

// ... (Restante do seu código e tipos Viagem) ...
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

export default function MinhasViagensScreen() {
  const [viagens, setViagens] = useState<Viagem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ... (função carregarViagens e formatarData existentes) ...

  useEffect(() => {
    async function carregarViagens() {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Erro", "Usuário não autenticado.");
          router.replace("/login");
          return;
        }

        // Requisição GET /viagens (lista todas as viagens, o filtro de motorista deve estar no backend)
        const response = await fetch(`${BASE_URL}/viagens`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Erro ao buscar viagens");

        setViagens(data);
      } catch (error) {
        console.error("Erro ao carregar viagens:", error);
        Alert.alert(
          "Erro",
          (error as Error).message || "Falha ao buscar viagens"
        );
      } finally {
        setLoading(false);
      }
    }

    carregarViagens();
  }, []);

  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO);
    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // NOVO: Função para navegar para a tela de detalhes
  const handleVisualizarDetalhes = (id_viagem: number) => {
    // Navega para a nova tela de detalhes, passando o ID da viagem
    router.replace({
      pathname: "/viagemDetalhesMotorista", // Ajuste este caminho de rota se necessário
      params: { id_viagem: id_viagem.toString() },
    });
  };

  // ... (Tela de Loading) ...
  if (loading) {
    return (
      <LinearGradient colors={["#1974F3", "#85E0FA"]} style={{ flex: 1 }}>
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

  // Tela Principal
  return (
    <LinearGradient colors={["#1974F3", "#85E0FA"]} style={{ flex: 1 }}>
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: Platform.OS === "android" ? 25 : 0,
        }}
      >
        <StatusBar barStyle="light-content" />

        {/* Botão de Voltar Padronizado */}
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
            paddingHorizontal: "5%",
          }}
        >
          {/* Card Branco Flutuante */}
          <View
            style={{
              width: "100%",
              backgroundColor: "#FFFFFF",
              borderRadius: 20,
              padding: 25,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 10,
              elevation: 10,
              maxHeight: "95%",
            }}
          >
            {/* Título */}
            <Text
              style={{
                fontSize: 28,
                fontWeight: "bold",
                color: "#333",
                marginBottom: 25,
              }}
            >
              Minhas Viagens
            </Text>

            {viagens.length === 0 ? (
              // Mensagem de "Nenhuma viagem"
              <Text
                style={{
                  fontSize: 16,
                  color: "#555",
                  textAlign: "center",
                  marginTop: 20,
                  marginBottom: 20,
                }}
              >
                Nenhuma viagem encontrada.
              </Text>
            ) : (
              // Lista de Viagens
              <FlatList
                data={viagens}
                keyExtractor={(item) => item.id_viagem.toString()}
                style={{ width: "100%" }}
                renderItem={({ item }) => (
                  // ALTERADO: Tornar o item clicável
                  <TouchableOpacity
                    onPress={() => handleVisualizarDetalhes(item.id_viagem)}
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
                      name="map-outline"
                      size={24}
                      style={{ marginRight: 15, color: "#1F7AF3" }}
                    />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          color: "#333",
                          marginBottom: 4,
                        }}
                      >
                        {item.modelo} ({item.placa_veiculo})
                      </Text>
                      <Text style={{ fontSize: 13, color: "#555" }}>
                        De: {item.local_saida}
                      </Text>
                      <Text style={{ fontSize: 13, color: "#555" }}>
                        Para: {item.local_chegada}
                      </Text>
                      <Text style={{ fontSize: 13, color: "#555" }}>
                        Partida: {formatarData(item.horario_partida)}
                      </Text>
                      <Text style={{ fontSize: 13, color: "#555" }}>
                        Vagas: {item.vagas_maximas} | Valor/km: R${" "}
                        {item.valor_por_km?.toFixed(2)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}

            {/* --- BOTÃO CADASTRO --- */}
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
              onPress={() => router.push("/criarViagem")}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                Cadastrar Nova Viagem
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
