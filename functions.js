const getIndexById = (collection, id) => {//создаем функцию, которая присваивает 2 параметра
  for(let i = 0; i < collection.length; i++){//запускаем цикл
    if(collection[i].id === id) {//если ключ id объекта collection
      return i// возвращаем ключ
    }
  }
  return -1// иначе -1
}

const getNextId = (collection) => {// cоздаем фукнцию, которая будет увеличивать индекс, смотря на самое большое значение
  let value = 0// создаем переменную с нулевым значение
  for (let i = 0; i < collection.length; i++) {//запускаем цикл
    if (collection[i].id > value)//если id больше переменной
      value = collection[i].id//в нашу переменную прибавляем id
  }
  if (collection.length < 0) {//если длина меньше 0
    return 1// то возравращаем 1
  }
  return value + 1// в общем возвращаем bigValue и прибавляем 1
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

module.exports.getIndexById = getIndexById;
module.exports.getNextId = getNextId;
module.exports.parseQuery = parseQuery;