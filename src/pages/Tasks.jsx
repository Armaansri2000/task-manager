import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../features/auth/authSlice'
import * as taskApi from '../api/taskApi.js'
import * as userApi from '../api/userApi.js'
import Pagination from '../components/Pagination.jsx'

const PAGE_SIZE = 6

const can = {
  manageUsers: (role) => role === 'admin',
  createTask: (role) => role === 'admin' || role === 'manager',
  deleteTask: (role, task, userId) => role === 'admin' || (role === 'manager' && task.createdBy === userId),
  updateTask: (role, task, userId) => role === 'admin' || role === 'manager' || task.assigneeId === userId,
  assignTask: (role) => role === 'admin' || role === 'manager',
}

function formatDate(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString()
  } catch {
    return iso
  }
}

function TaskForm({ users, currentUser, onSave, initial }) {
  const [title, setTitle] = useState(initial?.title || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [status, setStatus] = useState(initial?.status || 'todo')
  const [dueDate, setDueDate] = useState(initial?.dueDate ? initial.dueDate.slice(0, 10) : '')
  const [assigneeId, setAssigneeId] = useState(initial?.assigneeId ?? '')

  const onSubmit = (e) => {
    e.preventDefault()
    const payload = initial
      ? {
          ...initial,
          title,
          description,
          status,
          dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
          assigneeId: assigneeId ? Number(assigneeId) : null,
        }
      : {
          title,
          description,
          status,
          dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
          assigneeId: assigneeId ? Number(assigneeId) : null,
          createdBy: currentUser.id,
        }
    onSave(payload)
  }

  return (
    <form className="vstack gap-3" onSubmit={onSubmit}>
      <div className="vstack">
        <label htmlFor="tt">Title</label>
        <input id="tt" className="input" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="vstack">
        <label htmlFor="td">Description</label>
        <textarea id="td" className="input" rows="2" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="grid grid-3">
        <div className="vstack">
          <label>Status</label>
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div className="vstack">
          <label>Due date</label>
          <input type="date" className="input" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
        <div className="vstack">
          <label>Assignee</label>
          <select className="input" value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role})
              </option>
            ))}
          </select>
        </div>
      </div>
      <button className="btn primary" type="submit">
        {initial ? 'Update' : 'Create'}
      </button>
    </form>
  )
}

export default function Tasks() {
  const user = useSelector(selectUser)
  const [users, setUsers] = useState([])
  const [tasks, setTasks] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showNew, setShowNew] = useState(false)
  const [editing, setEditing] = useState(null)

  const load = async (p = page) => {
    try {
      setLoading(true)
      setError(null)
      const [us, list] = await Promise.all([userApi.listUsers(), taskApi.listTasks(p, PAGE_SIZE)])
      setUsers(us)
      setTasks(list.items)
      setTotal(list.total)
      setPage(p)
    } catch (e) {
      setError(e.message || 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    load(1)
  }, [])

  const onCreate = async (payload) => {
    try {
      await taskApi.createTask(payload)
      setShowNew(false) // close after create
      await load(1)
    } catch (e) {
      alert(e.message || 'Create failed')
    }
  }

  const onUpdate = async (patch) => {
    try {
      if (!editing) return
      await taskApi.updateTask(editing.id, patch)
      setEditing(null)
      await load(page)
    } catch (e) {
      alert(e.message || 'Update failed')
    }
  }

  const onDelete = async (t) => {
    if (!can.deleteTask(user.role, t, user.id)) return
    if (!confirm('Delete task?')) return
    try {
      await taskApi.deleteTask(t.id)
      await load(page)
    } catch (e) {
      alert(e.message || 'Delete failed')
    }
  }

  const nameById = useMemo(() => Object.fromEntries(users.map((u) => [u.id, u.name])), [users])

  return (
    <div className="container vstack gap-4" style={{ marginTop: '1rem' }}>
      <div className="hstack" style={{ justifyContent: 'space-between' }}>
        <div>
          <h2>Tasks</h2>
          <div className="small">Create, assign, update, delete</div>
        </div>
        {can.createTask(user.role) && (
          <button className="btn primary" onClick={() => setShowNew((v) => !v)}>
            New Task
          </button>
        )}
      </div>

      {/* ✅ Centered Modal Style New Task Form */}
      {showNew && (
        <div className="overlay">
          <div className="card new-task-card">
            <div className="card-head hstack" style={{ justifyContent: 'space-between' }}>
              <h3>New Task</h3>
              <button
                type="button"
                className="btn outline"
                onClick={() => setShowNew(false)}
                style={{ padding: '.2rem .5rem' }}
              >
                Close
              </button>
            </div>
            <div className="card-body">
              <TaskForm users={users} currentUser={user} onSave={onCreate} />
            </div>
          </div>
        </div>
      )}

      {editing && (
        <div className="card">
          <div className="card-head">
            <h3>Edit Task</h3>
          </div>
          <div className="card-body">
            <TaskForm users={users} currentUser={user} onSave={onUpdate} initial={editing} />
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-head">
          <h3>Task List</h3>
          <p className="small">Manage tasks with RBAC.</p>
        </div>
        <div className="card-body">
          {loading ? (
            'Loading…'
          ) : error ? (
            <div style={{ color: 'var(--danger)' }}>{error}</div>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Assignee</th>
                      <th>Due</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((t) => {
                      const mayEdit = can.updateTask(user.role, t, user.id)
                      const mayDelete = can.deleteTask(user.role, t, user.id)
                      return (
                        <tr key={t.id}>
                          <td>
                            <div style={{ fontWeight: 600 }}>{t.title}</div>
                            {t.description && <div className="small">{t.description}</div>}
                          </td>
                          <td>
                            <span className={`status ${t.status}`}>{t.status.replace('_', ' ')}</span>
                          </td>
                          <td>
                            {t.assigneeId ? nameById[t.assigneeId] : <span className="small">Unassigned</span>}
                          </td>
                          <td>{formatDate(t.dueDate)}</td>
                          <td>
                            <div className="hstack gap-2">
                              {mayEdit && (
                                <button className="btn outline" onClick={() => setEditing(t)}>
                                  Edit
                                </button>
                              )}
                              {mayDelete && (
                                <button className="btn danger" onClick={() => onDelete(t)}>
                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <Pagination page={page} total={total} pageSize={PAGE_SIZE} onPage={(p) => load(p)} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
