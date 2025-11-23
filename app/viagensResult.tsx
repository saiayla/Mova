import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BASE_URL } from "./script";

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
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [viagemSelecionada, setViagemSelecionada] = useState<Viagem | null>(null);

  const params = useLocalSearchParams();
  let viagens: Viagem[] = [];

  try {
    if (typeof params.viagens === "string") {
      viagens = JSON.parse(params.viagens);
    }
  } catch (e) {
    console.error("Erro ao parsear viagens:", e);
    Alert.alert("Erro", "Não foi possível carregar os resultados.");
  }

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

  const abrirModalConfirmacao = (viagem: Viagem) => {
    setViagemSelecionada(viagem);
    setModalVisible(true);
  };

  const handleConfirmarReserva = async () => {
    if (!viagemSelecionada) return;

    setModalVisible(false);
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Erro", "Usuário não autenticado. Faça login novamente.");
        setLoading(false);
        return;
      }

      const payload = {
        id_viagem: viagemSelecionada.id_viagem,
        ponto_embarque: viagemSelecionada.local_saida, // já fixo
      };

      const response = await fetch(`${BASE_URL}/check-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const textData = await response.text();
      let data;
      try {
        data = JSON.parse(textData);
      } catch {
        Alert.alert("Erro no Servidor", "Resposta inválida do servidor.");
        setLoading(false);
        return;
      }

      if (response.ok) {
        Alert.alert(
          "Sucesso!",
          "Sua reserva foi realizada. O motorista verá seu local de embarque.",
          [{ text: "OK", onPress: () => router.replace("/homePassageiro") }]
        );
      } else {
        Alert.alert("Atenção", data.message || "Não foi possível realizar a reserva.");
      }
    } catch {
      Alert.alert("Erro de Conexão", "Verifique sua internet e tente novamente.");
    } finally {
      setLoading(false);
      setViagemSelecionada(null);
    }
  };

  return (
    <LinearGradient colors={["#1974F3", "#85E0FA"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, paddingTop: Platform.OS === "android" ? 25 : 0 }}>
        <StatusBar barStyle="light-content" />

        {/* Botão Voltar */}
        <TouchableOpacity
          onPress={() => router.back()}
          disabled={loading}
          style={{
            position: "absolute",
            top: Platform.OS === "android" ? 35 : 10,
            left: 20,
            zIndex: 1,
            opacity: loading ? 0.5 : 1,
          }}
        >
          <Ionicons name="arrow-back-circle" size={40} color="white" />
        </TouchableOpacity>

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}

        {/* Modal */}
        <Modal
          animationType="fade"
          transparent
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
            setViagemSelecionada(null);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Ionicons name="location-outline" size={40} color="#1974F3" />
              <Text style={styles.modalTitle}>Ponto de Encontro</Text>
              <Text style={styles.modalText}>
                O motorista buscará você no seguinte local:
              </Text>

              {viagemSelecionada && (
                <Text style={styles.modalInput}>
                  {viagemSelecionada.local_saida}
                </Text>
              )}

              {viagemSelecionada && (
                <Text style={styles.priceText}>
                  Valor Total: R$ {Number(viagemSelecionada.valor_total ?? 0).toFixed(2)}
                </Text>
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    setModalVisible(false);
                    setViagemSelecionada(null);
                  }}
                >
                  <Text style={styles.textStyle}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.buttonConfirm]}
                  onPress={handleConfirmarReserva}
                >
                  <Text style={styles.textStyle}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Lista de Viagens */}
        <View style={{ flex: 1, paddingHorizontal: "5%", paddingTop: 60 }}>
          <View style={{
            flex: 1,
            width: "100%",
            backgroundColor: "#FFFFFF",
            borderRadius: 20,
            padding: 25,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 10,
            elevation: 10,
          }}>
            <Text style={{ fontSize: 28, fontWeight: "bold", color: "#333", marginBottom: 25 }}>
              Viagens Encontradas
            </Text>

            {viagens.length === 0 ? (
              <Text style={{ fontSize: 16, color: "#555", textAlign: "center", marginTop: 20 }}>
                Nenhuma viagem encontrada para esta rota.
              </Text>
            ) : (
              <FlatList
                data={viagens}
                keyExtractor={(item) => item.id_viagem.toString()}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    disabled={loading}
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "#F7F8FA",
                      paddingHorizontal: 15,
                      paddingVertical: 18,
                      borderRadius: 10,
                      marginBottom: 10,
                      borderWidth: 1,
                      borderColor: "transparent",
                    }}
                    onPress={() => abrirModalConfirmacao(item)}
                  >
                    <Ionicons name="bus-outline" size={32} style={{ marginRight: 15, color: "#1F7AF3" }} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 4 }}>
                        {item.modelo} ({item.placa_veiculo})
                      </Text>
                      <Text style={{ fontSize: 13, color: "#555" }}>Para: {item.local_chegada}</Text>
                      <Text style={{ fontSize: 13, color: "#555" }}>
                        Partida: {formatarData(item.horario_partida)}
                      </Text>
                      <Text style={{ fontSize: 13, color: "#555" }}>Vagas: {item.vagas_maximas}</Text>
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: "bold", color: "#333", marginLeft: 10 }}>
                      R$ {Number(item.valor_total ?? 0).toFixed(2)}
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

const styles = StyleSheet.create({
  loadingOverlay: {
    position: "absolute",
    zIndex: 10,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 20,
  },
  modalView: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    textAlign: "center",
    color: "#333",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 15,
    color: "#666",
  },
  modalInput: {
    width: "100%",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#DDD",
    marginBottom: 15,
    color: "#333",
    minHeight: 50,
    textAlignVertical: "center",
  },
  priceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1974F3",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    borderRadius: 10,
    padding: 12,
    elevation: 2,
    width: "48%",
    alignItems: "center",
  },
  buttonClose: {
    backgroundColor: "#FF6347",
  },
  buttonConfirm: {
    backgroundColor: "#1974F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});
