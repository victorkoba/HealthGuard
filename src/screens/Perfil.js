import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PerfilScreen({ navigation }) {
  const [email, setEmail] = useState("victorkoba08@gmail.com");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const handleConfirmar = () => {
    if (!novaSenha || !confirmarSenha) {
      Alert.alert("Erro", "Preencha todos os campos de senha.");
      return;
    }
    if (novaSenha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }
    Alert.alert("Sucesso", "Senha alterada com sucesso!");
    setNovaSenha("");
    setConfirmarSenha("");
  };

  const handleSair = () => {
    Alert.alert("Confirmação", "Deseja realmente sair?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sim", onPress: () => navigation.navigate("Login") },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require("../assets/logo.png")}
        />
      </View>
      <View style={styles.content}>
        <View style={styles.contentEdit}>
        <Image
          source={require("../assets/icon-perfil.png")}
          style={styles.iconPerfil}
        />
        </View>
        <Text style={styles.nome}>Victor Koba</Text>
      

      <TextInput
        style={styles.inputEmail}
        placeholder="Email"
        placeholderTextColor="#ffffffc7"
        editable={false}
        value={email}
      />

      <TextInput
        style={styles.input}
        placeholder="Alterar Senha"
        placeholderTextColor="#fff"
        secureTextEntry
        value={novaSenha}
        onChangeText={setNovaSenha}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar Senha"
        placeholderTextColor="#fff"
        secureTextEntry
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
      />

      <TouchableOpacity style={styles.btnConfirmar} onPress={handleConfirmar}>
        <Text style={styles.textoBtnConfirmar}>Confirmar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnSair} onPress={handleSair}>
        <Text style={styles.textoBtnSair}>Sair</Text>
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
    paddingTop: 60,
  },
  logo: {
    height: 350,
    width: 350,
    marginBottom: -120,
    marginTop: -180,
  },
  content: {
    flex: 1,
    width: "100%",
    backgroundColor: "#679880",
    borderTopLeftRadius: 80,
    alignItems: "center",
    paddingTop: 40,
  },
  iconPerfil: {
    width: 120,
    height: 120,
    margin: 'auto',
  },
  contentEdit: {
    backgroundColor: "#305F49",
    borderRadius: 200,
    width: 200,
    height: 200,
  },
  iconEdit: {
    position: "absolute",
    right: 100,
    bottom: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 5,
  },
  editImage: {
    width: 50,
    height: 50,
  },
  nome: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#9FD1B7",
    width: "80%",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    color: "#fff",
  },
  inputEmail: {
    backgroundColor: "#9fd1b781",
    width: "80%",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    color: "#ffffff86",
  },
  btnConfirmar: {
    backgroundColor: "#305F49",
    padding: 12,
    width: "70%",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  textoBtnConfirmar: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  btnSair: {
    backgroundColor: "red",
    padding: 12,
    width: "70%",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },
  textoBtnSair: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
