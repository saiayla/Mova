import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { cadastroMotorista, cadastroPassageiro } from "./script.js";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function CadastroScreen() {
  const router = useRouter();

  const [userType, setUserType] = useState<"passageiro" | "motorista">(
    "passageiro"
  );

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [num_telefone, setNum_telefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [senha, setSenha] = useState("");
  const [cnh, setCnh] = useState(""); 

  const toggleUserType = (type: "passageiro" | "motorista") => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setUserType(type);
  };

  const handleCadastro = () => {
    const commonData = { nome, email, num_telefone, endereco, senha, router };

    if (userType === "motorista") {
      cadastroMotorista({ ...commonData, cnh });
    } else {
      cadastroPassageiro(commonData);
    }
  };

  return (
    <LinearGradient
      colors={["#1974F3", "#85E0FA"]}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back-circle" size={40} color="white" />
        </TouchableOpacity>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }} 
        >
          {/* ScrollView */}
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.formContainer}>
              <Text style={styles.title}>Criar Conta</Text>

              {/* --- TIPO DE USUÁRIO --- */}
              <View style={styles.userTypeSelector}>
                <TouchableOpacity
                  style={[
                    styles.userTypeButton,
                    userType === "passageiro"
                      ? styles.userTypeButtonActive
                      : null,
                  ]}
                  onPress={() => toggleUserType("passageiro")}
                >
                  <Text
                    style={[
                      styles.userTypeButtonText,
                      userType === "passageiro"
                        ? styles.userTypeButtonTextActive
                        : styles.userTypeButtonTextInactive,
                    ]}
                  >
                    Passageiro
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.userTypeButton,
                    userType === "motorista"
                      ? styles.userTypeButtonActive
                      : null,
                  ]}
                  onPress={() => toggleUserType("motorista")}
                >
                  <Text
                    style={[
                      styles.userTypeButtonText,
                      userType === "motorista"
                        ? styles.userTypeButtonTextActive
                        : styles.userTypeButtonTextInactive,
                    ]}
                  >
                    Motorista
                  </Text>
                </TouchableOpacity>
              </View>

              {/* --- CAMPOS COMUNS --- */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nome Completo</Text>
                <TextInput
                  value={nome}
                  onChangeText={setNome}
                  style={styles.input}
                  placeholder="Seu nome e sobrenome"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>E-mail</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                  placeholder="seuemail@exemplo.com"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Celular (com DDD)</Text>
                <TextInput
                  value={num_telefone}
                  onChangeText={setNum_telefone}
                  style={styles.input}
                  placeholder="Apenas números"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                  maxLength={11}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Endereço</Text>
                <TextInput
                  value={endereco}
                  onChangeText={setEndereco}
                  style={styles.input}
                  placeholder="Ex: Rua, Número, Bairro"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Senha</Text>
                <TextInput
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry
                  style={styles.input}
                  placeholder="Mín. 6 caracteres"
                  placeholderTextColor="#999"
                />
              </View>

              {/* (CNH) */}
              {userType === "motorista" && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>CNH</Text>
                  <TextInput
                    value={cnh}
                    onChangeText={setCnh}
                    style={styles.input}
                    placeholder="11 dígitos numéricos"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    maxLength={11}
                  />
                </View>
              )}

              <TouchableOpacity
                onPress={handleCadastro}
                style={styles.loginButton}
              >
                <Text style={styles.buttonText}>Cadastrar</Text>
              </TouchableOpacity>
            </View>

            {/* voltar ao Login */}
            <TouchableOpacity
              onPress={() => router.push("/login")}
              style={styles.signupContainer}
            >
              <Text style={styles.signupText}>
                Já tem uma conta?{" "}
                <Text style={styles.signupLink}>Faça Login</Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>

        <StatusBar style="light" />
      </SafeAreaView>
    </LinearGradient>
  );
}

const COLORS = {
  primary: "#1F7AF3",
  white: "#FFFFFF",
  lightGray: "#F7F8FA", 
  mediumGray: "#999", 
  darkGray: "#333", 
  textLabel: "#555",
  gradientStart: "#1974F3",
  gradientEnd: "#85E0FA",
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60, 
  },
  contentContainer: {
    width: "90%",
    alignItems: "center",
  },
  formContainer: {
    width: "90%", 
    backgroundColor: COLORS.white,
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
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 25,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textLabel,
    marginBottom: 8,
    alignSelf: "flex-start", 
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },

  inputGroup: {
    width: "100%",
    marginBottom: 15, 
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: COLORS.darkGray,
    borderWidth: 1,
    borderColor: "#EEE",
  },

  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "android" ? 35 : 10, 
    left: 20,
    zIndex: 1,
  },
  forgotPassword: {
    fontSize: 13,
    color: COLORS.primary,
    textAlign: "right",
    marginTop: 8,
    fontWeight: "600",
  },
  signupContainer: {
    marginTop: 25,
  },
  signupText: {
    fontSize: 14,
    color: COLORS.white,
  },
  signupLink: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },

  userTypeSelector: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    marginBottom: 25,
    padding: 4,
  },
  userTypeButton: {
    flex: 1, 
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  userTypeButtonActive: {
    backgroundColor: COLORS.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userTypeButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  userTypeButtonTextActive: {
    color: COLORS.white,
  },
  userTypeButtonTextInactive: {
    color: COLORS.darkGray,
  },
});
