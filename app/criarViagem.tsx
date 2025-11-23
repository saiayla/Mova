import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
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
  const ORS_API_KEY = Constants.expoConfig?.extra?.expoPublicOrsApiKey;
  const router = useRouter();

  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");

  const [veiculo, setVeiculo] = useState<string | null>(null);
  const [veiculos, setVeiculos] = useState<VeiculoItem[]>([]);
  const [open, setOpen] = useState(false);

  const [sugestoesOrigem, setSugestoesOrigem] = useState<any[]>([]);
  const [sugestoesDestino, setSugestoesDestino] = useState<any[]>([]);

  const [origemCoords, setOrigemCoords] = useState<[number, number] | null>(
    null
  );
  const [destinoCoords, setDestinoCoords] = useState<[number, number] | null>(
    null
  );

  async function buscarSugestoes(texto: string, setSugestoes: any) {
    if (texto.length < 3) {
      setSugestoes([]);
      return;
    }

    try {
      const resp = await fetch(
        `https://api.openrouteservice.org/geocode/autocomplete?text=${encodeURIComponent(
          texto
        )}`,
        {
          headers: {
            Authorization: ORS_API_KEY,
            Accept: "application/json",
          },
        }
      );

      if (!resp.ok) {
        console.log("Erro ORS:", await resp.text());
        return;
      }

      const data = await resp.json();
      const lista =
        data?.features?.map((f: any) => ({
          label: f.properties.label,
          coords: f.geometry.coordinates, // [lon, lat]
        })) ?? [];

      setSugestoes(lista);
    } catch (err) {
      console.log("Erro ao buscar sugestões:", err);
    }
  }

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

  const handleTimeChange = (text: string) => {
    let numericText = text.replace(/[^\d]/g, "");
    if (numericText.length > 4) numericText = numericText.slice(0, 4);

    if (numericText.length <= 2) {
      setHora(numericText);
    } else {
      setHora(`${numericText.slice(0, 2)}:${numericText.slice(2)}`);
    }
  };

  const handleCriar = async () => {
    if (!origemCoords || !destinoCoords) {
      Alert.alert(
        "Atenção",
        "Selecione Origem e Destino clicando em uma sugestão."
      );
      return;
    }

    if (!origem || !destino || !data || !hora || !veiculo) {
      Alert.alert("Atenção", "Preencha todos os campos corretamente.");
      return;
    }

    const [dia, mes, ano] = data.split("/");
    const [horas, minutos] = hora.split(":");

    const horarioSelecionado = new Date(
      parseInt(ano),
      parseInt(mes) - 1,
      parseInt(dia),
      parseInt(horas),
      parseInt(minutos)
    );

    const agora = new Date();

    if (horarioSelecionado < agora) {
      Alert.alert(
        "Atenção",
        "Data e hora inválidas. Escolha um horário futuro."
      );
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      const [dia, mes, ano] = data.split("/");
      const [horas, minutos] = hora.split(":");

      const horario_partida = `${ano}-${mes}-${dia}T${horas}:${minutos}:00`;

      const body = {
        horario_partida,
        local_saida: origem,
        local_chegada: destino,
        placa_veiculo: veiculo,
        origemCoords,
        destinoCoords,
      };

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
      router.replace("/viagens");

      setOrigem("");
      setDestino("");
      setData("");
      setHora("");
      setVeiculo(null);
      setOrigemCoords(null);
      setDestinoCoords(null);
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
                  onChangeText={(txt) => {
                    setOrigem(txt);
                    setOrigemCoords(null);
                    buscarSugestoes(txt, setSugestoesOrigem);
                  }}
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

                {sugestoesOrigem.map((item, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => {
                      setOrigem(item.label);
                      setOrigemCoords([item.coords[0], item.coords[1]]);
                      setSugestoesOrigem([]);
                    }}
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 12,
                      backgroundColor: "#eee",
                      borderBottomWidth: 1,
                      borderColor: "#ccc",
                      borderRadius: 8,
                      marginTop: 5,
                    }}
                  >
                    <Text style={{ color: "#333" }}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
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
                  onChangeText={(txt) => {
                    setDestino(txt);
                    setDestinoCoords(null); // reset coords ao digitar
                    buscarSugestoes(txt, setSugestoesDestino);
                  }}
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

                {sugestoesDestino.map((item, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => {
                      setDestino(item.label);
                      setDestinoCoords([item.coords[0], item.coords[1]]);
                      setSugestoesDestino([]);
                    }}
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 12,
                      backgroundColor: "#eee",
                      borderBottomWidth: 1,
                      borderColor: "#ccc",
                      borderRadius: 8,
                      marginTop: 5,
                    }}
                  >
                    <Text style={{ color: "#333" }}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* DATA, HORA e VEÍCULO */}
              <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", marginBottom: 15 }}>
                <View style={{ width: "48%" }}>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#555", marginBottom: 8 }}>Data</Text>
                  <TextInput
                    value={data}
                    onChangeText={handleDateChange}
                    placeholder="DD/MM/AAAA"
                    placeholderTextColor="#999"
                    maxLength={10}
                    keyboardType="numeric"
                    style={{ width: "100%", height: 50, backgroundColor: "#F7F8FA", borderRadius: 10, paddingHorizontal: 15, fontSize: 16, color: "#333", borderWidth: 1, borderColor: "#EEE", textAlign: "center" }}
                  />
                </View>

                <View style={{ width: "48%" }}>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#555", marginBottom: 8 }}>Hora</Text>
                  <TextInput
                    value={hora}
                    onChangeText={handleTimeChange}
                    placeholder="HH:MM"
                    placeholderTextColor="#999"
                    maxLength={5}
                    keyboardType="numeric"
                    style={{ width: "100%", height: 50, backgroundColor: "#F7F8FA", borderRadius: 10, paddingHorizontal: 15, fontSize: 16, color: "#333", borderWidth: 1, borderColor: "#EEE", textAlign: "center" }}
                  />
                </View>
              </View>

              <View style={{ width: "100%", marginBottom: 15, zIndex: 1000 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: "#555", marginBottom: 8 }}>Veículo</Text>
                <DropDownPicker
                  open={open}
                  value={veiculo}
                  items={veiculos}
                  setOpen={setOpen}
                  setValue={setVeiculo}
                  setItems={setVeiculos}
                  placeholder="Selecione o veículo"
                  listMode="SCROLLVIEW"
                  style={{ width: "100%", height: 50, backgroundColor: "#F7F8FA", borderRadius: 10, borderWidth: 1, borderColor: "#EEE" }}
                  dropDownContainerStyle={{ width: "100%", backgroundColor: "#F7F8FA", borderColor: "#EEE" }}
                  textStyle={{ fontSize: 16, color: "#333" }}
                  placeholderStyle={{ color: "#999", fontSize: 16 }}
                />
              </View>

              {/* BOTÃO */}
              <TouchableOpacity
                style={{ width: "100%", height: 50, backgroundColor: "#1F7AF3", borderRadius: 10, justifyContent: "center", alignItems: "center", marginTop: 10, shadowColor: "#1F7AF3", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 6 }}
                onPress={handleCriar}
              >
                <Text style={{ color: "#FFFFFF", fontWeight: "bold", fontSize: 16 }}>Agendar Viagem</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
