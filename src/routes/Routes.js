import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image } from "react-native";

import SplashScreen from "../screens/splashscreen";
import Inicio from "../screens/Inicio";
import Perfil from "../screens/Perfil";
import Login from "../screens/Login";
import Duvidas from "../screens/Duvidas";
import Relatorios from "../screens/Relatorios";
import GerenciarTemperatura from "../screens/GerenciarTemperatura";
import GerenciarUsuarios from "../screens/GerenciarUsuarios";
import RedefinirSenha from "../screens/RedefinirSenha";
import InserirCodigo from "../screens/InserirCodigo";
import CriarNovaSenha from "../screens/CriarNovaSenha";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function NativeStack() {
  return (
     <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Login"
    >
      <Stack.Screen
        name="GerenciarTemperatura"
        component={GerenciarTemperatura}
      />
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
      />
      <Stack.Screen
        name="Login"
        component={Login}
      />
      <Stack.Screen
        name="App"
        component={DrawerNavigator}
      />
      <Stack.Screen
        name="RedefinirSenha"
        component={RedefinirSenha}
      />
      <Stack.Screen
        name="InserirCodigo"
        component={InserirCodigo}
      />
      <Stack.Screen
        name="CriarNovaSenha"
        component={CriarNovaSenha}
      />
      <Stack.Screen
        name="Inicio"
        component={Inicio}
      />
    </Stack.Navigator>
  );
}

export function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: "#fff",
        drawerInactiveTintColor: "#fff",
        drawerStyle: {
          backgroundColor: "#305F49",
          width: 320,
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
        },
        drawerLabelStyle: {
          fontWeight: "bold",
          fontSize: 20,
          marginLeft: 5,
        },
      }}
    >
      <Drawer.Screen
        name="Inicio"
        component={Inicio}
        options={{
          drawerLabel: "Início",
          drawerIcon: () => (
            <Image
              source={require("../assets/icon-home.png")}
              style={{ width: 25, height: 25, tintColor: "#fff" }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Perfil"
        component={Perfil}
        options={{
          drawerLabel: "Ver perfil",
          drawerIcon: () => (
            <Image
              source={require("../assets/icon-perfil.png")}
              style={{ width: 25, height: 25, tintColor: "#fff" }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="GerenciarTemperatura"
        component={GerenciarTemperatura}
        options={{
          drawerLabel: "Gerenciar Temperatura",
          drawerIcon: () => (
            <Image
              source={require("../assets/icon-temp.png")}
              style={{ width: 25, height: 25, tintColor: "#fff" }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Relatorios"
        component={Relatorios}
        options={{
          drawerLabel: "Relatórios",
          drawerIcon: () => (
            <Image
              source={require("../assets/icon-relatorios.png")}
              style={{ width: 25, height: 25, tintColor: "#fff" }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Duvidas"
        component={Duvidas}
        options={{
          drawerLabel: "Dúvidas frequentes",
          drawerIcon: () => (
            <Image
              source={require("../assets/icon-duvidas.png")}
              style={{ width: 25, height: 25, tintColor: "#fff" }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="GerenciarUsuarios"
        component={GerenciarUsuarios}
        options={{
          drawerLabel: "Gerenciar Usuários",
          drawerIcon: () => (
            <Image
              source={require("../assets/icon-perfil.png")}
              style={{ width: 25, height: 25, tintColor: "#fff" }}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
