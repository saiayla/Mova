import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PerfilMotoristaScreen() {
  const router = useRouter();
  const [dados, setDados] = useState<any>(null);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("user");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log("Erro ao ler o AsyncStorage:", e);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const resultado = await getData();
      setDados(resultado);
      console.log("usuário:", resultado);
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    // await AsyncStorage.clear();
    router.replace("/telaInicial");
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

        <TouchableOpacity
          onPress={() => router.replace("/homeMotorista")}
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
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.15,
              shadowRadius: 10,
              elevation: 10,
            }}
          >
            <Ionicons
              name="person-circle"
              size={80}
              color={"#1F7AF3"}
              style={{ marginBottom: 10 }}
            />
            <Text
              style={{
                fontSize: 26,
                fontWeight: "bold",
                color: "#333",
                marginBottom: 10,
              }}
            >
              {dados?.nome}
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#555",
                textAlign: "center",
                marginBottom: 30,
              }}
            >
              {dados?.email}
            </Text>

            <TouchableOpacity
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#F7F8FA",
                paddingHorizontal: 15,
                paddingVertical: 18,
                borderRadius: 10,
                marginBottom: 15,
              }}
              onPress={() =>
                Alert.alert("WIP", "Tela de Editar Dados Pessoais")
              }
            >
              <Ionicons
                name="pencil-outline"
                size={24}
                style={{
                  marginRight: 15,
                  color: "#1F7AF3",
                }}
              />
              <Text
                style={{
                  flex: 1,
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#333",
                }}
              >
                Editar Dados Pessoais
              </Text>
              <Ionicons
                name="chevron-forward-outline"
                size={20}
                style={{ color: "#999" }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#F7F8FA",
                paddingHorizontal: 15,
                paddingVertical: 18,
                borderRadius: 10,
                marginBottom: 15,
              }}
              onPress={() => router.replace("/veiculos")}
            >
              <Ionicons
                name="car"
                size={24}
                style={{
                  marginRight: 15,
                  color: "#1F7AF3",
                }}
              />
              <Text
                style={{
                  flex: 1,
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#333",
                }}
              >
                Veiculos
              </Text>
              <Ionicons
                name="chevron-forward-outline"
                size={20}
                style={{ color: "#999" }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#F7F8FA",
                paddingHorizontal: 15,
                paddingVertical: 18,
                borderRadius: 10,
                marginBottom: 15,
              }}
              onPress={() => router.push("/saldoMotorista")}
            >
              <Ionicons
                name="wallet-outline"
                size={24}
                style={{ marginRight: 15, color: "#1F7AF3" }}
              />
              <Text
                style={{
                  flex: 1,
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#333",
                }}
              >
                Pagamentos e Saldo
              </Text>
              <Ionicons
                name="chevron-forward-outline"
                size={20}
                style={{ color: "#999" }}
              />
            </TouchableOpacity>


            <TouchableOpacity
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#F7F8FA",
                paddingHorizontal: 15,
                paddingVertical: 18,
                borderRadius: 10,
                marginBottom: 15,
              }}
              onPress={() => router.push("/viagens")}
            >
              <Ionicons
                name="car-sport-outline"
                size={24}
                style={{
                  marginRight: 15,
                  color: "#1F7AF3",
                }}
              />
              <Text
                style={{
                  flex: 1,
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#333",
                }}
              >
                Corridas
              </Text>
              <Ionicons
                name="chevron-forward-outline"
                size={20}
                style={{ color: "#999" }}
              />
            </TouchableOpacity>

            {/* --- Botão de Sair (Logout) --- */}
            <TouchableOpacity
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 15,
                paddingVertical: 18,
                borderRadius: 10,
                marginBottom: 15,
                marginTop: 20,
                backgroundColor: "#fbeeee",
              }}
              onPress={handleLogout}
            >
              <Ionicons
                name="log-out-outline"
                size={24}
                style={{
                  marginRight: 15,
                  color: "#D94343",
                }}
              />
              <Text
                style={{
                  flex: 1,
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#D94343",
                }}
              >
                Sair
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
