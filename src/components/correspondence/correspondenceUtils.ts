import { useDate } from 'src/composables/Date'
import {
  getAssignmentStatusLabel,
  type CorrespondenceAssignment,
  type CorrespondenceUser
} from 'src/repositories/correspondence'

const dateManager = useDate()

export function formatDateTime (v: string | null | undefined): string {
  if (!v) return '-'
  const normalized = String(v).replace(' ', 'T')
  const formats = ['YYYY-MM-DDTHH:mm:ssZ', 'YYYY-MM-DDTHH:mm:ss.SSSSSSZ', 'YYYY-MM-DDTHH:mm:ss', 'YYYY-MM-DD']
  for (const f of formats) {
    try {
      const out = dateManager.miladiToShamsi(normalized, f, 'HH:mm jYYYY/jMM/jDD')
      if (out) return out
    } catch {
      // ادامه
    }
  }
  return String(v)
}

export function formatBytes (bytes: number | null | undefined): string {
  if (!bytes) return '0 بایت'
  const k = 1024
  const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function userInitial (user?: CorrespondenceUser | null): string {
  if (!user) return '؟'
  return (user.firstname?.[0] || user.username?.[0] || 'ک').toUpperCase()
}

export function userLabel (user?: CorrespondenceUser | null, id?: number | null): string {
  if (user) {
    const name = [user.firstname, user.lastname].filter(Boolean).join(' ').trim()
    const code = user.employee_code ? ` (${user.employee_code})` : ''
    return (name || user.username || `کاربر #${user.id}`) + code
  }
  return id ? `کاربر #${id}` : '-'
}

export function assignmentStatusLabel (v: any): string {
  return getAssignmentStatusLabel(v)
}

export function assignmentBadgeColor (status: string | undefined): string {
  switch (status) {
    case 'completed': return 'positive'
    case 'in_progress': return 'primary'
    case 'rejected': return 'negative'
    default: return 'warning'
  }
}

export function isMyAssignment (a: CorrespondenceAssignment, userId?: number | null): boolean {
  if (!userId) return false
  return a.assigned_to_id.toString() === userId.toString()
}

export function childrenOf (allAssignments: CorrespondenceAssignment[], id: number): CorrespondenceAssignment[] {
  return allAssignments.filter((a) => a.parent_assignment_id === id)
}