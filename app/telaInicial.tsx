import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
// 1. Image e TouchableOpacity foram importados
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// É uma boa prática carregar a imagem uma vez fora da função
// O caminho está baseado no seu log de erro
const busImage = require("../assets/images/bus.png");

export default function TelaInicial() {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#1974F3", "#85E0FA"]} style={styles.container}>
        <View style={styles.content}>
          {/* 2. Source agora usa a constante da imagem */}
          <Image source={busImage} style={styles.logo} resizeMode="contain" />

          <Text style={styles.title}>Bem-vindo ao Mova</Text>
          <Text style={{ color: "#FFF", fontSize: 18 }}>
            Conectando você a seu motorista
          </Text>

          {/* Link para voltar para a tela inicial */}
        </View>
        <View style={styles.parteBaixo}>
          {/* 3. Adicionado "asChild" e trocado View por TouchableOpacity */}
          <Link href={"/login"} asChild>
            <TouchableOpacity style={styles.botao}>
              <Text style={styles.txtBotao}>Logar</Text>
            </TouchableOpacity>
          </Link>
          <Link href={"/cadastro"} asChild>
            <TouchableOpacity style={styles.botao}>
              <Text style={styles.txtBotao}>Cadastrar-se</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    height: "60%",
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    paddingInline: 20,
  },
  // 4. Adicionado o estilo 'logo' que faltava
  logo: {
    width: "70%",
    height: 150,
    marginBottom: 20,
    alignSelf: "center",
  },
  title: {
    fontSize: 46,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#FFF",
  },
  link: {
    marginTop: 20,
    color: "#007AFF",
    fontSize: 16,
  },
  parteBaixo: {
    width: "100%",
    height: "40%",
    padding: 20,
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
  },
  botao: {
    // Definindo uma largura fixa para os botões ficarem iguais
    width: 350,
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  txtBotao: {
    fontSize: 16,
    color: "#555555",
  },
});
