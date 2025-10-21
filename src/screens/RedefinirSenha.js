import React, { useState } from "react";
import {
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function RedefinirSenha({ navigation }) {
  const [senha, setSenha] = useState("");

  const handleLogin = () => {
    console.log("Senha redefinida:", senha);
    // Aqui você pode redirecionar ou mostrar mensagem de sucesso
    navigation.navigate("Home"); 
  };

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../assets/logo.png')} />

      <View style={styles.loginCard}>
        <Text style={styles.title}>Redefinir{"\n"}Senha</Text>

        <TextInput
          style={styles.input}
          placeholder="Nova senha"
          placeholderTextColor="#fff"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
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
    height: 250,
    width: 250,
    resizeMode: "contain",
  },
  loginCard: {
    width: "100%",
    backgroundColor: "#679880",
    borderTopLeftRadius: 120,
    alignItems: "center",
    paddingTop: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
    fontFamily: "Roboto-Bold",
  },
  input: {
    width: "80%",
    backgroundColor: "#9FD1B7",
    borderRadius: 8,
    padding: 14,
    marginVertical: 10,
    fontSize: 16,
    color: "#fff",
    fontFamily: "Roboto-Bold",
  },
  button: {
    width: "80%",
    backgroundColor: "#305F49",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Roboto-Bold",
  },
});
