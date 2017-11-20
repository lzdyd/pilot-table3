const saveDocumentDataAPIold = (data, doctype) => {
  const updatedDoctype = JSON.parse(JSON.stringify(doctype));

  const updatedAttributes = Object.keys(data).map((item) => {
    return [item, data[item].value];
  });

  updatedDoctype.attributes = updatedAttributes;

  delete updatedDoctype.edit;

  console.log(updatedDoctype);
  debugger;

  const xhr = new XMLHttpRequest();

  xhr.open('POST', 'http://192.168.235.188:9081/prototype/saveDocument');
  xhr.withCredentials = true;

  // xhr.setRequestHeader('Accept', 'application/json');
  xhr.setRequestHeader('Content-Type', 'application/json');

  // xhr.withCredentials = true;

  xhr.send(JSON.stringify(updatedDoctype));
};

const saveDocumentDataAPI = (data, doctype) => {
  const updatedDoctype = JSON.parse(JSON.stringify(doctype));

  const updatedAttributes = Object.keys(data).map((item) => {
    return [item, data[item].value];
  });

  updatedDoctype.attributes = updatedAttributes;

  delete updatedDoctype.edit;

  const xhr = new XMLHttpRequest();

  xhr.open('POST', 'http://localhost:3000/savejson');

  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.send(JSON.stringify(updatedDoctype));

/*  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open('POST', 'http://192.168.235.188:9081/prototype/saveDocument');

    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = () => {
      resolve(xhr.responseText);
    };

    xhr.send(JSON.stringify(updatedDoctype));
  });*/

/*  return new Promise((resolve, reject) => {
    if (true) {
      // resolve({
      //   "message": "Документ успешно сохранён",
      //   "status": "OK"
      // });
    }

    reject({
      "message": "Ошибка сохранения документа:JDBC exception on Hibernate data access: SQLException for SQL [n/a]; SQL state [72000]; error code [12899]; could not execute statement; nested exception is org.hibernate.exception.GenericJDBCException: could not execute statement",
      "status": "ERROR"
    });

  });*/
};

export default function (data, doctype) {
  return saveDocumentDataAPI(data, doctype);
}
