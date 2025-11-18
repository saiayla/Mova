import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BASE_URL } from "./script"; // Verifique se o caminho está correto (pode ser ../script)

// Tipo dos dados que esperamos do backend
type CheckinDetalhe = {
  id_checkin: number;
  ponto_embarque: string;
  nome_passageiro: string;
  num_telefone: string;
  horario_partida?: string; // Opcional pois depende da query do backend
  sem_passageiros?: boolean;
};

export default function ViagemDetalhesMotorista() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id_viagem } = params;

  const [checkins, setCheckins] = useState<CheckinDetalhe[]>([]);
  const [loading, setLoading] = useState(true);
  const [horarioViagem, setHorarioViagem] = useState<string | null>(null);

  console.log("checkins", checkins);

  useEffect(() => {
    async function carregarDetalhes() {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Erro", "Sessão expirada.");
          router.replace("/login");
          return;
        }

        if (!id_viagem) return;

        const response = await fetch(
          `${BASE_URL}/viagens/${id_viagem}/checkins`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Erro ao carregar detalhes.");
        }

        // Lógica para extrair dados
        if (Array.isArray(data) && data.length > 0) {
          setCheckins(data);
          // Pega o horário do primeiro passageiro (já que é o mesmo para todos na viagem)
          if (data[0].horario_partida) {
            setHorarioViagem(data[0].horario_partida);
          }
        } else {
          setCheckins([]);
        }
      } catch (error) {
        console.error("Erro detalhe viagem:", error);
        Alert.alert("Erro", "Não foi possível carregar os dados.");
      } finally {
        setLoading(false);
      }
    }

    carregarDetalhes();
  }, [id_viagem]);

  // Função para abrir o discador
  const handleLigar = (telefone: string) => {
    const numeroLimpo = telefone.replace(/[^0-9]/g, "");
    const url = `tel:${numeroLimpo}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert("Erro", "Dispositivo não suporta chamadas.");
        }
      })
      .catch((err) => console.error("Erro ao ligar", err));
  };

  // Formatação de Horário (ex: 08:30)
  const formatarHorario = (dataISO: string) => {
    if (!dataISO) return "--:--";
    const data = new Date(dataISO);
    return data.toLocaleString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      // Se quiser mostrar o dia também, descomente abaixo:
      // day: "2-digit",
      // month: "2-digit",
    });
  };

  // Loading com o visual do gradiente
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

        {/* Botão Voltar (Padrão das outras telas) */}
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
              maxHeight: "95%", // Garante que não estoure a tela
            }}
          >
            {/* Título do Card */}
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "#333",
                marginBottom: 10,
              }}
            >
              Detalhes da Viagem
            </Text>

            {/* Destaque do Horário */}
            {horarioViagem ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 20,
                  backgroundColor: "#EBF5FF",
                  paddingHorizontal: 15,
                  paddingVertical: 8,
                  borderRadius: 20,
                }}
              >
                <Ionicons
                  name="time-outline"
                  size={20}
                  color="#1974F3"
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={{ fontSize: 18, color: "#1974F3", fontWeight: "700" }}
                >
                  Saída: {formatarHorario(horarioViagem)}
                </Text>
              </View>
            ) : (
              <Text style={{ fontSize: 14, color: "#999", marginBottom: 20 }}>
                Horário não disponível
              </Text>
            )}

            <View
              style={{
                width: "100%",
                height: 1,
                backgroundColor: "#EEE",
                marginBottom: 15,
              }}
            />

            <Text
              style={{
                fontSize: 14,
                color: "#666",
                alignSelf: "flex-start",
                marginBottom: 10,
                fontWeight: "bold",
              }}
            >
              Lista de Passageiros ({checkins.length})
            </Text>

            {/* Lista */}
            {checkins.length === 0 || checkins?.[0]?.sem_passageiros ? (
              <View
                style={{
                  alignItems: "center",
                  marginVertical: 30,
                  width: "100%",
                }}
              >
                <Ionicons name="people-outline" size={50} color="#ccc" />
                <Text
                  style={{ color: "#555", marginTop: 10, textAlign: "center" }}
                >
                  Nenhum passageiro confirmado.
                </Text>
              </View>
            ) : (
              <FlatList
                data={checkins}
                keyExtractor={(item) => item.id_checkin?.toString()}
                style={{ width: "100%" }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "#F7F8FA", // Fundo cinza claro igual ao MinhasViagens
                      padding: 15,
                      borderRadius: 12,
                      marginBottom: 10,
                      borderLeftWidth: 4,
                      borderLeftColor: "#1974F3", // Detalhe visual azul
                    }}
                  >
                    {/* Marcador Visual (1, 2, 3...) */}
                    <View style={{ marginRight: 15, alignItems: "center" }}>
                      <View
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 13,
                          backgroundColor: "#1974F3",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          {index + 1}
                        </Text>
                      </View>
                    </View>

                    {/* Dados do Passageiro */}
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          color: "#333",
                        }}
                      >
                        {item.nome_passageiro}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginTop: 4,
                        }}
                      >
                        <Ionicons
                          name="location-sharp"
                          size={14}
                          color="#666"
                        />
                        <Text
                          style={{ fontSize: 13, color: "#555", marginLeft: 4 }}
                        >
                          {item.ponto_embarque}
                        </Text>
                      </View>
                    </View>

                    {/* Botão Ligar (Verde para destaque) */}
                    <TouchableOpacity
                      onPress={() => handleLigar(item.num_telefone)}
                      style={{
                        padding: 10,
                        backgroundColor: "#E6F4EA",
                        borderRadius: 25,
                        borderWidth: 1,
                        borderColor: "#D4EDDA",
                      }}
                    >
                      <Ionicons name="call" size={20} color="#28A745" />
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
