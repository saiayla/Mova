import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BASE_URL } from "./script";

export default function SaldoMotoristaScreen() {
  const router = useRouter();
  const [saldo, setSaldo] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const carregarSaldo = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Erro", "Usuário não autenticado.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${BASE_URL}/getSaldo`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erro ao buscar saldo.");
      }

      const data = await response.json();
      setSaldo(data.saldo);
    } catch (error: any) {
      console.error("Erro ao carregar saldo:", error);
      Alert.alert("Erro", error.message || "Não foi possível carregar o saldo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarSaldo();
  }, []);

  return (
    <LinearGradient colors={["#1974F3", "#85E0FA"]} style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {/* Botão de Voltar */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          position: "absolute",
          top: Platform.OS === "android" ? 35 : 10,
          left: 20,
          zIndex: 10,
        }}
      >
        <Ionicons name="arrow-back-circle" size={40} color="white" />
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <View style={styles.container}>
          <Text style={styles.label}>Saldo Atual</Text>
          <Text style={styles.saldo}>R$ {saldo?.toFixed(2) ?? "0,00"}</Text>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  label: {
    fontSize: 18,
    color: "#555",
    marginBottom: 10,
  },
  saldo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1974F3",
  },
});
