const KEY_IDEAS = 'ideaos_ideas_v4'
const KEY_CREDS = 'ideaos_creds'

export function loadIdeas() {
  try { const r = localStorage.getItem(KEY_IDEAS); return r ? JSON.parse(r) : [] } catch { return [] }
}
export function saveIdeas(ideas) {
  try { localStorage.setItem(KEY_IDEAS, JSON.stringify(ideas)) } catch {}
}
export function loadCreds() {
  try { const r = localStorage.getItem(KEY_CREDS); return r ? JSON.parse(r) : { url: '', key: '', notionToken: '', notionDbId: '' } } catch { return { url: '', key: '', notionToken: '', notionDbId: '' } }
}
export function saveCreds(url, key, notionToken = '', notionDbId = '') {
  try { localStorage.setItem(KEY_CREDS, JSON.stringify({ url, key, notionToken, notionDbId })) } catch {}
}
