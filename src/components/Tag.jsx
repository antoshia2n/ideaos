import { C } from '../constants'
export default function Tag({ label }) {
  return <span style={{ fontSize: 11, background: C.tag, borderRadius: 4, padding: '2px 8px', color: C.tagText, fontWeight: 500 }}>{label}</span>
}
