import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  KeyboardAvoidingView, // Importa o ScrollView para formulários longos
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity, // Para a animação do campo CNH
  UIManager,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Importa AMBAS as funções de cadastro do seu script
import { cadastroMotorista, cadastroPassageiro } from "./script.js";
// Importa os estilos GLOBAIS (que vamos atualizar)
// import { globalStyles as styles } from "./style";

// Habilita LayoutAnimation no Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function CadastroScreen() {
  const router = useRouter();

  // Estado para o tipo de usuário (controla o seletor)
  const [userType, setUserType] = useState<"passageiro" | "motorista">(
    "passageiro"
  );

  // Estados para os campos do formulário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [num_telefone, setNum_telefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [senha, setSenha] = useState("");
  const [cnh, setCnh] = useState(""); // Campo condicional

  // Função para trocar o tipo de usuário com animação
  const toggleUserType = (type: "passageiro" | "motorista") => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setUserType(type);
  };

  // Função unificada de cadastro
  const handleCadastro = () => {
    const commonData = { nome, email, num_telefone, endereco, senha, router };

    if (userType === "motorista") {
      // Chama a função de motorista com a CNH
      cadastroMotorista({ ...commonData, cnh });
    } else {
      // Chama a função de passageiro
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
          style={{ flex: 1 }} // Garante que o KAV ocupe o espaço
        >
          {/* ScrollView é essencial para formulários que podem ser maiores que a tela */}
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.formContainer}>
              <Text style={styles.title}>Criar Conta</Text>

              {/* --- SELETOR DE TIPO DE USUÁRIO --- */}
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

              {/* --- CAMPO CONDICIONAL (CNH) --- */}
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

            {/* Link para voltar ao Login */}
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
  lightGray: "#F7F8FA", // Fundo do input e seletor inativo
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
    // Adiciona padding no topo para Android se não for 'safe'
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
  // Container para telas de Login/Cadastro (centralizado)
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60, // Espaço no topo e base
  },
  contentContainer: {
    width: "90%",
    alignItems: "center",
  },
  formContainer: {
    width: "90%", // Ocupa 90% da largura da tela
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
    alignSelf: "flex-start", // Alinha o label à esquerda
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },

  // -- Inputs --
  inputGroup: {
    width: "100%",
    marginBottom: 15, // Menos espaço entre os inputs
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

  // -- Botões e Links --
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
    top: Platform.OS === "android" ? 35 : 10, // Ajuste para o padding do Android
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

  // --- NOVOS ESTILOS PARA O SELETOR DE TIPO ---
  userTypeSelector: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    marginBottom: 25,
    padding: 4,
  },
  userTypeButton: {
    flex: 1, // Divide o espaço igualmente
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

  /* Seus estilos antigos (não usados aqui) */
  // map: { ... },
  // card: { ... },
});
