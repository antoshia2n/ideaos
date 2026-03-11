export const C = {
  bg: '#f5f4f1', surface: '#ffffff', surface2: '#f0efe9',
  border: '#e0ddd6', borderStrong: '#c8c4bc',
  text: '#1e1e1e', sub: '#555', muted: '#888', faint: '#bbb',
  tag: '#e8e6de', tagText: '#555', accent: '#2d2d2d',
  ok: '#2a7a4b', okBg: '#edf6f1',
  err: '#c0392b', errBg: '#fdf0ee', blue: '#1a56db',
}
export const baseInp = {
  width: '100%', padding: '11px 13px', borderRadius: 8,
  border: `1.5px solid ${C.border}`, background: C.surface,
  color: C.text, fontSize: 15, boxSizing: 'border-box',
  outline: 'none', fontFamily: 'inherit',
}
export const DEFAULT_TPL = [
  { id: 't1', label: 'X投稿 1（主張型）',    body: '- フック（冒頭1行）:\n- 主張:\n- 理由 / 根拠:\n- 具体例:\n- まとめ / CTA:' },
  { id: 't2', label: 'X投稿 2（問いかけ型）', body: '- 問いかけ:\n- 答え（逆説・意外性）:\n- 補足:\n- 締め:' },
  { id: 't3', label: 'note記事 1',            body: '- タイトル案:\n- リード文:\n- 見出し1:\n- 見出し2:\n- 見出し3:\n- まとめ・次のアクション:' },
  { id: 't4', label: 'セミナー 1',            body: '- テーマ:\n- 対象者:\n- 学べること（3点）:\n- 構成:\n- 集客フック:\n- 所要時間:' },
  { id: 't5', label: 'Spaces告知',            body: '- タイトル:\n- 開催日時:\n- 話すこと:\n- ゲスト:\n- 参加してほしい人:' },
  { id: 't6', label: 'リサーチメモ',          body: '- 調査テーマ:\n- 情報ソース:\n- 発見・気づき:\n- 自分の仮説:\n- 次のアクション:' },
]
export const TABS = ['投入', '検索', 'AI展開', 'テンプレート', '設定']
