import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import { Alert, Platform, TouchableOpacity } from 'react-native';


export default function BotaoVoltar() {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ padding: 5}}
        >
            <Ionicons name="arrow-back" size={15} color="black" />
        </TouchableOpacity>
    );
}

const BASE_URL = 'http://192.168.100.192:3000';
// const BASE_URL = 'http://localhost:3000';

async function validarCampos(dados = {}) {
  if (typeof dados !== 'object' || dados === null) {
    throw new Error('Dados inválidos para validação.');
  }

  const { nome, email, num_telefone, endereco, senha, cnh, motorista = false } = dados;
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
    throw new Error('Por favor, preencha todos os campos.');
  }

  const nomePartes = nome.trim().split(' ').filter(Boolean);
  if (nomePartes.length < 2) {
    throw new Error('Por favor, insira o nome completo.');
  }

  if (!emailRegex.test(email)) throw new Error('Por favor, insira um e-mail válido.');
  if (senha.length < 6) throw new Error('A senha deve ter no mínimo 6 caracteres.');
  if (!senhaRegex.test(senha)) throw new Error('Senha deve conter pelo menos 1 letra maiúscula e 1 número.');
  if (!num_telefoneRegex.test(num_telefone)) throw new Error('Insira um número válido (com DDD).');
  if (motorista && !cnhRegex.test(cnh)) throw new Error('CNH inválida. Deve conter 11 dígitos numéricos.');
}

async function cadastrarUsuario(dados, motorista = false, router) {
  try {
    await validarCampos({ ...dados, motorista });

    const endpoint = motorista ? '/users/motorista' : '/users/passageiro';

    const body = {
      nome: dados.nome,
      email: dados.email,
      num_telefone: dados.num_telefone,
      endereco: dados.endereco,
      senha: dados.senha,
      ...(motorista && { cnh: dados.cnh }),
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 409) {
        if (Platform.OS === 'web') {
          alert('Erro! Usuário já existe.');
        } else {
          Alert.alert('Erro', 'Usuário já existe!');
        }
      } else {
        Alert.alert("Erro", data.message || "Erro ao cadastrar.");
      }
      return;
    }

    if (Platform.OS === 'web') {
      alert('Sucesso! Cadastro realizado.');
      router.push('/login');
    } else {
      Alert.alert('Sucesso', 'Cadastro realizado!');
      router.push('/login');
    }

  } catch (error) {
    console.log('Erro no cadastro:', error);
    if (Platform.OS === 'web') {
      alert(error.message || 'Erro inesperado.');
    } else {
      Alert.alert('Erro', error.message || 'Erro inesperado.');
    }
  }
}

export async function cadastroPassageiro({ nome, email, num_telefone, endereco, senha, router }) {
  await cadastrarUsuario({ nome, email, num_telefone, endereco, senha }, false, router);
}

export async function cadastroMotorista({ nome, email, num_telefone, endereco, senha, cnh, router }) {
  await cadastrarUsuario({ nome, email, num_telefone, endereco, senha, cnh, }, true, router);
}

async function validarCamposLogin({ email, senha }) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email?.trim() || !senha?.trim()) throw new Error('Por favor, preencha todos os campos.');
  if (!emailRegex.test(email)) throw new Error('Por favor, insira um e-mail válido.');
}

export async function login({ email, senha, router }) {
  try {
    await validarCamposLogin({ email, senha });

    const BASE_URL = 'http://192.168.100.192:3000';
    // const BASE_URL = 'http://localhost:3000';
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();

    if (response.ok) {

      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('tipo', data.tipo);
      
      if (Platform.OS === 'web') {
        alert('Sucesso! Login realizado.');
      } else {
        Alert.alert('Sucesso', 'Login realizado!');
      }

      if (data.tipo === 'motorista') {
        router.push('/registroVeiculo');
      } else if (data.tipo === 'passageiro') {
        router.push('/solicitarViagem');
      } else {
        router.push('/');
      }

    } else {
      const message = data.message || 'Falha no login.';
      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert('Erro', message);
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (Platform.OS === 'web') {
      alert(message);
    } else {
      Alert.alert('Erro', message);
    }
  }
}

export async function cadastrarVeiculo({ tipo, placa, modelo, cor, passageiros_maximos, chassi }) {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      alert('Usuário não autenticado!');
      return;
    }

    const response = await fetch(`${BASE_URL}/veiculo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        tipo,
        placa,
        modelo,
        cor,
        passageiros_maximos,
        chassi
      })
    });

    const data = await response.json();

    if (response.ok) {
      alert('Veículo cadastrado com sucesso!');
    } else {
      alert(data.message || 'Erro ao cadastrar veículo');
    }
  } catch (error) {
    console.error(error);
    alert('Erro de rede ao cadastrar veículo');
  }
}


