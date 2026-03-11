import { useState } from 'react'
import { C, baseInp } from '../constants'
import { callClaude, getText, parseJSON } from '../api/claude'
import Tag from '../components/Tag'

export default function TabExpand({ onAddIdea }) {
  const [kw, setKw] = useState('')
  const [aiList, setAiList] = useState([])
  const [expanding, setExpanding] = useState(false)

  async function doExpand() {
    if (!kw.trim()) return
    setExpanding(true); setAiList([])
    try {
      const data = await callClaude([{ role: 'user', content: `「${kw}」をテーマにX投稿・note・Spaces向けアイデアを10件生成。JSON配列のみ:\n[{"title":"タイトル","tags":["タグ"],"memo":"1〜2文"}]` }], 'コンテンツアイデア生成。JSON配列のみ返す。')
      setAiList(parseJSON(getText(data)) || [])
    } catch { setAiList([]) }
    setExpanding(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <input value={kw} onChange={e => setKw(e.target.value)} onKeyDown={e => e.key === 'Enter' && doExpand()} placeholder="テーマ・キーワード" style={{ ...baseInp, flex: 1 }} />
        <button onClick={doExpand} disabled={expanding || !kw.trim()} style={{ padding: '12px 14px', borderRadius: 8, border: 'none', background: !expanding && kw.trim() ? C.accent : C.borderStrong, color: !expanding && kw.trim() ? '#fff' : C.muted, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
          {expanding ? '生成中' : '展開'}
        </button>
      </div>
      {expanding && <p style={{ fontSize: 14, color: C.muted, textAlign: 'center', padding: '30px 0' }}>AIがアイデアを生成中...</p>}
      {aiList.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {aiList.map((idea, i) => (
            <div key={i} style={{ background: C.surface, borderRadius: 10, padding: '13px 14px', border: `1.5px solid ${C.border}`, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{idea.title}</p>
                {idea.memo && <p style={{ margin: '5px 0 0', fontSize: 13, color: C.sub, lineHeight: 1.5 }}>{idea.memo}</p>}
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 6 }}>
                  {(idea.tags || []).map((t, j) => <Tag key={j} label={t} />)}
                </div>
              </div>
              <button onClick={() => onAddIdea(idea)} style={{ padding: '7px 12px', borderRadius: 7, border: `1.5px solid ${C.borderStrong}`, cursor: 'pointer', background: C.surface2, color: C.sub, fontSize: 13, fontWeight: 600, flexShrink: 0, fontFamily: 'inherit' }}>追加</button>
            </div>
          ))}
        </div>
      )}
      {aiList.length === 0 && !expanding && <p style={{ fontSize: 14, color: C.muted, textAlign: 'center', padding: '40px 0' }}>キーワードを入力して展開</p>}
    </div>
  )
}
