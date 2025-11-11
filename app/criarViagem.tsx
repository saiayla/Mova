import AsyncStorage from "@react-native-async-storage/async-storage";
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
// ✅ Corrigido: `ItemType` estava importado mas não usado
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import DropDownPicker, { ItemType } from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";
// 1. Corrigido: O caminho da importação precisa de '..'
import { BASE_URL } from "./script"; // Caminho corrigido

// ✅ Tipos
type Veiculo = {
  id_veiculo: number;
  placa: string;
  modelo: string;
};

// ✅ Tipagem correta para o DropDownPicker
type VeiculoItem = ItemType<string>; // value = placa

export default function CriarViagemScreen() {
  const router = useRouter();

  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [data, setData] = useState("");

  // ✅ Tipagem correta para o dropdown
  const [veiculo, setVeiculo] = useState<string | null>(null);
  const [veiculos, setVeiculos] = useState<VeiculoItem[]>([]); // ✅ Corrigido: O estado armazena os ITENS
  const [open, setOpen] = useState(false); // Estado para o DropDownPicker

  // ✅ Buscar veículos do usuário
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

        const data: Veiculo[] = await response.json();

        // ✅ Converter lista → DropDownPicker items
        const items: VeiculoItem[] = data.map((v) => ({
          label: `${v.modelo} - ${v.placa}`,
          value: v.placa,
        }));

        setVeiculos(items); // ✅ Corrigido: Salva os itens formatados
      } catch (error) {
        console.error("Erro ao carregar veículos:", error);
        Alert.alert("Erro", "Falha ao buscar veículos");
      }
    }

    buscarVeiculos();
  }, []);

  // --- 1. MUDANÇA: Função de Máscara de Data ---
  const handleDateChange = (text: string) => {
    // Remove tudo que não for dígito
    let numericText = text.replace(/[^\d]/g, "");

    // Aplica a máscara DD/MM/AAAA
    if (numericText.length <= 2) {
      setData(numericText);
    } else if (numericText.length <= 4) {
      setData(`${numericText.slice(0, 2)}/${numericText.slice(2)}`);
    } else {
      // Limita aos 8 dígitos de DDMMYYYY
      numericText = numericText.slice(0, 8);
      setData(
        `${numericText.slice(0, 2)}/${numericText.slice(
          2,
          4
        )}/${numericText.slice(4)}`
      );
    }
  };
  // --- Fim da MUDANÇA ---

  // ✅ Criar viagem
  const handleCriar = async () => {
    if (!origem || !destino || !data || !veiculo) {
      Alert.alert("Atenção", "Preencha todos os campos antes de continuar.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      const [dia, mes, ano] = data.split("/");
      // Validação básica da data
      if (!ano || !mes || !dia || ano.length !== 4 || data.length !== 10) {
        Alert.alert("Erro", "Formato de data inválido. Use DD/MM/AAAA.");
        return;
      }
      const horario_partida = `${ano}-${mes}-${dia}T08:00:00`; // 08h fixo

      const body = {
        horario_partida,
        local_saida: origem,
        local_chegada: destino,
        placa_veiculo: veiculo,
      };

      console.log("body", body);

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
      router.push("/viagens");

      setOrigem("");
      setDestino("");
      setData("");
      setVeiculo(null);
    } catch (error) {
      console.error("Erro ao criar viagem:", error);
      Alert.alert("Erro", (error as Error).message || "Erro ao criar viagem.");
    }
  };

  return (
    <LinearGradient colors={["#1974F3", "#85E0FA"]} style={{ flex: 1 }}>
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: Platform.OS === "android" ? 25 : 0,
        }}
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
          {/* 2. Corrigido: Trocado View por ScrollView */}
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1, // Permite o scroll
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
                    alignSelf: "flex-start",
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
                    alignSelf: "flex-start",
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

              {/* DATA */}
              <View style={{ width: "100%", marginBottom: 15 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#555",
                    marginBottom: 8,
                    alignSelf: "flex-start",
                  }}
                >
                  Data (DD/MM/AAAA)
                </Text>
                <TextInput
                  value={data}
                  // --- 2. MUDANÇA: onChangeText ---
                  onChangeText={handleDateChange}
                  // ------------------------------
                  placeholder="Ex: 25/12/2025"
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
                  maxLength={10} // DD/MM/AAAA
                  // --- 3. MUDANÇA: keyboardType ---
                  keyboardType="numeric"
                  // -------------------------------
                />
              </View>

              {/* VEÍCULO */}
              <View
                style={{
                  width: "100%",
                  marginBottom: 15,
                  zIndex: 1000,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#555",
                    marginBottom: 8,
                    alignSelf: "flex-start",
                  }}
                >
                  Veículo
                </Text>

                <DropDownPicker
                  open={open}
                  value={veiculo}
                  items={veiculos} // ✅ Corrigido
                  setOpen={setOpen}
                  setValue={setVeiculo}
                  setItems={setVeiculos} // ✅ Corrigido
                  placeholder="Selecione o veículo"
                  onChangeValue={(value) => setVeiculo(value as string)}
                  style={{
                    width: "100%",
                    height: 50,
                    backgroundColor: "#F7F8FA",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#EEE",
                  }}
                  placeholderStyle={{
                    color: "#999",
                    fontSize: 16,
                  }}
                  textStyle={{
                    fontSize: 16,
                    color: "#333",
                  }}
                  dropDownContainerStyle={{
                    width: "100%",
                    backgroundColor: "#F7F8FA",
                    borderColor: "#EEE",
                  }}
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
                  style={{
                    color: "#FFFFFF",
                    fontWeight: "bold",
                    fontSize: 16,
                  }}
                >
                  Criar Viagem
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
