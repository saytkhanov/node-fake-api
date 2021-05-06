const http = require("http");
const fs = require("fs");
const path = require("path");
const { getIndexById, getNextId, parseQuery } = require("./functions");

const fileName = path.resolve(__dirname, "database.json");

const server = http.createServer((req, res) => {
  //создаем сервер
  res.writeHead(200); //код сайта, 200 означает что все хорошо

  fs.readFile(fileName, "utf-8", (err, data) => {
    //читаем файл
    data = JSON.parse(data); //данные из файла парсим в объект
    if (err) {
      //если ошибка
      console.log(err); //вызываем в консоль ошибку
    } else {
      //иначе
      if (req.method === "GET") {
        //если метод GET
        const parse = parseQuery(req.url); //Создаем переменную, чтобы легче было использовать
        if (parse.id === null) {
          // если id из значения равен null
          console.log(data[parse.resourse]); //выводим в консоль
          res.write(JSON.stringify(data[parse.resourse]));
          res.end(); //останавливаем выполнение функции
        } else {
          const index = getIndexById(data[parse.resourse], parse.id); //создаем переменную для запуска функции, чтобы добавить id
          console.log(index);
          res.write(JSON.stringify(data[parse.resourse][index])); //выводим преобразованную в строку базу данных
          res.end(); //останавливаем выполнение функции
        }
      }
      if (req.method === "DELETE") {
        //если метод DELETE
        const parse = parseQuery(req.url); //опять добавляем переменную
        const index = getIndexById(data[parse.resourse], parse.id);
        data[parse.resourse].splice(index, 1); //берем данные и используем метод splice для удаления
        fs.writeFile(fileName, JSON.stringify(data), (err, data) => {
          //перезаписываем файл
          res.end("Удаление прошло успешно"); // в случае успеха выводим текст
        });
      }
      //если метод POST
      if (req.method === "POST") {
        //опять же повторяем использование переменных, и также создаем новую переменную для функции который добавляет id в соответствии с наибольшим id  базе данных
        const parse = parseQuery(req.url);
        const i = getNextId(data[parse.resourse], parse.id);
        res.writeHead(200, {
          "Content-type": "application/json",
        });
        req.on("data", (chunk) => {
          // обработчик событий, читающее содержимое запроса
          chunk = JSON.parse(chunk); //данные парсим
          chunk.toString(); //данные преобразовываем в строку
          chunk.id = i; //присвываем параметр, чтобы добавлял новый индекс
          data[parse.resourse].push(chunk); //в базу данных пушим в конец преобразованные данные
          fs.writeFile(fileName, JSON.stringify(data, null, " "), (err) => {
            if (err) {
              res.writeHead(404);
              res.write("ошибка запроса");
            } else {
              res.writeHead(200);
              res.write("Добавлено");
            }
            res.end(); // перезаписываем в строку данные и в случае успеха выводим Добавлено
          });
        });
      } // если метод PATCH
      if (req.method === "PATCH") {
        const parse = parseQuery(req.url); // опять же используем переменные
        const index = getIndexById(data[parse.resourse], parse.id);
        req.on("data", (update) => {
          //запускаем обработчик событий, которое читает содержимое файлы в качестве параметра используем update
          update = JSON.parse(update); // данные парсим
          data[parse.resourse][index] = Object.assign(
            data[parse.resourse][index],
            update
          ); //объединение старого и нового значения, для этого используем Object.assign по подсказке Aхмеда
          fs.writeFile(fileName, JSON.stringify(data, null, " "), (err) => {
            if (err) {
              res.writeHead(404);
              res.write("Ошибка запроса");
            } else {
              res.writeHead(200);
              res.write("Успешно");
            }
            res.end();
          }); // перезаписываем файл переводя в строку, так добавляем значение, чтобы все это дело вырлвнял в файле
        });
      }
    }
  });
});
server.listen(3000);
