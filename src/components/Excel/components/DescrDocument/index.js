import React from 'react';

import './style.scss';

export default function DescrDocument(descrDoc) {
  // Повторяется, сделать отдельную функцию
  const statusLabel = ['Архив', 'Редактируется', 'Утверджен'];
  let status;

  switch (descrDoc.descrDoc.status) {
    case 0:
      status = statusLabel[1];
      break;

    case 3:
      status = statusLabel[0];
      break;

    default:
      status = statusLabel[2];
      break;
  }

  const {
    client,
    year,
    period,
    version,
    type,
    edit
  } = descrDoc.descrDoc;

  const mode = edit ? 'Редактируется' : 'Просмотр';

  return (
    <div className="descr-doc">
      <div className="descr-doc__item">{`Клиент: ${client}`}</div>
      <div className="descr-doc__item">{`Год: ${year}`}</div>
      <div className="descr-doc__item">{`Период: ${period} квартал`}</div>
      <div className="descr-doc__item">{`Версия: ${version}`}</div>
      <div className="descr-doc__item">{`Статус: ${status}`}</div>
      <div className="descr-doc__item">{`Режим: ${mode}`}</div>
      <div className="descr-doc__item">{`Форма: ${type}`}</div>
    </div>
  );
}


