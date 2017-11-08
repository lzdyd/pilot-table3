const saveDocumentDataAPI = (data, doctype) => {
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

  // xhr.setRequestHeader('Accept', 'application/json');
  xhr.setRequestHeader('Content-Type', 'application/json');

  // xhr.withCredentials = true;

  xhr.send(JSON.stringify(updatedDoctype));
};

export default function (data, doctype) {
  saveDocumentDataAPI(data, doctype);
}
