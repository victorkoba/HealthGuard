import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert
} from "react-native";
import { Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar, LocaleConfig } from "react-native-calendars";
import Modal from "react-native-modal";

const screenWidth = Dimensions.get("window").width;

export default function GerenciarTemperaturaScreen({ navigation }) {
  const [selectedDates, setSelectedDates] = useState({});

  const [isModalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [freezer, setFreezer] = useState();

  const today = new Date().toISOString().split("T")[0];
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
                <TouchableOpacity style={styles.button} onPress={() => {
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
            <View style={styles.downloadBox}>
              <Text style={styles.downloadTitle}>
                Escolha o período para recuperar os dados de temperatura
              </Text>
              <TouchableOpacity style={styles.downloadButton}>
                <Text style={styles.downloadText}>Baixar dados de hoje</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.downloadButton}>
                <Text style={styles.downloadText}>Baixar dados dos últimos 7 dias</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.downloadButton}>
                <Text style={styles.downloadText}>
                  Baixar dados dos últimos 30 dias
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.calendarWrapper}>
              <Text style={styles.calenderTitle}>
                Escolha uma data ou período para consultar a temperatura
              </Text>
              <Calendar
                style={styles.calendar}
                current={today}
                markingType="period"
                markedDates={selectedDates}
                maxDate={today}
                theme={styles.calendarTheme}
                onDayPress={(day) => {
                  const start = Object.keys(selectedDates)[0];

                  if (!start || (start && Object.keys(selectedDates).length > 1)) {
                    setSelectedDates({
                      [day.dateString]: {
                        startingDay: true,
                        endingDay: true,
                        color: "#305F49",
                        textColor: "#fff",
                      },
                    });
                  } else {
                    const end = day.dateString;
                    const range = getDateRange(start, end);

                    const obj = {};
                    range.forEach((date, index) => {
                      obj[date] = {
                        color: "#305F49",
                        textColor: "#fff",
                        startingDay: index === 0,
                        endingDay: index === range.length - 1,
                      };
                    });

                    setSelectedDates(obj);
                  }
                }}
              />
              <TouchableOpacity style={styles.calendarButton}
                onPress={() => {
                  Alert.alert(
                    "Confirmação",
                    "Deseja realmente baixar os dados de temperatura dos dias selecionados?",
                    [
                      {
                        text: "Cancelar",
                        style: "cancel",
                      },
                      {
                        text: "Confirmar",
                      },
                    ],
                    { cancelable: false }
                  );
                }}
              >
                <Text style={styles.calendarText}>
                  Baixar período selecionado
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
function getDateRange(start, end) {
  const range = [];
  const startDate = new Date(start);
  const endDate = new Date(end);

  while (startDate <= endDate) {
    range.push(startDate.toISOString().split("T")[0]);
    startDate.setDate(startDate.getDate() + 1);
  }
  return range;
}

LocaleConfig.locales['pt'] = {
  monthNames: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ],
  monthNamesShort: [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ],
  dayNames: [
    'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'
  ],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  today: 'Hoje'
};

// Define o idioma padrão como português
LocaleConfig.defaultLocale = 'pt';


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
  calendarWrapper: {
    width: 350,
    minHeight: 380,
    backgroundColor: "#679880",
    borderRadius: 15,
    padding: 10,
    alignSelf: "center",
    marginBottom: 10,
  },
  calendar: {
    borderRadius: 12,
    padding: 5,
  },

  calendarTheme: {
    backgroundColor: "transparent",
    calendarBackground: "transparent",
    todayTextColor: "#244C38",
    selectedDayBackgroundColor: "#244C38",
    monthTextColor: "#FFFFFF",
    dayTextColor: "#FFFFFF",
    arrowColor: "#FFFFFF",
    textMonthFontWeight: "bold",
    textMonthFontSize: 18,
    textDayFontSize: 15,
    textSectionTitleColor: "#FFFFFF",
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
  textArea: {
    width: "65%",
  },
  freezerText: {
    color: "#244C38",
    fontSize: 14,
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#C6E0CF",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignSelf: "flex-start",
  },
  imageArea: {
    alignItems: "center",
    justifyContent: "center",
  },
  freezerIcon: {
    width: 40,
    height: 40,
    marginBottom: 5,
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
  downloadBox: {
    backgroundColor: "#679880",
    borderRadius: 12,
    width: "90%",
    padding: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  downloadTitle: {
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20,
    fontSize: 16,
    textAlign: "center",
  },
  calenderTitle: {
    marginTop: 10,
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  downloadButton: {
    height: 45,
    width: '80%',
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: "rgba(255,255,255, 0.5)",
  },
  calendarButton: {
    height: 45,
    width: '100%',
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 10,
    backgroundColor: "rgba(255,255,255, 0.5)",
  },
  downloadText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  calendarText: {
    textAlign: 'center',
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

    modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

    iconFreezerModal: {
    height: 50,
    width: 50,
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
});
