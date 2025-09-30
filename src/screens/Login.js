import React, { useState } from "react";
import {
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { useFonts } from 'expo-font';

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    'Roboto-Bold': require('../../assets/fonts/KantumruyPro-VariableFont_wght.ttf'),
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://SEU_ENDPOINT_API/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
      });

      const data = await response.json();

      if (data.success) {
        alert("Login efetuado com sucesso!");
        // Aqui você pode navegar para a próxima tela
      } else {
        alert("Email ou senha incorretos");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao fazer login");
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../assets/logo.png')} />

      <View style={styles.loginCard}>
        <Text style={styles.title}>Entre na sua{"\n"}conta</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#d9e6dd"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#d9e6dd"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
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
  },
  logo: {
    marginTop: 50,
    width: 200,
    height: 80,
    resizeMode: "contain",
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
    fontFamily: "Roboto-Bold",
  },
  input: {
    width: "80%",
    backgroundColor: "#9fbfae",
    borderRadius: 8,
    padding: 14,
    marginVertical: 10,
    fontSize: 16,
    color: "#fff",
    fontFamily: "Roboto-Bold",
  },
  button: {
    width: "80%",
    backgroundColor: "#214631",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Roboto-Bold",
  },
  forgotPassword: {
    marginTop: 15,
    color: "#d0e6db",
    fontSize: 14,
    textDecorationLine: "underline",
    fontFamily: "Roboto-Bold",
  },
});
