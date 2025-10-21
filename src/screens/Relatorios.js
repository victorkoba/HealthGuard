import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

export default function GerenciarTemperaturaScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
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

        <View style={styles.chartContainer}>
          <View style={styles.tittleChart}>
            <Image
              style={styles.chartIcon}
              source={require("../assets/icon-time.png")}
            />
            <Text style={styles.chartTitle}>
              Registro de temperatura durante a semana
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
              backgroundGradientFrom: "#89BBA1",
              backgroundGradientTo: "#89BBA1",
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 60,
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
    width: "100%",
    backgroundColor: "#679880",
    borderTopLeftRadius: 80,
    alignItems: "center",
    paddingTop: 40,
  },
  card: {
    backgroundColor: "#89BBA1",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  chartContainer: {
    backgroundColor: "#89BBA1",
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
  downloadBox: {
    backgroundColor: "#89BBA1",
    borderRadius: 12,
    width: "90%",
    padding: 15,
    alignItems: "center",
  },
  downloadTitle: {
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  downloadButton: {
    height: 35,
    width: '80%',
    borderRadius: 20,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: "rgba(255,255,255, 0.5)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  downloadText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
