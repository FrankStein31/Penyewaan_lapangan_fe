'use client'

import { useEffect, useState } from 'react'
import { getUserProfile } from '@/services/api'

export default function ProfilePage() {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchProfile() {
            try {
                const data = await getUserProfile()
                setProfile(data)
            } catch (error) {
                console.error('Gagal memuat profil pengguna:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [])

    if (loading) return <p className="p-4">Memuat data profil...</p>

    return (
        <div className="max-w-2xl p-6 mx-auto">
            <h1 className="mb-6 text-3xl font-bold">Profil Saya</h1>

            <div className="p-6 space-y-4 bg-white rounded-lg shadow-md">
                <div>
                    <label className="block text-sm text-gray-500">Nama Lengkap</label>
                    <p className="text-lg font-medium">{profile.name}</p>
                </div>

                <div>
                    <label className="block text-sm text-gray-500">Email</label>
                    <p className="text-lg font-medium">{profile.email}</p>
                </div>

                <div>
                    <label className="block text-sm text-gray-500">Nomor HP</label>
                    <p className="text-lg font-medium">{profile.phone}</p>
                </div>

                <div>
                    <label className="block text-sm text-gray-500">Alamat</label>
                    <p className="text-lg font-medium">{profile.address}</p>
                </div>

                <button className="px-4 py-2 mt-6 text-white bg-blue-600 rounded hover:bg-blue-700">
                    Edit Profil
                </button>
            </div>
        </div>
    )
}
