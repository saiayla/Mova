import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker, { ItemType } from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { BASE_URL } from "./script";

type Veiculo = {
  id_veiculo: number;
  placa: string;
  modelo: string;
};

type VeiculoItem = ItemType<string>;

export default function CriarViagemScreen() {
  const router = useRouter();

  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState(""); // 1. Novo estado para Hora

  const [veiculo, setVeiculo] = useState<string | null>(null);
  const [veiculos, setVeiculos] = useState<VeiculoItem[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function buscarVeiculos() {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Erro", "Usuário não autenticado.");
          router.replace("/login");
          return;
        }

        const response = await fetch(`${BASE_URL}/veiculo`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Erro ao buscar veículos");

        const dataRes: Veiculo[] = await response.json();

        const items: VeiculoItem[] = dataRes.map((v) => ({
          label: `${v.modelo} - ${v.placa}`,
          value: v.placa,
        }));

        setVeiculos(items);
      } catch (error) {
        console.error("Erro ao carregar veículos:", error);
        Alert.alert("Erro", "Falha ao buscar veículos");
      }
    }

    buscarVeiculos();
  }, []);

  // Máscara de Data (DD/MM/AAAA)
  const handleDateChange = (text: string) => {
    let numericText = text.replace(/[^\d]/g, "");
    if (numericText.length <= 2) {
      setData(numericText);
    } else if (numericText.length <= 4) {
      setData(`${numericText.slice(0, 2)}/${numericText.slice(2)}`);
    } else {
      numericText = numericText.slice(0, 8);
      setData(
        `${numericText.slice(0, 2)}/${numericText.slice(
          2,
          4
        )}/${numericText.slice(4)}`
      );
    }
  };

  // 2. Máscara de Hora (HH:MM)
  const handleTimeChange = (text: string) => {
    let numericText = text.replace(/[^\d]/g, "");
    // Limita a 4 dígitos
    if (numericText.length > 4) numericText = numericText.slice(0, 4);

    if (numericText.length <= 2) {
      setHora(numericText);
    } else {
      setHora(`${numericText.slice(0, 2)}:${numericText.slice(2)}`);
    }
  };

  const handleCriar = async () => {
    // Validação inclui a hora agora
    if (!origem || !destino || !data || !hora || !veiculo) {
      Alert.alert("Atenção", "Preencha todos os campos antes de continuar.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      // Validação e Montagem da Data/Hora
      const [dia, mes, ano] = data.split("/");
      const [horas, minutos] = hora.split(":");

      if (
        !ano ||
        !mes ||
        !dia ||
        ano.length !== 4 ||
        data.length !== 10 ||
        !horas ||
        !minutos ||
        hora.length !== 5
      ) {
        Alert.alert("Erro", "Data ou Hora inválidas.");
        return;
      }

      // 3. Formata para o padrão do Banco (YYYY-MM-DDTHH:MM:SS)
      const horario_partida = `${ano}-${mes}-${dia}T${horas}:${minutos}:00`;

      const body = {
        horario_partida,
        local_saida: origem,
        local_chegada: destino,
        placa_veiculo: veiculo,
      };

      console.log("Enviando:", body);

      const response = await fetch(`${BASE_URL}/viagens`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok)
        throw new Error(result.message || "Erro ao criar viagem");

      Alert.alert("Sucesso", "Viagem criada com sucesso!");
      router.replace("/viagens"); // Volta para a lista

      // Limpa os campos
      setOrigem("");
      setDestino("");
      setData("");
      setHora("");
      setVeiculo(null);
    } catch (error) {
      console.error("Erro ao criar viagem:", error);
      Alert.alert("Erro", (error as Error).message || "Erro ao criar viagem.");
    }
  };

  return (
    <LinearGradient colors={["#1974F3", "#85E0FA"]} style={{ flex: 1 }}>
      <SafeAreaView
        style={{ flex: 1, paddingTop: Platform.OS === "android" ? 25 : 0 }}
      >
        <StatusBar barStyle="light-content" />

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

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{
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
              }}
            >
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "bold",
                  color: "#333",
                  marginBottom: 25,
                }}
              >
                Criar Viagem
              </Text>

              {/* ORIGEM */}
              <View style={{ width: "100%", marginBottom: 15 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#555",
                    marginBottom: 8,
                  }}
                >
                  Origem
                </Text>
                <TextInput
                  value={origem}
                  onChangeText={setOrigem}
                  placeholder="Ex: Shopping Vila Velha"
                  placeholderTextColor="#999"
                  style={{
                    width: "100%",
                    height: 50,
                    backgroundColor: "#F7F8FA",
                    borderRadius: 10,
                    paddingHorizontal: 15,
                    fontSize: 16,
                    color: "#333",
                    borderWidth: 1,
                    borderColor: "#EEE",
                  }}
                />
              </View>

              {/* DESTINO */}
              <View style={{ width: "100%", marginBottom: 15 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#555",
                    marginBottom: 8,
                  }}
                >
                  Destino
                </Text>
                <TextInput
                  value={destino}
                  onChangeText={setDestino}
                  placeholder="Ex: Universidade UVV"
                  placeholderTextColor="#999"
                  style={{
                    width: "100%",
                    height: 50,
                    backgroundColor: "#F7F8FA",
                    borderRadius: 10,
                    paddingHorizontal: 15,
                    fontSize: 16,
                    color: "#333",
                    borderWidth: 1,
                    borderColor: "#EEE",
                  }}
                />
              </View>

              {/* LINHA: DATA E HORA LADO A LADO */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                  marginBottom: 15,
                }}
              >
                {/* DATA */}
                <View style={{ width: "48%" }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#555",
                      marginBottom: 8,
                    }}
                  >
                    Data
                  </Text>
                  <TextInput
                    value={data}
                    onChangeText={handleDateChange}
                    placeholder="DD/MM/AAAA"
                    placeholderTextColor="#999"
                    maxLength={10}
                    keyboardType="numeric"
                    style={{
                      width: "100%",
                      height: 50,
                      backgroundColor: "#F7F8FA",
                      borderRadius: 10,
                      paddingHorizontal: 15,
                      fontSize: 16,
                      color: "#333",
                      borderWidth: 1,
                      borderColor: "#EEE",
                      textAlign: "center",
                    }}
                  />
                </View>

                {/* HORA */}
                <View style={{ width: "48%" }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#555",
                      marginBottom: 8,
                    }}
                  >
                    Hora
                  </Text>
                  <TextInput
                    value={hora}
                    onChangeText={handleTimeChange}
                    placeholder="HH:MM"
                    placeholderTextColor="#999"
                    maxLength={5}
                    keyboardType="numeric"
                    style={{
                      width: "100%",
                      height: 50,
                      backgroundColor: "#F7F8FA",
                      borderRadius: 10,
                      paddingHorizontal: 15,
                      fontSize: 16,
                      color: "#333",
                      borderWidth: 1,
                      borderColor: "#EEE",
                      textAlign: "center",
                    }}
                  />
                </View>
              </View>

              {/* VEÍCULO */}
              <View style={{ width: "100%", marginBottom: 15, zIndex: 1000 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#555",
                    marginBottom: 8,
                  }}
                >
                  Veículo
                </Text>
                <DropDownPicker
                  open={open}
                  value={veiculo}
                  items={veiculos}
                  setOpen={setOpen}
                  setValue={setVeiculo}
                  setItems={setVeiculos}
                  placeholder="Selecione o veículo"
                  style={{
                    width: "100%",
                    height: 50,
                    backgroundColor: "#F7F8FA",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#EEE",
                  }}
                  dropDownContainerStyle={{
                    width: "100%",
                    backgroundColor: "#F7F8FA",
                    borderColor: "#EEE",
                  }}
                  textStyle={{ fontSize: 16, color: "#333" }}
                  placeholderStyle={{ color: "#999", fontSize: 16 }}
                />
              </View>

              {/* BOTÃO */}
              <TouchableOpacity
                style={{
                  width: "100%",
                  height: 50,
                  backgroundColor: "#1F7AF3",
                  borderRadius: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 10,
                  shadowColor: "#1F7AF3",
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.3,
                  shadowRadius: 5,
                  elevation: 6,
                  zIndex: 0,
                }}
                onPress={handleCriar}
              >
                <Text
                  style={{ color: "#FFFFFF", fontWeight: "bold", fontSize: 16 }}
                >
                  Agendar Viagem
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
