function h(key) {
  return { 'Content-Type': 'application/json', apikey: key, Authorization: `Bearer ${key}` }
}
export async function sbList(url, key) {
  const res = await fetch(`${url}/rest/v1/ideaos_templates?order=created_at.asc`, { headers: h(key) })
  if (!res.ok) throw new Error(`Supabase ${res.status}`)
  return res.json()
}
export async function sbInsert(url, key, row) {
  const res = await fetch(`${url}/rest/v1/ideaos_templates`, {
    method: 'POST', headers: { ...h(key), Prefer: 'return=representation' }, body: JSON.stringify(row),
  })
  if (!res.ok) throw new Error(`Supabase ${res.status}`)
  return res.json()
}
export async function sbUpdate(url, key, id, row) {
  const res = await fetch(`${url}/rest/v1/ideaos_templates?id=eq.${id}`, {
    method: 'PATCH', headers: { ...h(key), Prefer: 'return=representation' }, body: JSON.stringify(row),
  })
  if (!res.ok) throw new Error(`Supabase ${res.status}`)
  return res.json()
}
export async function sbDelete(url, key, id) {
  const res = await fetch(`${url}/rest/v1/ideaos_templates?id=eq.${id}`, {
    method: 'DELETE', headers: h(key),
  })
  if (!res.ok) throw new Error(`Supabase ${res.status}`)
}
