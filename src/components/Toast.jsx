import { C } from '../constants'
export default function Toast({ t }) {
  if (!t) return null
  const isErr = t.type === 'err'
  return (
    <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: isErr ? C.errBg : C.okBg, border: `1px solid ${isErr ? '#e8b4ae' : '#b0d8bf'}`, borderRadius: 8, padding: '10px 18px', fontSize: 13, fontWeight: 500, color: isErr ? C.err : C.ok, boxShadow: '0 4px 16px rgba(0,0,0,.08)', zIndex: 999, whiteSpace: 'nowrap' }}>
      {t.msg}
    </div>
  )
}
