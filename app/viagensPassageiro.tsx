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

type ViagemPassageiro = {
  id_viagem: number;
  id_checkin: number; 
  local_saida: string;
  local_chegada: string;
  horario_partida: string;
  valor_por_km: number;
  km: number;
  valor_total: number;
  placa_veiculo: string;
  modelo: string;
  status: string; // ✅ Adicione o status
};

export default function ViagensPassageiroScreen() {
  const router = useRouter();
  const [viagens, setViagens] = useState<ViagemPassageiro[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarViagens = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Erro", "Usuário não autenticado.");
        router.replace("/login");
        return;
      }
      const response = await fetch(`${BASE_URL}/getCheckin`, {
        headers: { Authorization: `Bearer ${token}` },
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
              if (!token) return;

              const response = await fetch(
                `${BASE_URL}/deletarCheckin/check-in/${id_checkin}/cancelar`,
                {
                  method: "PATCH",
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              const data = await response.json();

              if (response.ok) {
                // Atualiza apenas o item cancelado na lista
                setViagens((prev) =>
                  prev.map((v) =>
                    v.id_checkin === id_checkin
                      ? { ...v, status: "cancelado" }
                      : v
                  )
                );
                Alert.alert("Sucesso", data.message || "Reserva cancelada.");
              } else {
                Alert.alert("Erro", data.message || "Não foi possível cancelar.");
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
      year: "2-digit", 
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <LinearGradient colors={["#1974F3", "#85E0FA"]} style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
                <Text style={{ color: "#555", marginTop: 10, textAlign: "center", fontSize: 16 }}>
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
                      borderLeftColor: "#1974F3", 
                    }}
                  >
                    {/* Cabeçalho: Carro e Placa */}
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                      <Text style={{ fontSize: 16, fontWeight: "bold", color: "#333" }}>{item.modelo}</Text>
                      <Text style={{ fontSize: 14, color: "#666", fontWeight: "600" }}>{item.placa_veiculo}</Text>
                    </View>

                    {/* Rota */}
                    <View style={{ marginBottom: 10 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                        <Ionicons name="ellipse-outline" size={12} color="#1974F3" style={{ marginRight: 6 }} />
                        <Text style={{ fontSize: 14, color: "#555" }} numberOfLines={1}>
                          De: {item.local_saida}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Ionicons name="location" size={12} color="#E11D48" style={{ marginRight: 6 }} />
                        <Text style={{ fontSize: 14, color: "#333", fontWeight: "500" }} numberOfLines={1}>
                          Para: {item.local_chegada}
                        </Text>
                      </View>
                    </View>

                    {/* Data, Valor e Status */}
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 5, borderTopWidth: 1, borderTopColor: "#EEE", paddingTop: 10 }}>
                      <View>
                        <Text style={{ fontSize: 12, color: "#888" }}>Data e Hora</Text>
                        <Text style={{ fontSize: 14, color: "#333", fontWeight: "600" }}>
                          {formatarData(item.horario_partida)}
                        </Text>
                      </View>
                      <View style={{ alignItems: "flex-end" }}>
                        <Text style={{ fontSize: 12, color: "#888" }}>Valor</Text>
                        <Text style={{ fontSize: 16, color: "#1974F3", fontWeight: "bold" }}>
                          R$ {item.valor_total?.toFixed(2)}
                        </Text>
                        <Text style={{ fontSize: 12, color: item.status === "cancelado" ? "#D94343" : "#1974F3", fontWeight: "600" }}>
                          {item.status === "cancelado" ? "Cancelado" : "Confirmado"}
                        </Text>
                      </View>
                    </View>

                    {/* Botão de Cancelar */}
                    <TouchableOpacity
                      onPress={() => handleCancelarCheckin(item.id_checkin)}
                      disabled={item.status === "cancelado"}
                      style={{
                        marginTop: 15,
                        backgroundColor: item.status === "cancelado" ? "#f0f0f0" : "#fff0f0",
                        paddingVertical: 10,
                        borderRadius: 8,
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: item.status === "cancelado" ? "#ccc" : "#ffcccc",
                      }}
                    >
                      <Text style={{ color: item.status === "cancelado" ? "#888" : "#D94343", fontWeight: "600" }}>
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
