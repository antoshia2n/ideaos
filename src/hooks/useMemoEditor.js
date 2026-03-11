import { useRef } from 'react'
const INDENT = '  '
function getLine(val, cursor) {
  const ls = val.lastIndexOf('\n', cursor - 1) + 1
  const leRaw = val.indexOf('\n', cursor)
  const le = leRaw === -1 ? val.length : leRaw
  return { ls, le, line: val.slice(ls, le) }
}
export default function useMemoEditor(setMemo) {
  const ref = useRef()
  const composing = useRef(false)
  function applyMemo(newVal, newCursor) {
    setMemo(newVal)
    requestAnimationFrame(() => {
      const ta = ref.current
      if (ta) { ta.selectionStart = ta.selectionEnd = newCursor; ta.focus() }
    })
  }
  function onKeyDown(e) {
    if (composing.current) return
    const ta = ref.current; if (!ta) return
    const val = ta.value, s = ta.selectionStart, en = ta.selectionEnd
    if (e.key === 'Enter') {
      e.preventDefault()
      const { line } = getLine(val, s)
      const m = line.match(/^(\s*)([-*] )/)
      const prefix = m ? m[1] + m[2] : (line.match(/^(\s*)/) || ['', ''])[1]
      const ins = '\n' + prefix
      applyMemo(val.slice(0, s) + ins + val.slice(en), s + ins.length)
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const { ls, le, line } = getLine(val, s)
      if (e.shiftKey) {
        const rm = line.startsWith(INDENT) ? INDENT.length : line.startsWith(' ') ? 1 : 0
        if (rm) applyMemo(val.slice(0, ls) + line.slice(rm) + val.slice(le), Math.max(ls, s - rm))
      } else {
        applyMemo(val.slice(0, ls) + INDENT + val.slice(ls), s + INDENT.length)
      }
    }
  }
  function insertAtLineHead(prefix, toggle = true) {
    const ta = ref.current; if (!ta) return
    const val = ta.value, s = ta.selectionStart
    const { ls, le, line } = getLine(val, s)
    if (toggle && line.startsWith(prefix)) {
      applyMemo(val.slice(0, ls) + line.slice(prefix.length) + val.slice(le), Math.max(ls, s - prefix.length))
    } else {
      applyMemo(val.slice(0, ls) + prefix + val.slice(ls), s + prefix.length)
    }
  }
  function wrapSelection(before, after) {
    const ta = ref.current; if (!ta) return
    const val = ta.value, s = ta.selectionStart, en = ta.selectionEnd
    const sel = val.slice(s, en) || 'テキスト'
    setMemo(val.slice(0, s) + before + sel + after + val.slice(en))
    requestAnimationFrame(() => {
      if (ta) { ta.selectionStart = s + before.length; ta.selectionEnd = s + before.length + sel.length; ta.focus() }
    })
  }
  function unindent() {
    const ta = ref.current; if (!ta) return
    const val = ta.value, s = ta.selectionStart
    const { ls, le, line } = getLine(val, s)
    const rm = line.startsWith(INDENT) ? INDENT.length : line.startsWith(' ') ? 1 : 0
    if (rm) applyMemo(val.slice(0, ls) + line.slice(rm) + val.slice(le), Math.max(ls, s - rm))
  }
  return {
    ref,
    handlers: {
      onCompositionStart: () => { composing.current = true },
      onCompositionEnd: () => { composing.current = false },
      onKeyDown,
    },
    toolbar: { insertAtLineHead, wrapSelection, unindent },
  }
}
