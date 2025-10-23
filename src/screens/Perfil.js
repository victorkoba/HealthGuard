import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PerfilScreen({
  navigation,
}) {
  const [email, setEmail] = useState(
    "victorkoba08@gmail.com"
  );
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] =
    useState("");

  const handleConfirmar = () => {
    if (!novaSenha || !confirmarSenha) {
      Alert.alert(
        "Erro",
        "Preencha todos os campos de senha."
      );
      return;
    }
    if (novaSenha !== confirmarSenha) {
      Alert.alert(
        "Erro",
        "As senhas não coincidem."
      );
      return;
    }
    Alert.alert(
      "Sucesso",
      "Senha alterada com sucesso!"
    );
    setNovaSenha("");
    setConfirmarSenha("");
  };

  const handleSair = () => {
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#305F49",
      }}
    >
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <TouchableOpacity
            style={styles.drawer}
            onPress={() =>
              navigation.openDrawer()
            }
          >
            <Ionicons
              name="menu"
              size={50}
              color="#305F49"
            />
          </TouchableOpacity>
          <Image
            style={styles.logo}
            source={require("../assets/logo.png")}
          />
        </View>
        <View style={styles.content}>
          <View style={styles.contentEdit}>
            <Ionicons
              name="person-outline"
              size={150}
              color="#fff"
            />
          </View>
          <Text style={styles.nome}>
            Victor Koba
          </Text>

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

          <TouchableOpacity
            style={styles.btnConfirmar}
            onPress={handleConfirmar}
          >
            <Text
              style={styles.textoBtnConfirmar}
            >
              Confirmar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnSair}
            onPress={handleSair}
          >
            <Text style={styles.textoBtnSair}>
              Sair
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
    paddingTop: 60,
  },
  logo: {
    width: 280,
    resizeMode: "contain",
    marginTop: -60,
  },
  drawer: {
    marginTop: -60,
    marginRight: 20,
  },
  logoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  content: {
    flex: 1,
    width: "100%",
    backgroundColor: "#305F49",
    borderTopLeftRadius: 80,
    alignItems: "center",
    paddingTop: 40,
  },

  contentEdit: {
    backgroundColor: "#679880",
    borderRadius: 200,
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },

  nome: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },

  input: {
    backgroundColor: "rgba(159, 209, 183, 0.69)",
    width: "80%",
    borderRadius: 8,
    height: 50,
    padding: 10,
    marginBottom: 30,
    color: "#fff",
  },
  inputEmail: {
    backgroundColor: "rgba(159, 209, 183, 1)",
    width: "80%",
    borderRadius: 8,
    height: 50,
    padding: 10,
    marginBottom: 30,
    color: "#ffffff86",
  },
  btnConfirmar: {
    backgroundColor: "#9FD1B7",
    padding: 10,
    width: 250,
    height: 50,
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
    backgroundColor: "#305F49",
    padding: 10,
    width: 170,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#679880",
    alignItems: "center",
    marginTop: 15,
  },
  textoBtnSair: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
