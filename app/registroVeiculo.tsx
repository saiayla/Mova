import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import BotaoVoltar from './script';
import { cadastrarVeiculo } from './script.js';
import { globalStyles as styles } from './style';


export default function RegistroVeiculo() {
    const router = useRouter();

    const [tipo, setTipo] = useState('');
    const [placa, setPlaca] = useState('');
    const [modelo, setModelo] = useState('');
    const [cor, setCor] = useState('');
    const [passageiros_maximos, setPassageiros_maximos] = useState('');
    const [chassi, setChassi] = useState('');

    return (
        <View style={styles.container}>
            <Text style={styles.title3}>Novo Veículo</Text>
            <View style={{ gap: 10, marginTop: 50 }}>
                <View>
                    <Picker selectedValue={tipo} onValueChange={(value) => setTipo(value)} style={{padding: 5, backgroundColor: '#F8FAFF', borderWidth: 1, borderColor: '#E6EEF8', borderRadius: 15, color: '#c9c9c9ff', height: 40}}>
                        <Picker.Item label="Selecione o tipo" value="" />
                        <Picker.Item label="Van" value="Van" />
                        <Picker.Item label="Ônibus" value="Ônibus" />
                    </Picker>
                </View>
                <TextInput value={placa} onChangeText={setPlaca} placeholder="Placa" placeholderTextColor="#c9c9c9ff" style={styles.input2}></TextInput>
                <TextInput value={modelo} onChangeText={setModelo} placeholder="Modelo" placeholderTextColor="#c9c9c9ff" style={styles.input2}></TextInput>
                <View>
                    <Picker selectedValue={cor} onValueChange={(value) => setCor(value)} style={{padding: 5, backgroundColor: '#F8FAFF', borderWidth: 1, borderColor: '#E6EEF8', borderRadius: 15, color: '#c9c9c9ff', height: 40}}>
                        <Picker.Item label="Selecione a cor" value="" />
                        <Picker.Item label="Branco" value="Branco" />
                        <Picker.Item label="Preto" value="Preto" />
                        <Picker.Item label="Prata" value="Prata" />
                        <Picker.Item label="Vermelho" value="Vermelho" />
                        <Picker.Item label="Azul" value="Azul" />
                        <Picker.Item label="Cinza" value="Cinza" />
                        <Picker.Item label="Verde" value="Verde" />
                        <Picker.Item label="Amarelo" value="Amarelo" />
                    </Picker>
                </View>

                <TextInput value={passageiros_maximos} keyboardType="numeric" onChangeText={setPassageiros_maximos} placeholder="Capacidade" placeholderTextColor="#c9c9c9ff" style={styles.input2}></TextInput>
                <TextInput value={chassi} onChangeText={setChassi} placeholder="Chassi" placeholderTextColor="#c9c9c9ff" style={styles.input2}></TextInput>
                <TouchableOpacity style={[styles.Button, { marginTop: 50, alignItems: 'center' }]} onPress={() =>
                    cadastrarVeiculo({ tipo, placa, modelo, cor, passageiros_maximos, chassi })}>
                    <Text style={styles.buttonText}>Cadastrar Veículo</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <BotaoVoltar />
                    <Text style={{ fontSize: 15 }}>Voltar</Text>
                </View>
            </View>
        </View>
    );
}