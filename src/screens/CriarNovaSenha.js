import React, { useState } from "react";
import {
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RedefinirSenha({
  navigation,
}) {
  const [senhaNova, setSenhaNova] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

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
            value={senhaNova}
            onChangeText={setSenhaNova}
            secureTextEntry
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirmar nova senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite a senha novamente"
            placeholderTextColor="#fff"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("Login")
          }
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
