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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Ativar animação no Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Duvidas() {
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
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Cabeçalho curvado */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Dúvidas frequentes</Text>
        </View>

        {/* Lista de perguntas */}
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

        <Text style={styles.footer}>HealthGuard</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#305F49", // fundo principal padronizado
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  headerContainer: {
    backgroundColor: "#305F49",
    borderBottomLeftRadius: 60,
    paddingVertical: 25,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#679880", // cor intermediária
    borderRadius: 10,
    marginBottom: 10,
    overflow: "hidden",
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
    backgroundColor: "#EAF3EC", // cor clara para contraste
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  answer: {
    color: "#305F49", // texto com cor principal
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    marginTop: 25,
    textAlign: "center",
    color: "#fff",
    fontWeight: "600",
  },
});
