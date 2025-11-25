import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar, LocaleConfig } from "react-native-calendars";
import Modal from "react-native-modal";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDB } from "../../awsConfig";

const screenWidth = Dimensions.get("window").width;
const TABLE_NAME = "LeiturasDHT";

export default function GerenciarTemperaturaScreen({ navigation }) {
  const [selectedDates, setSelectedDates] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentFreezer, setCurrentFreezer] = useState(2);
  const [tempFreezer, setTempFreezer] = useState(2);
  const [isLoading, setIsLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  // Função para converter string "DD/MM/YYYY HH:MM:SS" para timestamp
  const dateStringToTimestamp = (dateStr) => {
    if (typeof dateStr !== "string") return 0;

    try {
      // Split "24/11/2025 14:30:00" em partes
      const [datePart, timePart] = dateStr.split(" ");
      const [day, month, year] = datePart.split("/");
      const [hours, minutes, seconds] = timePart.split(":");

      // Criar data (mês é 0-indexed no JavaScript)
      return new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hours),
        parseInt(minutes),
        parseInt(seconds || 0)
      ).getTime();
    } catch (error) {
      console.error("Erro ao converter data:", dateStr, error);
      return 0;
    }
  };

  // Função para formatar data (agora o timestamp já vem formatado do banco)
  const formatDateBR = (dateString) => {
    // Se já vier no formato "DD/MM/YYYY HH:MM:SS", retornar direto
    if (typeof dateString === "string" && dateString.includes("/")) {
      return dateString;
    }

    // Fallback para timestamp em número
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  // Função para buscar dados do DynamoDB
  const fetchTemperatureData = async (freezerId, startDate, endDate) => {
    try {
      setIsLoading(true);
      console.log(
        `Buscando dados do Freezer ${freezerId} de ${startDate} a ${endDate}`
      );

      // Converter datas para timestamp para comparação
      const startTimestamp = new Date(startDate + "T00:00:00").getTime();
      const endTimestamp = new Date(endDate + "T23:59:59").getTime();

      console.log("Timestamps de busca:", {
        startTimestamp,
        endTimestamp,
        startDate: new Date(startTimestamp).toLocaleString("pt-BR"),
        endDate: new Date(endTimestamp).toLocaleString("pt-BR"),
      });

      let allItems = [];
      let lastEvaluatedKey = null;

      // Scan apenas com filtro de freezerId (timestamp é string, não dá para filtrar no DynamoDB)
      do {
        const params = {
          TableName: TABLE_NAME,
          FilterExpression: "freezerId = :freezerId",
          ExpressionAttributeValues: {
            ":freezerId": freezerId,
          },
        };

        if (lastEvaluatedKey) {
          params.ExclusiveStartKey = lastEvaluatedKey;
        }

        const command = new ScanCommand(params);
        const response = await dynamoDB.send(command);

        if (response.Items && response.Items.length > 0) {
          console.log(`Página recebida: ${response.Items.length} itens`);

          // Filtrar por data no lado do cliente (timestamp é string)
          const filteredItems = response.Items.filter((item) => {
            const itemTimestamp = dateStringToTimestamp(item.timestamp);
            const isInRange =
              itemTimestamp >= startTimestamp && itemTimestamp <= endTimestamp;

            if (!isInRange) {
              console.log("Item fora do período:", {
                timestamp: item.timestamp,
                itemTimestamp,
                startTimestamp,
                endTimestamp,
              });
            }

            return isInRange;
          });

          console.log(`Filtrados nesta página: ${filteredItems.length} itens`);
          allItems = [...allItems, ...filteredItems];
        }

        lastEvaluatedKey = response.LastEvaluatedKey;
      } while (lastEvaluatedKey);

      console.log(`Total de registros encontrados: ${allItems.length}`);
      return allItems;
    } catch (error) {
      console.error("Erro ao buscar dados do DynamoDB:", error);
      Alert.alert(
        "Erro",
        "Não foi possível buscar os dados de temperatura: " + error.message
      );
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Função para converter dados para CSV
  const convertToCSV = (data) => {
    if (!data || data.length === 0) {
      return null;
    }

    const headers = ["Freezer ID", "Temperatura", "Timestamp", "Unidade"];

    // Ordenar dados por timestamp
    const sortedData = [...data].sort((a, b) => {
      return (
        dateStringToTimestamp(a.timestamp) - dateStringToTimestamp(b.timestamp)
      );
    });

    // Linhas de dados
    const rows = sortedData.map((item) => {
      return [
        item.freezerId || "",
        item.temperatura || "",
        item.timestamp, // Já vem formatado do banco
        item.unidade || "°C",
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    return csvContent;
  };

  const downloadData = async (startDate, endDate, periodName) => {
    try {
      const data = await fetchTemperatureData(
        currentFreezer,
        startDate,
        endDate
      );

      if (!data || data.length === 0) {
        Alert.alert(
          "Aviso",
          `Nenhum dado encontrado para o Freezer ${currentFreezer} no período selecionado`
        );
        return;
      }

      const csvContent = convertToCSV(data);

      if (!csvContent) {
        Alert.alert("Erro", "Não foi possível gerar o arquivo CSV");
        return;
      }

      const fileName = `temperatura_freezer${currentFreezer}_${periodName}_${new Date().getTime()}.csv`;
      const fileUri = FileSystem.documentDirectory + fileName;

      // Salvar arquivo (sem especificar encoding)
      await FileSystem.writeAsStringAsync(fileUri, csvContent);

      // Compartilhar arquivo
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "text/csv",
          dialogTitle: `Exportar dados do Freezer ${currentFreezer}`,
        });
        Alert.alert(
          "Sucesso!",
          `${data.length} registros do Freezer ${currentFreezer} exportados com sucesso!`
        );
      } else {
        Alert.alert(
          "Arquivo Salvo",
          `${data.length} registros salvos em:\n${fileUri}`
        );
      }
    } catch (error) {
      console.error("Erro ao baixar dados:", error);
      Alert.alert("Erro", "Não foi possível baixar os dados: " + error.message);
    }
  };

  const downloadToday = () => {
    const today = new Date().toISOString().split("T")[0];
    Alert.alert(
      "Confirmar Download",
      `Deseja baixar os dados de hoje do Freezer ${currentFreezer}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: () => downloadData(today, today, "hoje"),
        },
      ]
    );
  };

  const downloadLast7Days = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    Alert.alert(
      "Confirmar Download",
      `Deseja baixar os dados dos últimos 7 dias do Freezer ${currentFreezer}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: () =>
            downloadData(
              startDate.toISOString().split("T")[0],
              endDate.toISOString().split("T")[0],
              "ultimos_7_dias"
            ),
        },
      ]
    );
  };

  const downloadLast30Days = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    Alert.alert(
      "Confirmar Download",
      `Deseja baixar os dados dos últimos 30 dias do Freezer ${currentFreezer}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: () =>
            downloadData(
              startDate.toISOString().split("T")[0],
              endDate.toISOString().split("T")[0],
              "ultimos_30_dias"
            ),
        },
      ]
    );
  };

  const downloadSelectedPeriod = () => {
    const dates = Object.keys(selectedDates).sort();

    if (dates.length === 0) {
      Alert.alert("Aviso", "Selecione uma data ou período no calendário");
      return;
    }

    const startDate = dates[0];
    const endDate = dates[dates.length - 1];

    Alert.alert(
      "Confirmação",
      `Deseja baixar os dados de temperatura do Freezer ${currentFreezer} de ${startDate
        .split("-")
        .reverse()
        .join("/")} até ${endDate.split("-").reverse().join("/")}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: () => {
            downloadData(startDate, endDate, "periodo_selecionado");
          },
        },
      ],
      { cancelable: false }
    );
  };

  const confirmFreezerChange = () => {
    if (tempFreezer === currentFreezer) {
      Alert.alert("Aviso", "Este freezer já está selecionado");
      setModalVisible(false);
      return;
    }

    Alert.alert(
      "Confirmação",
      `Deseja realmente mudar para o Freezer ${tempFreezer}?`,
      [
        {
          text: "Cancelar",
          onPress: () => {
            setModalVisible(false);
            setTempFreezer(currentFreezer);
          },
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: () => {
            setCurrentFreezer(tempFreezer);
            setModalVisible(false);
            setSelectedDates({});
            Alert.alert(
              "Sucesso",
              `Visualizando dados do Freezer ${tempFreezer}`
            );
          },
        },
      ],
      { cancelable: false }
    );
  };

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
              onPress={() => navigation.openDrawer()}
            >
              <Ionicons name="menu" size={50} color="#305F49" />
            </TouchableOpacity>
            <Image style={styles.logo} source={require("../assets/logo.png")} />
          </View>

          <View style={styles.content}>
            <View style={styles.card}>
              <Text style={styles.textSmall}>
                Você está visualizando a temperatura do freezer {currentFreezer}
              </Text>
              <View style={styles.freezerInfo}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    setTempFreezer(currentFreezer);
                    setModalVisible(true);
                  }}
                  disabled={isLoading}
                >
                  <Text style={styles.buttonText}>Mudar freezer</Text>
                </TouchableOpacity>

                <Modal
                  isVisible={isModalVisible}
                  backdropOpacity={0.5}
                  onBackdropPress={() => {
                    setModalVisible(false);
                    setTempFreezer(currentFreezer);
                  }}
                >
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
                            onPress={() => setTempFreezer(item)}
                          >
                            {tempFreezer === item && (
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
                            <Text style={styles.freezerLabel}>
                              Freezer {item}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>

                      <View style={styles.modalActions}>
                        <TouchableOpacity
                          style={styles.cancelBtn}
                          onPress={() => {
                            setModalVisible(false);
                            setTempFreezer(currentFreezer);
                          }}
                        >
                          <Text style={styles.cancelText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.confirmBtn}
                          onPress={confirmFreezerChange}
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
                  <Text style={styles.freezerLabel}>
                    Freezer {currentFreezer}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.downloadBox}>
              <Text style={styles.downloadTitle}>
                Escolha o período para recuperar os dados de temperatura
              </Text>
              <TouchableOpacity
                style={[
                  styles.downloadButton,
                  isLoading && styles.buttonDisabled,
                ]}
                onPress={downloadToday}
                disabled={isLoading}
              >
                <Text style={styles.downloadText}>
                  {isLoading ? "Processando..." : "Baixar dados de hoje"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.downloadButton,
                  isLoading && styles.buttonDisabled,
                ]}
                onPress={downloadLast7Days}
                disabled={isLoading}
              >
                <Text style={styles.downloadText}>
                  {isLoading
                    ? "Processando..."
                    : "Baixar dados dos últimos 7 dias"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.downloadButton,
                  isLoading && styles.buttonDisabled,
                ]}
                onPress={downloadLast30Days}
                disabled={isLoading}
              >
                <Text style={styles.downloadText}>
                  {isLoading
                    ? "Processando..."
                    : "Baixar dados dos últimos 30 dias"}
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

                  if (
                    !start ||
                    (start && Object.keys(selectedDates).length > 1)
                  ) {
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
              <TouchableOpacity
                style={[
                  styles.calendarButton,
                  isLoading && styles.buttonDisabled,
                ]}
                onPress={downloadSelectedPeriod}
                disabled={isLoading}
              >
                <Text style={styles.calendarText}>
                  {isLoading ? "Processando..." : "Baixar período selecionado"}
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

LocaleConfig.locales["pt"] = {
  monthNames: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],
  monthNamesShort: [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ],
  dayNames: [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ],
  dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  today: "Hoje",
};

LocaleConfig.defaultLocale = "pt";

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
    width: "80%",
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255, 0.5)",
  },
  calendarButton: {
    height: 45,
    width: "100%",
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
    textAlign: "center",
    lineHeight: 45,
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.5,
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
});
