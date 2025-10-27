import React, { useState } from "react";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useFonts } from "expo-font";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen({navigation}) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#305F49" }}>
    <ScrollView>
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require("../assets/logo.png")}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          Página Inicial
        </Text>

        <TouchableOpacity style={styles.button}
        onPress={() => navigation.navigate("Perfil")}
        >
          <TouchableOpacity
            style={styles.iconButton}
          >
            <Image
              style={styles.icon}
              source={require("../assets/icon-perfil.png")}
            />
          </TouchableOpacity>
          <Text style={styles.buttonText}>
            Ver perfil
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}
        onPress={() => navigation.navigate("GerenciarTemperatura")}
        >
          <TouchableOpacity
            style={styles.iconButton}
          >
            <Image
              style={styles.icon}
              source={require("../assets/icon-temp.png")}
            />
          </TouchableOpacity>
          <Text style={styles.buttonText}>
            Gerenciar temperatura
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}
        onPress={() => navigation.navigate("Relatorios")}
        >
          <TouchableOpacity
            style={styles.iconButton}
          >
            <Image
              style={styles.icon}
              source={require("../assets/icon-relatorios.png")}
            />
          </TouchableOpacity>
          <Text style={styles.buttonText}>
            Relatórios
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}
        onPress={() => navigation.navigate("Duvidas")}
        >
          <TouchableOpacity
            style={styles.iconButton}
          >
            <Image
              style={styles.icon}
              source={require("../assets/icon-duvidas.png")}
            />
          </TouchableOpacity>
          <Text style={styles.buttonText}>
            Dúvidas frequentes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}
        onPress={() => navigation.navigate("GerenciarUsuarios")}
        >
          <TouchableOpacity
            style={styles.iconButton}
          >
            <Image
              style={styles.icon}
              source={require("../assets/icon-gerenciar-usuarios.png")}
            />
          </TouchableOpacity>
          <Text style={styles.buttonText}>
            Gerenciar usuários
          </Text>
        </TouchableOpacity>
      </View>
    </View>
    </ScrollView>
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
    width: 280,
    resizeMode: "contain",
  },
  content: {
    flex: 1,
    width: "100%",
    backgroundColor: "#305F49",
    borderTopLeftRadius: 120,
    alignItems: "center",
    paddingTop: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
    alignSelf: "center",
    marginTop: 5,
  },
  button: {
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#305F49",
    shadowOpacity: 0.7,
    shadowOffset: { width: 4, height: 4 },
    shadowRadius: 5,
    elevation: 3,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    margin: "auto",
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#305F49",
    marginRight: 20,
  },
  buttonText: {
    fontSize: 20,
    color: "#305F49",
    fontWeight: "600",
  },
});
