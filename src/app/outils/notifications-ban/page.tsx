// app/notifications-ban/page.tsx
import Loader from '@/components/Loader'
import dynamic from 'next/dynamic'

const DynamicNotificationsBAN = dynamic(
  () => import('../../../components/NotificationsBAN/NotificationsBAN'),
  {
    ssr: false,
    loading: () => (
      <div style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        height: '400px',
        alignItems: 'center',
      }}
      >
        <Loader size={50} />
      </div>
    ),
  }
)

export default function NotificationsBANPage() {
  return <DynamicNotificationsBAN />
}
