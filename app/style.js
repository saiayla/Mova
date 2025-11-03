import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  form: {
    paddingVertical: 40,
    width: '100%',
    backgroundColor: '#F6F6F6',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    padding: 10,
  },
  input2: {
    width: 250,
    borderWidth: 1,
    borderColor: '#E6EEF8',
    borderRadius: 15,
    padding: 10,
    backgroundColor: '#F8FAFF',
  },
  Button:{
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#1F7AF3',
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logo: {
    width: 640,
    height: 280,
    marginBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 40
  },
  title2: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1F7AF3',
    marginBottom: 5
  },
  title3: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5
  },
});