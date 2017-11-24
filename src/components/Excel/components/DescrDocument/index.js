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

  const mode = descrDoc.descrDoc.edit ? 'Редактируется' : 'Просмотр';

  return (
    <div className="descr-doc">
      <div className="descr-doc__item">{`Клиент: ${descrDoc.descrDoc.client}`}</div>
      <div className="descr-doc__item">{`Год: ${descrDoc.descrDoc.year}`}</div>
      <div className="descr-doc__item">{`Период: ${descrDoc.descrDoc.period} квартал`}</div>
      <div className="descr-doc__item">{`Версия: ${descrDoc.descrDoc.version}`}</div>
      <div className="descr-doc__item">{`Статус: ${status}`}</div>
      <div className="descr-doc__item">{`Режим: ${mode}`}</div>
      <div className="descr-doc__item">{`Форма: ${descrDoc.descrDoc.type}`}</div>
    </div>
  );
}
