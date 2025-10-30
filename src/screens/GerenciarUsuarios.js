import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Modal from "react-native-modal";

export default function GerenciarUsuariosScreen({
  navigation,
}) {
  const [isAddModalVisible, setAddModalVisible] =
    useState(false);
  const [isModalVisible, setModalVisible] =
    useState(false);
  const [editModalVisible, setEditModalVisible] =
    useState(false);
  const [
    usuarioSelecionadoIndex,
    setUsuarioSelecionadoIndex,
  ] = useState(null);

  const [email, setEmail] = useState(
    "email@exemplo.com"
  );
  const [senhaNova, setSenhaNova] = useState("");
  const [senhaConfirmar, setSenhaConfirmar] =
    useState("");
  const [nome, setNome] = useState("");

  // Estados do modal de criação
  const [novoNome, setNovoNome] = useState("");
  const [novoEmail, setNovoEmail] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [
    novaSenhaConfirmar,
    setNovaSenhaConfirmar,
  ] = useState("");

  const usuarios = [
    "Jacquys Barbosa",
    "Miguel Sales",
    "Victor Koba",
    "Nicole Oliveira",
    "Lucas Machado",
    "Luis Felipe",
    "André Batista",
    "Adriana Koba",
  ];

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#305F49",
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
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
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                Gerenciar usuários
              </Text>
            </View>

            <TouchableOpacity
              onPress={() =>
                setAddModalVisible(true)
              }
              style={styles.userCardAdd}
            >
              <View style={styles.userInfoAdd}>
                <View
                  style={styles.contentIconAdd}
                >
                  <Ionicons
                    name="add-outline"
                    size={40}
                    color="#305F49"
                  />
                </View>
                <Text style={styles.userNameAdd}>
                  Criar novo usuário
                </Text>
              </View>
            </TouchableOpacity>

            {usuarios.map((usuario, index) => (
              <View
                key={index}
                style={styles.userCard}
              >
                <View style={styles.userInfo}>
                  <View
                    style={styles.contentIcon}
                  >
                    <Ionicons
                      name="person-outline"
                      size={40}
                      color="#fff"
                    />
                  </View>
                  <Text style={styles.userName}>
                    {usuario}
                  </Text>
                </View>

                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => {
                      setModalVisible(true);
                      setUsuarioSelecionadoIndex(
                        index
                      );
                      setNome(usuario);
                      setSenhaNova("");
                      setSenhaConfirmar("");
                      setEditModalVisible(true);
                    }}
                  >
                    <MaterialIcons
                      name="edit"
                      size={20}
                      color="#fff"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => {
                      Alert.alert(
                        "Excluir",
                        "Deseja realmente excluir esse usuário?",
                        [
                          {
                            text: "Cancelar",
                          },
                          {
                            text: "Excluir",
                            onPress: () => {
                              Alert.alert(
                                "Sucesso",
                                "Você exclui esse usuário."
                              );
                            },
                          },
                        ],
                        { cancelable: false }
                      );
                    }}
                  >
                    <MaterialIcons
                      name="delete"
                      size={20}
                      color="#fff"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <Modal
        isVisible={isAddModalVisible}
        style={{ margin: 0 }}
        onBackdropPress={() =>
          setAddModalVisible(false)
        }
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              Criar novo usuário
            </Text>

            <TextInput
              style={styles.inputNome}
              placeholder="Nome completo"
              placeholderTextColor="#ffffff85"
              value={novoNome}
              onChangeText={setNovoNome}
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#ffffff85"
              keyboardType="email-address"
              value={novoEmail}
              onChangeText={setNovoEmail}
            />

            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#ffffff85"
              secureTextEntry
              value={novaSenha}
              onChangeText={setNovaSenha}
            />

            <TextInput
              style={styles.input}
              placeholder="Confirmar senha"
              placeholderTextColor="#ffffff85"
              secureTextEntry
              value={novaSenhaConfirmar}
              onChangeText={setNovaSenhaConfirmar}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() =>
                  setAddModalVisible(false)
                }
              >
                <Text
                  style={styles.btnTextCancel}
                >
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={() => {
                  if (
                    !novoNome ||
                    !novoEmail ||
                    !novaSenha ||
                    !novaSenhaConfirmar
                  ) {
                    Alert.alert(
                      "Erro",
                      "Preencha todos os campos."
                    );
                    return;
                  }

                  if (
                    novaSenha !==
                    novaSenhaConfirmar
                  ) {
                    Alert.alert(
                      "Erro",
                      "As senhas não coincidem."
                    );
                    return;
                  }

                  Alert.alert(
                    "Sucesso",
                    "Novo usuário criado com sucesso!"
                  );
                  setAddModalVisible(false);
                  setNovoNome("");
                  setNovoEmail("");
                  setNovaSenha("");
                  setNovaSenhaConfirmar("");
                }}
              >
                <Text style={styles.btnText}>
                  Salvar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={isModalVisible}
        style={{ margin: 0 }}
        onBackdropPress={() =>
          setModalVisible(false)
        }
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              Editar usuário
            </Text>

            <TextInput
              style={styles.inputNome}
              value={nome}
              onChangeText={setNome}
            />

            <TextInput
              style={styles.inputEmail}
              value={email}
              editable={false}
              keyboardType="email-address"
            />

            <TextInput
              style={styles.input}
              value={senhaNova}
              onChangeText={setSenhaNova}
              placeholder="Nova senha"
              placeholderTextColor={"#ffffff85"}
              secureTextEntry
            />

            <TextInput
              style={styles.input}
              value={senhaConfirmar}
              onChangeText={setSenhaConfirmar}
              placeholder="Confirmar nova senha"
              placeholderTextColor={"#ffffff85"}
              secureTextEntry
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() =>
                  setModalVisible(false)
                }
              >
                <Text
                  style={styles.btnTextCancel}
                >
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={() => {
                  Alert.alert(
                    "Confirmação",
                    "Deseja realmente salvar essas alterações?",
                    [
                      {
                        text: "Cancelar",
                        onPress: () => {
                          setModalVisible(false);
                        },
                        style: "cancel",
                      },
                      {
                        text: "Confirmar",
                        onPress: () => {
                          console.log(
                            "Atualizar dados:",
                            {
                              nome,
                              senhaNova,
                              senhaConfirmar,
                            }
                          );
                          setModalVisible(false);
                        },
                      },
                    ],
                    {
                      cancelable: false,
                    }
                  );
                }}
              >
                <Text style={styles.btnText}>
                  Salvar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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

  contentIcon: {
    backgroundColor: "#305F49",
    width: 60,
    height: 60,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  contentIconAdd: {
    backgroundColor: "#fff",
    width: 60,
    height: 60,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
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
    width: "100%",
    height: "100%",
    backgroundColor: "#305F49",
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

  userCardAdd: {
    backgroundColor: "#305F49",
    width: "90%",
    borderRadius: 10,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#fff",
    borderStyle: "dashed",
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  userInfoAdd: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#305F49",
  },

  userNameAdd: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  modalBox: {
    width: "80%",
    backgroundColor: "#305F49",
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#fff",
    color: "#888",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  inputEmail: {
    borderWidth: 1,
    borderColor: "#888888be",
    color: "#888888be",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  inputNome: {
    borderWidth: 1,
    borderColor: "#fff",
    color: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelBtn: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  saveBtn: {
    backgroundColor: "#9FD1B7",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  btnTextCancel: {
    color: "#305F49",
    fontWeight: "bold",
  },
});
