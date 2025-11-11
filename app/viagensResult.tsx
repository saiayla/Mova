import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  FlatList,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Definição do tipo Viagem (baseado no seu log)
type Viagem = {
  id_viagem: number;
  local_saida: string;
  local_chegada: string;
  horario_partida: string;
  valor_por_km: number;
  km: number;
  valor_total: number;
  vagas_maximas: number;
  placa_veiculo: string;
  modelo: string;
};

export default function ViagensResultScreen() {
  const router = useRouter();

  // 1. Recebe os parâmetros da rota (a lista de viagens filtrada)
  const params = useLocalSearchParams();
  let viagens: Viagem[] = [];

  try {
    // 2. Converte a string JSON de volta para um array de objetos
    if (typeof params.viagens === "string") {
      viagens = JSON.parse(params.viagens);
    }
  } catch (e) {
    console.error("Erro ao parsear viagens:", e);
    Alert.alert("Erro", "Não foi possível carregar os resultados.");
  }

  // Função para formatar a data
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

  // Função de placeholder para quando o passageiro reservar
  const handleReservar = (viagem: Viagem) => {
    Alert.alert(
      "Reservar Viagem",
      `Você selecionou a viagem para ${
        viagem.local_chegada
      } por R$ ${viagem.valor_total.toFixed(
        2
      )}.\n\n(Implementar lógica de reserva aqui)`
    );
    // TODO: Adicionar lógica de check-in (POST /checkin)
  };

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

        {/* Botão de Voltar Padronizado */}
        <TouchableOpacity
          onPress={() => router.back()}
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
            justifyContent: "center", // Centraliza o card
            alignItems: "center",
            paddingVertical: 60, // Espaço em cima e embaixo
            paddingHorizontal: "5%", // Garante 5% de margem nas laterais
          }} // style={styles.scrollContainer}
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
              maxHeight: "95%", // Garante que o card não estoure a tela
            }} // style={styles.formContainer}
          >
            {/* Título */}
            <Text
              style={{
                fontSize: 28,
                fontWeight: "bold",
                color: "#333",
                marginBottom: 25,
              }} // style={styles.dashboardTitle}
            >
              Viagens Encontradas
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
                }} // style={styles.dashboardSubtitle}
              >
                Nenhuma viagem encontrada para esta rota.
              </Text>
            ) : (
              // Lista de Viagens
              <FlatList
                data={viagens}
                keyExtractor={(item) => item.id_viagem.toString()}
                style={{ width: "100%" }} // Garante que a FlatList use a largura total do card
                renderItem={({ item }) => (
                  // Card de Item de Viagem (Clicável)
                  <TouchableOpacity
                    style={{
                      width: "100%",
                      flexDirection: "row", // Para alinhar ícone e texto
                      alignItems: "center",
                      backgroundColor: "#F7F8FA",
                      paddingHorizontal: 15,
                      paddingVertical: 18,
                      borderRadius: 10,
                      marginBottom: 10,
                    }} // style={styles.dashboardButton}
                    onPress={() => handleReservar(item)} // Ação de clique
                  >
                    <Ionicons
                      name="bus-outline" // Ícone de Van/Ônibus
                      size={32}
                      style={{ marginRight: 15, color: "#1F7AF3" }} // style={styles.dashboardButtonIcon}
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
                        De: {item.local_saida} Para: {item.local_chegada}
                      </Text>
                      <Text style={{ fontSize: 13, color: "#555" }}>
                        Partida: {formatarData(item.horario_partida)}
                      </Text>
                      <Text style={{ fontSize: 13, color: "#555" }}>
                        Vagas: {item.vagas_maximas}
                      </Text>
                    </View>

                    {/* Preço Total (Baseado na imagem) */}
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: "#333",
                        marginLeft: 10,
                      }}
                    >
                      R$ {item.valor_total.toFixed(2)}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
