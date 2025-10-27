import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView
} from "react-native";
import { Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "react-native-calendars";

const screenWidth = Dimensions.get("window").width;

export default function GerenciarTemperaturaScreen({ navigation }) {
  const [selectedDates, setSelectedDates] = useState({});

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
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>Mudar freezer</Text>
                </TouchableOpacity>
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
                Selecione o período para recuperar os dados de temperatura
              </Text>
              <TouchableOpacity style={styles.downloadButton}>
                <Text style={styles.downloadText}>Abaixar dados do dia de hoje</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.downloadButton}>
                <Text style={styles.downloadText}>Abaixar dados dos últimos 7 dias</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.downloadButton}>
                <Text style={styles.downloadText}>
                  Abaixar dados dos últimos 30 dias
                </Text>
              </TouchableOpacity>
            </View>
          </View>
      <View>
      <Calendar
        current={today}
        markingType={"period"}
        markedDates={selectedDates}
        onDayPress={(day) => {
          const start = Object.keys(selectedDates)[0];

          if (!start || start && Object.keys(selectedDates).length > 1) {
            setSelectedDates({
              [day.dateString]: {
                startingDay: true,
                endingDay: true,
                color: "#9FD1B7",
                textColor: "white",
              },
            });
          } else {
            // Cria intervalo
            const end = day.dateString;
            const range = getDateRange(start, end);

            const obj = {};
            range.forEach((date, index) => {
              obj[date] = {
                color: "#9FD1B7",
                textColor: "white",
                startingDay: index === 0,
                endingDay: index === range.length - 1,
              };
            });

            setSelectedDates(obj);
          }
        }}
        maxDate={today}

        theme={{
          todayTextColor: "#244C38",
          selectedDayBackgroundColor: "#244C38",
        }}
      />
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
  downloadButton: {
    height: 45,
    width: '80%',
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: "rgba(255,255,255, 0.5)",
  },
  downloadText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
