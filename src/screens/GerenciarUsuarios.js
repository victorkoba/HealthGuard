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
    <ScrollView contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}>

      <View style={styles.logoContainer}>
              <TouchableOpacity style={styles.drawer} onPress={() => navigation.openDrawer()}>
                <Ionicons name="menu" size={32} color="#305F49" />
              </TouchableOpacity>
              <Image
                style={styles.logo}
                source={require("../assets/logo.png")}
              />
      </View>

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Gerenciar usuários</Text>
        </View>

        {usuarios.map((usuario, index) => (
          <View key={index} style={styles.userCard}>
            <View style={styles.userInfo}>
              <View style={styles.contentIcon}>
              <Ionicons name="person-outline" size={40} color="#fff" />
            </View>
              <Text style={styles.userName}>{usuario}</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.editButton}>
                <MaterialIcons name="edit" size={20} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.deleteButton}>
                <MaterialIcons name="delete" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 60,
  },
  
  contentIcon: {
    backgroundColor: '#305F49',
    width: 60,
    height: 60,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

    logo: {
    height: 350,
    width: 350,
  },
  logoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    marginBottom: -120,
    marginTop: -180,
    paddingLeft: 40,
    paddingRight: 20,
  },

  content: {
    width: "100%",
    height: '100%',
    backgroundColor: "#679880",
    borderTopLeftRadius: 80,
    alignItems: "center",
    paddingTop: 40,
  },

  titleContainer: {
    padding: 15,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 50,
    marginBottom: 20,
  },

  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },

  userCard: {
    backgroundColor: "#EAF3EC",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    width: "90%",
    borderRadius: 10,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  userName: {
    fontSize: 18,
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
