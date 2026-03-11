import { useState, useEffect } from 'react'
import { C, baseInp } from '../constants'
export default function Settings({ sbUrl, sbKey, setSbUrl, setSbKey, showToast, onSave }) {
  const [u, setU] = useState(sbUrl)
  const [k, setK] = useState(sbKey)
  useEffect(() => { setU(sbUrl) }, [sbUrl])
  useEffect(() => { setK(sbKey) }, [sbKey])
  function save() { setSbUrl(u.trim()); setSbKey(k.trim()); onSave(u.trim(), k.trim()); showToast('設定を保存しました') }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
        <p style={{ margin: '0 0 14px', fontWeight: 700, fontSize: 15 }}>Supabase接続設定</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.sub, marginBottom: 6 }}>Project URL</label>
            <input value={u} onChange={e => setU(e.target.value)} placeholder="https://xxxx.supabase.co" style={baseInp} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.sub, marginBottom: 6 }}>anon public キー</label>
            <input value={k} onChange={e => setK(e.target.value)} placeholder="eyJhbGci..." type="password" style={baseInp} />
          </div>
          <button onClick={save} disabled={!u.trim() || !k.trim()} style={{ padding: '12px', borderRadius: 8, border: 'none', background: u.trim() && k.trim() ? C.accent : C.borderStrong, color: u.trim() && k.trim() ? '#fff' : C.muted, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>保存</button>
        </div>
      </div>
    </div>
  )
}
