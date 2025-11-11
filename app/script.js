import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Alert, Platform, TouchableOpacity } from "react-native";

export const BASE_URL = "http://10.5.10.155:3000";
// const BASE_URL = 'http://172.20.10.4:3000'; //laila
// const BASE_URL = 'http://10.5.10.155:3000'; //gianluca

export default function BotaoVoltar() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={{ padding: 5 }}
    >
      <Ionicons name="arrow-back" size={15} color="black" />
    </TouchableOpacity>
  );
}

async function validarCampos(dados = {}) {
  if (typeof dados !== "object" || dados === null) {
    throw new Error("Dados inválidos para validação.");
  }

  const {
    nome,
    email,
    num_telefone,
    endereco,
    senha,
    cnh,
    motorista = false,
  } = dados;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const senhaRegex = /^(?=.*[A-Z])(?=.*\d).+$/;
  const num_telefoneRegex = /^\d{10,11}$/;
  const cnhRegex = /^\d{11}$/;

  if (
    !nome?.trim() ||
    !email?.trim() ||
    !num_telefone?.trim() ||
    !endereco?.trim() ||
    (motorista && !cnh?.trim()) ||
    !senha?.trim()
  ) {
    throw new Error("Por favor, preencha todos os campos.");
  }

  const nomePartes = nome.trim().split(" ").filter(Boolean);
  if (nomePartes.length < 2) {
    throw new Error("Por favor, insira o nome completo.");
  }

  if (!emailRegex.test(email))
    throw new Error("Por favor, insira um e-mail válido.");
  if (senha.length < 6)
    throw new Error("A senha deve ter no mínimo 6 caracteres.");
  if (!senhaRegex.test(senha))
    throw new Error(
      "Senha deve conter pelo menos 1 letra maiúscula e 1 número."
    );
  if (!num_telefoneRegex.test(num_telefone))
    throw new Error("Insira um número válido (com DDD).");
  if (motorista && !cnhRegex.test(cnh))
    throw new Error("CNH inválida. Deve conter 11 dígitos numéricos.");
}

async function cadastrarUsuario(dados, motorista = false, router) {
  try {
    await validarCampos({ ...dados, motorista });

    const endpoint = motorista ? "/users/motorista" : "/users/passageiro";

    const body = {
      nome: dados.nome,
      email: dados.email,
      num_telefone: dados.num_telefone,
      endereco: dados.endereco,
      senha: dados.senha,
      ...(motorista && { cnh: dados.cnh }),
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 409) {
        if (Platform.OS === "web") {
          alert("Erro! Usuário já existe.");
        } else {
          Alert.alert("Erro", "Usuário já existe!");
        }
      } else {
        Alert.alert("Erro", data.message || "Erro ao cadastrar.");
      }
      return;
    }

    if (Platform.OS === "web") {
      alert("Sucesso! Cadastro realizado.");
      router.push("/login");
    } else {
      Alert.alert("Sucesso", "Cadastro realizado!");
      router.push("/login");
    }
  } catch (error) {
    console.log("Erro no cadastro:", error);
    if (Platform.OS === "web") {
      alert(error.message || "Erro inesperado.");
    } else {
      Alert.alert("Erro", error.message || "Erro inesperado.");
    }
  }
}

export async function cadastroPassageiro({
  nome,
  email,
  num_telefone,
  endereco,
  senha,
  router,
}) {
  await cadastrarUsuario(
    { nome, email, num_telefone, endereco, senha },
    false,
    router
  );
}

export async function cadastroMotorista({
  nome,
  email,
  num_telefone,
  endereco,
  senha,
  cnh,
  router,
}) {
  await cadastrarUsuario(
    { nome, email, num_telefone, endereco, senha, cnh },
    true,
    router
  );
}

async function validarCamposLogin({ email, senha }) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email?.trim() || !senha?.trim())
    throw new Error("Por favor, preencha todos os campos.");
  if (!emailRegex.test(email))
    throw new Error("Por favor, insira um e-mail válido.");
}

export async function login({ email, senha, router }) {
  try {
    await validarCamposLogin({ email, senha });

    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();

    if (response.ok) {
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("tipo", data.tipo);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      console.log("data", data);

      if (Platform.OS === "web") {
        alert("Sucesso! Login realizado.");
      } else {
        // Alert.alert("Sucesso", "Login realizado!");
      } // --- CORREÇÃO PRINCIPAL --- // Use router.replace() em vez de router.push() // Isso impede que o usuário aperte "Voltar" e retorne para a tela de Login.

      if (data.tipo === "motorista") {
        router.replace("/homeMotorista");
      } else if (data.tipo === "passageiro") {
        router.replace("/homePassageiro"); // Lembre-se: o arquivo 'app/solicitarViagem.tsx' precisa existir
      } else {
        router.replace("/"); // Rota padrão (ex: tela inicial)
      }
    } else {
      const message = data.message || "E-mail ou senha inválidos.";
      if (Platform.OS === "web") {
        alert(message);
      } else {
        Alert.alert("Erro", message);
      }
    }
  } catch (error) {
    // --- CORREÇÃO DE ERRO DE REDE ---
    // Esta mensagem de erro personalizada ajuda a identificar o problema de 'localhost'
    let message = error instanceof Error ? error.message : String(error);

    if (message.includes("Network request failed")) {
      message =
        "Não foi possível conectar ao servidor. Verifique sua rede e o IP do servidor.";
    }

    if (Platform.OS === "web") {
      alert(message);
    } else {
      Alert.alert("Erro de Conexão", message);
    }
  }
}

export async function cadastrarVeiculo({
  tipo,
  placa,
  modelo,
  cor,
  passageiros_maximos,
  chassi,
  router,
}) {
  try {
    const placaRegex = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/i;
    if (!placaRegex.test(placa)) {
      alert("Placa inválida. Use o formato ABC1D23.");
      return;
    }
    const capacidadeNum = Number(passageiros_maximos);
    if (isNaN(capacidadeNum) || capacidadeNum <= 0) {
      alert("Capacidade deve ser um número positivo.");
      return;
    }
    if (chassi.length < 17) {
      alert("Chassi inválido. Deve ter pelo menos 17 caracteres.");
      return;
    }

    const token = await AsyncStorage.getItem("token");
    if (!token) {
      alert("Usuário não autenticado!");
      return;
    }

    const response = await fetch(`${BASE_URL}/veiculo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        tipo,
        placa,
        modelo,
        cor,
        passageiros_maximos,
        chassi,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      Alert.alert("Veículo cadastrado com sucesso!");
      // router.push("/veiculos");
    } else {
      Alert.alert(data.message || "Erro ao cadastrar veículo");
    }
    // router.push("/veiculos");
  } catch (error) {
    console.error(error);
    alert("Erro de rede ao cadastrar veículo");
  }
}

export async function excluirVeiculo(id, setVeiculos) {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      console.error("Sem token no AsyncStorage");
      if (Platform.OS === "web") alert("Usuário não autenticado");
      else Alert.alert("Erro", "Usuário não autenticado");
      return;
    }

    console.log("[DELETE] URL:", `${BASE_URL}/veiculo/${id}`);
    console.log("[DELETE] Token:", token);

    const response = await fetch(`${BASE_URL}/veiculo/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("[DELETE] status:", response.status, "ok:", response.ok);

    // tenta ler body (pode ser texto ou json)
    let text;
    try {
      text = await response.text();
      console.log("[DELETE] body text:", text);
    } catch (e) {
      console.log("[DELETE] não conseguiu ler body:", e);
    }

    // se backend retornar JSON com mensagem de erro, tenta parsear
    try {
      const maybeJson = JSON.parse(text || "{}");
      console.log("[DELETE] body json:", maybeJson);
    } catch (_) {
      /* ignora */
    }

    // tratar códigos esperados:
    if (response.ok) {
      // se 200/204 etc
      setVeiculos((prev) => prev.filter((v) => v.id_veiculo !== id));
      if (Platform.OS === "web") alert("Veículo excluído com sucesso!");
      else Alert.alert("Sucesso", "Veículo excluído com sucesso!");
      return;
    }

    // se não ok, joga um erro com info
    throw new Error(`DELETE falhou: status ${response.status} - ${text}`);
  } catch (err) {
    console.error("Erro ao excluir veículo:", err);
    if (Platform.OS === "web") alert(`Erro ao excluir veículo: ${err.message}`);
    else
      Alert.alert("Erro", err.message || "Não foi possível excluir o veículo.");
  }
}
