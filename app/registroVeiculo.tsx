import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { cadastrarVeiculo } from "./script";

export default function RegistroVeiculoScreen() {
  const router = useRouter();

  const [tipo, setTipo] = useState("");
  const [placa, setPlaca] = useState("");
  const [modelo, setModelo] = useState("");
  const [cor, setCor] = useState("");
  const [passageiros_maximos, setPassageiros_maximos] = useState("");
  const [chassi, setChassi] = useState("");

  const handleCadastro = () => {
    cadastrarVeiculo({
      tipo,
      placa,
      modelo,
      cor,
      passageiros_maximos,
      chassi,
      router,
    });
  };

  return (
    <LinearGradient
      colors={["#1974F3", "#85E0FA"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: Platform.OS === "android" ? 25 : 0,
        }} 
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
            {/* Card Branco Flutuante */}
            <View
              style={{
                width: "100%",
                backgroundColor: "#FFFFFF",
                borderRadius: 20,
                padding: 25,
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
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
                Novo Veículo
              </Text>

              {/* --- Tipo (Picker) --- */}
              <View
                style={{
                  width: "100%",
                  marginBottom: 15,
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
                  Tipo de Veículo
                </Text>
                {/* Wrapper para o Picker parecer um input */}
                <View
                  style={{
                    width: "100%",
                    height: 50,
                    backgroundColor: "#F7F8FA",
                    borderRadius: 10,
                    paddingHorizontal: 15, 
                    borderWidth: 1,
                    borderColor: "#EEE",
                    justifyContent: "center", 
                  }}
                >
                  <Picker
                    selectedValue={tipo}
                    onValueChange={(value) => setTipo(value)}
                    mode="dialog"
                    style={{
                      width: "100%",
                      height: 50,
                      color: tipo ? "#333" : "#999",
                      marginLeft: -15, 
                      marginRight: -15,
                    }}
                  >
                    <Picker.Item
                      label="Selecione o tipo"
                      value=""
                      enabled={false}
                    />
                    <Picker.Item label="Van" value="Van" />
                    <Picker.Item label="Ônibus" value="Ônibus" />
                    <Picker.Item label="Carro" value="Carro" />
                  </Picker>
                </View>
              </View>

              {/* --- Placa --- */}
              <View
                style={{
                  width: "100%",
                  marginBottom: 15,
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
                  Placa
                </Text>
                <TextInput
                  value={placa}
                  onChangeText={setPlaca}
                  placeholder="ABC1D23"
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
                  autoCapitalize="characters"
                  maxLength={7}
                />
              </View>

              {/* --- Modelo --- */}
              <View
                style={{
                  width: "100%",
                  marginBottom: 15,
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
                  Modelo
                </Text>
                <TextInput
                  value={modelo}
                  onChangeText={setModelo}
                  placeholder="Ex: Sprinter, Ducato, HB20"
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

              {/* --- Cor (Picker) --- */}
              <View
                style={{
                  width: "100%",
                  marginBottom: 15,
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
                  Cor
                </Text>
                <View
                  style={{
                    width: "100%",
                    height: 50,
                    backgroundColor: "#F7F8FA",
                    borderRadius: 10,
                    paddingHorizontal: 15,
                    borderWidth: 1,
                    borderColor: "#EEE",
                    justifyContent: "center",
                  }}
                >
                  <Picker
                    selectedValue={cor}
                    onValueChange={(value) => setCor(value)}
                    mode="dialog"
                    style={{
                      width: "100%",
                      height: 50,
                      color: cor ? "#333" : "#999",
                      marginLeft: -15,
                      marginRight: -15,
                    }}
                  >
                    <Picker.Item
                      label="Selecione a cor"
                      value=""
                      enabled={false}
                    />
                    <Picker.Item label="Branco" value="Branco" />
                    <Picker.Item label="Preto" value="Preto" />
                    <Picker.Item label="Prata" value="Prata" />
                    <Picker.Item label="Vermelho" value="Vermelho" />
                    <Picker.Item label="Azul" value="Azul" />
                    <Picker.Item label="Cinza" value="Cinza" />
                    <Picker.Item label="Verde" value="Verde" />
                    <Picker.Item label="Amarelo" value="Amarelo" />
                  </Picker>
                </View>
              </View>

              {/* --- Capacidade --- */}
              <View
                style={{
                  width: "100%",
                  marginBottom: 15,
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
                  Capacidade de Passageiros
                </Text>
                <TextInput
                  value={passageiros_maximos}
                  keyboardType="numeric"
                  onChangeText={setPassageiros_maximos}
                  placeholder="Ex: 4"
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

              {/* --- Chassi --- */}
              <View
                style={{
                  width: "100%",
                  marginBottom: 15,
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
                  Chassi
                </Text>
                <TextInput
                  value={chassi}
                  onChangeText={setChassi}
                  placeholder="17 caracteres"
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
                  autoCapitalize="characters"
                  maxLength={17}
                />
              </View>

              {/* Botão de Cadastrar */}
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
                  shadowOffset: {
                    width: 0,
                    height: 3,
                  },
                  shadowOpacity: 0.3,
                  shadowRadius: 5,
                  elevation: 6,
                }} 
                onPress={handleCadastro}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontWeight: "bold",
                    fontSize: 16,
                  }} 
                >
                  Cadastrar Veículo
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
