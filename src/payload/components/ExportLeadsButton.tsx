import React from 'react'

export function ExportLeadsButton() {
  return (
    <div className="export-leads">
      <a className="export-leads__button" href="/api/leads/export" download="leads.csv">
        Экспорт в CSV
      </a>
    </div>
  )
}
