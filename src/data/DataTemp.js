// node-serial-example.js
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

// Ajuste a porta e baudRate conforme seu Arduino
const portPath = 'COM6'; 
const baudRate = 9600;

const port = new SerialPort({ path: portPath, baudRate: baudRate });

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

port.on('open', () => {
  console.log('Porta serial aberta:', portPath);
});

parser.on('data', (line) => {
  line = line.trim();
  console.log('Recebido:', line);

  // exemplo: se linha for "valor:512"
  if (line.startsWith('valor:')) {
    const val = parseInt(line.split(':')[1], 10);
    console.log('Valor numérico:', val);
  }

  // se Arduino enviar JSON: try { const obj = JSON.parse(line); ... } catch(e) {}
});

port.on('error', (err) => {
  console.error('Erro na porta serial:', err.message);
});
