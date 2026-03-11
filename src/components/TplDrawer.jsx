import { C } from '../constants'
export default function TplDrawer({ templates, onSelect, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.3)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.surface, borderRadius: '16px 16px 0 0', padding: '20px 16px 36px', width: '100%', maxWidth: 540, boxShadow: '0 -8px 40px rgba(0,0,0,.12)', maxHeight: '70vh', overflowY: 'auto' }}>
        <div style={{ width: 36, height: 4, background: C.borderStrong, borderRadius: 2, margin: '0 auto 18px' }} />
        <p style={{ margin: '0 0 12px', fontWeight: 700, fontSize: 15 }}>テンプレートを選ぶ</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {templates.map(t => (
            <button key={t.id} onClick={() => { onSelect(t.body); onClose() }} style={{ textAlign: 'left', background: C.surface2, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: '11px 13px', cursor: 'pointer', fontSize: 14, color: C.text, fontWeight: 500, fontFamily: 'inherit' }}>{t.label}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
