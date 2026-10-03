// Minimal IndexedDB storage for offline driver work:
//   kv     — cached API responses (my trips, trip details)
//   outbox — actions recorded on the device, waiting to be sent
// Falls back to memory when IndexedDB is unavailable (private mode), so the app still works online.

const DB_NAME = 'wayflow-offline'
const VERSION = 1
const memory = { kv: new Map(), outbox: new Map() }
let dbPromise = null

function open() {
  if (typeof indexedDB === 'undefined') return Promise.resolve(null)
  if (!dbPromise) {
    dbPromise = new Promise((resolve) => {
      const req = indexedDB.open(DB_NAME, VERSION)
      req.onupgradeneeded = () => {
        const db = req.result
        if (!db.objectStoreNames.contains('kv')) db.createObjectStore('kv')
        if (!db.objectStoreNames.contains('outbox')) db.createObjectStore('outbox', { keyPath: 'id' })
      }
      req.onsuccess = () => resolve(req.result)
      req.onerror = () => resolve(null)
    })
  }
  return dbPromise
}

async function run(store, mode, fn) {
  const db = await open()
  if (!db) return fn(null)
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, mode)
    const result = fn(tx.objectStore(store))
    tx.oncomplete = () => resolve(result?.result ?? result)
    tx.onerror = () => reject(tx.error)
  })
}

export async function kvGet(key) {
  try {
    const value = await run('kv', 'readonly', (s) => (s ? s.get(key) : memory.kv.get(key)))
    return value ?? null
  } catch {
    return memory.kv.get(key) ?? null
  }
}

export async function kvSet(key, value) {
  try {
    await run('kv', 'readwrite', (s) => (s ? s.put(value, key) : memory.kv.set(key, value)))
  } catch {
    memory.kv.set(key, value)
  }
}

export async function outboxAll() {
  try {
    const rows = await run('outbox', 'readonly', (s) => (s ? s.getAll() : [...memory.outbox.values()]))
    return [...(rows || [])].sort((a, b) => a.seq - b.seq)
  } catch {
    return [...memory.outbox.values()].sort((a, b) => a.seq - b.seq)
  }
}

export async function outboxPut(event) {
  try {
    await run('outbox', 'readwrite', (s) => (s ? s.put(event) : memory.outbox.set(event.id, event)))
  } catch {
    memory.outbox.set(event.id, event)
  }
}

export async function outboxDelete(id) {
  try {
    await run('outbox', 'readwrite', (s) => (s ? s.delete(id) : memory.outbox.delete(id)))
  } catch {
    memory.outbox.delete(id)
  }
}
