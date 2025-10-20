import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function GerenciarUsuariosScreen({ navigation }) {
  const usuarios = [
    "Jacquys Barbosa",
    "Miguel Sales",
    "Victor Koba",
    "Nicole Oliveira",
    "Lucas Machado",
    "Luis Felipe",
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={30} color="#305F49" />
        </TouchableOpacity>
        <Text style={styles.logoText}>HealthGuard</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Gerenciar usuários</Text>
        </View>

        {usuarios.map((usuario, index) => (
          <View key={index} style={styles.userCard}>
            <View style={styles.userInfo}>
              <Ionicons name="person-outline" size={40} color="#305F49" />
              <Text style={styles.userName}>{usuario}</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.editButton}>
                <MaterialIcons name="edit" size={24} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.deleteButton}>
                <MaterialIcons name="delete" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#679880",
    alignItems: "center",
    paddingTop: 60,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#305F49",
    textDecorationLine: "underline",
  },

  scrollContent: {
    alignItems: "center",
    paddingBottom: 40,
  },

  titleContainer: {
    width: "90%",
    backgroundColor: "#5B8B72",
    padding: 15,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 50,
    marginBottom: 20,
  },

  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  userCard: {
    backgroundColor: "#EAF3EC",
    width: "90%",
    borderRadius: 10,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#305F49",
  },

  actions: {
    flexDirection: "row",
    gap: 10,
  },

  editButton: {
    backgroundColor: "#305F49",
    padding: 8,
    borderRadius: 50,
  },

  deleteButton: {
    backgroundColor: "#D32F2F",
    padding: 8,
    borderRadius: 50,
  },
});
