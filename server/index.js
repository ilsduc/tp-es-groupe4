const http = require('http');
const fs = require('fs');
const csvParser = require('csv-parser')
//
const dataPath = './datas/data.csv';

let results = [];

const ES_PATH = 'localhost';
const ES_PORT = 9200;

fs.createReadStream(dataPath)
  .pipe(csvParser({
      separator: ';',
      headers: [
        'title',
        'seo_title',
        'url',
        'author',
        'date',
        'category',
        'locales',
        'content',
      ],
  }))
  .on('data', (data) => results.push(data))
  .on('end', () => {
    // Ecriture des datas dans un fichier json
    fs.writeFile('./data.json', results.map(json => JSON.stringify(json)).join("\n") + "\n", 'utf8', () => null);

    // Ecriture des datas dans ES
    results.map(document => {
      const request = http.request({
        hostname: ES_PATH,
        port: ES_PORT,
        path: '/groupe_4/_doc',
        method: 'POST',
        headers: {
          'Content-type': 'application/ndjson',
        }
      }, (response) => {
        response.on('data', d => console.log(d));
      });
      // 
      request.write(JSON.stringify(document));
      request.end();

    });
  });

