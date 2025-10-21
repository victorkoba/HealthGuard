import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "../screens/splashscreen";
import Inicio from "../screens/Inicio";
import Perfil from "../screens/Perfil";
import Login from "../screens/Login";
import Cadastro from "../screens/Cadastro";
import Duvidas from "../screens/Duvidas";
import Monitoramento from "../screens/Monitoramento";
import Relatorios from "../screens/Relatorios";
import GerenciarTemperatura from "../screens/GerenciarTemperatura";
import GerenciarUsuarios from "../screens/GerenciarUsuarios";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function NativeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="App" component={DrawerNavigator} />
    </Stack.Navigator>
  );
}

export function DrawerNavigator() {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="Inicio" component={Inicio} />
      <Drawer.Screen name="Perfil" component={Perfil} />
      <Drawer.Screen name="Cadastro" component={Cadastro} />
      <Drawer.Screen name="Duvidas" component={Duvidas} />
      <Drawer.Screen name="Monitoramento" component={Monitoramento} />
      <Drawer.Screen name="Relatorios" component={Relatorios} />
      <Drawer.Screen name="GerenciarTemperatura" component={GerenciarTemperatura} />
      <Drawer.Screen name="GerenciarUsuarios" component={GerenciarUsuarios} />
    </Drawer.Navigator>
  );
}
