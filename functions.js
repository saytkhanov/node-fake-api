// const http = require ('http')
// const fs = require('fs');
// const path = require('path');
//
// const server = http.createServer((req, res) => {
//   res.writeHead(200)
//   fs.readFile(path.resolve(__dirname, 'database.json'), 'utf-8', (err, data) => {
//     let change = JSON.parse(data);
//
//     if (err) {
//       console.log('manty')
//     } else {
//       if(req.method === 'GET') {
//         const parse = parseQuery(req.url);
//
//         if(parse.id === null ) {
//           res.write(JSON.stringify(change[parse.resource]))
//           res.end()
//         }
//     }
//   }
// })
// server.listen(3000)
//
// let getIndexById = (collection, id) => {
//  if(collection[id - 1] === undefined) {
//    return - 1
//  } else {
//    return collection[id - 1]
//  }
// }
//
//
// let getNextId = collection => {
//  let max = 0;
//  for(let i = 0 ; i < collection.length; i ++) {
//    max = collection[i].id
//  } if(collection.length < 0) {
//    return 1
//   }
//  return max + 1
// }
//
// parseQuery = string => {
//  let split = string.split('/');
//  let slovo = split[1];
//  let chislo = split[2];
//
//  if(chislo <= 0 || chislo === undefined) {
//    return { resource:slovo, id:null }
//  } else {
//    return { resource:slovo, id:Number(chislo) }
//  }
// }
