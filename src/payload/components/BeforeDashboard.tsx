import type { Payload } from 'payload'
import Link from 'next/link'
import React from 'react'

const STATUS_LABELS: Record<string, string> = {
  new: 'Новая',
  inProgress: 'В работе',
  closed: 'Закрыта',
}

const TYPE_LABELS: Record<string, string> = {
  callback: 'Обратный звонок',
  calculator: 'Калькулятор',
  project3d: '3D-проект',
  contact: 'Контактная форма',
}

export async function BeforeDashboard({ payload }: { payload: Payload }) {
  const [newCount, inProgressCount, recent] = await Promise.all([
    payload.count({ collection: 'leads', where: { status: { equals: 'new' } } }),
    payload.count({ collection: 'leads', where: { status: { equals: 'inProgress' } } }),
    payload.find({ collection: 'leads', sort: '-createdAt', limit: 5, depth: 0 }),
  ])

  return (
    <div className="dashboard-leads">
      <div className="dashboard-leads__stats">
        <Link className="dashboard-leads__stat" href="/admin/collections/leads?where[status][equals]=new">
          <span className="dashboard-leads__number">{newCount.totalDocs}</span>
          <span>новых заявок</span>
        </Link>
        <Link
          className="dashboard-leads__stat"
          href="/admin/collections/leads?where[status][equals]=inProgress"
        >
          <span className="dashboard-leads__number">{inProgressCount.totalDocs}</span>
          <span>в работе</span>
        </Link>
      </div>

      {recent.docs.length > 0 && (
        <div className="dashboard-leads__recent">
          <h3>Последние заявки</h3>
          <table>
            <thead>
              <tr>
                <th>Имя</th>
                <th>Телефон</th>
                <th>Тип</th>
                <th>Статус</th>
                <th>Дата</th>
              </tr>
            </thead>
            <tbody>
              {recent.docs.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <Link href={`/admin/collections/leads/${lead.id}`}>{lead.name}</Link>
                  </td>
                  <td>{lead.phone}</td>
                  <td>{TYPE_LABELS[lead.type] ?? lead.type}</td>
                  <td>
                    <span className={`dashboard-leads__status dashboard-leads__status--${lead.status}`}>
                      {STATUS_LABELS[lead.status] ?? lead.status}
                    </span>
                  </td>
                  <td>{new Date(lead.createdAt).toLocaleString('ru-RU')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
