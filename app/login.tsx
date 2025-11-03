import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { login } from './script';
import  BotaoVoltar from './script';
import { globalStyles as styles } from './style';

export default function LoginScreen() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    return (
        <LinearGradient colors={['#1974F3', '#85E0FA']} style={styles.container}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                <BotaoVoltar />
                <Text style={{ fontSize: 15 }}>Voltar</Text>
           </View>
            <View style={styles.form}>
                <Text style={styles.title2}>Login</Text>
                <View style={{width: '100%', gap: 30, padding: 20, alignItems: 'center'}}>
                    <View style={{gap: 5, width: '80%'}}>
                        <Text>E-mail</Text>
                        <TextInput value={email} onChangeText={setEmail} style={styles.input}/>
                    </View>
                    <View style={{gap: 5, width: '80%'}}>
                        <Text>Senha</Text>
                        <TextInput value={senha} onChangeText={setSenha} secureTextEntry style={styles.input}/>
                    </View>
                    <TouchableOpacity onPress={() => login({ email, senha, router })} style={styles.Button}>
                        <Text style={styles.buttonText}>Entrar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
}