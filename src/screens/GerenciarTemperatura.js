import React from "react";
import { View, Text, Button } from "react-native";

export default function GerenciarTemperatura({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Tela Inicial</Text>
      <Button
        title="Ir para Perfil"
        onPress={() =>
          navigation.navigate("Perfil")
        }
      />
    </View>
  );
}
