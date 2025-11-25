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

export default function NewPassword({ navigation, route }) {
  const { email, code } = route.params;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    try {
      const res = await fetch('https://jsuitlgn0e.execute-api.us-east-1.amazonaws.com/prod/reset-password/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
  email: email,
  novaSenha: password
}),

      });

      const data = await res.json();

      if (data.success) {
        Alert.alert('Sucesso', 'Senha alterada com sucesso');
        navigation.navigate('Login');
      } else {
        Alert.alert('Erro', data.message || 'Erro ao alterar senha');
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
          Criar nova senha
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Criar nova senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua nova senha"
            placeholderTextColor="#fff"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirmar nova senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite a senha novamente"
            placeholderTextColor="#fff"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleChangePassword}
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
    height: '100%',
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
