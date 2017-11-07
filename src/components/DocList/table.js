import { data } from 'DocList';

console.log(data);
//
// const periods = createAndFillPeriods('4', '2017');
// const forms = createAndFillForms();
//
// createAndFillDocuments();



// Заполнение заголовка таблицы по периодам
export function createAndFillPeriods(period, year) {
  const tabEL = document.getElementById('TBL');
  if (tabEL != null) {
    const trHeader = document.createElement('tr');
    const thHeader0 = document.createElement('th');
    const textHeader0 = document.createTextNode('Документы');
    thHeader0.appendChild(textHeader0);
    trHeader.appendChild(thHeader0);
    var periodsArray = [];
    let p = parseInt(period);
    let y = parseInt(year);
    for (let i = 0; i < 10; i++) {
      const periodObject = {
        period: p,
        year: y
      };
      periodsArray[(9 - i)] = periodObject;
      const thHeader = document.createElement('th');
      let text = '';
      switch (p) {
        case 1:
          text = 'I';
          break;
        case 2:
          text = 'II';
          break;
        case 3:
          text = 'III';
          break;
        case 4:
          text = 'IV';
          break;
      }
      const textHeader = document.createTextNode(`${text} Квартал ${y}`);
      thHeader.appendChild(textHeader);
      trHeader.appendChild(thHeader);
      p -= 1;
      if (p == 0) {
        p = 4;
        y -= 1;
      }
    }
    tabEL.appendChild(trHeader);
  }
  // console.log(periodsArray)
  return periodsArray;
}


// Заполнение списка документов
export function createAndFillForms() {
  const formsList = [
    {
      formType: 'INPUT',
      formid: 'FORM01',
      fullName: 'Бухгалтерский баланс'
      // perivCode:
    },
    {
      formType: 'INPUT',
      formid: 'FORM02',
      fullName: 'Отчет о финансовых результатах'
      // perivCode:
    }
  ];

  const formsArray = [];
  const tabEL = document.getElementById('TBL');
  if (tabEL != null) {
    formsList.forEach((item) => {
      const type = item.formType;
      if (type != null && type == 'INPUT') {
        const formObject = {
          formid: item.formid,
          fullName: item.fullName
          // periv: "<c:out value="${listItem.perivCode}" />"
        };
        formsArray.push(formObject);
        const trrow = document.createElement('tr');
        trrow.setAttribute('id', formObject.formid);
        const tdHeader0 = document.createElement('td');
        const textHeader0 = document.createTextNode(formObject.fullName);
        tdHeader0.appendChild(textHeader0);
        trrow.appendChild(tdHeader0);
        tabEL.appendChild(trrow);
      }
    });
  }
  return formsArray;
}


// Заполнение списка документов
export function createAndFillDocuments() {
  const mapOfDocs = createMapOfDocs();
  // console.log(mapOfDocs);
  // console.log(mapOfDocs);
  for (let i = 0; i < forms.length; i++) {
    const row = document.getElementById(forms[i].formid);
    // console.log(forms);
    if (row != null) {
      for (let y = periods.length - 1; y >= 0; y--) {
        const cell = document.createElement('td');
        const cellId = `${forms[i].formid}_${y}`;
        console.log(cellId);
        cell.setAttribute('id', cellId);
        row.appendChild(cell);
        const key = `${forms[i].formid}_${periods[y].period}_${periods[y].year}`;
        let isExist = false;
        for (let docIndex = 0; docIndex < mapOfDocs.length; docIndex++) {
          if (mapOfDocs[docIndex].key == key) {
            // console.log(mapOfDocs[docIndex].key);
            fillcell(cellId, mapOfDocs[docIndex].doc);
            isExist = true;
            break;
          }
        }
        if (!isExist) {
          cell.onclick = function () {
            // console.log(this.id);
            showPopUp(null, this.id);
          };
        }
      }
    }
  }
}


// создаём список объектов у которых key это ключ из формы , периода и года , а значения объент docheader
function createMapOfDocs() {
  docHeadersList = [
    {
      id: 1,
      status: 0,
      version: '1',
      period: '2',
      year: '2017',
      client: 'Клиент 1',
      type: 'FORM01',
      creation_date: +new Date(),
      modify_date: Date.now()
    },
    {
      id: 3,
      status: 0,
      version: '1',
      period: '3',
      year: '2016',
      client: 'Клиент 6',
      type: 'FORM01',
      creation_date: +new Date(),
      modify_date: Date.now()
    },
    {
      id: 2,
      status: 7,
      version: '1',
      period: '3',
      year: '2017',
      client: 'Клиент 2',
      type: 'FORM02',
      creation_date: +new Date(),
      modify_date: Date.now()
    }
  ];
  const mapOfDocs = [];
  let doclist;
  // TODO
  docHeadersList.forEach((item) => {
    const date = item.creation_date;

    doclist = {
      id: item.id,
      status: item.status,
      version: item.version,
      period: item.period,
      year: item.year,
      client: item.client,
      type: item.type,
      creation_date: date,
      modify_date: item.modify_date
    };

    const key = `${doclist.type}_${doclist.period}_${doclist.year}`;
    const docObject = {
      key,
      doc: doclist
    };
    mapOfDocs.push(docObject);
  });


  return mapOfDocs;
}

// Заполнение ячейки
function fillcell(cellId, docObject) {
  const el = document.getElementById(cellId);
  // console.log(cellId);
  if (el != null) {
    const newTableElem = document.createElement('table');
    newTableElem.setAttribute('CELLPADDING', '0', 'CELLSPACING', '0');
    newTableElem.style.height = '99%';
    newTableElem.onclick = function () {
      showPopUp(docObject, cellId);
    };
    // tr
    const tr1 = document.createElement('tr');
    // td
    const td1 = document.createElement('td');
    td1.setAttribute('ROWSPAN', '2');
    td1.style.minWidth = '10px';
    td1.style.maxWidth = '10px';
    if (docObject.status != null && docObject.status == 0) {
      td1.style.background = 'red';
    } else if (docObject.status != null && docObject.status == 7) {
      td1.style.background = 'green';
    } else {
      td1.style.background = 'white';
    }
    const text1 = document.createTextNode('');
    td1.appendChild(text1);
    tr1.appendChild(td1);
    // td2
    const td2 = document.createElement('td');
    td2.setAttribute('COLSPAN', '2');
    td2.style.paddingLeft = '5px';
    const text2 = document.createTextNode(docObject.modify_date == null ? ' ' : docObject.modify_date);
    td2.appendChild(text2);
    tr1.appendChild(td2);
    newTableElem.appendChild(tr1);
    // tr
    const tr2 = document.createElement('tr');
    // td
    const td21 = document.createElement('td');
    td21.style.paddingLeft = '5px;';
    const text21 = document.createTextNode(docObject.version != null ? (`Версия:${docObject.version}`) : ' ');
    td21.appendChild(text21);
    tr2.appendChild(td21);
    const td22 = document.createElement('td');
    const text22 = document.createTextNode(' ');
    td22.appendChild(text22);
    tr2.appendChild(td22);
    newTableElem.appendChild(tr2);
    el.appendChild(newTableElem);
  }
}


// окно открытия документа
function showPopUp(docObject, cellID) {
  // Находим окно
  let formid = '';
  let period = 0;
  let year = 0;
  const elPopUp = document.getElementById('popup');
  if (elPopUp !== null) {
    elPopUp.style.display = 'block';
    // Находим строку с сообщением и вопросом
    const elPopUpLabel = document.getElementById('popupLabel');
    if (elPopUpLabel !== null) {
      // находим кнопки
      // кнопка редактирования
      const elEditBtn = document.getElementById('editBtn');
      // кнопка просмотра
      const elViewBtn = document.getElementById('viewBtn');
      if (cellID !== null) {
        const t = cellID.split('_');
        if (t !== null && t.length > 1) {
          formid = t[0];
          const idx = t[1];
          const per = periods[idx];
          if (per !== null) {
            period = per.period;
            year = per.year;
          }
        }
      }
      // в зависимости от статуса устанавливаем соответствующее сообщение и показываем кнопки
      if (docObject !== null && docObject.status === 0) {
        elPopUpLabel.innerHTML = 'Документ \'Отчёт о финансовых результатах\' уже существует,  открыть документ на редактирование или открыть документ на просмотр?</label>';
        if (elEditBtn !== null) {
          elEditBtn.setAttribute('value', 'Редактирование');
          elEditBtn.style.display = 'inline';
        }
        if (elViewBtn !== null) {
          elViewBtn.style.display = 'inline';
        }
      } else if (docObject !== null && docObject.status === 7) {
        elPopUpLabel.innerHTML = 'Документ \'Отчёт о финансовых результатах\' уже существует в статусе утверждён, создать новую версию документа или открыть документ на просмотр?</label>';
        if (elEditBtn !== null) {
          elEditBtn.setAttribute('value', 'Создать');
          elEditBtn.style.display = 'inline';
        }
        if (elViewBtn !== null) {
          elViewBtn.style.display = 'inline';
        }
      } else {
        elPopUpLabel.innerHTML = 'Документ \'Отчёт о финансовых результатах\' отсутствует в выбранном периоде, создать новый документ ?</label>';
        if (elEditBtn !== null) {
          elEditBtn.setAttribute('value', 'Создать');
          elEditBtn.style.display = 'inline';
        }
        if (elViewBtn !== null) {
          elViewBtn.style.display = 'none';
        }
      }
      // передаём параметры
      const idField = document.getElementById('docId');
      const formidField = document.getElementById('docFormId');
      const dividField = document.getElementById('docDivId');
      const statusField = document.getElementById('docStatus');
      const versField = document.getElementById('docVersion');
      const yearField = document.getElementById('docYear');
      const periodField = document.getElementById('docPeriod');
      if (idField != null && docObject != null) {
        idField.setAttribute('value', docObject.id);
      }
      if (formidField != null) {
        formidField.setAttribute('value', formid);
      }
      if (statusField != null && docObject != null) {
        statusField.setAttribute('value', docObject.status);
      }
      if (versField != null && docObject != null) {
        versField.setAttribute('value', docObject.version);
      }
      if (dividField != null && docObject != null) {
        dividField.setAttribute('value', docObject.client);
      }
      if (yearField != null) {
        yearField.setAttribute('value', year);
      }
      if (periodField != null) {
        periodField.setAttribute('value', period);
      }
    }
  }
}

function closePopUp() {
  document.getElementById('popup').style.display = 'none';
}

document.querySelector('#cancelBtn').onclick = closePopUp;

function setAction(formName, act) {
  // находим форму
  const elForm = document.getElementById(formName);
  if (elForm != null) {
    elForm.setAttribute('action', act);
  }
}