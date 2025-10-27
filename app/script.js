import { Alert, Platform } from 'react-native';

const BASE_URL = 'http://localhost:3000'; // usa o IP da rede local, não localhost se for em celular

async function validarCampos({ nome, email, senha, endereco, num_telefone }) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const senhaRegex = /^(?=.*[A-Z])(?=.*\d).+$/;
  const telefoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;

  if (!nome?.trim() || !email?.trim() || !senha?.trim() || !endereco?.trim() || !num_telefone?.trim()) {
    throw new Error('Por favor, preencha todos os campos.');
  }

  if (!emailRegex.test(email)) throw new Error('Por favor, insira um e-mail válido.');
  if (!senhaRegex.test(senha)) throw new Error('Senha deve conter pelo menos 1 letra maiúscula e 1 número.');
  if (!telefoneRegex.test(num_telefone)) throw new Error('Número de telefone inválido.');
}

async function cadastrarUsuario(dados, motorista = false) {
  const { router } = dados;
  try {
    // Validação básica
    // await validarCampos(dados);

    // Endpoint
    const endpoint = motorista ? '/users/motorista' : '/users/passageiro';

    // Corpo da requisição
    const body = {
      nome: dados.nome,
      email: dados.email,
      senha: dados.senha,
      endereco: 'dr dido fontes,937',
      num_telefone: '27997330514',
    };

    // Requisição
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'Erro ao cadastrar.');

    if (Platform.OS === 'web') {
      alert('Sucesso! Cadastro realizado.');
    } else {
      Alert.alert('Sucesso', 'Cadastro realizado!');
      router.push('./login');
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

// Funções exportadas
export async function cadastroPassageiro({ nome, email, senha, endereco, num_telefone, router }) {
  await cadastrarUsuario({ nome, email, senha, endereco, num_telefone, router });
}

export async function cadastroMotorista({ nome, email, senha, endereco, num_telefone, router }) {
  await cadastrarUsuario({ nome, email, senha, endereco, num_telefone, router }, true);
}

// LOGIN
async function validarCamposLogin({ email, senha }) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const senhaRegex = /^(?=.*[A-Z])(?=.*\d).+$/;

  if (!email?.trim() || !senha?.trim()) throw new Error('Por favor, preencha todos os campos.');
  if (!emailRegex.test(email)) throw new Error('Por favor, insira um e-mail válido.');
  if (!senhaRegex.test(senha)) throw new Error('Senha deve conter pelo menos 1 letra maiúscula e 1 número.');
}

export async function login({ email, senha, router }) {
  try {
    await validarCamposLogin({ email, senha });

    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();

    if (response.ok) {
      Alert.alert('Sucesso', 'Login realizado!');
      router.push('../index');
    } else {
      Alert.alert('Erro', data.message || 'Falha no login.');
    }
  } catch (error) {
    console.log('Erro no login:', error);
    Alert.alert('Erro', error.message || 'Erro inesperado.');
  }
}
