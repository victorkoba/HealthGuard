import AWS from 'aws-sdk';

const TABLE_NAME = "LeiturasDHT";

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: 'ASIAZI2LGGRE27QL33FM',
  secretAccessKey: 'gR+GdiRYZB2nW/acuv0XFNpI7Jxfmb8n+F9WmULh',
  sessionToken: 'IQoJb3JpZ2luX2VjEIP//////////wEaCXVzLXdlc3QtMiJIMEYCIQDpRexnFbM+9KiVor81PHOOcOSRGLxylow3j4qQuhSTDwIhALge1OBUTw+AZz+TZIgCBycQ0fXqlQAP+mut+6GAqh+9KrACCEsQABoMNjM3NDIzNDY1NTQ1IgyQ4R5+Kestq5R64F8qjQJyW9zOKs4tsRe5ATsVN1Oolh/xrZ6YLOdF+xqoo6JtqPthbJnScAimVoFbFTvtW4Cptf/kEp/YLmSzNSulKsMkEHIzLywWdmAdwPzL5uz18rJj00vE9poMIMqtel+klF3EgF4vT0mpL8Jkoi5eVPDAFXDqzE7otDQPv4xAdHHjzPTFuhMvluFfJQSPte0EzMJnRxiOhXZYEKrQDPMDs5VY4vUkMOQmjrCB6bl+ZYRTHe7F3SvNn95ztBB1v1bVlga/znwLD1RIpxwYStJlZowSKxAvIf5S4k8XRgenchR3YMSNOetEkFU8JEloasLOguIdDryfj+Ug5msy4ywNCYQ1WIAmptTYvsbmHxd3njDzgI/JBjqcAV0hbwwOc420xm7diTgg2LlGchX2bCq6OVM6ZpWEQr/IcowbDbUjfwRbXbEwuM4XVM8E5SGFnBLlMK2a29Lgc6lXxlUNznzrMbCnK3LawQyy0WH/dv5XnKyxsUAOoQlNJAK18rvklUUiVms8S8EqSHWMrnetc1hu75EDe7hreD5sQVrFdA1oVrIoviHAAy3XqAVLmJQTZkWp0x/crQ=='
   });

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export async function getUltimaLeitura() {
  try {
    const params = {
      TableName: TABLE_NAME
    };

    const data = await dynamoDB.scan(params).promise();

    if (!data.Items || data.Items.length === 0) {
      return null;
    }

    // Ordenar pelo timestamp mais recente
    const arredondado = data.Items.map(item => ({
  ...item,
  temperatura: Math.round(Number(item.temperatura))
}));

const ultimo = arredondado.sort((a, b) =>
  new Date(b.timestamp) - new Date(a.timestamp)
)[0];

    return ultimo;

  } catch (error) {
    console.error("Erro DynamoDB:", error);
    return null;
  }
}

export async function getMinMaxTemperatura() {
  try {
    const params = {
      TableName: "LeiturasDHT"
    };

    const data = await dynamoDB.scan(params).promise();

    if (!data.Items || data.Items.length === 0) {
      return null;
    }

    let min = Math.round(Number(data.Items[0].temperatura));
    let max = Math.round(Number(data.Items[0].temperatura));

    data.Items.forEach(item => {
      const temp = Math.round(Number(item.temperatura));

      if (temp < min) min = temp;
      if (temp > max) max = temp;
    });

    return { min, max };

  } catch (error) {
    console.error("Erro DynamoDB:", error);
    return null;
  }
}

export async function getTemperaturasUltimas24h() {
  try {
    const params = {
      TableName: "LeiturasDHT"
    };

    const data = await dynamoDB.scan(params).promise();

    console.log("SCAN RAW 24H:", data.Items);

    if (!data.Items || data.Items.length === 0) {
      return { labels: [], valores: [] };
    }

    // ordenar por timestamp
    const ordenado = data.Items.sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );

    const labels = ordenado.map(item => {
      const date = new Date(item.timestamp);
      return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
    });

    const valores = ordenado.map(item =>
      Number(item.temperatura)
    );

    console.log("LABELS MONTADOS:", labels);
    console.log("VALORES MONTADOS:", valores);

    return { labels, valores };

  } catch (error) {
    console.error("ERRO 24H:", error);
    return { labels: [], valores: [] };
  }
}
export async function getMinMaxSemana() {
  try {
    const params = {
      TableName: "LeiturasDHT"
    };

    const data = await dynamoDB.scan(params).promise();

    console.log("SCAN RAW SEMANA:", data.Items);

    if (!data.Items || data.Items.length === 0) {
      return { labels: [], min: [], max: [] };
    }

    const dias = {};

    data.Items.forEach(item => {
      const date = new Date(item.timestamp);
      const dia = date.toLocaleDateString("pt-BR");

      const temp = Number(item.temperatura);

      if (!dias[dia]) {
        dias[dia] = { min: temp, max: temp };
      } else {
        if (temp < dias[dia].min) dias[dia].min = temp;
        if (temp > dias[dia].max) dias[dia].max = temp;
      }
    });

    const labels = Object.keys(dias);
    const min = labels.map(d => dias[d].min);
    const max = labels.map(d => dias[d].max);

    console.log("LABELS SEMANA:", labels);
    console.log("MIN SEMANA:", min);
    console.log("MAX SEMANA:", max);

    return { labels, min, max };

  } catch (error) {
    console.error("ERRO SEMANA:", error);
    return { labels: [], min: [], max: [] };
  }
}
