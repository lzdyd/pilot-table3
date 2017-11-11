/**
 * Created by lzdyd
 */

const saveDocumentDataAPI = (data, doctype) => {
  const updatedDoctype = JSON.parse(JSON.stringify(doctype));

  const updatedAttributes = Object.keys(data).map((item) => {
    return [item, data[item].value];
  });

  updatedDoctype.attributes = updatedAttributes;

  delete updatedDoctype.edit;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open('POST', 'http://192.168.235.188:9081/prototype/saveDocument');

    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.responseText);
      } else {
        reject(Error(xhr.responseText));
      }
    };

    xhr.send(JSON.stringify(updatedDoctype));
  });

  // Promise for testing modalbox
  /*
  return new Promise((resolve, reject) => {
    if (true) {
      resolve('{"message":"Документ успешно сохранён","status":"OK"}')
    }

    reject({"message":"Ошибка сохранения документа:null","status":"ERROR"})
  });
  */
};

export default function (data, doctype) {
  return saveDocumentDataAPI(data, doctype);
}
