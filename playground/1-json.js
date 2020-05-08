const fs = require('fs');

const dataBuffer = fs.readFileSync('1-json.json');

const dataJSON = dataBuffer.toString();

const JSdata = JSON.parse(dataJSON);

JSdata.name = 'tanish';

JSdata.age = 30;

const userJSON = JSON.stringify(JSdata);

fs.writeFileSync('1-json.json', userJSON);  

console.log(dataBuffer);


































