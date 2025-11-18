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
import { BASE_URL } from "./script"; // Verifique o caminho

type ViagemPassageiro = {
  id_viagem: number;
  id_checkin: number; // Importante para cancelar
  local_saida: string;
  local_chegada: string;
  horario_partida: string;
  valor_por_km: number;
  km: number;
  valor_total: number;
  placa_veiculo: string;
  modelo: string;
};

export default function ViagensPassageiroScreen() {
  const router = useRouter();
  const [viagens, setViagens] = useState<ViagemPassageiro[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar as viagens
  const carregarViagens = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Erro", "Usuário não autenticado.");
        router.replace("/login");
        return;
      }

      // Usa a rota GET /checkin que retorna as viagens do passageiro
      const response = await fetch(`${BASE_URL}/checkin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao buscar viagens.");
      }

      setViagens(data);
    } catch (error) {
      console.error("Erro ao carregar viagens:", error);
      Alert.alert("Erro", "Não foi possível carregar suas viagens.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarViagens();
  }, []);

  // Função para cancelar Check-in
  const handleCancelarCheckin = async (id_checkin: number) => {
    Alert.alert(
      "Cancelar Viagem",
      "Tem certeza que deseja cancelar sua reserva nesta viagem?",
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim, cancelar",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              // Rota de cancelamento (ajuste conforme seu backend: /checkin/:id/cancelar)
              const response = await fetch(
                `${BASE_URL}/checkin/${id_checkin}/cancelar`,
                {
                  method: "PATCH", // ou DELETE, dependendo do seu backend
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (response.ok) {
                Alert.alert("Sucesso", "Reserva cancelada.");
                carregarViagens(); // Recarrega a lista
              } else {
                Alert.alert("Erro", "Não foi possível cancelar.");
              }
            } catch (error) {
              Alert.alert("Erro", "Falha na conexão.");
            }
          },
        },
      ]
    );
  };

  const formatarData = (dataISO: string) => {
    if (!dataISO) return "--/--/-- --:--";
    const data = new Date(dataISO);
    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit", // Ano com 2 dígitos para economizar espaço
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <LinearGradient colors={["#1974F3", "#85E0FA"]} style={{ flex: 1 }}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#1974F3", "#85E0FA"]} style={{ flex: 1 }}>
      <SafeAreaView
        style={{ flex: 1, paddingTop: Platform.OS === "android" ? 25 : 0 }}
      >
        <StatusBar barStyle="light-content" />

        {/* Botão de Voltar */}
        <TouchableOpacity
          onPress={() => router.back()}
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
            <Text
              style={{
                fontSize: 26,
                fontWeight: "bold",
                color: "#333",
                marginBottom: 20,
              }}
            >
              Minhas Corridas
            </Text>

            {viagens.length === 0 ? (
              <View style={{ alignItems: "center", marginVertical: 30 }}>
                <Ionicons name="car-sport-outline" size={60} color="#ccc" />
                <Text
                  style={{
                    color: "#555",
                    marginTop: 10,
                    textAlign: "center",
                    fontSize: 16,
                  }}
                >
                  Você ainda não tem corridas agendadas.
                </Text>
              </View>
            ) : (
              <FlatList
                data={viagens}
                keyExtractor={(item) => item.id_checkin.toString()}
                style={{ width: "100%" }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View
                    style={{
                      width: "100%",
                      backgroundColor: "#F7F8FA",
                      padding: 15,
                      borderRadius: 12,
                      marginBottom: 15,
                      borderLeftWidth: 5,
                      borderLeftColor: "#1974F3", // Detalhe azul na esquerda
                    }}
                  >
                    {/* Cabeçalho do Card: Carro e Placa */}
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          color: "#333",
                        }}
                      >
                        {item.modelo}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#666",
                          fontWeight: "600",
                        }}
                      >
                        {item.placa_veiculo}
                      </Text>
                    </View>

                    {/* Rota */}
                    <View style={{ marginBottom: 10 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginBottom: 4,
                        }}
                      >
                        <Ionicons
                          name="ellipse-outline"
                          size={12}
                          color="#1974F3"
                          style={{ marginRight: 6 }}
                        />
                        <Text
                          style={{ fontSize: 14, color: "#555" }}
                          numberOfLines={1}
                        >
                          De: {item.local_saida}
                        </Text>
                      </View>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Ionicons
                          name="location"
                          size={12}
                          color="#E11D48"
                          style={{ marginRight: 6 }}
                        />
                        <Text
                          style={{
                            fontSize: 14,
                            color: "#333",
                            fontWeight: "500",
                          }}
                          numberOfLines={1}
                        >
                          Para: {item.local_chegada}
                        </Text>
                      </View>
                    </View>

                    {/* Data e Valor */}
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 5,
                        borderTopWidth: 1,
                        borderTopColor: "#EEE",
                        paddingTop: 10,
                      }}
                    >
                      <View>
                        <Text style={{ fontSize: 12, color: "#888" }}>
                          Data e Hora
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            color: "#333",
                            fontWeight: "600",
                          }}
                        >
                          {formatarData(item.horario_partida)}
                        </Text>
                      </View>
                      <View>
                        <Text
                          style={{
                            fontSize: 12,
                            color: "#888",
                            textAlign: "right",
                          }}
                        >
                          Valor
                        </Text>
                        <Text
                          style={{
                            fontSize: 16,
                            color: "#1974F3",
                            fontWeight: "bold",
                          }}
                        >
                          R$ {item.valor_total?.toFixed(2)}
                        </Text>
                      </View>
                    </View>

                    {/* Botão de Cancelar */}
                    <TouchableOpacity
                      onPress={() => handleCancelarCheckin(item.id_checkin)}
                      style={{
                        marginTop: 15,
                        backgroundColor: "#fff0f0",
                        paddingVertical: 10,
                        borderRadius: 8,
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: "#ffcccc",
                      }}
                    >
                      <Text style={{ color: "#D94343", fontWeight: "600" }}>
                        Cancelar Reserva
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
