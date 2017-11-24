
/**
 * Created by lzdyd
 */

const saveDocumentDataAPI = (data, doctype) => {
  const updatedDoctype = JSON.parse(JSON.stringify(doctype));

  const updatedAttributes = Object.keys(data).map((item) => {
    return {
      fieldName: item,
      dbvalue: data[item].value
    };
  });

  updatedDoctype.data = updatedAttributes;

  if (doctype.hasOwnProperty('id')) {
    if(doctype.status !== 0) {
      delete updatedDoctype.id;
      updatedDoctype.version += 1;
      updatedDoctype.status = 0;
    }
  }

  delete updatedDoctype.edit;


  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open('POST', 'http://192.168.235.188:9081/prototype/saveDocument');
    xhr.withCredentials = true;

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
};

export default function (data, doctype) {
  return saveDocumentDataAPI(data, doctype);
}
