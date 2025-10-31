import React, { useState } from "react";
import {
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert
} from "react-native";

import { useFonts } from "expo-font";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen({
  navigation,
}) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

 const fazerLogin = async () => {
  try {
    const res = await fetch("https://ye0elggnhg.execute-api.us-east-1.amazonaws.com/prod2/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    const data = await res.json();
    console.log(data); // Para depuração

    if (res.status === 200) {
      if (data.user.tipoUsuario === "admin") {
        navigation.navigate("Inicio");
      } else {
        navigation.navigate("Inicio");
      }
    } else {
      Alert.alert("Erro", data.message || "Falha no login");
    }
  } catch (err) {
    Alert.alert("Erro", err.message);
  }
};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#305F49" }}>
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require("../assets/logo.png")}
      />

      <View style={styles.loginCard}>
        <Text style={styles.title}>
          Entre na sua{"\n"}conta
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu email"
            placeholderTextColor="#fff"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            placeholderTextColor="#fff"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />
        </View>


        <TouchableOpacity
          style={styles.button}
          onPress={fazerLogin}
        >
          <Text style={styles.buttonText}>
            Login
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("RedefinirSenha")
          }
        >
          <Text style={styles.forgotPassword}>
            Esqueceu a senha?
          </Text>
        </TouchableOpacity>
      </View>
    </View>
    </SafeAreaView>
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
    height: 280,
    width: 280,
    resizeMode: "contain",
  },
  loginCard: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#305F49",
    borderTopLeftRadius: 120,
    alignItems: "center",
    paddingTop: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
    fontFamily: "Roboto-Bold",
  },
  inputGroup: {
    width: "80%",
    marginVertical: 10,
    alignItems: "flex-start",
  },
  label: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    width: '100%',
    backgroundColor: "rgba(159, 209, 183, 0.69)",
    borderRadius: 8,
    height: 50,
    padding: 10,
    fontSize: 16,
    color: "#fff",
    fontFamily: "Roboto-Bold",
  },

  button: {
    width: "60%",
    backgroundColor: "#9FD1B7",
    borderRadius: 8,
    padding: 15,
    height: 60,
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
  forgotPassword: {
    marginTop: 15,
    marginBottom: 10,
    color: "#fff",
    fontSize: 16,
    textDecorationLine: "underline",
    fontFamily: "Roboto-Bold",
  },
});