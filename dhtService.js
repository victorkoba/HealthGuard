import { QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDB } from "./awsConfig";

function getTableName(freezerId) {
  return `freezer${freezerId}`;
}

// -------- BUSCAR ÚLTIMA LEITURA --------
export async function getUltimaLeitura(freezerId) {
  try {
    const table = getTableName(freezerId);

    const resp = await dynamoDB.send(
      new ScanCommand({
        TableName: table,
      })
    );

    if (!resp.Items || resp.Items.length === 0) return null;

    const ordenado = resp.Items.sort((a, b) => b.timestamp - a.timestamp);

    return ordenado[0];

  } catch (error) {
    console.log("ERRO getUltimaLeitura:", error);
    return null;
  }
}

// -------- BUSCAR MIN/MAX 24H --------
export async function getMinMaxTemperatura(freezerId) {
  try {
    const table = getTableName(freezerId);
    const agora = Date.now();
    const limite = agora - 24 * 60 * 60 * 1000;

    const resp = await dynamoDB.send(
      new ScanCommand({
        TableName: table,
      })
    );

    const filtrado = resp.Items?.filter(
      (i) => i.timestamp >= limite && i.timestamp <= agora
    ) || [];

    if (filtrado.length === 0) return { min: 0, max: 0 };

    const temps = filtrado.map((i) => Number(i.temperatura));

    return {
      min: Math.min(...temps),
      max: Math.max(...temps),
    };

  } catch (error) {
    console.log("ERRO getMinMaxTemperatura:", error);
    return { min: 0, max: 0 };
  }
}

// -------- GRÁFICO 24H --------
export async function getTemperaturas24h(freezerId) {
  try {
    const table = getTableName(freezerId);
    const agora = Date.now();
    const limite = agora - 24 * 60 * 60 * 1000;

    const resp = await dynamoDB.send(
      new ScanCommand({
        TableName: table,
      })
    );

    const filtrado = resp.Items
      ?.filter((i) => i.timestamp >= limite && i.timestamp <= agora)
      ?.sort((a, b) => a.timestamp - b.timestamp) || [];

    return {
      labels: filtrado.map((i) =>
        new Date(i.timestamp).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      ),
      data: filtrado.map((i) => Number(i.temperatura)),
    };

  } catch (error) {
    console.log("ERRO getTemperaturas24h:", error);
    return { labels: [], data: [] };
  }
}

// -------- GRÁFICO SEMANAL --------
export async function getTemperaturaSemana(freezerId) {
  try {
    const table = getTableName(freezerId);
    const agora = Date.now();
    const inicioSemana = agora - 7 * 24 * 60 * 60 * 1000;

    const resp = await dynamoDB.send(
      new ScanCommand({
        TableName: table,
      })
    );

    const filtrado = resp.Items?.filter(
      (i) => i.timestamp >= inicioSemana && i.timestamp <= agora
    ) || [];

    const dias = {};

    filtrado.forEach((i) => {
      const dia = new Date(i.timestamp).toLocaleDateString("pt-BR", {
        weekday: "short",
      });

      if (!dias[dia]) dias[dia] = [];

      dias[dia].push(Number(i.temperatura));
    });

    const labels = Object.keys(dias);
    const maxData = labels.map((d) => Math.max(...dias[d]));
    const minData = labels.map((d) => Math.min(...dias[d]));

    return { labels, maxData, minData };

  } catch (error) {
    console.log("ERRO getTemperaturaSemana:", error);
    return { labels: [], maxData: [], minData: [] };
  }
}
