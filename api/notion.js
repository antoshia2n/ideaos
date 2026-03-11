export const config = { runtime: 'edge' }

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 })

  let body
  try { body = await req.json() } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
  }

  const { token, database_id, title, tags, memo } = body
  if (!token || !database_id) {
    return new Response(JSON.stringify({ error: 'token and database_id are required' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
  }

  // DBのプロパティ一覧を取得
  const dbRes = await fetch(`https://api.notion.com/v1/databases/${database_id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
    },
  })
  if (!dbRes.ok) {
    const err = await dbRes.json()
    return new Response(JSON.stringify({ error: 'DB取得失敗', detail: err }), {
      status: dbRes.status,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  }
  const db = await dbRes.json()

  // title型のプロパティ名を動的に取得
  const titlePropName = Object.entries(db.properties).find(([, v]) => v.type === 'title')?.[0] || 'title'

  // 今日の日付（ISO形式 YYYY-MM-DD）
  const today = new Date().toISOString().slice(0, 10)

  // プロパティを組み立て
  const properties = {
    [titlePropName]: { title: [{ text: { content: title || '無題' } }] },
  }

  // ジャンルプロパティがあればタグをmulti_selectで送る
  if (tags && tags.length > 0 && db.properties['ジャンル']?.type === 'multi_select') {
    properties['ジャンル'] = { multi_select: tags.map(t => ({ name: t })) }
  }

  // 日付プロパティがあれば今日の日付を送る
  if (db.properties['日付']?.type === 'date') {
    properties['日付'] = { date: { start: today } }
  }

  // メモをページ本文に追加
  const children = []
  if (memo) {
    children.push({
      object: 'block', type: 'paragraph',
      paragraph: { rich_text: [{ type: 'text', text: { content: memo } }] },
    })
  }

  const payload = { parent: { database_id }, properties, children }

  const res = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json()
  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  })
}
