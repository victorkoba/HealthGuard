import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: "CAMINHO_DO_LOGO" }}
          style={styles.logo}
        />
      </View>

      {/* Conteúdo principal */}
      <View style={styles.content}>
        <Text style={styles.title}>Página Inicial</Text>

        <TouchableOpacity style={styles.button}>
          <Image
            source={{ uri: "CAMINHO_DO_ICONE1" }}
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Ver perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Image
            source={{ uri: "CAMINHO_DO_ICONE2" }}
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Gerenciamento de temperatura</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Image
            source={{ uri: "CAMINHO_DO_ICONE3" }}
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Relatórios</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Image
            source={{ uri: "CAMINHO_DO_ICONE4" }}
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Dúvidas frequentes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Image
            source={{ uri: "CAMINHO_DO_ICONE5" }}
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Gerenciar usuários</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  logoContainer: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 30,
  },
  logo: {
    width: 150, // tamanho predefinido do logo
    height: 50,
    resizeMode: "contain",
  },
  content: {
    flex: 1,
    backgroundColor: "#679880", // verde mais claro
    borderTopLeftRadius: 40,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    alignSelf: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  icon: {
    width: 30, // tamanho predefinido do ícone
    height: 30,
    marginRight: 15,
    resizeMode: "contain",
  },
  buttonText: {
    fontSize: 16,
    color: "#305F49", // verde escuro
    fontWeight: "600",
  },
});
