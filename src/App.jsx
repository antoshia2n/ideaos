import { useState, useEffect } from 'react'
import { C, DEFAULT_TPL, TABS } from './constants'
import { callClaude } from './api/claude'
import { sbList } from './api/supabase'
import { loadIdeas, saveIdeas, loadCreds, saveCreds } from './storage'
import Toast from './components/Toast'
import TplDrawer from './components/TplDrawer'
import TplManager from './components/TplManager'
import Settings from './components/Settings'
import TabInput from './tabs/TabInput'
import TabSearch from './tabs/TabSearch'
import TabExpand from './tabs/TabExpand'

export default function App() {
  const [tab, setTab]             = useState(0)
  const [ideas, setIdeas]         = useState([])
  const [templates, setTemplates] = useState(DEFAULT_TPL)
  const [sbUrl, setSbUrl]         = useState('')
  const [sbKey, setSbKey]         = useState('')
  const [toast, setToast]         = useState(null)
  const [loading, setLoading]     = useState(false)
  const [showTpl, setShowTpl]     = useState(false)
  const [title, setTitle]         = useState('')
  const [tags, setTags]           = useState('')
  const [memo, setMemo]           = useState('')

  useEffect(() => {
    setIdeas(loadIdeas())
    const creds = loadCreds()
    if (creds.url) { setSbUrl(creds.url); setSbKey(creds.key); loadTemplates(creds.url, creds.key) }
  }, [])

  function showToastMsg(msg, type = 'ok') { setToast({ msg, type }); setTimeout(() => setToast(null), 3000) }

  async function loadTemplates(url, key) {
    if (!url || !key) return
    try { const rows = await sbList(url, key); setTemplates(rows?.length > 0 ? [...DEFAULT_TPL, ...rows] : DEFAULT_TPL) } catch {}
  }

  function handleSaveCredentials(url, key) { saveCreds(url, key); loadTemplates(url, key) }

  function persistIdeas(list) { setIdeas(list); saveIdeas(list) }

  async function handleSave() {
    if (!title.trim()) return
    setLoading(true)
    const idea = { id: Date.now(), title: title.trim(), tags: tags.split(/[,、\s]+/).map(t => t.trim()).filter(Boolean), memo: memo.trim(), at: new Date().toLocaleString('ja-JP') }
    persistIdeas([idea, ...ideas])
    try {
      await callClaude([{ role: 'user', content: `Notionのinboxデータベースに新しいページを追加してください。\nタイトル: ${idea.title}\nタグ: ${idea.tags.join(', ')}\nメモ:\n${idea.memo || 'なし'}` }], 'NotionのMCPを使ってページを作成するアシスタント。', true)
      showToastMsg('保存しました（ローカル + Notion）')
    } catch { showToastMsg('ローカルに保存しました（Notion送信エラー）', 'err') }
    setTitle(''); setTags(''); setMemo('')
    setLoading(false)
  }

  async function handleAddAiIdea(idea) {
    const n = { id: Date.now(), title: idea.title, tags: idea.tags || [], memo: idea.memo || '', at: new Date().toLocaleString('ja-JP') }
    persistIdeas([n, ...ideas])
    showToastMsg(`追加：${idea.title.slice(0, 20)}...`)
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Hiragino Sans','Hiragino Kaku Gothic ProN','Yu Gothic',sans-serif" }}>
      <Toast t={toast} />
      {showTpl && <TplDrawer templates={templates} onSelect={t => setMemo(t)} onClose={() => setShowTpl(false)} />}
      <div style={{ background: C.surface, borderBottom: `1.5px solid ${C.border}`, padding: '14px 16px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 540, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-.01em' }}>IdeaOS</span>
          <span style={{ fontSize: 12, color: C.muted }}>{ideas.length}件のアイデア</span>
        </div>
      </div>
      <div style={{ background: C.surface, borderBottom: `1.5px solid ${C.border}`, overflowX: 'auto' }}>
        <div style={{ maxWidth: 540, margin: '0 auto', display: 'flex', minWidth: 'max-content' }}>
          {TABS.map((t, i) => (
            <button key={i} onClick={() => setTab(i)} style={{ padding: '13px 16px', border: 'none', background: 'none', borderBottom: tab === i ? `2.5px solid ${C.accent}` : '2.5px solid transparent', color: tab === i ? C.accent : C.muted, fontWeight: tab === i ? 700 : 400, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', marginBottom: -1 }}>{t}</button>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: 540, margin: '0 auto', padding: '20px 16px 80px' }}>
        {tab === 0 && <TabInput ideas={ideas} onSave={handleSave} onDelete={id => persistIdeas(ideas.filter(i => i.id !== id))} loading={loading} setShowTpl={setShowTpl} memo={memo} setMemo={setMemo} title={title} setTitle={setTitle} tags={tags} setTags={setTags} showToast={showToastMsg} />}
        {tab === 1 && <TabSearch ideas={ideas} />}
        {tab === 2 && <TabExpand onAddIdea={handleAddAiIdea} />}
        {tab === 3 && <TplManager templates={templates} reload={() => loadTemplates(sbUrl, sbKey)} sbUrl={sbUrl} sbKey={sbKey} showToast={showToastMsg} />}
        {tab === 4 && <Settings sbUrl={sbUrl} sbKey={sbKey} setSbUrl={setSbUrl} setSbKey={setSbKey} showToast={showToastMsg} onSave={handleSaveCredentials} />}
      </div>
    </div>
  )
}
