import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Modal from "react-native-modal";
import {
  getUltimaLeitura,
  getMinMaxTemperatura,
  getTemperaturas24h,
  getTemperaturaSemana,
} from "../../dhtService";

const screenWidth = Dimensions.get("window").width;

export default function GerenciarTemperaturaScreen({ navigation }) {
  const [freezerAtual, setFreezerAtual] = useState(2);
  const [freezerSelecionado, setFreezerSelecionado] = useState(2);
  const [minTemp, setMinTemp] = useState("--");
  const [maxTemp, setMaxTemp] = useState("--");
  const [temp, setTemp] = useState("--");
  const [time, setTime] = useState("--");
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  // Dados dos gráficos
  const [grafico24h, setGrafico24h] = useState({
    labels: ["12:00", "12:30", "13:00", "13:30", "14:00", "Agora"],
    data: [5, 9, 10, 12, 4, 3],
  });

  const [graficoSemana, setGraficoSemana] = useState({
    labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
    maxData: [12, 8, 11, 14, 10, 9, 9],
    minData: [8, 6, 7, 10, 9, 8, 8],
  });

  // Carrega temperatura atual e min/max
  async function carregarDados() {
    try {
      setLoading(true);

      // Busca última leitura
      const dadosUltima = await getUltimaLeitura(freezerAtual);
      if (dadosUltima) {
        setTemp(dadosUltima.temperatura.toFixed(1));
        setTime(dadosUltima.timestamp);
      }

      // Busca min/max
      const minMax = await getMinMaxTemperatura(freezerAtual);
      if (minMax) {
        setMinTemp(minMax.min);
        setMaxTemp(minMax.max);
      }

      // Busca dados para gráfico de 24h
      const dados24h = await getTemperaturas24h(freezerAtual);
      if (dados24h.labels.length > 0) {
        setGrafico24h(dados24h);
      }

      // Busca dados para gráfico semanal
      const dadosSemana = await getTemperaturaSemana(freezerAtual);
      if (dadosSemana.labels.length > 0) {
        setGraficoSemana(dadosSemana);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados do freezer");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarDados();

    // Atualiza a cada 10 segundos
    const intervalo = setInterval(carregarDados, 10000);
    return () => clearInterval(intervalo);
  }, [freezerAtual]);

  const confirmarMudancaFreezer = () => {
    Alert.alert(
      "Confirmação",
      `Deseja realmente mudar para o Freezer ${freezerSelecionado}?`,
      [
        {
          text: "Cancelar",
          onPress: () => {
            setModalVisible(false);
            setFreezerSelecionado(freezerAtual);
          },
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: () => {
            setFreezerAtual(freezerSelecionado);
            setModalVisible(false);
            setLoading(true);
          },
        },
      ],
      { cancelable: false }
    );
  };

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
            {/* Card de seleção de freezer */}
            <View style={styles.card}>
              <Text style={styles.textSmall}>
                Você está visualizando a temperatura do freezer {freezerAtual}
              </Text>
              <View style={styles.freezerInfo}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setModalVisible(true)}
                >
                  <Text style={styles.buttonText}>Mudar freezer</Text>
                </TouchableOpacity>

                <View style={styles.freezerLogo}>
                  <Image
                    style={styles.iconFreezer}
                    source={require("../assets/icon-freezer.png")}
                  />
                  <Text style={styles.freezerLabel}>
                    Freezer {freezerAtual}
                  </Text>
                </View>
              </View>
            </View>

            {/* Modal de seleção */}
            <Modal
              isVisible={isModalVisible}
              backdropOpacity={0.5}
              onBackdropPress={() => {
                setModalVisible(false);
                setFreezerSelecionado(freezerAtual);
              }}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalBox}>
                  <Text style={styles.modalTitle}>
                    Você deseja mudar para qual freezer?
                  </Text>

                  <View style={styles.freezerGrid}>
                    {[1, 2, 3].map((item) => (
                      <TouchableOpacity
                        key={item}
                        style={styles.freezerItem}
                        onPress={() => setFreezerSelecionado(item)}
                      >
                        {freezerSelecionado === item && (
                          <View style={styles.selectedBadge}>
                            <Text style={styles.selectedBadgeText}>
                              Selecionado
                            </Text>
                          </View>
                        )}
                        <Image
                          style={styles.iconFreezerModal}
                          source={require("../assets/icon-freezer.png")}
                        />
                        <Text style={styles.freezerLabel}>Freezer {item}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={styles.cancelBtn}
                      onPress={() => {
                        setModalVisible(false);
                        setFreezerSelecionado(freezerAtual);
                      }}
                    >
                      <Text style={styles.cancelText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.confirmBtn}
                      onPress={confirmarMudancaFreezer}
                    >
                      <Text style={styles.confirmText}>Confirmar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* Card de temperatura atual */}
            {loading ? (
              <View style={styles.cardMain}>
                <ActivityIndicator size="large" color="#fff" />
              </View>
            ) : (
              <View style={styles.cardMain}>
                <Text style={styles.title}>
                  Temperatura atual dentro do freezer {freezerAtual}
                </Text>
                <Text style={styles.temp}>{temp}°</Text>
                {/* <Text style={styles.subTemp}>
                  {maxTemp}° / {minTemp}°
                </Text> */}
                {/* <Text style={styles.lastUpdate}>
                  Última atualização: {time}
                </Text> */}
              </View>
            )}

            {/* Gráfico de 24 horas */}
            <View style={styles.cardTemp}>
              <View style={styles.InfoTime}>
                <Image
                  style={styles.iconTime}
                  source={require("../assets/icon-time.png")}
                />
                <Text style={styles.subtitle}>
                  Temperaturas registradas nas últimas 24 horas
                </Text>
              </View>
              <View style={styles.chart}>
                {loading ? (
                  <ActivityIndicator size="large" color="#fff" />
                ) : (
                  <>
                    {/* ---- EIXO Y FIXO (APENAS TEXTO) ---- */}
                    <View
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 20,
                        zIndex: 20,
                      }}
                    >
                      <Text style={{ color: "#fff", fontSize: 16 }}>
                        Temp (°C)
                      </Text>
                    </View>

                    {/* ---- ÁREA DO GRÁFICO SCROLLÁVEL ---- */}
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={{ marginLeft: 40 }} // espaço para o eixo Y fixo
                      ref={(ref) => {
                        if (ref) {
                          setTimeout(
                            () => ref.scrollToEnd({ animated: false }),
                            100
                          );
                        }
                      }}
                      contentContainerStyle={{ paddingRight: 20 }}
                    >
                      <LineChart
                        data={{
                          labels: grafico24h.labels,
                          datasets: [
                            {
                              data:
                                grafico24h.data.length > 0
                                  ? grafico24h.data
                                  : [0],
                              color: () => "#fff",
                            },
                          ],
                        }}
                        width={grafico24h.labels.length * 80} // espaçamento entre os pontos
                        height={240}
                        withInnerLines={true}
                        withHorizontalLines={true}
                        withVerticalLines={true}
                        yAxisSuffix="°"
                        chartConfig={{
                          backgroundGradientFrom: "#679880",
                          backgroundGradientTo: "#679880",
                          decimalPlaces: 1,
                          color: () => "#fff",
                          labelColor: () => "#fff",
                          propsForDots: {
                            r: "6",
                            strokeWidth: "3",
                            stroke: "#fff",
                            fill: "#fff",
                          },
                        }}
                        bezier
                        style={{ borderRadius: 10 }}
                      />
                    </ScrollView>

                    {/* ---- EIXO X FIXO (HORÁRIO) ---- */}
                    <View
                      style={{
                        position: "absolute",
                        bottom: -5,
                        left: 50,
                        zIndex: 30,
                      }}
                    >
                      <Text style={{ color: "#fff", fontSize: 16, width: 200 }}>
                        Horário
                      </Text>
                    </View>
                  </>
                )}
              </View>
            </View>

            {/* Gráfico semanal */}
            <View style={styles.chartContainer}>
              <View style={styles.tittleChart}>
                <Image
                  style={styles.chartIcon}
                  source={require("../assets/icon-time.png")}
                />
                <Text style={styles.chartTitle}>
                  Temperaturas registradas durante a semana
                </Text>
              </View>

              {loading ? (
                <ActivityIndicator size="large" color="#fff" />
              ) : (
                <LineChart
                  data={{
                    labels: graficoSemana.labels,
                    datasets: [
                      {
                        data:
                          graficoSemana.maxData.length > 0
                            ? graficoSemana.maxData
                            : [0],
                        color: () => "#244C38",
                      },
                      {
                        data:
                          graficoSemana.minData.length > 0
                            ? graficoSemana.minData
                            : [0],
                        color: () => "#ffffffbe",
                      },
                    ],
                  }}
                  width={screenWidth * 0.9}
                  height={220}
                  formatYLabel={(value) => `${parseInt(value)}°C`}
                  chartConfig={{
                    backgroundGradientFrom: "#679880",
                    backgroundGradientTo: "#679880",
                    color: () => "#244C38",
                    labelColor: () => "#fff",
                    propsForBackgroundLines: {
                      stroke: "transparent",
                    },
                  }}
                  bezier
                  style={{ borderRadius: 12 }}
                />
              )}

              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View
                    style={[styles.colorBox, { backgroundColor: "#244C38" }]}
                  />
                  <Text style={styles.legendText}>Temperatura máxima</Text>
                </View>
                <View style={styles.legendItem}>
                  <View
                    style={[styles.colorBox, { backgroundColor: "#ffffffff" }]}
                  />
                  <Text style={styles.legendText}>Temperatura mínima</Text>
                </View>
              </View>
            </View>
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
    width: "100%",
    backgroundColor: "#305F49",
    borderTopLeftRadius: 80,
    alignItems: "center",
    paddingTop: 40,
  },
  card: {
    backgroundColor: "#679880",
    width: 350,
    height: 150,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  cardTemp: {
    backgroundColor: "#679880",
    width: 350,
    minHeight: 280,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  cardMain: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    alignItems: "center",
    minHeight: 200,
    justifyContent: "center",
  },
  textSmall: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    width: 200,
  },
  iconFreezer: {
    height: 80,
    width: 80,
  },
  iconFreezerModal: {
    height: 50,
    width: 50,
  },
  freezerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  freezerLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginLeft: -7,
  },
  freezerLogo: {
    marginTop: -50,
  },
  iconTime: {
    backgroundColor: "rgba(255,255,255, 0.2)",
    borderRadius: 20,
    height: 20,
    width: 20,
    marginLeft: 10,
    marginRight: -10,
  },
  InfoTime: {
    flexDirection: "row",
    justifyContent: "center",
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 25,
    backgroundColor: "rgba(255,255,255, 0.5)",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  temp: {
    color: "#fff",
    fontSize: 96,
    fontWeight: "bold",
  },
  subTemp: {
    marginLeft: 150,
    marginTop: -45,
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  lastUpdate: {
    color: "#fff",
    fontSize: 12,
    marginTop: 10,
    opacity: 0.8,
  },
  chart: {
    marginTop: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
  },
  subtitle: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#305F49",
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
  },
  freezerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  freezerItem: {
    width: "45%",
    alignItems: "center",
    marginBottom: 20,
  },
  selectedBadge: {
    backgroundColor: "#9FD1B7",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 6,
  },
  selectedBadgeText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  confirmBtn: {
    backgroundColor: "#9FD1B7",
    paddingVertical: 12,
    borderRadius: 10,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  confirmText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelText: {
    color: "#305F49",
    fontWeight: "bold",
  },
  chartContainer: {
    backgroundColor: "#679880",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    width: "90%",
    marginBottom: 25,
  },
  chartTitle: {
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    fontSize: 15,
  },
  tittleChart: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  chartIcon: {
    backgroundColor: "rgba(255,255,255, 0.2)",
    borderRadius: 20,
    height: 20,
    width: 20,
    marginRight: 5,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: screenWidth * 0.9,
    marginTop: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorBox: {
    width: 12,
    height: 12,
    marginRight: 6,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
});
