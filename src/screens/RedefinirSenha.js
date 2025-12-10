import React, { useState } from "react";
import {
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ForgotPasswordEmail({ navigation }) {
  const [email, setEmail] = useState('');

  const handleSendCode = async () => {
    if (!email) {
      Alert.alert('Erro', 'Digite seu email');
      return;
    }

    // Exemplo de chamada para o backend
    try {
      const res = await fetch(
  'https://jsuitlgn0e.execute-api.us-east-1.amazonaws.com/prod/reset-password/request',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  }
);


      const data = await res.json();

      if (data.success) {
    Alert.alert('Código gerado', `Código: ${data.code}`);
    navigation.navigate('InserirCodigo', { email });
      } else {
        Alert.alert('Erro', data.message || 'Erro ao enviar código');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro de conexão');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#305F49" }}>
    <View style={styles.container}>
      <View style={styles.setaContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={32}
            color="#305F49"
          />
        </TouchableOpacity>
      </View>

      <Image
        style={styles.logo}
        source={require("../assets/logo.png")}
      />

      <View style={styles.loginCard}>
        <Text style={styles.titleHeader}>
          Redefinir senha
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
        <View style={styles.contentText}>
          <Text style={styles.info}>
            Insira seu e-mail para receber um
            código para redefinir sua senha.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSendCode}
        >
          <Text style={styles.buttonText}>
            Confirmar
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
    overflow: "hidden",
  },
  logo: {
    height: 280,
    width: 280,
    resizeMode: "contain",
  },
  loginCard: {
    flex: 1,
    width: "100%",
    backgroundColor: "#305F49",
    borderTopLeftRadius: 120,
    alignItems: "center",
  },
  setaContainer: {
    marginTop: 10,
    marginLeft: 15,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  titleHeader: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "Roboto-Bold",
    textAlign: "center",
    marginTop: 40,
    marginBottom: 20,
  },
    inputGroup: {
    width: "80%",
    marginVertical: 10,
    alignItems: "flex-start",
  },
  input: {
    width: '100%',
    backgroundColor: "rgba(159, 209, 183, 0.69)",
    borderRadius: 8,
    padding: 10,
    height: 50,
    fontSize: 16,
    color: "#fff",
    fontFamily: "Roboto-Bold",
  },
  contentText: {
    width: '80%',
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  button: {
    width: "60%",
    backgroundColor: "#9FD1B7",
    borderRadius: 8,
    padding: 15,
    height: 60,
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
