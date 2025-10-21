import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Ativar animação no Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Duvidas({navigation}) {
  const [expanded, setExpanded] = useState(null);

  const toggleExpand = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(expanded === index ? null : index);
  };

  const perguntas = [
    {
      pergunta: "O que cada funcionalidade do aplicativo faz?",
      resposta:
        "Relatórios: permite gerar e baixar relatórios diários, semanais e mensais das temperaturas dos refrigeradores.\n\n" +
        "Gerenciamento de temperatura: exibe a temperatura atual e o histórico recente para facilitar o controle e emitir alertas.\n\n" +
        "Gerenciar usuários: para os administradores, há a opção de gerenciar os outros usuários comuns.",
    },
    {
      pergunta: "Por que o armazenamento correto das vacinas é tão importante?",
      resposta:
        "O armazenamento adequado mantém a eficácia das vacinas e evita perdas por exposição a temperaturas inadequadas.",
    },
    {
      pergunta: "Posso armazenar vacinas em refrigeradores domésticos?",
      resposta:
        "Não é recomendado, pois refrigeradores domésticos não mantêm a estabilidade de temperatura exigida.",
    },
    {
      pergunta: "O que fazer se houver uma falha na refrigeração?",
      resposta:
        "Registre o ocorrido, verifique a temperatura e comunique imediatamente o responsável técnico para avaliação das vacinas.",
    },
    {
      pergunta: "Qual é a faixa de temperatura ideal para armazenar vacinas?",
      resposta:
        "Entre +2°C e +8°C, garantindo a integridade e eficácia das vacinas conforme as normas da Anvisa.",
    },
    {
      pergunta: "Posso guardar vacinas na porta do refrigerador?",
      resposta:
        "Não. A porta é a região com maior variação térmica e pode comprometer as vacinas.",
    },
    {
      pergunta: "O que acontece se uma vacina congelar?",
      resposta:
        "Vacinas congeladas podem perder sua eficácia e não devem ser utilizadas.",
    },
  ];

  return (
    <View style={styles.container}>
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
        {/* Cabeçalho curvado */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Dúvidas frequentes</Text>
        </View>

        {/* Lista de perguntas rolável */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {perguntas.map((item, index) => (
            <View key={index} style={styles.card}>
              <TouchableOpacity
                style={styles.question}
                onPress={() => toggleExpand(index)}
                activeOpacity={0.8}
              >
                <Text style={styles.questionText}>{item.pergunta}</Text>
                <Ionicons
                  name={expanded === index ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#fff"
                />
              </TouchableOpacity>

              {expanded === index && (
                <View style={styles.answerContainer}>
                  <Text style={styles.answer}>{item.resposta}</Text>
                </View>
              )}
            </View>
          ))}

        </ScrollView>
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
    flex: 1,
    width: "100%",
    backgroundColor: "#679880",
    borderTopLeftRadius: 80,
    alignItems: "center",
    paddingTop: 40,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
card: {
  width: "90%",
  backgroundColor: "#9fd1b7",
  borderRadius: 10,
  marginBottom: 10,
  overflow: "hidden",
  alignSelf: "center",
},
  question: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  questionText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
    flex: 1,
    paddingRight: 10,
  },
  answerContainer: {
    backgroundColor: "#9fd1b7",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  answer: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
  },
});
