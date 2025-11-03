import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { Button, Platform, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { WebView } from 'react-native-webview';

export default function SolicitarViagem() {
  const [origem, setOrigem] = useState('Universidade Vila Velha');
  const [destino, setDestino] = useState('R. Cristóvão Colombo, 479');

  const initialRegion = {
    latitude: -20.3155,
    longitude: -40.3128,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={{ flex: 1 }}>
      {Platform.OS === 'web' ? (
        <WebView
          source={{
            uri: `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(
              'R. Cristóvão Colombo, 479, Vila Velha, ES'
            )}`,
          }}
          style={{ flex: 1 }}
        />
      ) : (
        <MapView style={{ flex: 1 }} initialRegion={initialRegion}>
          <Marker coordinate={{ latitude: -20.3155, longitude: -40.3128 }} title="Você está aqui" />
        </MapView>
      )}

      <View style={{ padding: 10 }}>
        <Text>Origem</Text>
        {Platform.OS === 'web' ? (
          <select value={origem} onChange={(e) => setOrigem(e.target.value)} style={{ width: '100%' }}>
            <option value="Universidade Vila Velha">Universidade Vila Velha</option>
            <option value="Outro Local">Outro Local</option>
          </select>
        ) : (
          <Picker selectedValue={origem} onValueChange={setOrigem}>
            <Picker.Item label="Universidade Vila Velha" value="Universidade Vila Velha" />
            <Picker.Item label="Outro Local" value="Outro Local" />
          </Picker>
        )}

        <Text>Destino</Text>
        {Platform.OS === 'web' ? (
          <select value={destino} onChange={(e) => setDestino(e.target.value)} style={{ width: '100%' }}>
            <option value="R. Cristóvão Colombo, 479">R. Cristóvão Colombo, 479</option>
            <option value="Outro Local">Outro Local</option>
          </select>
        ) : (
          <Picker selectedValue={destino} onValueChange={setDestino}>
            <Picker.Item label="R. Cristóvão Colombo, 479" value="R. Cristóvão Colombo, 479" />
            <Picker.Item label="Outro Local" value="Outro Local" />
          </Picker>
        )}

        <Button title="Buscar" onPress={() => console.log({ origem, destino })} />
      </View>
    </View>
  );
}
