import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo / Título */}
      <Image style={styles.logo} source={require('../assets/logo.png')} />
      {/* Card de login */}
      <View style={styles.loginCard}>
        <Text style={styles.title}>Entre na sua{"\n"}conta</Text>

        {/* Input Email */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#d9e6dd"
          value={email}
          onChangeText={setEmail}
        />

        {/* Input Senha */}
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#d9e6dd"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        {/* Botão Login */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* Esqueceu a senha */}
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  logo: {
    marginTop: 50,
    marginBottom: 30,
    alignItems: "center",
    height: 500,
  },
  loginCard: {
    flex: 1,
    width: "100%",
    backgroundColor: "#5d8b71",
    borderTopLeftRadius: 120,
    alignItems: "center",
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    width: "80%",
    backgroundColor: "#9fbfae",
    borderRadius: 8,
    padding: 12,
    marginVertical: 10,
    fontSize: 16,
    color: "#fff",
  },
  button: {
    width: "80%",
    backgroundColor: "#214631",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  forgotPassword: {
    marginTop: 15,
    color: "#d0e6db",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
