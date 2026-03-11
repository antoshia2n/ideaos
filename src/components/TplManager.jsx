import { useState } from 'react'
import { C, baseInp } from '../constants'
import { sbInsert, sbUpdate, sbDelete } from '../api/supabase'
import useMemoEditor from '../hooks/useMemoEditor'
import MemoToolbar from './MemoToolbar'

export default function TplManager({ templates, reload, sbUrl, sbKey, showToast }) {
  const [editing, setEditing] = useState(null)
  const [label, setLabel] = useState('')
  const [body, setBody] = useState('')
  const [saving, setSaving] = useState(false)
  const ed = useMemoEditor(setBody)
  const noSb = !sbUrl || !sbKey

  async function commit() {
    if (!label.trim()) return
    setSaving(true)
    const row = { label: label.trim(), body }
    try {
      if (editing.id && !editing.id.startsWith('t')) {
        await sbUpdate(sbUrl, sbKey, editing.id, row)
      } else {
        await sbInsert(sbUrl, sbKey, { id: 'u' + Date.now(), ...row })
      }
      await reload()
      showToast(editing.id ? '更新しました' : '追加しました')
      setEditing(null)
    } catch { showToast('保存エラー（Supabase設定を確認）', 'err') }
    setSaving(false)
  }

  async function del(id) {
    if (id.startsWith('t')) { showToast('デフォルトは削除できません', 'err'); return }
    try { await sbDelete(sbUrl, sbKey, id); await reload(); showToast('削除しました') }
    catch { showToast('削除エラー', 'err') }
  }

  if (editing !== null) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>{editing.id ? 'テンプレートを編集' : 'テンプレートを追加'}</p>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.sub, marginBottom: 6 }}>テンプレート名</label>
          <input value={label} onChange={e => setLabel(e.target.value)} placeholder="例：X投稿 3" style={baseInp} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.sub, marginBottom: 6 }}>本文</label>
          <MemoToolbar toolbar={ed.toolbar} />
          <textarea ref={ed.ref} value={body} onChange={e => setBody(e.target.value)} {...ed.handlers} rows={8} style={{ ...baseInp, resize: 'vertical', lineHeight: 1.8 }} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={commit} disabled={saving || !label.trim()} style={{ flex: 1, padding: '12px', borderRadius: 8, border: 'none', background: !saving && label.trim() ? C.accent : C.borderStrong, color: !saving && label.trim() ? '#fff' : C.muted, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
            {saving ? '保存中...' : '保存'}
          </button>
          <button onClick={() => setEditing(null)} style={{ padding: '12px 16px', borderRadius: 8, border: `1.5px solid ${C.borderStrong}`, background: C.surface2, color: C.sub, fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>キャンセル</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {noSb && <div style={{ background: '#fffbeb', border: '1.5px solid #f5d87a', borderRadius: 8, padding: '11px 13px', fontSize: 13, color: '#7a5c00' }}>Supabase未設定。「設定」タブからURLとキーを入力してください。</div>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>テンプレート一覧</p>
        <button onClick={() => { setEditing({ id: null }); setLabel(''); setBody('') }} disabled={noSb}
          style={{ padding: '8px 14px', borderRadius: 8, border: `1.5px solid ${C.borderStrong}`, background: noSb ? C.surface2 : C.accent, color: noSb ? C.muted : '#fff', fontWeight: 600, fontSize: 13, cursor: noSb ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
          + 追加
        </button>
      </div>
      {templates.map(t => (
        <div key={t.id} style={{ background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 10, padding: '12px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{t.label}</p>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              {!t.id.startsWith('t') && <>
                <button onClick={() => { setEditing(t); setLabel(t.label); setBody(t.body) }} style={{ fontSize: 12, color: C.sub, background: C.surface2, border: `1.5px solid ${C.border}`, borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontFamily: 'inherit' }}>編集</button>
                <button onClick={() => del(t.id)} style={{ fontSize: 12, color: C.err, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', fontFamily: 'inherit' }}>削除</button>
              </>}
              {t.id.startsWith('t') && <span style={{ fontSize: 11, color: C.faint, padding: '4px 8px' }}>デフォルト</span>}
            </div>
          </div>
          <pre style={{ margin: '8px 0 0', fontSize: 12, color: C.muted, lineHeight: 1.6, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
            {t.body.slice(0, 100)}{t.body.length > 100 ? '...' : ''}
          </pre>
        </div>
      ))}
    </div>
  )
}
