const NOTION_MCP = [{ type: 'url', url: 'https://mcp.notion.com/mcp', name: 'notion' }]

export async function callClaude(messages, system = '', mcp = false) {
  const res = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages,
      ...(system && { system }),
      ...(mcp && { mcp_servers: NOTION_MCP }),
    }),
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}
export function getText(d) {
  return (d.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n')
}
export function parseJSON(text) {
  try {
    const m = text.replace(/```json|```/g, '').trim().match(/\[[\s\S]*\]/)
    return m ? JSON.parse(m[0]) : null
  } catch { return null }
}
