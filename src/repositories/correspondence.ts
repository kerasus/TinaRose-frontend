import BaseAPI, { type ListType } from './BaseAPI'
import type { AxiosResponse } from 'axios'
import { UserRolesType } from 'src/repositories/user'

export type CorrespondenceStatus = 'draft' | 'sent' | 'cancelled'
export type CorrespondencePriority = 'low' | 'normal' | 'high' | 'urgent'
export type CorrespondenceConfidentiality = 'internal' | 'confidential'
export type RecipientType = 'to' | 'cc'
export type AssignmentStatus = 'pending' | 'in_progress' | 'completed' | 'rejected' | 'cancelled'
export type CorrespondenceEventType = 'sent' | 'read' | 'assigned' | 'started' | 'replied' | 'completed' | 'rejected' | 'cancelled' | 'closed'

export type CorrespondenceUser = {
  id: number
  firstname?: string | null
  lastname?: string | null
  employee_code?: string | null
  username?: string | null
  roles_list?: UserRolesType[]
  email?: string | null
  mobile?: string | null
}

export type CorrespondenceRecipient = {
  id: number
  user_id: number
  type: RecipientType
  due_at?: string | null
  read_at: string | null
  archived_at: string | null
  user?: CorrespondenceUser | null
  correspondence?: Correspondence
}

export type CorrespondenceAssignment = {
  id: number
  correspondence_id: number
  parent_assignment_id: number | null
  assigned_by_id: number
  assigned_to_id: number
  note: string | null
  status: AssignmentStatus
  due_at: string | null
  read_at: string | null
  started_at: string | null
  resolved_at: string | null
  resolution_note: string | null
  archived_at: string | null
  created_at: string | null
  updated_at: string | null
  assigned_by?: CorrespondenceUser | null
  assigned_to?: CorrespondenceUser | null
  parent_assignment?: CorrespondenceAssignment | null
  children?: CorrespondenceAssignment[]
  correspondence?: Correspondence
}

export type CorrespondenceAttachment = {
  id: number
  correspondence_id: number
  uploaded_by_id: number
  original_name: string
  mime_type: string | null
  size_bytes: number
  created_at: string | null
  path?: string | null
  uploaded_by?: CorrespondenceUser | null
}

export type CorrespondenceEvent = {
  id: number
  correspondence_id: number
  assignment_id: number | null
  actor_id: number
  event_type: CorrespondenceEventType
  metadata: Record<string, any> | null
  created_at: string | null
  actor?: CorrespondenceUser | null
}

export type Correspondence = {
  id: number | null
  reference_number: string | null
  sender_id: number | null
  thread_root_id: number | null
  reply_to_id: number | null
  subject: string | null
  body: string | null
  status: CorrespondenceStatus | null
  priority: CorrespondencePriority | null
  confidentiality: CorrespondenceConfidentiality | null
  due_at: string | null
  sent_at: string | null
  closed_at: string | null
  created_at: string | null
  updated_at: string | null
  sender?: CorrespondenceUser | null
  reply_to?: Correspondence | null
  recipients?: CorrespondenceRecipient[]
  assignments?: CorrespondenceAssignment[]
  attachments?: CorrespondenceAttachment[]
  events?: CorrespondenceEvent[]
}

export type CorrespondenceRecipientInput = {
  user_id: number
  type?: RecipientType
  due_at?: string | null
}

export type StoreCorrespondencePayload = {
  subject: string
  body?: string | null
  priority?: CorrespondencePriority
  confidentiality?: CorrespondenceConfidentiality
  due_at?: string | null
  thread_root_id?: number | null
  reply_to_id?: number | null
  recipients?: CorrespondenceRecipientInput[]
  to?: number[]
  cc?: number[]
}

export type AddRecipientsPayload = {
  recipients: CorrespondenceRecipientInput[]
}

export type CreateChildAssignmentPayload = {
  assigned_to_id: number
  note?: string | null
  due_at?: string | null
}

export type ResolveAssignmentPayload = {
  resolution_note?: string | null
}

export const assignmentStatusOptions: {label: string, value: AssignmentStatus}[] = [
  { label: 'در انتظار', value: 'pending' },
  { label: 'در انجام', value: 'in_progress' },
  { label: 'انجام‌شده', value: 'completed' },
  { label: 'ردشده', value: 'rejected' },
  { label: 'لغوشده', value: 'cancelled' }
]

export function getCorrespondenceStatusLabel (status: CorrespondenceStatus | string | null): string {
  const map: Record<string, string> = {
    draft: 'پیش‌نویس',
    sent: 'ارسال‌شده',
    cancelled: 'لغوشده'
  }
  return status ? (map[status] ?? status) : '-'
}

export function getCorrespondencePriorityLabel (priority: CorrespondencePriority | string | null): string {
  const map: Record<string, string> = {
    low: 'کم',
    normal: 'معمولی',
    high: 'زیاد',
    urgent: 'فوری'
  }
  return priority ? (map[priority] ?? priority) : '-'
}

export function getCorrespondenceConfidentialityLabel (c: CorrespondenceConfidentiality | string | null): string {
  const map: Record<string, string> = {
    internal: 'داخلی',
    confidential: 'محرمانه'
  }
  return c ? (map[c] ?? c) : '-'
}

export function getAssignmentStatusLabel (status: AssignmentStatus | string | null): string {
  const target = assignmentStatusOptions.find((i) => i.value === status)
  if (target) {
    return target.label
  }
  return '-'
}

export function getRecipientTypeLabel (type: RecipientType | string | null): string {
  const map: Record<string, string> = { to: 'گیرنده اصلی', cc: 'رونوشت' }
  return type ? (map[type] ?? type) : '-'
}

export function getCorrespondenceEventTypeLabel (eventType: CorrespondenceEventType | string | null): string {
  const map: Record<string, string> = {
    sent: 'ارسال',
    read: 'مطالعه',
    assigned: 'ارجاع',
    started: 'شروع',
    replied: 'پاسخ',
    completed: 'انجام',
    rejected: 'رد',
    cancelled: 'لغو',
    closed: 'بستن'
  }
  return eventType ? (map[eventType] ?? eventType) : '-'
}

function unwrap<T> (response: AxiosResponse<any>): T {
  const body = response.data
  if (body && typeof body === 'object' && 'data' in body && !Array.isArray(body.data) && !('current_page' in body)) {
    return body.data as T
  }
  return body as T
}

export default class CorrespondenceAPI extends BaseAPI<Correspondence> {
  constructor () {
    super('/correspondences')
    this.defaultObject = {
      id: null,
      reference_number: null,
      sender_id: null,
      thread_root_id: null,
      reply_to_id: null,
      subject: null,
      body: null,
      status: null,
      priority: null,
      confidentiality: null,
      due_at: null,
      sent_at: null,
      closed_at: null,
      created_at: null,
      updated_at: null
    }
    this.endpoints = {
      ...this.endpoints,
      inbox: `${this.baseEndpoint}/inbox`,
      assignments: `${this.baseEndpoint}/assignments`,
      send: (id: number) => `${this.baseEndpoint}/${id}/send`,
      attach: (id: number) => `${this.baseEndpoint}/${id}/attachments`,
      addRecipients: (id: number) => `${this.baseEndpoint}/${id}/recipients`,
      assignmentChildren: (assignmentId: number) => `${this.baseEndpoint}/assignments/${assignmentId}/children`,
      assignmentStart: (assignmentId: number) => `${this.baseEndpoint}/assignments/${assignmentId}/start`,
      assignmentComplete: (assignmentId: number) => `${this.baseEndpoint}/assignments/${assignmentId}/complete`,
      assignmentReject: (assignmentId: number) => `${this.baseEndpoint}/assignments/${assignmentId}/reject`
    }
  }

  async createDraft (data: StoreCorrespondencePayload): Promise<Correspondence> {
    const response = await this.getAxiosInstanceWithToken().post(this.endpoints.base, data)
    return unwrap<Correspondence>(response)
  }

  override async get (id: number, _useCache = true, _ttl = 1000): Promise<Correspondence> {
    const response = await this.getAxiosInstanceWithToken().get(this.endpoints.byId(id))
    const data = unwrap<Correspondence>(response)
    return this.getNormalizedItem(this.normalize(data, this.defaultObject))
  }

  async send (id: number): Promise<Correspondence> {
    const response = await this.getAxiosInstanceWithToken().post(this.endpoints.send(id))
    return unwrap<Correspondence>(response)
  }

  async attach (id: number, file: File): Promise<CorrespondenceAttachment> {
    const form = new FormData()
    form.append('file', file)
    const response = await this.getAxiosInstanceWithToken().post(this.endpoints.attach(id), form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data as CorrespondenceAttachment
  }

  async addRecipients (id: number, payload: AddRecipientsPayload): Promise<Correspondence> {
    const response = await this.getAxiosInstanceWithToken().post(this.endpoints.addRecipients(id), payload)
    return unwrap<Correspondence>(response)
  }

  async inbox (filters: any = {}): Promise<ListType<CorrespondenceRecipient>> {
    const response = await this.getAxiosInstanceWithToken().get(this.endpoints.inbox, { params: filters })
    return response.data as ListType<CorrespondenceRecipient>
  }

  async assignmentsInbox (filters: any = {}): Promise<ListType<CorrespondenceAssignment>> {
    const response = await this.getAxiosInstanceWithToken().get(this.endpoints.assignments, { params: filters })
    return response.data as ListType<CorrespondenceAssignment>
  }

  async createChildAssignment (assignmentId: number, payload: CreateChildAssignmentPayload): Promise<CorrespondenceAssignment> {
    const response = await this.getAxiosInstanceWithToken().post(this.endpoints.assignmentChildren(assignmentId), payload)
    return unwrap<CorrespondenceAssignment>(response)
  }

  async startAssignment (assignmentId: number): Promise<CorrespondenceAssignment> {
    const response = await this.getAxiosInstanceWithToken().post(this.endpoints.assignmentStart(assignmentId))
    return unwrap<CorrespondenceAssignment>(response)
  }

  async completeAssignment (assignmentId: number, payload: ResolveAssignmentPayload = {}): Promise<CorrespondenceAssignment> {
    const response = await this.getAxiosInstanceWithToken().post(this.endpoints.assignmentComplete(assignmentId), payload)
    return unwrap<CorrespondenceAssignment>(response)
  }

  async rejectAssignment (assignmentId: number, payload: ResolveAssignmentPayload = {}): Promise<CorrespondenceAssignment> {
    const response = await this.getAxiosInstanceWithToken().post(this.endpoints.assignmentReject(assignmentId), payload)
    return unwrap<CorrespondenceAssignment>(response)
  }
}
