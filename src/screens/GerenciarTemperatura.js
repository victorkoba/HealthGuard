import React, { useState } from "react"; import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  TextInput,
  Alert
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Modal from "react-native-modal";

const screenWidth = Dimensions.get("window").width;

export default function GerenciarTemperaturaScreen({ navigation }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [freezer, setFreezer] = useState();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#305F49",
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
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
            <View style={styles.card}>
              <Text style={styles.textSmall}>
                Você está visualizando a temperatura do freezer 2
              </Text>
              <View style={styles.freezerInfo}>
                <TouchableOpacity style={styles.button}
                  onPress={() => {
                    setModalVisible(true)
                    setEditModalVisible(true);
                  }}
                >
                  <Text style={styles.buttonText}>Mudar freezer</Text>
                </TouchableOpacity>
                <Modal isVisible={isModalVisible}
                  backdropOpacity={0.1}
                  onBackdropPress={() => setModalVisible(false)}>
                  <View style={styles.modalContainer}>
                    <View style={styles.modalBox}>

                      <Text style={styles.modalTitle}>
                        Você deseja mudar para qual freezer?
                      </Text>

                      <View style={styles.freezerGrid}>
                        {[1, 2, 3, 4].map((item) => (
                          <TouchableOpacity
                            key={item}
                            style={styles.freezerItem}
                            onPress={() => setFreezer(item)}
                          >
                            {freezer === item && (
                              <View style={styles.selectedBadge}>
                                <Text style={styles.selectedBadgeText}>Selecionado</Text>
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
                        <TouchableOpacity style={styles.cancelBtn}
                          onPress={() => setModalVisible(false)}
                        >
                          <Text style={styles.cancelText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.confirmBtn}
                          onPress={() => {
                            Alert.alert(
                              "Confirmação",
                              "Deseja realmente mudar o freezer?",
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
                                    setModalVisible(false);
                                  },
                                },
                              ],
                              { cancelable: false }
                            );
                          }}
                        >
                          <Text style={styles.confirmText}>Confirmar</Text>
                        </TouchableOpacity>
                      </View>

                    </View>
                  </View>
                </Modal>
                <View style={styles.freezerLogo}>
                  <Image
                    style={styles.iconFreezer}
                    source={require("../assets/icon-freezer.png")}
                  />
                  <Text style={styles.freezerLabel}>Freezer 2</Text>
                </View>
              </View>
            </View>

            <View style={styles.cardMain}>
              <Text style={styles.title}>Temperatura atual dentro do freezer 2</Text>
              <Text style={styles.temp}>7°C</Text>
              <Text style={styles.subTemp}>12° / 4°</Text>
            </View>

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
                <LineChart
                  data={{
                    labels: ["12:00", "12:30", "13:00", "13:30", "14:00", "Agora"],
                    datasets: [{ data: [5, 9, 10, 12, 4, 3], color: () => "#fff" }],
                  }}
                  width={340}
                  height={200}
                  yAxisSuffix="°"
                  chartConfig={{
                    backgroundGradientFrom: "#679880",
                    backgroundGradientTo: "#679880",
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(48, 95, 73, ${opacity})`,
                    labelColor: () => "#fff",
                    propsForDots: {
                      r: "5",
                      strokeWidth: "2",
                      stroke: "#fff",
                      fill: "#fff",
                    },
                  }}
                  withInnerLines={false}
                  withVerticalLines={false}
                  withHorizontalLines={false}
                  bezier
                  style={{
                    borderRadius: 10,
                    fontWeight: '600',
                  }}
                />

              </View>
            </View>
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
                      <LineChart
                        data={{
                          labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
                          datasets: [
                            { data: [12, 8, 11, 14, 10, 9, 9], color: () => "#244C38" },
                            { data: [8, 6, 7, 10, 9, 8, 8], color: () => "#ffffffbe" },
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
            
                      <View style={styles.legendContainer}>
                        <View style={styles.legendItem}>
                          <View style={[styles.colorBox, { backgroundColor: "#244C38" }]} />
                          <Text style={styles.legendText}>Temperatura máxima</Text>
                        </View>
                        <View style={styles.legendItem}>
                          <View style={[styles.colorBox, { backgroundColor: "#ffffffff" }]} />
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
    height: 280,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  cardUltimasTemps: {
    backgroundColor: "#679880",
    width: 350,
    height: 260,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  ultimasTemps: {
    flexDirection: "row",
    justifyContent: "space-around",
    justifyContent: 'center',
  },
  iconCalender: {
    backgroundColor: "rgba(255,255,255, 0.2)",
    borderRadius: 10,
    height: 20,
    width: 20,
    marginLeft: 10,
    marginRight: -10,
  },
  cardMain: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    alignItems: "center",
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
    justifyContent: "space-around",
    justifyContent: 'center',
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
  buttonTemps: {
    backgroundColor: "rgba(255,255,255, 0.5)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 25,
  },

  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: '600',
  },
  temp: {
    color: "#fff",
    fontSize: 96,
    fontWeight: "bold",
  },
  subTemp: {
    color: "#fff",
    fontSize: 18,
    fontWeight: '600',
  },
  chart: {
    marginTop: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  subtitle: {
    color: "#fff",
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '600',
  },
  row: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  day: {
    fontSize: 14,
    color: "#fff",
    fontWeight: '600',
  },
  degrees: {
    fontSize: 14,
    color: "#fff",
    fontWeight: '600',
  },
  linha: {
    height: 1.3,
    width: 180,
    backgroundColor: '#ffffff59',
    marginTop: 12,
    borderRadius: 50,
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

  freezerLabel: {
    marginTop: 8,
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
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
    marginLeft: 10,
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
    fontWeight:'600',
  },
});
