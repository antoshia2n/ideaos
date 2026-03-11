import { useState } from 'react'
import { C } from '../constants'
import Tag from './Tag'
export default function IdeaCard({ idea, onDelete }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ background: C.surface, borderRadius: 10, border: `1.5px solid ${C.border}`, overflow: 'hidden' }}>
      <div onClick={() => setOpen(o => !o)} style={{ padding: '13px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', cursor: 'pointer', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 600, lineHeight: 1.4 }}>{idea.title}</p>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 6 }}>
            {(idea.tags || []).map((t, i) => <Tag key={i} label={t} />)}
          </div>
        </div>
        <span style={{ fontSize: 12, color: C.muted, flexShrink: 0, paddingTop: 2 }}>{open ? '▲' : '▼'}</span>
      </div>
      {open && (
        <div style={{ borderTop: `1px solid ${C.border}`, padding: '12px 14px', background: C.surface2 }}>
          {idea.memo ? <pre style={{ margin: 0, fontSize: 13, color: C.sub, lineHeight: 1.8, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{idea.memo}</pre> : <p style={{ margin: 0, fontSize: 13, color: C.faint }}>メモなし</p>}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
            <span style={{ fontSize: 11, color: C.faint }}>{idea.at}</span>
            {onDelete && <button onClick={onDelete} style={{ fontSize: 12, color: C.err, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', fontFamily: 'inherit' }}>削除</button>}
          </div>
        </div>
      )}
    </div>
  )
}
