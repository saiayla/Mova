import { Ionicons } from "@expo/vector-icons"; // Para o ícone de voltar
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar"; // Para controlar a cor do texto da barra de status
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  KeyboardAvoidingView, // Para o teclado não cobrir os inputs
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { login } from "./script"; // Deixei seu script
// import { globalStyles as styles } from './style'; // Usando o novo style.js

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  return (
    <LinearGradient
      colors={["#1974F3", "#85E0FA"]}
      style={styles.gradientBackground}
    >
      {/* SafeAreaView garante que os botões e conteúdo fiquem na área visível */}
      <SafeAreaView style={styles.safeArea}>
        {/* Botão de voltar com ícone, posicionado no canto */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back-circle" size={40} color="white" />
        </TouchableOpacity>

        {/* KeyboardAvoidingView ajusta a tela quando o teclado abre */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          {/* View principal para centralizar o formulário */}
          <View style={styles.contentContainer}>
            <View style={styles.formContainer}>
              <Text style={styles.title}>Login</Text>

              {/* Container para o input de E-mail */}
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

              {/* Container para o input de Senha */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Senha</Text>
                <TextInput
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry // Esconde a senha
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#999"
                />
                <TouchableOpacity>
                  <Text style={styles.forgotPassword}>Esqueceu sua senha?</Text>
                </TouchableOpacity>
              </View>

              {/* Botão de Entrar */}
              <TouchableOpacity
                onPress={() => login({ email, senha, router })}
                style={styles.loginButton}
              >
                <Text style={styles.buttonText}>Entrar</Text>
              </TouchableOpacity>
            </View>

            {/* Link para criar conta */}
            <TouchableOpacity
              onPress={() => router.push("/cadastro")}
              style={styles.signupContainer}
            >
              <Text style={styles.signupText}>
                Não tem uma conta?{" "}
                <Text style={styles.signupLink}>Cadastre-se</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        {/* Deixa o texto da barra de status (hora, bateria) branco */}
        <StatusBar style="light" />
      </SafeAreaView>
    </LinearGradient>
  );
}

const COLORS = {
  primary: "#1F7AF3",
  white: "#FFFFFF",
  lightGray: "#F7F8FA", // Fundo do input
  mediumGray: "#999", // Texto do placeholder
  darkGray: "#333", // Texto principal
  textLabel: "#555",
  gradientStart: "#1974F3",
  gradientEnd: "#85E0FA",
};

const styles = StyleSheet.create({
  // -- Layout Containers --
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center", // Centraliza o formulário verticalmente
    alignItems: "center", // Centraliza o formulário horizontalmente
  },
  contentContainer: {
    width: "90%", // O conteúdo principal ocupa 90% da largura
    alignItems: "center",
  },
  formContainer: {
    width: "100%",
    backgroundColor: COLORS.white,
    borderRadius: 20, // Cantos mais suaves e modernos
    padding: 25,
    alignItems: "center",
    // Sombra para o efeito "flutuante"
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10, // Sombra para Android
  },

  // -- Títulos e Textos --
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
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },

  // -- Inputs --
  inputGroup: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: COLORS.darkGray,
    borderWidth: 1, // Uma borda sutil é melhor que nenhuma
    borderColor: "#EEE",
  },

  // -- Botões e Links --
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10, // Espaço acima do botão
    // Sombra sutil para o botão
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
    position: "absolute", // Posiciona sobre todo o conteúdo
    top: 10, // Ajuste baseado no seu `SafeAreaView`
    left: 20,
    zIndex: 1, // Garante que fique na frente
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
    color: COLORS.white, // Texto branco sobre o gradiente
  },
  signupLink: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
