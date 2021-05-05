const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {//создаем сервер
  res.writeHead(200);//код сайта, 200 означает что все хорошо

  fs.readFile(path.resolve(__dirname, 'database.json'), 'utf-8', (err, data) => {//читаем файл
    data = JSON.parse(data)//данные из файла парсим в объект
    if(err) {//если ошибка
      console.log(err)//вызываем в консоль ошибку
    } else {//иначе
      if (req.method === 'GET') {//если метод GET
        const parse = parseQuery(req.url);//Создаем переменную, чтобы легче было использовать
        if (parse.id === null) {// если id из значения равен null
          console.log(data[parse.resourse])//выводим в консоль
          res.write(JSON.stringify(data[parse.resourse]))
          res.end()//останавливаем выполнение функции
        } else {
          const index = getIndexById(data[parse.resourse], parse.id)//создаем переменную для запуска функции, чтобы добавить id
          console.log(index)
          res.write(JSON.stringify(data[parse.resourse][index]))//выводим преобразованную в строку базу данных
          res.end()//останавливаем выполнение функции
        }
      }
      if (req.method === 'DELETE') {//если метод DELETE
        const parse = parseQuery(req.url);//опять добавляем переменную
        const index = getIndexById(data[parse.resourse], parse.id)
        data[parse.resourse].splice(index, 1);//берем данные и используем метод splice для удаления
        fs.writeFile(path.resolve(__dirname, 'database.json'), JSON.stringify(data), (err, data) => {//перезаписываем файл
          res.end('Удаление прошло успешно')// в случае успеха выводим текст
        })
      }
      //если метод POST
      if(req.method === 'POST') {
        //опять же повторяем использование переменных, и также создаем новую переменную для функции который добавляет id в соответствии с наибольшим id  базе данных
        const parse = parseQuery(req.url);
        const i = getNextId(data[parse.resourse], parse.id);
        res.writeHead(200, {
          "Content-type":  "application/json"
        })
        req.on('data', chunk => {// обработчик событий, читающее содержимое запроса
          chunk = JSON.parse(chunk);//данные парсим
          chunk.toString();//данные преобразовываем в строку
          chunk.id = i;//присвываем параметр, чтобы добавлял новый индекс
          data[parse.resourse].push(chunk);//в базу данных пушим в конец преобразованные данные
          fs.writeFile(path.resolve(__dirname, 'database.json'), JSON.stringify(data, null, ' '), () => {
            res.end('Добавлено');// перезаписываем в строку данные и в случае успеха выводим Добавлено
          })
        })
      }// если метод PATCH
      if(req.method === 'PATCH') {
        const parse = parseQuery(req.url);// опять же используем переменные
        const index = getIndexById(data[parse.resourse], parse.id);
        req.on('data', update => {//запускаем обработчик событий, которое читает содержимое файлы в качестве параметра используем update
        update = JSON.parse(update);// данные парсим
        data[parse.resourse][index] = Object.assign(data[parse.resourse][index], update)//объединение старого и нового значения, для этого используем Object.assign по подсказке Aхмеда
        fs.writeFile(path.resolve(__dirname, 'database.json'), JSON.stringify(data, null, ' '), () => {})// перезаписываем файл переводя в строку, так добавляем значение, чтобы все это дело вырлвнял в файле
        })
      }
    }
  })
})
server.listen(3000)

const getIndexById = (collection, id) => {//создаем функцию, которая присваивает 2 параметра
for(let i = 0; i < collection.length; i++){//запускаем цикл
  if(collection[i].id === id) {//если ключ id объекта collection
    return i// возвращаем ключ
  }
}
return -1// иначе -1
}

const getNextId = (collection) => {// cоздаем фукнцию, которая будет увеличивать индекс, смотря на самое большое значение
  let bigValue = 0// создаем переменную с нулевым значение
  for (let i = 0; i < collection.length; i++) {//запускаем цикл
    if (collection[i].id > bigValue)//если id больше переменной
      bigValue = collection[i].id//в нашу переменную прибавляем id
  }
  if (collection.length < 0) {//если длина меньше 0
    return 1// то возравращаем 1
  }
  return bigValue + 1// в общем возвращаем bigValue и прибавляем 1
}


const parseQuery = string => {//пишем функцию,которая будет определять что возвращается при определенных запросах
  let splits = string.split('/');// созадем переменную где разбиваем на массив, разделяя их cлэшом
  let word = splits[1];// создаем переменную, которая берет 1 значение
  let num = splits[2];// создаем переменную, которая берет 2 значение
  if(num <= 0 || num === undefined) {//если num меньше или равно нулю или равно undefined
    return { resourse:word, id:null}// возвращаем значение с id null
  } else {
    // иначе num переводим в число и добавляем
    return { resourse:word, id:Number(num)}
  }
}