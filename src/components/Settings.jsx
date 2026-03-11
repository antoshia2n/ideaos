import { useState, useEffect } from 'react'
import { C, baseInp } from '../constants'

export default function Settings({ sbUrl, sbKey, setSbUrl, setSbKey, notionToken, setNotionToken, notionDbId, setNotionDbId, showToast, onSave }) {
  const [u, setU] = useState(sbUrl)
  const [k, setK] = useState(sbKey)
  const [nt, setNt] = useState(notionToken)
  const [nd, setNd] = useState(notionDbId)

  useEffect(() => { setU(sbUrl) }, [sbUrl])
  useEffect(() => { setK(sbKey) }, [sbKey])
  useEffect(() => { setNt(notionToken) }, [notionToken])
  useEffect(() => { setNd(notionDbId) }, [notionDbId])

  function save() {
    setSbUrl(u.trim())
    setSbKey(k.trim())
    setNotionToken(nt.trim())
    setNotionDbId(nd.trim())
    onSave(u.trim(), k.trim(), nt.trim(), nd.trim())
    showToast('設定を保存しました')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Notion設定 */}
      <div style={{ background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
        <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 15 }}>Notion接続設定</p>
        <p style={{ margin: '0 0 14px', fontSize: 12, color: C.muted }}>
          <a href="https://www.notion.so/my-integrations" target="_blank" rel="noreferrer" style={{ color: C.blue }}>notion.so/my-integrations</a> でトークンを取得
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.sub, marginBottom: 6 }}>Integration Token</label>
            <input value={nt} onChange={e => setNt(e.target.value)} placeholder="secret_xxxx..." type="password" style={baseInp} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.sub, marginBottom: 6 }}>inbox データベースID</label>
            <input value={nd} onChange={e => setNd(e.target.value)} placeholder="32文字のID（URLから取得）" style={baseInp} />
            <p style={{ margin: '4px 0 0', fontSize: 11, color: C.faint }}>NotionのURLの notion.so/ 以降の32文字</p>
          </div>
        </div>
      </div>

      {/* Supabase設定 */}
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
        </div>
      </div>

      <button onClick={save} style={{ padding: '12px', borderRadius: 8, border: 'none', background: C.accent, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>保存</button>
    </div>
  )
}
