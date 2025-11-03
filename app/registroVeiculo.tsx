import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { globalStyles as styles } from './style';
import  BotaoVoltar from './script';


export default function RegistroVeiculo() {
    const router = useRouter();

    const [tipo, setTipo] = useState('');
    const [placa, setPlaca] = useState('');
    const [modelo, setModelo] = useState('');
    const [cor, setCor] = useState('');
    const [capacidade, setCapacidade] = useState('');
    const [chassi, setChassi] = useState('');

    return (
        <View style={styles.container}>
            <Text style={styles.title3}>Novo Veículo</Text>
            <View style={{ gap: 10, marginTop: 50 }}>
                <TextInput value={tipo} onChangeText={setTipo} placeholder="Tipo" placeholderTextColor="#c9c9c9ff" style={styles.input2}></TextInput>
                <TextInput value={placa} onChangeText={setPlaca} placeholder="Placa" placeholderTextColor="#c9c9c9ff" style={styles.input2}></TextInput>
                <TextInput value={modelo} onChangeText={setModelo} placeholder="Modelo" placeholderTextColor="#c9c9c9ff" style={styles.input2}></TextInput>
                <TextInput value={cor} onChangeText={setCor} placeholder="Cor" placeholderTextColor="#c9c9c9ff" style={styles.input2}></TextInput>
                <TextInput value={capacidade} onChangeText={setCapacidade} placeholder="Capacidade" placeholderTextColor="#c9c9c9ff" style={styles.input2}></TextInput>
                <TextInput value={chassi} onChangeText={setChassi} placeholder="Chassi" placeholderTextColor="#c9c9c9ff" style={styles.input2}></TextInput>
                <TouchableOpacity style={[styles.Button, { marginTop: 50, alignItems: 'center' }]}>
                    <Text style={styles.buttonText}>Cadastrar Veículo</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: "row", alignItems: "center"}}>
                    <BotaoVoltar />
                <Text style={{ fontSize: 15 }}>Voltar</Text>
            </View>
            </View>
        </View>
    );
}