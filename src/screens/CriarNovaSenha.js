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
import { useFonts } from 'expo-font';

export default function LoginScreen({navigation}) {
const [email, setEmail] = useState("");
const [senha, setSenha] = useState("");

const handleLogin = () => {
  if (email === "123" && senha === "123") {
    navigation.navigate("App");
  } else {
    Alert.alert("Erro", "Email ou senha incorretos");
  }
};

  // const [email, setEmail] = useState("");
  // const [senha, setSenha] = useState("");
  // const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    'Roboto-Bold': require('../../assets/fonts/KantumruyPro-VariableFont_wght.ttf'),
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  // const handleLogin = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch("https://SEU_ENDPOINT_API/login", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email, senha })
  //     });

  //     const data = await response.json();

  //     if (data.success) {
  //       alert("Login efetuado com sucesso!");
  //     } else {
  //       alert("Email ou senha incorretos");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     alert("Erro ao fazer login");
  //   }
  //   setLoading(false);
  // };

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../assets/logo.png')} />

      <View style={styles.loginCard}>
        <Text style={styles.title}>Entre na sua{"\n"}conta</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#fff"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#fff"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
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
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "Roboto-Bold",
  },
  forgotPassword: {
    marginTop: 15,
    color: "#fff",
    fontSize: 16,
    textDecorationLine: "underline",
    fontFamily: "Roboto-Bold",
  },
});