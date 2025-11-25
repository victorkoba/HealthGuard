import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { QueryCommand  } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";
import { dynamoDB } from "../../awsConfig";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

 const fazerLogin = async () => {
  if (!email || !senha) {
    Alert.alert("Erro", "Preencha todos os campos!");
    return;
  }

  setLoading(true);

  try {
    const data = await dynamoDB.send(
      new QueryCommand({
        TableName: "usuarios",
        IndexName: "email-index", // ✅ usa o índice corretamente
        KeyConditionExpression: "email = :email",
        ExpressionAttributeValues: {
          ":email": email,
        },
      })
    );

    if (!data.Items || data.Items.length === 0) {
      Alert.alert("Erro", "Usuário não encontrado!");
      return;
    }

    const usuario = data.Items[0];

    const senhaHash = usuario.senha; // ✅ NÃO usa mais .S

    const senhaCorreta = await bcrypt.compare(senha, senhaHash);

    if (!senhaCorreta) {
      Alert.alert("Erro", "Senha incorreta!");
      return;
    }

const usuarioFormatado = {
  id: String(usuario.id), // ✅ converte para string
  nome: usuario.nome,
  email: usuario.email,
  tipo: usuario.tipo,
};

await AsyncStorage.setItem("usuarioId", String(usuarioFormatado.id));

    Alert.alert("Sucesso", `Bem-vindo, ${usuarioFormatado.nome}!`);
    navigation.navigate("Inicio");

  } catch (error) {
    console.error("Erro ao fazer login:", error);
    Alert.alert("Erro", "Falha na autenticação.");
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#305F49" }}>
      <View style={styles.container}>
        <Image style={styles.logo} source={require("../assets/logo.png")} />

        <View style={styles.loginCard}>
          <Text style={styles.title}>Entre na sua{"\n"}conta</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu email"
              placeholderTextColor="#fff"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
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
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("RedefinirSenha")}
          >
            <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
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
    width: "100%",
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
