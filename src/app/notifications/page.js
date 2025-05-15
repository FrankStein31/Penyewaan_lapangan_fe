// src/app/User/notifications/page.js
'use client'

import { useEffect, useState } from 'react'
import { getUserNotifications } from '@/services/api'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const data = await getUserNotifications()
        setNotifications(data)
      } catch (error) {
        console.error('Gagal memuat notifikasi:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  if (loading) return <p>Memuat notifikasi...</p>

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Notifikasi</h1>
      {notifications.length === 0 ? (
        <p>Tidak ada notifikasi saat ini.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notif) => (
            <li key={notif.id} className="p-4 border rounded shadow bg-gray-50">
              <p>{notif.message}</p>
              <p className="text-sm text-gray-500">{new Date(notif.timestamp).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
