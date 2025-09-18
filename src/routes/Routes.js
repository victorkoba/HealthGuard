import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Inicio from "../screens/Inicio";
import Perfil from "../screens/Perfil";
import Login from "../screens/Login";
import Cadastro from "../screens/Cadastro";
import Duvidas from "../screens/Duvidas";
import Monitoramento from "../screens/Monitoramento";
import Relatorios from "../screens/Relatorios";
import Gerenciamento from "../screens/Gerenciamento";

const Stack = createNativeStackNavigator();
export default function NativeStack() {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          />
      </Stack.Navigator>
  );
}