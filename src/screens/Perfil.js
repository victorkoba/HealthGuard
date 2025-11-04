import React, { useState, useEffect } from "react";
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
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DynamoDBClient,
  UpdateItemCommand,
  GetItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import * as FileSystemLegacy from "expo-file-system/legacy";
import bcrypt from "bcryptjs";
import { Buffer } from "buffer";
global.Buffer = Buffer;

// ⚙️ Configuração AWS
const REGION = "us-east-1";
const BUCKET_NAME = "gerenciarusuarios-imagens"; // nome do seu bucket

const credentials = {
  accessKeyId: "ASIAZYPPXAY47OHPQE64",
  secretAccessKey: "/8IFstjZtGLYe6d1pnGesgzo7eQ39JOcDMW7B5bX",
  sessionToken:
    "IQoJb3JpZ2luX2VjEKD//////////wEaCXVzLXdlc3QtMiJHMEUCIC+Vkjv7/rre7YsDZr1A8CJIQyprhJt33mLGQt3atfBKAiEAkUTPPFMj8PlQlWmE0K+nsj2xg8WpoHM/6VAbaeO830gquAIIaBAAGgw2NzEwNTQ0OTczMzciDNSKmFkFHZA5W4vfUCqVAspY0HbtyS5OyJIMm9OWU3k+ff0m0nz49RwOzrZ7cYjzTq0N25sitM6ivmaYYIoaamSl6Pr4aVy1meGmeMGG92pW5LDkBileuLCaohyLe519ojI9TSQ+WANrdXxjkQSNxLFd4B7mDRN/dznkIhco6F86X/6chXsDll4KvwAnb/Svv2sp4mrFZO3jJC0RrJuOFkE6hh/9Kf6Bjp2HuSKyMTT33utiA9rjCOJnSAzqml5oXS6tohK0JcJRavOI1l8VffLOJq+Sc7EjRSRRV5Wrv2r2S/OklRHctFY1xDK3aLPkgFtTsneeEjjbt48dwisSzjiPMlbH5eVU7bot+kb49JhFmBe23k/si2EHQkFpD6gPQsFuCAIws/CkyAY6nQFwO5bmQ8m9R0Jbv9pSSXvj7qVvcbwrReo/z4msUMCaHfFl3LAV+ACGGrlYN9UZKKlqFACZRMpPPpf5pOVxYKI3qJpWN/xGvnHKa0JdR5YES2R6Vro1TnrvnKJ50VaBJKFcLGrcpzX4J0Osj6pvMuXiC2bRLmO5id+giCFMoH+bNfgXzfrVli1VSWSqWZCJuZI0huqmJsG/jwNiuN6+",
};

const dynamoDB = new DynamoDBClient({ region: REGION, credentials });
const s3 = new S3Client({ region: REGION, credentials });

export default function PerfilScreen({ navigation }) {
  const [usuario, setUsuario] = useState({ nome: "", email: "", id: "" });
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [fotoUri, setFotoUri] = useState(null);

  // 📥 Carregar dados do usuário logado
  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const usuarioId = await AsyncStorage.getItem("usuarioId");
        if (!usuarioId) return;

        // 🔍 Buscar usuário
        const params = {
          TableName: "usuarios",
          Key: { id: { N: usuarioId } },
        };
        const result = await dynamoDB.send(new GetItemCommand(params));

        if (result.Item) {
          setUsuario({
            id: usuarioId,
            nome: result.Item.nome.S,
            email: result.Item.email.S,
          });
        }

        // 🔍 Buscar foto
        const fotoParams = {
          TableName: "fotoPerfil",
          Key: { usuario_id: { N: usuarioId } },
        };
        const fotoResult = await dynamoDB.send(new GetItemCommand(fotoParams));

        if (fotoResult.Item?.foto?.S) {
          setFotoUri(fotoResult.Item.foto.S);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
        Alert.alert("Erro", "Não foi possível carregar os dados do usuário.");
      }
    };

    carregarUsuario();
  }, []);

  const escolherImagem = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permissão negada",
        "Você precisa permitir o acesso à galeria para escolher uma imagem."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.Image],
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setFotoUri(imageUri);

      try {
        const usuarioId = await AsyncStorage.getItem("usuarioId");

        const fileData = await FileSystemLegacy.readAsStringAsync(imageUri, {
          encoding: FileSystemLegacy.EncodingType.Base64,
        });

        const buffer = Buffer.from(fileData, "base64");
        const nomeArquivo = `perfil_${usuarioId}_${Date.now()}.jpg`;

        const uploadParams = {
          Bucket: BUCKET_NAME,
          Key: `imagens-perfil/${nomeArquivo}`,
          Body: buffer,
          ContentType: "image/jpeg",
        };

        await s3.send(new PutObjectCommand(uploadParams));

        const imageUrl = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/imagens-perfil/${nomeArquivo}`;

        const params = {
          TableName: "fotoPerfil",
          Item: {
            usuario_id: { S: usuarioId },
            foto: { S: imageUrl },
          },
        };

        await dynamoDB.send(new PutItemCommand(params));
        setFotoUri(imageUrl);

        Alert.alert("Sucesso", "Foto de perfil atualizada!");
      } catch (error) {
        console.error("Erro ao salvar foto:", error);
        Alert.alert("Erro", "Não foi possível salvar a foto.");
      }
    }
  };

  // 🔐 Atualizar senha com hash
  const handleConfirmar = async () => {
    if (!novaSenha || !confirmarSenha) {
      Alert.alert("Erro", "Preencha todos os campos de senha.");
      return;
    }
    if (novaSenha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    try {
      const hashedSenha = await bcrypt.hash(novaSenha, 10);
      const params = {
        TableName: "usuarios",
        Key: { id: { N: usuario.id } },
        UpdateExpression: "SET senha = :senha",
        ExpressionAttributeValues: {
          ":senha": { S: hashedSenha },
        },
      };
      await dynamoDB.send(new UpdateItemCommand(params));

      Alert.alert("Sucesso", "Senha alterada com sucesso!");
      setNovaSenha("");
      setConfirmarSenha("");
    } catch (error) {
      console.error("Erro ao atualizar senha:", error);
      Alert.alert("Erro", "Não foi possível alterar a senha.");
    }
  };

  // 🚪 Sair da conta
  const handleLogout = async () => {
    Alert.alert("Confirmação", "Deseja realmente sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Confirmar",
        onPress: async () => {
          await AsyncStorage.removeItem("usuarioId");
          navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#305F49" }}>
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
          <TouchableOpacity style={styles.contentEdit} onPress={escolherImagem}>
            {fotoUri ? (
              <Image source={{ uri: fotoUri }} style={styles.fotoPerfil} />
            ) : (
              <Ionicons name="person-outline" size={150} color="#fff" />
            )}
          </TouchableOpacity>

          <Text style={styles.nome}>{usuario.nome || "Carregando..."}</Text>

          <TextInput
            style={styles.inputEmail}
            value={usuario.email}
            editable={false}
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
            <Text style={styles.textoBtnConfirmar}>Confirmar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnSair} onPress={handleLogout}>
            <Text style={styles.textoBtnSair}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// mantém o mesmo estilo
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
  fotoPerfil: {
    width: 200,
    height: 200,
    borderRadius: 200,
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
