import React from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";


const screenWidth = Dimensions.get("window").width;

export default function GerenciarTemperaturaScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
      <View style={styles.logoContainer}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={30} color="#305F49" />
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

        <View style={styles.cardMain}>
          <Text style={styles.title}>Temperatura atual dentro do freezer 1</Text>
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
            Últimas temperaturas registradas nas 24 horas
          </Text>
          </View>
          <View style={styles.chart}>
<LineChart
  data={{
    labels: ["13:00", "13:30", "14:00", "Agora"],
    datasets: [{ data: [9, 10, 12, 8] }],
  }}
  width={screenWidth * 1}
  height={200}
  yAxisSuffix="°"
  chartConfig={{
    backgroundGradientFrom: "transparent",
    backgroundGradientTo: "transparent",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(48, 95, 73, ${opacity})`,
    labelColor: () => "#fff",
    propsForDots: {
      r: "5",
      strokeWidth: "2",
      stroke: "#305F49",
      fill: "#305F49",
    },
  }}
  withInnerLines={false} // opcional, remove linhas internas
  withVerticalLines={false} // deixa o gráfico mais limpo
  withHorizontalLines={false}
  bezier
  style={{
    borderRadius: 10,
    marginLeft: 30,
    fontWeight: '600',
  }}
/>

</View>
        </View>

        <View style={styles.cardUltimasTemps}>
          <View style={styles.ultimasTemps}> 
          <Image
          style={styles.iconCalender}
          source={require("../assets/icon-calender.png")}
          />
          <Text style={styles.subtitle}>
            Últimas temperaturas registradas nos últimos dias
          </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.day}>Terça-feira</Text>
            <View style={styles.linha}></View>
            <Text style={styles.degrees}>12° / 5°</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.day}>Quarta-feira</Text>
            <View style={styles.linha}></View>
            <Text style={styles.degrees}>10° / 7°</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.day}>Quinta-feira</Text>
            <View style={styles.linha}></View>
            <Text style={styles.degrees}>11° / 6°</Text>
          </View>

          <TouchableOpacity style={styles.buttonTemps}>
            <Text style={styles.buttonText}>Todas as temperaturas registradas</Text>
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
  logo: {
    height: 350,
    width: 350,
    marginBottom: -120,
    marginTop: -180,
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
  cardTemp: {
    backgroundColor: "#89BBA1",
    width: 350,
    height: 260,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  cardUltimasTemps: {
    backgroundColor: "#89BBA1",
    width: 350,
    height: 230,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  ultimasTemps: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  iconCalender: {
    backgroundColor: "rgba(255,255,255, 0.2)",
    borderRadius: 10,
    height: 20,
    width: 20,
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
  },

  InfoTime: {
    flexDirection: "row",
    justifyContent: "space-around",
  },

  button: {
    backgroundColor: "rgba(255,255,255, 0.5)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 25,
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
  buttonTemps: {
    backgroundColor: "rgba(255,255,255, 0.5)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
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
    alignItems: "center",
  },
  subtitle: {
    color: "#fff",
    fontSize: 13,
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
});
