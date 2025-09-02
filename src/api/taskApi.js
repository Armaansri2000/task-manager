const TASKS_KEY = 'tm_tasks'
const NEXT_ID_KEY = 'tm_nextTaskId'

const read = () => JSON.parse(localStorage.getItem(TASKS_KEY) || '[]')
const write = (arr) => localStorage.setItem(TASKS_KEY, JSON.stringify(arr))

const sortDesc = (arr) => {
  // newest first by createdAt, fallback to id desc
  return [...arr].sort((a, b) => {
    const at = a.createdAt ? new Date(a.createdAt).getTime() : 0
    const bt = b.createdAt ? new Date(b.createdAt).getTime() : 0
    if (bt !== at) return bt - at
    return (b.id || 0) - (a.id || 0)
  })
}

export async function listTasks(page=1, pageSize=6){
  const all = sortDesc(read())
  const start = (page-1)*pageSize
  const items = all.slice(start, start+pageSize)
  return { items, total: all.length }
}

export async function createTask(payload){
  const next = parseInt(localStorage.getItem(NEXT_ID_KEY) || '1', 10)
  const now = new Date().toISOString()
  const task = {
    id: next,
    title: payload.title,
    description: payload.description || '',
    status: payload.status || 'todo',
    priority: payload.priority || 'medium',
    assigneeId: payload.assigneeId || null,
    createdBy: payload.createdBy,
    createdAt: now,
    updatedAt: now
  }
  const all = read()
  const nextArr = [task, ...all] // ✅ put newest first
  write(nextArr)
  localStorage.setItem(NEXT_ID_KEY, String(next + 1))
  return task
}

export async function updateTask(id, patch){
  const all = read()
  const idx = all.findIndex(t=>t.id===id)
  if(idx===-1) throw new Error('Task not found')
  const now = new Date().toISOString()
  all[idx] = { ...all[idx], ...patch, id, updatedAt: now }
  // keep order: if updatedAt changes, re-sort
  const sorted = sortDesc(all)
  write(sorted)
  return sorted.find(t=>t.id===id)
}

export async function deleteTask(id){
  const all = read()
  const next = all.filter(t=>t.id!==id)
  write(next)
  return { ok:true }
}
