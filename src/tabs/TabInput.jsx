import { C, baseInp } from '../constants'
import useMemoEditor from '../hooks/useMemoEditor'
import MemoToolbar from '../components/MemoToolbar'
import IdeaCard from '../components/IdeaCard'

export default function TabInput({ ideas, onSave, onDelete, loading, setShowTpl, memo, setMemo, title, setTitle, tags, setTags, showToast }) {
  const memoEd = useMemoEditor(setMemo)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.sub, marginBottom: 6 }}>タイトル</label>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="アイデアを一言で" style={baseInp} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.sub, marginBottom: 6 }}>タグ（カンマ区切り）</label>
        <input value={tags} onChange={e => setTags(e.target.value)} placeholder="マーケ, SNS, note" style={baseInp} />
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: C.sub }}>メモ</label>
          <div style={{ display: 'flex', gap: 6 }}>
            {memo && <button onClick={() => { navigator.clipboard.writeText(memo); showToast('コピーしました') }} style={{ fontSize: 12, fontWeight: 600, color: C.sub, background: C.surface2, border: `1.5px solid ${C.borderStrong}`, borderRadius: 6, padding: '5px 11px', cursor: 'pointer', fontFamily: 'inherit' }}>コピー</button>}
            <button onClick={() => setShowTpl(true)} style={{ fontSize: 12, fontWeight: 600, color: C.sub, background: C.surface2, border: `1.5px solid ${C.borderStrong}`, borderRadius: 6, padding: '5px 11px', cursor: 'pointer', fontFamily: 'inherit' }}>テンプレート</button>
          </div>
        </div>
        <MemoToolbar toolbar={memoEd.toolbar} />
        <textarea ref={memoEd.ref} value={memo} onChange={e => setMemo(e.target.value)} {...memoEd.handlers} placeholder={'- フック:\n- 主張:'} rows={7} style={{ ...baseInp, resize: 'vertical', lineHeight: 1.8 }} />
        <p style={{ fontSize: 11, color: C.faint, margin: '4px 0 0' }}>Enter：箇条書き継続 / Tab：インデント / Shift+Tab：戻す</p>
      </div>
      <button onClick={onSave} disabled={loading || !title.trim()} style={{ width: '100%', padding: '13px', borderRadius: 8, border: 'none', background: !loading && title.trim() ? C.accent : C.borderStrong, color: !loading && title.trim() ? '#fff' : C.muted, fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit' }}>
        {loading ? '保存中...' : '保存 → Notion inbox'}
      </button>
      {ideas.length > 0 && (
        <div style={{ marginTop: 4 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 10 }}>最近のアイデア</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ideas.slice(0, 10).map(idea => <IdeaCard key={idea.id} idea={idea} onDelete={() => onDelete(idea.id)} />)}
            {ideas.length > 10 && <p style={{ fontSize: 12, color: C.muted, textAlign: 'center' }}>他 {ideas.length - 10}件</p>}
          </div>
        </div>
      )}
    </div>
  )
}
