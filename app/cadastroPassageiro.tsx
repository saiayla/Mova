import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { cadastroPassageiro } from './script.js';
import { globalStyles as styles } from './style';

export default function passageiro() {
    const router = useRouter();

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [num_telefone, setNum_telefone] = useState('');
    const [endereco, setEndereco] = useState('');
    const [senha, setSenha] = useState('');

    return (
        <LinearGradient colors={['#1974F3', '#85E0FA']} style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.title2}>Cadastro</Text>
                <View style={{ width: '100%', gap: 30, padding: 20, alignItems: 'center' }}>
                    <View style={{ gap: 5, width: '80%' }}>
                        <Text>Nome</Text>
                        <TextInput value={nome} onChangeText={setNome} style={styles.input} />
                    </View>
                    <View style={{ gap: 5, width: '80%' }}>
                        <Text>E-mail</Text>
                        <TextInput value={email} onChangeText={setEmail} style={styles.input} />
                    </View>
                    <View style={{ gap: 5, width: '80%' }}>
                        <Text>Celular</Text>
                        <TextInput value={num_telefone} onChangeText={setNum_telefone} style={styles.input}  keyboardType="phone-pad" />
                    </View>
                    <View style={{ gap: 5, width: '80%' }}>
                        <Text>Endereço</Text>
                        <TextInput value={endereco} onChangeText={setEndereco} style={styles.input} />
                    </View>
                    <View style={{ gap: 5, width: '80%' }}>
                        <Text>Senha</Text>
                        <TextInput value={senha} onChangeText={setSenha} secureTextEntry style={styles.input} />
                    </View>
                    <TouchableOpacity style={styles.Button} onPress={() =>
                        cadastroPassageiro({ nome, email, num_telefone, endereco, senha, router })}>
                        <Text style={styles.buttonText}>Cadastrar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
}