import { C } from '../constants'
const INDENT = '  '
export default function MemoToolbar({ toolbar }) {
  function tbtn(label, onClick, title) {
    return (
      <button key={label} title={title} onMouseDown={e => { e.preventDefault(); onClick() }}
        style={{ padding: '5px 9px', fontSize: 12, fontWeight: 600, background: C.surface2, border: `1.5px solid ${C.border}`, borderRadius: 6, cursor: 'pointer', color: C.sub, fontFamily: 'inherit', lineHeight: 1, whiteSpace: 'nowrap' }}>
        {label}
      </button>
    )
  }
  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 6 }}>
      {tbtn('• 箇条書き',  () => toolbar.insertAtLineHead('- '),         '箇条書き')}
      {tbtn('1. 番号',     () => toolbar.insertAtLineHead('1. '),        '番号付きリスト')}
      {tbtn('☐ チェック', () => toolbar.insertAtLineHead('- [ ] '),     'チェックボックス')}
      {tbtn('→ indent',   () => toolbar.insertAtLineHead(INDENT, false), 'インデント')}
      {tbtn('← outdent',  () => toolbar.unindent(),                      'アンインデント')}
      {tbtn('## 見出し',  () => toolbar.insertAtLineHead('## '),        '見出し')}
      {tbtn('> 引用',     () => toolbar.insertAtLineHead('> '),         '引用')}
      {tbtn('B 太字',     () => toolbar.wrapSelection('**', '**'),      '太字')}
      {tbtn('` コード',   () => toolbar.wrapSelection('`', '`'),        'コード')}
    </div>
  )
}
