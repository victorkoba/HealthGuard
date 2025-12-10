import { QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDB } from "./awsConfig";

function getTableName(freezerId) {
  return `freezer${freezerId}`;
}

function parseTimestampBR(timestampStr) {
  // Formato: "09/12/2025 19:28:12" (DD/MM/YYYY HH:MM:SS)
  const [datePart, timePart] = timestampStr.split(" ");
  const [day, month, year] = datePart.split("/");
  const [hours, minutes, seconds] = timePart.split(":");

  // Meses em JavaScript são 0-indexed (0 = Janeiro, 11 = Dezembro)
  return new Date(year, month - 1, day, hours, minutes, seconds);
}

// -------- BUSCAR ÚLTIMA LEITURA --------
export async function getUltimaLeitura(freezerId) {
  try {
    const table = getTableName(freezerId);
    console.log(`[getUltimaLeitura] Buscando em: ${table}`);

    const resp = await dynamoDB.send(
      new ScanCommand({
        TableName: table,
      })
    );

    console.log(
      `[getUltimaLeitura] Total de items: ${resp.Items?.length || 0}`
    );

    if (!resp.Items || resp.Items.length === 0) {
      console.log("[getUltimaLeitura] Nenhum item encontrado");
      return null;
    }

    // Ordena por timestamp convertido do formato BR
    const ordenado = resp.Items.sort((a, b) => {
      const timestampA = parseTimestampBR(a.timestamp).getTime();
      const timestampB = parseTimestampBR(b.timestamp).getTime();
      return timestampB - timestampA;
    });

    console.log("[getUltimaLeitura] Último item:", ordenado[0]);

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

    console.log(`[getMinMaxTemperatura] Buscando em: ${table}`);
    console.log(
      `[getMinMaxTemperatura] Período: ${new Date(limite)} até ${new Date(
        agora
      )}`
    );

    const resp = await dynamoDB.send(
      new ScanCommand({
        TableName: table,
      })
    );

    console.log(
      `[getMinMaxTemperatura] Total de items retornados: ${
        resp.Items?.length || 0
      }`
    );

    // CORRIGIDO: usando parseTimestampBR
    const filtrado =
      resp.Items?.filter((i) => {
        const itemTimestamp = parseTimestampBR(i.timestamp).getTime();
        return itemTimestamp >= limite && itemTimestamp <= agora;
      }) || [];

    console.log(
      `[getMinMaxTemperatura] Items nas últimas 24h: ${filtrado.length}`
    );

    if (filtrado.length === 0) {
      console.log("[getMinMaxTemperatura] Nenhum dado nas últimas 24h");
      return { min: 0, max: 0 };
    }

    const temps = filtrado.map((i) => Number(i.temperatura));

    const result = {
      min: Math.min(...temps),
      max: Math.max(...temps),
    };

    console.log("[getMinMaxTemperatura] Resultado:", result);
    return result;
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

    console.log(`[getTemperaturas24h] Buscando em: ${table}`);
    console.log(
      `[getTemperaturas24h] Timestamp agora: ${agora} (${new Date(agora)})`
    );
    console.log(
      `[getTemperaturas24h] Timestamp limite: ${limite} (${new Date(limite)})`
    );

    const resp = await dynamoDB.send(
      new ScanCommand({
        TableName: table,
      })
    );

    console.log(
      `[getTemperaturas24h] Total de items no banco: ${resp.Items?.length || 0}`
    );

    if (resp.Items && resp.Items.length > 0) {
      console.log("[getTemperaturas24h] Primeiro item exemplo:", resp.Items[0]);
      console.log(
        "[getTemperaturas24h] Tipo do timestamp:",
        typeof resp.Items[0].timestamp
      );
    }

    // CORRIGIDO: mudei 'item' para 'i' e adicionei .getTime()
    const filtrado =
      resp.Items?.filter((i) => {
        const itemTimestamp = parseTimestampBR(i.timestamp).getTime();
        const dentroLimite = itemTimestamp >= limite && itemTimestamp <= agora;

        if (!dentroLimite) {
          console.log(
            `[getTemperaturas24h] Item fora do período: ${itemTimestamp} (${new Date(
              itemTimestamp
            )})`
          );
        }

        return dentroLimite;
      })?.sort((a, b) => {
        const timestampA = parseTimestampBR(a.timestamp).getTime();
        const timestampB = parseTimestampBR(b.timestamp).getTime();
        return timestampA - timestampB;
      }) || [];

    console.log(
      `[getTemperaturas24h] Items filtrados (últimas 24h): ${filtrado.length}`
    );

    const result = {
      labels: filtrado.map((i) => {
        // Usa o timestamp do formato BR para exibir a hora
        const date = parseTimestampBR(i.timestamp);
        return date.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        });
      }),
      data: filtrado.map((i) => Number(i.temperatura)),
    };

    console.log("[getTemperaturas24h] Resultado final:", result);
    return result;
  } catch (error) {
    console.log("ERRO getTemperaturas24h:", error);
    console.log("Stack trace:", error.stack);
    return { labels: [], data: [] };
  }
}

// -------- GRÁFICO SEMANAL --------
export async function getTemperaturaSemana(freezerId) {
  try {
    const table = getTableName(freezerId);
    const agora = Date.now();
    const inicioSemana = agora - 7 * 24 * 60 * 60 * 1000;

    console.log(`[getTemperaturaSemana] Buscando em: ${table}`);
    console.log(
      `[getTemperaturaSemana] Período: ${new Date(inicioSemana)} até ${new Date(
        agora
      )}`
    );

    const resp = await dynamoDB.send(
      new ScanCommand({
        TableName: table,
      })
    );

    console.log(
      `[getTemperaturaSemana] Total de items no banco: ${
        resp.Items?.length || 0
      }`
    );

    // CORRIGIDO: mudei 'item' para 'i' e adicionei .getTime()
    const filtrado =
      resp.Items?.filter((i) => {
        const itemTimestamp = parseTimestampBR(i.timestamp).getTime();
        return itemTimestamp >= inicioSemana && itemTimestamp <= agora;
      }) || [];

    console.log(
      `[getTemperaturaSemana] Items filtrados (última semana): ${filtrado.length}`
    );

    const dias = {};
    const diasOrdenados = [
      "dom.",
      "seg.",
      "ter.",
      "qua.",
      "qui.",
      "sex.",
      "sáb.",
    ];

    filtrado.forEach((i) => {
      const date = parseTimestampBR(i.timestamp);
      const dia = date.toLocaleDateString("pt-BR", {
        weekday: "short",
      });

      if (!dias[dia]) dias[dia] = [];
      dias[dia].push(Number(i.temperatura));
    });

    console.log("[getTemperaturaSemana] Dias agrupados:", Object.keys(dias));
    console.log(
      "[getTemperaturaSemana] Quantidade por dia:",
      Object.entries(dias).map(([k, v]) => `${k}: ${v.length}`)
    );

    // Ordenar os dias da semana corretamente
    const labels = Object.keys(dias).sort((a, b) => {
      return diasOrdenados.indexOf(a) - diasOrdenados.indexOf(b);
    });

    const maxData = labels.map((d) => Math.max(...dias[d]));
    const minData = labels.map((d) => Math.min(...dias[d]));

    const result = { labels, maxData, minData };
    console.log("[getTemperaturaSemana] Resultado final:", result);

    return result;
  } catch (error) {
    console.log("ERRO getTemperaturaSemana:", error);
    console.log("Stack trace:", error.stack);
    return { labels: [], maxData: [], minData: [] };
  }
}
