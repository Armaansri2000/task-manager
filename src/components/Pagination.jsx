import React from 'react'

export default function Pagination({ page, total, pageSize, onPage }){
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const prev = () => onPage(Math.max(1, page-1))
  const next = () => onPage(Math.min(totalPages, page+1))

  if(total <= 3) return null // show only after 3 tasks total

  return (
    <div className="hstack" style={{justifyContent:'flex-end', marginTop: '.75rem', gap: '.5rem'}}>
      <span className="small">Page {page} / {totalPages}</span>
      <button className="btn" onClick={prev} disabled={page===1}>Prev</button>
      <button className="btn" onClick={next} disabled={page===totalPages}>Next</button>
    </div>
  )
}
