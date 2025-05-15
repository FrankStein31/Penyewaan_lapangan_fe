// src/app/User/payments/page.js
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getUserPayments } from '@/services/api'
import Sidebar from '@/components/user/Sidebar' // Changed from admin to user
import Topbar from '@/components/user/Topbar'   // Changed from admin to user
import { formatDate, formatCurrency } from '@/lib/utils'
import PaymentStatusBadge from '@/components/user/PaymentStatusBadge'
import SkeletonLoader from '@/components/common/SkeletonLoader'
import EmptyState from '@/components/common/EmptyState'
import ErrorMessage from '@/components/common/ErrorMessage'

export default function PaymentsPage() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0) // For refresh functionality

  useEffect(() => {x  
    const fetchPayments = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getUserPayments()
        setPayments(data)
      } catch (err) {
        console.error('Failed to fetch payments:', err)
        setError('Gagal memuat data pembayaran. Silakan coba lagi.')
      } finally {
        setLoading(false)
      }
    }

    fetchPayments()
  }, [refreshKey])

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Riwayat Pembayaran</h1>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 text-blue-600 transition-colors rounded-md bg-blue-50 hover:bg-blue-100"
              disabled={loading}
            >
              {loading ? 'Memuat...' : 'Refresh'}
            </button>
          </div>

          {error && (
            <ErrorMessage
              message={error}
              onRetry={() => setRefreshKey(prev => prev + 1)}
            />
          )}

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <SkeletonLoader key={i} className="h-24" />
              ))}
            </div>
          ) : payments.length === 0 ? (
            <EmptyState
              title="Tidak Ada Pembayaran"
              description="Anda belum memiliki riwayat pembayaran."
              icon="💰"
            />
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <PaymentCard key={payment.id} payment={payment} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

const PaymentCard = ({ payment }) => (
  <Link
    href={`/User/payments/${payment.id}`}
    className="block p-6 transition-shadow bg-white border rounded-lg shadow-sm hover:shadow-md"
  >
    <div className="flex items-start justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          {payment.invoice_number || `Pembayaran #${payment.id}`}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {formatDate(payment.date)}
        </p>
      </div>
      <PaymentStatusBadge status={payment.status} />
    </div>

    <div className="flex items-center justify-between mt-4">
      <p className="text-xl font-bold text-gray-900">
        {formatCurrency(payment.total)}
      </p>
      {payment.booking_id && (
        <span className="text-sm text-gray-500">
          Booking #{payment.booking_id}
        </span>
      )}
    </div>
  </Link>
)