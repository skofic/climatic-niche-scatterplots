/* Shared page helpers of the panes. Pop: the reading popover behind the "i" (status) and "?" (hints) marks of the legend
   row. A native title tooltip cannot be styled; this one has a text style of its own (panes.css .pop) and shows a
   " · "-separated status as a list of lines. Hovering or focusing the mark opens it, leaving closes it. */
window.Pop = (() => {
  let box = null, owner = null, timer = null
  const el = () => {
    if (box) return box
    box = Object.assign(document.body.appendChild(document.createElement('div')), { className: 'pop' })
    // the popover can be entered (its links are clickable) and a click inside it does not close it
    box.addEventListener('mouseenter', () => clearTimeout(timer)); box.addEventListener('mouseleave', () => { timer = setTimeout(hide, 200) })
    box.addEventListener('click', (e) => e.stopPropagation())
    return box
  }
  const html = (text) => String(text ?? '').split(' · ').map((s) => `<div>${s.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</div>`).join('')
  function show(mark) {
    const rich = mark._card ? mark._card() : null, text = mark.dataset.text; if (!rich && !text) return
    const b = el(); b.innerHTML = rich ?? (mark.dataset.head ? `<div class="head">${mark.dataset.head}</div>` : '') + html(text); b.classList.toggle('card', !!rich); b.classList.toggle('shade', !!mark.closest('.na')); b.classList.add('open'); owner = mark; b.scrollTop = 0
    const r = mark.getBoundingClientRect(), w = b.offsetWidth
    b.style.top = `${r.bottom + 6 + scrollY}px`; b.style.left = `${Math.max(6, Math.min(r.left + scrollX, innerWidth - w - 6))}px`
  }
  let pinned = false
  function hide() { if (pinned) return; if (box) box.classList.remove('open'); owner = null }
  /** bind a mark: hovering shows mark.dataset.text (kept current with set()); a click pins the popover open (touch
   *  screens have no hover), a second click or a click elsewhere closes it */
  function bind(mark) {
    mark.tabIndex = 0; mark.removeAttribute('title')
    mark.addEventListener('mouseenter', () => { clearTimeout(timer); if (!pinned) show(mark) })
    mark.addEventListener('mouseleave', () => { timer = setTimeout(hide, 200) })
    mark.addEventListener('click', (e) => { e.stopPropagation(); if (pinned && owner === mark) { pinned = false; hide() } else { pinned = false; show(mark); pinned = true } })
    mark.addEventListener('keydown', (e) => { if (e.key === 'Escape') { pinned = false; hide() } })
    if (!bind.doc) { bind.doc = true; document.addEventListener('click', () => { pinned = false; hide() }) }
  }
  /** set a mark's text; the mark glows briefly so that a changed status catches the eye without staying prominent */
  function set(mark, text, head) {
    mark.dataset.text = text ?? ''; if (head !== undefined) mark.dataset.head = head
    mark.classList.remove('flash'); void mark.offsetWidth; mark.classList.add('flash')
    if (owner === mark) show(mark)
    if (window.Info) Info.refresh()   // a new status means the pane was redrawn: the chosen options may have changed
  }
  /** inside a captioned group, a label that repeats the caption ("Base layer opacity" under "Base layer") loses the
   *  repeated words; the full title stays in the hover. Call after Dict.labels(). */
  function shortLabels(root = document) {
    for (const g of root.querySelectorAll('.group')) {
      const cap = g.querySelector(':scope > .cap')?.textContent.trim().toLowerCase(); if (!cap) continue
      for (const e of g.querySelectorAll('label > span[data-term]')) {
        const t = e.textContent; if (t.toLowerCase().startsWith(cap + ' ') && t.length > cap.length + 1) { if (!e.title) e.title = t; const r = t.slice(cap.length + 1); e.textContent = r[0].toUpperCase() + r.slice(1) }
      }
    }
  }
  /** a term card on an element that is not a mark (a label, a caption): card() returns the HTML, or null for nothing.
   *  Opened by resting the pointer on the element (no click: a click on a label belongs to its control) */
  function card(target, fn, delay = 450) {
    target._card = fn; let wait = null
    target.addEventListener('mouseenter', () => { clearTimeout(timer); clearTimeout(wait); wait = setTimeout(() => { if (!pinned) show(target) }, delay) })
    target.addEventListener('mouseleave', () => { clearTimeout(wait); timer = setTimeout(hide, 200) })
  }
  /** draw the open popover again when it belongs to this element (its content was completed) */
  const again = (target) => { if (owner === target) show(target) }
  return { bind, set, show, hide, shortLabels, card, again }
})()

/* Info: what the dictionary says of a control beyond its label. Every element labelled by a term (data-term) gets a
   term card when the term has more than a definition: the description, then `_uses` (what the control is for),
   `_methods` (how the drawing or value is produced) and `_issues` (what to keep in mind), each under the dictionary's
   own title for that field; the card's head links to the term's page on the dictionary site. A term with `_issues`
   gets a warning mark beside its label; a selector gets one beside itself when the chosen option, or the section the
   option belongs to (a source's periods), has issues. No text is written here: all of it is the dictionary's. */
window.Info = (() => {
  const SECT = ['_uses', '_methods', '_issues'], q = new URLSearchParams(location.search), h = location.hostname
  const SITE = q.get('dictsite') || (['localhost', '127.0.0.1'].includes(h) ? 'http://localhost:8529' : h.startsWith('panes.') ? `https://dictionary.${h.slice(6)}` : location.origin) + '/_db/metadata/web/'
  const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  const href = (g) => `${SITE}#/term/${encodeURIComponent(g)}`
  // a dataset's page on the dictionary site, addressed by the record's code: what a `[words](dataset:CODE)` link in a
  // text and the title of a source in the Source card open (2026-11-20)
  const dataset = (code) => `${SITE}#/dataset/${encodeURIComponent(code)}`
  // every link to the dictionary site goes to ONE tab, named: the first click opens it, the next ones show their term
  // there (Milko, 2026-11-14); any other link opens a tab of its own
  const TERM = 'target="dictionary"', OUT = 'target="_blank" rel="noopener"'
  // a link to a term must never show the term's identifier (Milko, 2026-11-14): when the visible text is the bare
  // identifier, the term's title stands for it. Titles not fetched yet are fetched and the card is drawn again.
  let want = new Set()
  const linkText = (txt, g) => { const bare = txt.replace(/^`|`$/g, ''); if (bare !== g) return txt; if (Dict.terms.has(g)) return Dict.terms.get(g) ? esc(Dict.title(g)) : txt; want.add(g); return '…' }
  /** the dictionary's Markdown, as far as its texts use it: paragraphs, bold, italics, code, links (a `gid.md` link is a term page, a `dataset:CODE` link a dataset page) */
  const md = (t) => esc(t).split(/\n{2,}/).map((p) => '<p>' + p
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, txt, url) => { if (/^https?:/.test(url)) return `<a ${OUT} href="${url}">${txt}</a>`; if (url.startsWith('dataset:')) return `<a ${TERM} href="${dataset(url.slice(8))}">${txt}</a>`; const g = url.replace(/\.md$/, ''); return `<a ${TERM} href="${href(g)}">${linkText(txt, g)}</a>` })
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\*([^*]+)\*/g, '<i>$1</i>').replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\n/g, ' ') + '</p>').join('')
  const has = (g, f) => !!(g && Dict.info(g, f))
  const rich = (g) => g && (['_description', ...SECT].some((f) => has(g, f)) || !!Dict.terms.get(g)?._info?._references)
  const sect = (f, body) => `<div class="sect${f === '_issues' ? ' issues' : ''}"><div class="sub">${f === '_issues' ? '⚠ ' : ''}${esc(Dict.title(f))}</div>${body}</div>`
  const refs = (R) => R && (R._citation || R._url) ? sect('_references', [...(R._citation || []), ...(R._url || [])].map(md).join('')) : ''
  /** what a term says: definition, description, the three sections, references (only: just the named sections) */
  function body(g, only) {
    let out = ''
    if (!only) { const d = Dict.info(g, '_definition'); if (d) out += `<p class="def">${esc(d)}</p>`; if (has(g, '_description')) out += md(Dict.info(g, '_description')) }
    for (const f of only || SECT) if (has(g, f)) out += sect(f, md(Dict.info(g, f)))
    if (!only) out += refs(Dict.terms.get(g)?._info?._references)
    return out
  }
  /** one term's part of a card: the head (its title, linked to the term page), then what it says */
  const part = (g, only) => `<div class="term"><div class="head"><a ${TERM} href="${href(g)}">${esc(Dict.title(g))} ↗</a></div>${body(g, only)}</div>`
  /** the same for an object that is not a term but follows the dictionary (a dataset record: `_info` texts already in
   *  the pane's language + `_references`), as the service's catalogue returns it */
  function recordBody(info = {}, only) {
    let out = ''
    if (!only && info._description) out += md(info._description)
    for (const f of only || SECT) if (info[f]) out += sect(f, md(info[f]))
    if (!only) out += refs(info._references)
    return out
  }
  /** A selector's options as blocks, in the selector's order (Milko, 2026-11-14): the chosen one is opened — a filled
   *  dot, an accent bar, its title large, everything it says; the others are quiet — an empty dot, the title, one line.
   *  Three levels never share a style: option titles, section titles (small capitals), unchosen options (grey). */
  const block = (on, title, link, open, line) => on
    ? `<div class="opt on"><div class="otitle">● ${link ? `<a ${TERM} href="${link}">${esc(title)}</a>` : esc(title)}</div>${open}</div>`
    : `<div class="opt"><div class="otitle">○ ${esc(title)}</div>${line ? `<p>${esc(line)}</p>` : ''}</div>`
  const first = (text) => Dict.plain(text || '').split(/(?<=[.:;])\s/)[0]   // an object without a definition: the opening sentence of its description
  /** only short lists whose options are all terms are listed (never the species, the countries or the units) */
  function options(sel) {
    const os = sel ? [...sel.options] : []
    if (os.length < 2 || os.length > 12 || !os.every((o) => o.value && Dict.terms.get(o.value))) return ''
    return `<div class="opts">${os.map((o) => block(o.selected, Dict.title(o.value), href(o.value), body(o.value), Dict.info(o.value, '_definition'))).join('')}</div>`
  }
  /** the terms behind a selector's choice: the chosen option and, when it belongs to another namespace than the field's own (a source's periods), that section */
  function chosen(sel) {
    const g = sel && sel.value, t = g && Dict.terms.get(g); if (!t) return []
    const nid = t._code && t._code._nid
    return [g, ...(nid && !String(sel.dataset.key).startsWith(nid) && Dict.terms.has(nid) && Dict.terms.get(nid) ? [nid] : [])]
  }
  const selectOf = (e) => (e.closest('label') || (e.classList.contains('cap') ? e.parentElement : null))?.querySelector(e.classList.contains('cap') ? ':scope > select[data-key]' : 'select[data-key]')
  const warn = () => Object.assign(document.createElement('span'), { className: 'warn', textContent: '⚠', tabIndex: 0 })
  /** build a card; when it named terms whose titles were missing, fetch them and draw the card again */
  const build = (target, fn) => { want = new Set(); const html = fn(); if (want.size) { const gs = [...want]; Dict.load(gs).then(() => Pop.again(target)) } return html }
  let targets = []
  async function init(root = document) {
    const els = [...root.querySelectorAll('[data-term], [data-info]')].filter((e) => !e._info)
    await Dict.load([...SECT, '_references', ...els.flatMap((e) => (e.dataset.info || '').split(' '))])
    for (const e of els) {
      e._info = true
      // a label inside an element that speaks for other terms (a legend label inside its switch) has no hover of its own
      if (e.parentElement && e.parentElement.closest('[data-info]')) { e.removeAttribute('title'); continue }
      // data-info names further terms the element stands for: a label whose subject is a state property set by a gesture
      // (the map selection), or a legend label, which shows the card of the layer it switches (the check box's term)
      const gs0 = [e.dataset.term, ...(e.dataset.info || '').split(' ')].filter(Boolean), sel = selectOf(e)
      Pop.card(e, () => build(e, () => {
        const gs = [...new Set([...gs0, ...chosen(sel)])].filter(rich), extra = e._extra ? e._extra() : '', opts = options(sel)
        if (!gs.length && !extra && !opts) return null
        e.removeAttribute('title')
        // the field (with options it always opens the card, were it only with its definition), then its options (the
        // chosen one opened), then the section the chosen option belongs to
        const field = gs0.filter((x) => rich(x) || ((opts || extra) && has(x, '_definition'))).map((x) => part(x)).join(''), rest = gs.filter((x) => !gs0.includes(x) && !(opts && sel && x === sel.value)).map((x) => part(x)).join('')
        return field + opts + rest + extra
      }))
      targets.push({ e, gs: gs0, sel, mark: null, selMark: null })
    }
    await refresh()
  }
  /** a selector whose options are records, not terms (the climate source): the label's card lists every record and
   *  opens the chosen one; the selector gets the warning mark when the chosen record has issues.
   *  records() → [{ key, title, code, definition, info }], sel.value is the chosen key */
  function records(label, sel, records) {
    const cur = () => records().find((r) => String(r.key) === sel.value)
    label._extra = () => `<div class="opts">${records().map((r) => block(String(r.key) === sel.value, r.title, r.code ? dataset(r.code) : null, recordBody(r.info), r.definition && r.definition !== (r.info || {})._description ? r.definition : first(r.info && r.info._description))).join('')}</div>`
    const mark = warn(); sel.after(mark); mark._card = () => { const r = cur(); return r && r.info && r.info._issues ? build(mark, () => `<div class="term"><div class="head">${esc(r.title)}</div>${recordBody(r.info, ['_issues'])}</div>`) : null }; Pop.bind(mark)
    const sync = () => { const r = cur(); mark.hidden = !(r && r.info && r.info._issues) }
    sel.addEventListener('change', sync); recordSyncs.push(sync); sync()
  }
  const recordSyncs = []
  let pending = null
  /** show or hide the warning marks; the sections of the chosen options are fetched on first need */
  function refresh() {
    clearTimeout(pending)
    return new Promise((done) => { pending = setTimeout(async () => {
      targets = targets.filter((t) => t.e.isConnected)
      const nids = targets.map((t) => t.sel && Dict.terms.get(t.sel.value)?._code?._nid).filter((n) => n && !Dict.terms.has(n))
      if (nids.length) await Dict.load(nids)
      for (const t of targets) {
        if (t.e.classList.contains('tog')) continue   // a legend switch: the card is enough, the mark is at the check box
        if (t.gs.some((x) => has(x, '_issues'))) { if (!t.mark) {
          t.mark = warn(); if (t.e.classList.contains('cap')) t.e.append(t.mark); else t.e.after(t.mark);   // inside a caption: the settings grid gives every child of a group a column
          t.mark._card = () => build(t.mark, () => t.gs.filter((x) => has(x, '_issues')).map((x) => part(x, ['_issues'])).join('')); Pop.bind(t.mark) } }
        if (t.sel) {
          const gs = chosen(t.sel).filter((x) => has(x, '_issues'))
          if (gs.length && !t.selMark) { t.selMark = warn(); t.sel.after(t.selMark); t.selMark._card = () => build(t.selMark, () => chosen(t.sel).filter((x) => has(x, '_issues')).map((x) => part(x, ['_issues'])).join('') || null); Pop.bind(t.selMark) }
          if (t.selMark) t.selMark.hidden = !gs.length
        }
      }
      for (const f of recordSyncs) f()
      done()
    }, 60) })
  }
  return { init, refresh, records, SITE }
})()

/* Wait: the activity monitor. service.js reports its pending requests here; the page's body gets the "busy" class while
   any are pending (panes.css dims the controls and shows the hourglass), released 150 ms after the last answer so that a
   chain of requests reads as one wait. A pane tells its host (or the window that opened it) too, so the host waits with
   its panes; the host counts every pane that is busy. */
window.Wait = (() => {
  const busy = new Set(); let timer = null, late = null
  // a short request (a point read, a selection) must not flicker the controls: the page dims only when the wait lasts
  // longer than 400 ms (Milko, 2026-11-14)
  const sync = () => {
    clearTimeout(timer)
    if (busy.size) { if (!late && !document.body.classList.contains('busy')) late = setTimeout(() => { late = null; if (busy.size) document.body.classList.add('busy') }, 400) }
    else { clearTimeout(late); late = null; timer = setTimeout(() => document.body.classList.remove('busy'), 150) }
  }
  function set(who, on) {
    if (on) busy.add(who); else busy.delete(who); sync()
    if (who !== 'self') return
    for (const w of [window.parent !== window && window.parent, window.opener]) if (w) w.postMessage({ type: 'busy', busy: on }, '*')
  }
  window.addEventListener('message', (e) => { if (e.data?.type === 'busy') set(e.source, e.data.busy) })
  return { set }
})()

/* Store: the settings a pane remembers in the browser (localStorage, one entry per page). What is remembered is each
   page's list of state keys — never the species, country, unit or selections, which start empty (Milko, 2026-11-12);
   the restriction level is the portal's. Storage can be absent or blocked: every call is guarded. */
window.Store = {
  load(page, keys) { try { const o = JSON.parse(localStorage.getItem(`panes:${page}`)) || {}; return keys ? Object.fromEntries(Object.entries(o).filter(([k]) => keys.includes(k))) : o } catch { return {} } },
  save(page, state, keys, extra = {}) { try { localStorage.setItem(`panes:${page}`, JSON.stringify({ ...Object.fromEntries(keys.filter((k) => state[k] !== undefined).map((k) => [k, state[k]])), ...extra })) } catch {} },
}

// ---- the reference point flag (2026-11-25; first built 2026-11-24 as a comparison with the area's mean). A unit is flagged
// when any criterion in use is met: its reference point lies farther from its polygon than the distance threshold, or the
// climate at the point lies outside the minimum–maximum range found over the unit's area by more than the temperature or the
// precipitation threshold, on the selected climate source's reference period. The service gives the two excesses per dataset
// under `climate_excess`: { "<dataset key>": [°C, %] } (0 within the range). State: gcu_loc_climate_flag is the SET of the
// criteria in use (its elements are the three threshold terms); a criterion left out is off and keeps its number.
window.Flag = (() => {
  const SET = 'gcu_loc_climate_flag', D = SET + '_distance', T = SET + '_temperature', P = SET + '_precipitation', KEYS = [D, T, P]
  const DS = 'std_dataset_ids', DIST = 'gcu_loc_climate_distance', EX = 'climate_excess', OFF = 'ui_layout_label_off'
  const CHOICES = { [D]: [1, 2, 5, 10, 20, 50], [T]: [0.25, 0.5, 1, 2, 3, 5], [P]: [2, 5, 10, 20, 30, 50] }
  const TERMS = [SET, ...KEYS, OFF, DIST]
  const unit = (k) => Dict.unit(k) || { [D]: 'km', [T]: '°C', [P]: '%' }[k]
  const used = (state, k) => (Array.isArray(state[SET]) ? state[SET] : KEYS).includes(k)
  const getter = (u) => (typeof u === 'function' ? u : (k) => u[k])
  /** the criteria a unit meets, as texts ("12.0 km", "1.3 °C", "8 %"); `u` is a unit object or a property getter */
  function why(u, state) {
    const g = getter(u), ex = (g(EX) ?? {})[[].concat(state[DS] ?? [])[0]] ?? null, km = g(DIST), r = []
    if (used(state, D) && km != null && km > Number(state[D])) r.push(`${km.toFixed(1)} ${unit(D)}`)
    if (ex && used(state, T) && ex[0] > Number(state[T])) r.push(`${ex[0].toFixed(1)} ${unit(T)}`)
    if (ex && used(state, P) && ex[1] != null && ex[1] > Number(state[P])) r.push(`${Math.round(ex[1])} ${unit(P)}`)
    return r
  }
  const on = (u, state) => why(u, state).length > 0
  const text = (u, state) => why(u, state).join(' · ')
  const rule = (state) => KEYS.filter((k) => used(state, k)).map((k) => `${Dict.title(k)} > ${state[k]} ${unit(k)}`).join(' · ') || Dict.title(OFF)
  /** set every [data-flag] selector from the state */
  function sync(state) { for (const el of document.querySelectorAll('select[data-flag]')) { const k = el.dataset.flag; el.value = used(state, k) && state[k] != null ? String(state[k]) : 'off' } }
  /** fill the [data-flag] selectors (the offered values and Off) and bind them: a value sets the threshold and puts the
   *  criterion in the set, Off takes it out and keeps the number. `getState` returns the page's state object. */
  function bind(getState, onChange) {
    for (const el of document.querySelectorAll('select[data-flag]')) {
      const k = el.dataset.flag; el.innerHTML = ''
      for (const v of CHOICES[k]) el.add(new Option(`${v} ${unit(k)}`, String(v)))
      const off = new Option(Dict.title(OFF), 'off'); off.title = Dict.def(OFF); el.add(off)
      el.title = Dict.def(k)
      el.addEventListener('change', () => {
        const state = getState(), set = new Set(Array.isArray(state[SET]) ? state[SET] : KEYS)
        if (el.value === 'off') set.delete(k); else { state[k] = Number(el.value); set.add(k) }
        state[SET] = KEYS.filter((x) => set.has(x)); onChange()
      })
    }
    sync(getState())
  }
  return { SET, D, T, P, KEYS, DS, DIST, EX, TERMS, used, why, on, text, rule, sync, bind }
})()
