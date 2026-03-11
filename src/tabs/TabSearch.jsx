import { useState } from 'react'
import { C, baseInp } from '../constants'
import { callClaude, getText, parseJSON } from '../api/claude'
import IdeaCard from '../components/IdeaCard'

export default function TabSearch({ ideas }) {
  const [q, setQ] = useState('')
  const [localHits, setLocalHits] = useState(null)
  const [notionHits, setNotionHits] = useState(null)
  const [searching, setSearching] = useState(false)

  function doLocalSearch(query) {
    if (!query.trim()) { setLocalHits(null); return }
    const lq = query.toLowerCase()
    setLocalHits(ideas.filter(i => i.title.toLowerCase().includes(lq) || (i.memo || '').toLowerCase().includes(lq) || (i.tags || []).some(t => t.toLowerCase().includes(lq))))
  }

  async function doNotionSearch() {
    if (!q.trim()) return
    setSearching(true); setNotionHits(null)
    try {
      const data = await callClaude([{ role: 'user', content: `Notionで「${q}」をキーワードにページを検索し、JSON配列のみ返してください。\n[{"title":"タイトル","url":"https://notion.so/...","snippet":"要約"}]` }], 'NotionのMCPで検索。JSON配列のみ。', true)
      setNotionHits(parseJSON(getText(data)) || [{ title: '結果取得失敗', snippet: getText(data) }])
    } catch { setNotionHits([{ title: 'エラー', snippet: 'Notion接続を確認してください' }]) }
    setSearching(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <input value={q} onChange={e => { setQ(e.target.value); doLocalSearch(e.target.value) }} onKeyDown={e => e.key === 'Enter' && doNotionSearch()} placeholder="キーワードを入力" style={{ ...baseInp, flex: 1 }} />
        <button onClick={doNotionSearch} disabled={searching || !q.trim()} style={{ padding: '12px 14px', borderRadius: 8, border: `1.5px solid ${C.borderStrong}`, background: !searching && q.trim() ? C.accent : C.surface2, color: !searching && q.trim() ? '#fff' : C.muted, fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
          {searching ? '検索中' : 'Notion'}
        </button>
      </div>
      {localHits !== null && (
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 8 }}>ローカル（{localHits.length}件）</p>
          {localHits.length === 0 ? <p style={{ fontSize: 14, color: C.muted }}>一致なし</p> : <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{localHits.map(i => <IdeaCard key={i.id} idea={i} />)}</div>}
        </div>
      )}
      {notionHits !== null && !searching && (
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 8 }}>Notion（{notionHits.length}件）</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {notionHits.map((r, i) => (
              <div key={i} style={{ background: C.surface, borderRadius: 10, padding: '13px 14px', border: `1.5px solid ${C.border}` }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{r.title}</p>
                {r.snippet && <p style={{ margin: '6px 0 0', fontSize: 13, color: C.sub, lineHeight: 1.6 }}>{r.snippet}</p>}
                {r.url && <a href={r.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: C.blue, display: 'inline-block', marginTop: 6 }}>Notionで開く</a>}
              </div>
            ))}
          </div>
        </div>
      )}
      {localHits === null && notionHits === null && !searching && <p style={{ fontSize: 14, color: C.muted, textAlign: 'center', padding: '40px 0' }}>キーワードを入力<br /><span style={{ fontSize: 12 }}>Enterまたは「Notion」でNotion横断検索</span></p>}
    </div>
  )
}
