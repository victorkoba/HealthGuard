import React, { useState } from "react";
import {
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from '@expo/vector-icons'; // Biblioteca de ícones

export default function RedefinirSenha({ navigation }) {
  const [senha, setSenha] = useState("");
  const [senhaNova, setSenhaNova] = useState("");

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../assets/logo.png')} />

      <View style={styles.loginCard}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons style={styles.iconSeta} name="arrow-back" size={32} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.titleHeader}>Criar nova senha</Text>

        <TextInput
          style={styles.input}
          placeholder="Nova senha"
          placeholderTextColor="#fff"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />
         <TextInput
          style={styles.input}
          placeholder="Confirmar nova senha"
          placeholderTextColor="#fff"
          value={senhaNova}
          onChangeText={setSenhaNova}
          secureTextEntry
        />

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('Login')}
        >          
          <Text style={styles.buttonText}>Confirmar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    height: 350,
    width: 350,
    resizeMode: "contain",
  },
  loginCard: {
    flex: 1,
    width: "100%",
    backgroundColor: "#679880",
    borderTopLeftRadius: 120,
    alignItems: "center",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  iconSeta: {
    marginLeft: -150,
    marginTop: 20,
  },
  titleHeader: {
    width: '100%',
    marginLeft: 60,
    marginBottom: 20,
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "Roboto-Bold",
    marginRight: 40,
    marginTop: 15,
  },
  input: {
    width: "100%",
    backgroundColor: "#9FD1B7",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: "#fff",
    fontFamily: "Roboto-Bold",
    marginBottom: 20,
  },
  contentText: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  button: {
    width: "80%",
    backgroundColor: "#305F49",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 50,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Roboto-Bold",
  },
});
