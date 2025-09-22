export interface NotificationSubscription {
  id: string
  subscriptionName?: string
  webhookUrl: string
  statusesToFollow: string[]
  districtsToFollow: string[]
  isActive: boolean
  createdAt: string
  createdBy?: string
  createdByEmail?: string
  allDistricts?: boolean
}

export interface FormData {
  subscriptionName: string
  webhookURL: string
  statusesToFollow: string[]
  districtsToFollow: string
  allDistricts: boolean
}

export interface UseSubscriptionsReturn {
  authenticated: boolean
  userInfo: any
  subscriptions: NotificationSubscription[]
  hasExistingSubscription: boolean
  loading: boolean
  actionLoading: string | null
  message: { type: 'success' | 'error' | 'info', text: string } | null
  editingSubscription: NotificationSubscription | null
  isEditing: boolean

  setMessage: (message: { type: 'success' | 'error' | 'info', text: string } | null) => void
  startEditSubscription: (subscription: NotificationSubscription) => void
  cancelEdit: () => void
  createSubscription: (formData: FormData) => Promise<void>
  updateSubscription: (formData: FormData) => Promise<void>
  toggleSubscription: (id: string, active: boolean) => Promise<void>
  deleteSubscription: (id: string) => Promise<void>
}

export interface SubscriptionFormProps {
  formData: FormData
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
  onSubmit: (e: React.FormEvent) => Promise<void>
  loading: boolean
  isEditing: boolean
  onCancel?: () => void
  isFormValid: boolean
  formErrors: Record<string, string>
}

export interface SubscriptionTableProps {
  subscriptions: NotificationSubscription[]
  onEdit: (subscription: NotificationSubscription) => void
  onDelete: (id: string) => Promise<void>
  onToggle: (id: string, active: boolean) => Promise<void>
  actionLoading: string | null
}
