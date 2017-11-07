const saveDocumentDataAPI = (data, doctype) => {
  const updatedDoctype = JSON.parse(JSON.stringify(doctype));

  const updatedAttributes = Object.keys(data).map((item) => {
    return [item, data[item].value];
  });

  updatedDoctype.attributes = updatedAttributes;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open('POST', `http://localhost:8080/test/employees/${id}/edit`);

    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('content-type', 'application/json');

    xhr.withCredentials = true;

    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.responseText);
      } else {
        reject(Error(xhr.statusText));
      }
    };

    xhr.onerror = () => {
      reject(Error('Network error'));
    };

    xhr.send(JSON.stringify(updatedDoctype));
  });
};

export default function (data, doctype) {
  return saveDocumentDataAPI(data, doctype);
}
