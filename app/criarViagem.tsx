import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { Alert, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { globalStyles as styles } from "./style";

type Veiculo = {
  id_veiculo: number;
  placa: string;
  modelo: string;
};

export default function CriarViagem() {
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [data, setData] = useState("");
  const [veiculo, setVeiculo] = useState("");
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);

  // const BASE_URL = "http://172.20.10.4:3000";
  const BASE_URL = "http://192.168.100.192:3000";

  // Buscar veículos do usuário
  useEffect(() => {
    async function buscarVeiculos() {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Erro", "Usuário não autenticado.");
          return;
        }

        const response = await fetch(`${BASE_URL}/veiculo`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Erro ao buscar veículos");

        const data = await response.json();
        setVeiculos(data);
      } catch (error) {
        console.error("Erro ao carregar veículos:", error);
        Alert.alert("Erro", "Falha ao buscar veículos");
      }
    }

    buscarVeiculos();
  }, []);

  // Criar viagem
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

      // payload agora só envia local_saida, local_chegada, placa_veiculo
      const body = {
        local_saida: origem,
        local_chegada: destino,
        placa_veiculo: veiculo,
        // data não é usada no backend, mas você pode mandar se quiser
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
      console.log(result);

      if (!response.ok) {
        throw new Error(result.error || "Erro ao criar viagem");
      }

      if (Platform.OS === "web") {
        alert("Viagem criada com sucesso!");
      } else {
        Alert.alert("Sucesso", "Viagem criada com sucesso!");
      }

      setOrigem("");
      setDestino("");
      setData("");
      setVeiculo("");
    } catch (error) {
      console.error("Erro ao criar viagem:", error);
      if (Platform.OS === "web") {
        alert("Erro ao criar viagem.");
      } else {
        Alert.alert("Erro", "Erro ao criar viagem.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title3}>Criar Viagem</Text>

      <TextInput
        placeholder="Origem"
        value={origem}
        onChangeText={setOrigem}
        placeholderTextColor="#c9c9c9ff"
        style={styles.input2}
      />

      <TextInput
        placeholder="Destino"
        value={destino}
        onChangeText={setDestino}
        placeholderTextColor="#c9c9c9ff"
        style={styles.input2}
      />

      <TextInput
        placeholder="Data (ex: 10/11/2025)"
        value={data}
        onChangeText={setData}
        placeholderTextColor="#c9c9c9ff"
        style={styles.input2}
      />

      <Picker
        selectedValue={veiculo}
        onValueChange={(value) => setVeiculo(value)}
        style={styles.input2}
      >
        <Picker.Item label="Selecione o veículo" value="" />
        {veiculos.map((v) => (
          <Picker.Item
            key={v.id_veiculo}
            label={`${v.modelo} - ${v.placa}`}
            value={v.placa} // agora bate com placa_veiculo no backend
          />
        ))}
      </Picker>

      <TouchableOpacity
        style={[styles.Button, { marginTop: 50, alignItems: "center" }]}
        onPress={handleCriar}
      >
        <Text style={styles.buttonText}>Criar Viagem</Text>
      </TouchableOpacity>
    </View>
  );
}
