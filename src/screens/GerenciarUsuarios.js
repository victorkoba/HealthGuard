import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "react-native-modal";
import { dynamoDB } from "../../awsConfig";
import { Picker } from "@react-native-picker/picker";
import bcrypt from "bcryptjs";
import {
  ScanCommand,
  PutItemCommand,
  DeleteItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";

export default function GerenciarUsuariosScreen({ navigation }) {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);

  const [novoNome, setNovoNome] = useState("");
  const [novoEmail, setNovoEmail] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [novaSenhaConfirmar, setNovaSenhaConfirmar] = useState("");
  const [novoTipo, setNovoTipo] = useState("funcionario");

  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [tipoLogado] = useState("admin"); // simulação do usuário logado

  const [idLogado, setIdLogado] = useState(null);


  // 🔄 Buscar usuários
  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await dynamoDB.send(
        new ScanCommand({ TableName: "Usuarios" })
      );

      const lista =
        data.Items?.map((item) => ({
          id: item.id.S,
          nome: item.nome.S,
          email: item.email.S,
          tipo: item.tipo?.S || "funcionario",
        })) || [];

      setUsuarios(lista);
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
      Alert.alert("Erro", "Não foi possível carregar os usuários.");
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Adicionar novo usuário
  const adicionarUsuario = async () => {
    if (!novoNome || !novoEmail || !novaSenha || !novaSenhaConfirmar) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    if (novaSenha !== novaSenhaConfirmar) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    try {
      // 🔍 Verifica se já existe e-mail igual
      const existente = await dynamoDB.send(
        new ScanCommand({ TableName: "Usuarios" })
      );
      const jaExiste = existente.Items?.some((u) => u.email.S === novoEmail);
      if (jaExiste) {
        Alert.alert("Erro", "Já existe um usuário com este e-mail.");
        return;
      }

      const hashedSenha = await bcrypt.hash(novaSenha, 10);

      const params = {
        TableName: "Usuarios",
        Item: {
          id: { S: Date.now().toString() },
          nome: { S: novoNome },
          email: { S: novoEmail },
          senha: { S: hashedSenha },
          tipo: { S: novoTipo },
        },
      };

      await dynamoDB.send(new PutItemCommand(params));

      Alert.alert("Sucesso", "Usuário criado com sucesso!");
      setAddModalVisible(false);
      setNovoNome("");
      setNovoEmail("");
      setNovaSenha("");
      setNovaSenhaConfirmar("");
      setNovoTipo("funcionario");
      carregarUsuarios();
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error);
      Alert.alert("Erro", "Falha ao salvar usuário no banco.");
    }
  };

  // ✏️ Editar usuário
  const abrirModalEdicao = (usuario) => {
    setUsuarioEditando(usuario);
    setNovoNome(usuario.nome);
    setNovoEmail(usuario.email);
    setNovaSenha("");
    setNovaSenhaConfirmar("");
    setNovoTipo(usuario.tipo);
    setEditModalVisible(true);
  };

  const salvarEdicao = async () => {
    if (!novoNome) {
      Alert.alert("Erro", "O nome não pode ficar vazio.");
      return;
    }

    if (novaSenha && novaSenha !== novaSenhaConfirmar) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    try {
      let senhaHash = null;
      if (novaSenha) {
        // 🔐 Gera o hash da nova senha antes de salvar
        const salt = await bcrypt.genSalt(10);
        senhaHash = await bcrypt.hash(novaSenha, salt);
      }

      const params = {
        TableName: "Usuarios",
        Key: { id: { S: usuarioEditando.id } },
        UpdateExpression:
          "SET nome = :nome, tipo = :tipo" +
          (novaSenha ? ", senha = :senha" : ""),
        ExpressionAttributeValues: {
          ":nome": { S: novoNome },
          ":tipo": { S: novoTipo },
          ...(novaSenha ? { ":senha": { S: senhaHash } } : {}),
        },
      };

      await dynamoDB.send(new UpdateItemCommand(params));

      Alert.alert("Sucesso", "Usuário atualizado com sucesso!");
      setEditModalVisible(false);
      carregarUsuarios();
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      Alert.alert("Erro", "Não foi possível atualizar o usuário.");
    }
  };

  // ❌ Excluir usuário
  const excluirUsuario = async (id) => {
    Alert.alert("Excluir", "Deseja realmente excluir este usuário?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await dynamoDB.send(
              new DeleteItemCommand({
                TableName: "Usuarios",
                Key: { id: { N: id } },
              })
            );
            Alert.alert("Sucesso", "Usuário excluído com sucesso!");
            carregarUsuarios();
          } catch (err) {
            console.error("Erro ao excluir usuário:", err);
            Alert.alert("Erro", "Não foi possível excluir o usuário.");
          }
        },
      },
    ]);
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#305F49" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <TouchableOpacity
              style={styles.drawer}
              onPress={() => navigation.openDrawer()}
            >
              <Ionicons name="menu" size={50} color="#305F49" />
            </TouchableOpacity>
            <Image style={styles.logo} source={require("../assets/logo.png")} />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Gerenciar usuários</Text>

            {tipoLogado === "admin" && (
              <TouchableOpacity
                onPress={() => setAddModalVisible(true)}
                style={styles.userCardAdd}
              >
                <View style={styles.userInfoAdd}>
                  <View style={styles.contentIconAdd}>
                    <Ionicons name="add-outline" size={40} color="#305F49" />
                  </View>
                  <Text style={styles.userNameAdd}>Criar novo usuário</Text>
                </View>
              </TouchableOpacity>
            )}

            {loading ? (
              <ActivityIndicator
                size="large"
                color="#fff"
                style={{ marginTop: 30 }}
              />
            ) : usuarios.length === 0 ? (
              <Text style={{ color: "#fff", marginTop: 40, fontSize: 18 }}>
                Nenhum usuário registrado
              </Text>
            ) : (
              usuarios.map((usuario) => (
                <View key={usuario.id} style={styles.userCard}>
                  <View style={styles.userInfo}>
                    <View style={styles.contentIcon}>
                      <Ionicons name="person-outline" size={40} color="#fff" />
                    </View>
                    <View>
                      <Text style={styles.userName}>{usuario.nome}</Text>
                      <Text style={{ color: "#666", fontSize: 13 }}>
                        {usuario.email}
                      </Text>
                    </View>
                  </View>

                  {tipoLogado === "admin" && (
                    <View style={styles.actions}>
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => abrirModalEdicao(usuario)}
                      >
                        <MaterialIcons name="edit" size={20} color="#fff" />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => excluirUsuario(usuario.id)}
                      >
                        <MaterialIcons name="delete" size={20} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      <Modal
        isVisible={isAddModalVisible}
        onBackdropPress={() => setAddModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Criar novo usuário</Text>

            <TextInput
              style={styles.input}
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

            <View
              style={[
                styles.input,
                { paddingHorizontal: 0, paddingVertical: 0 },
              ]}
            >
              <Picker
                selectedValue={novoTipo}
                onValueChange={(itemValue) => setNovoTipo(itemValue)}
                dropdownIconColor="#fff"
                style={{
                  color: "#fff",
                  backgroundColor: "transparent",
                  width: "100%",
                }}
              >
                <Picker.Item
                  label="Funcionário"
                  value="funcionario"
                  color="#305F49"
                />
                <Picker.Item
                  label="Administrador"
                  value="admin"
                  color="#305F49"
                />
              </Picker>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setAddModalVisible(false)}
              >
                <Text style={styles.btnTextCancel}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={adicionarUsuario}
              >
                <Text style={styles.btnText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL DE EDIÇÃO */}
      <Modal
        isVisible={isEditModalVisible}
        onBackdropPress={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Editar usuário</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              placeholderTextColor="#ffffff85"
              value={novoNome}
              onChangeText={setNovoNome}
            />

            <TextInput
              style={[styles.input, { opacity: 0.6 }]}
              editable={false}
              value={novoEmail}
            />

            <TextInput
              style={styles.input}
              placeholder="Nova senha (opcional)"
              placeholderTextColor="#ffffff85"
              secureTextEntry
              value={novaSenha}
              onChangeText={setNovaSenha}
            />

            <TextInput
              style={styles.input}
              placeholder="Confirmar nova senha"
              placeholderTextColor="#ffffff85"
              secureTextEntry
              value={novaSenhaConfirmar}
              onChangeText={setNovaSenhaConfirmar}
            />

            <View
              style={[
                styles.input,
                { paddingHorizontal: 0, paddingVertical: 0 },
              ]}
            >
              <Picker
                selectedValue={novoTipo}
                onValueChange={(itemValue) => setNovoTipo(itemValue)}
                dropdownIconColor="#fff"
                style={{
                  color: "#fff",
                  backgroundColor: "transparent",
                  width: "100%",
                }}
              >
                <Picker.Item
                  label="Funcionário"
                  value="funcionario"
                  color="#305F49"
                />
                <Picker.Item
                  label="Administrador"
                  value="admin"
                  color="#305F49"
                />
              </Picker>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.btnTextCancel}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveBtn} onPress={salvarEdicao}>
                <Text style={styles.btnText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// 🔧 ESTILOS
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
  logo: { width: 280, resizeMode: "contain", marginTop: -60 },
  drawer: { marginTop: -60, marginRight: 20 },
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
    paddingBottom: 100,
  },
  title: { color: "#fff", fontSize: 32, fontWeight: "bold", marginBottom: 20 },
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
  userInfo: { flexDirection: "row", alignItems: "center", gap: 10 },
  userInfoAdd: { flexDirection: "row", alignItems: "center", gap: 10 },
  userName: { fontSize: 18, fontWeight: "600", color: "#305F49" },
  userNameAdd: { fontSize: 18, fontWeight: "600", color: "#fff" },
  actions: { flexDirection: "row", gap: 10 },
  deleteButton: { backgroundColor: "#D32F2F", padding: 8, borderRadius: 50 },
  editButton: { backgroundColor: "#1976D2", padding: 8, borderRadius: 50 },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    color: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  modalActions: { flexDirection: "row", justifyContent: "space-between" },
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
  btnText: { color: "#fff", fontWeight: "bold" },
  btnTextCancel: { color: "#305F49", fontWeight: "bold" },
});
