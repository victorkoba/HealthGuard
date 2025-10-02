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
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Login"
    >
      <Stack.Screen
        name="Login"
        component={Login}
      />
      <Stack.Screen
        name="Perfil"
        component={Perfil}
      />
      <Stack.Screen
        name="Inicio"
        component={Inicio}
      />
      <Stack.Screen
        name="Cadastro"
        component={Cadastro}
      />
      <Stack.Screen
        name="Duvidas"
        component={Duvidas}
      />
      <Stack.Screen
        name="Monitoramento"
        component={Monitoramento}
      />
      <Stack.Screen
        name="Relatorios"
        component={Relatorios}
      />
      <Stack.Screen
        name="Gerenciamento"
        component={Gerenciamento}
      />
    </Stack.Navigator>
  );
}

const Drawer = createDrawerNavigator();
export function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Inicio"
    >
      <Drawer.Screen
        name="Perfil"
        component={Perfil}
      />
      <Drawer.Screen
        name="Inicio"
        component={Inicio}
      />
      <Drawer.Screen
        name="Cadastro"
        component={Cadastro}
      />
      <Drawer.Screen
        name="Duvidas"
        component={Duvidas}
      />
      <Drawer.Screen
        name="Monitoramento"
        component={Monitoramento}
      />
      <Drawer.Screen
        name="Relatorios"
        component={Relatorios}
      />
      <Drawer.Screen
        name="Gerenciamento"
        component={Gerenciamento}
      />
    </Drawer.Navigator>
  );
}
