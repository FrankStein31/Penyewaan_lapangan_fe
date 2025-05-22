'use client'

import { useEffect, useState } from 'react'
import { getUserProfile, updateUserProfile, updateUserPhoto } from '@/services/api'
import Image from 'next/image'

export default function ProfilePage() {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [updating, setUpdating] = useState(false)
    const [uploading, setUploading] = useState(false)

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

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setSelectedFile(file)
            setPreviewUrl(URL.createObjectURL(file))
        }
    }

    const handleUpload = async () => {
        if (!selectedFile) return
        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('photo', selectedFile)
            await updateUserPhoto(formData)
            setModalOpen(false)
            location.reload()
        } catch (error) {
            console.error('Gagal mengupload foto:', error)
        } finally {
            setUploading(false)
        }
    }

    const handleProfileUpdate = async (e) => {
        e.preventDefault()
        setUpdating(true)
        try {
            await updateUserProfile(profile)
            // Show success message or refresh data
        } catch (error) {
            console.error('Gagal memperbarui profil:', error)
        } finally {
            setUpdating(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 border-2 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                    <p className="text-gray-600">Memuat data profil...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="max-w-4xl p-6 mx-auto">
                {/* Header Section */}
                <div className="relative mb-8">
                    <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl"></div>
                    <div className="absolute -bottom-16 left-8">
                        <div className="relative">
                            <Image
                                src={profile.photoUrl || '/profile.jpg'}
                                alt="Foto Profil"
                                width={120}
                                height={120}
                                className="object-cover border-4 border-white rounded-full shadow-lg"
                            />
                            <button
                                onClick={() => setModalOpen(true)}
                                className="absolute flex items-center justify-center w-10 h-10 text-white transition-colors bg-blue-600 rounded-full shadow-lg bottom-2 right-2 hover:bg-blue-700"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Profile Info Section */}
                <div className="pt-16 mb-8">
                    <div className="p-8 bg-white border border-gray-100 shadow-lg rounded-2xl">
                        <div className="flex flex-col mb-6 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="mb-2 text-3xl font-bold text-gray-900">{profile.name}</h1>
                                <div className="flex items-center space-x-3">
                                    <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                                        {profile.type}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="flex items-center p-4 space-x-3 bg-gray-50 rounded-xl">
                                <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Nomor Telepon</p>
                                    <p className="font-semibold text-gray-900">{profile.phone}</p>
                                </div>
                            </div>

                            <div className="flex items-center p-4 space-x-3 bg-gray-50 rounded-xl">
                                <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
                                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-semibold text-gray-900">{profile.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Profile Form */}
                <div className="bg-white border border-gray-100 shadow-lg rounded-2xl">
                    <div className="p-8">
                        <div className="flex items-center mb-6 space-x-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-full">
                                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Perbarui Informasi Pribadi</h2>
                        </div>

                        <form onSubmit={handleProfileUpdate} className="space-y-6">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">Nama Lengkap</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={profile.name}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">Nomor HP</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={profile.phone}
                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={profile.email}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={updating}
                                className="flex items-center justify-center w-full px-8 py-3 space-x-2 font-medium text-white transition-all md:w-auto bg-gradient-to-r from-green-600 to-green-700 rounded-xl hover:from-green-700 hover:to-green-800 focus:ring-4 focus:ring-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {updating ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                                        <span>Menyimpan...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Simpan Perubahan</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Photo Upload Modal */}
                {modalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                        <div className="w-full max-w-md mx-4">
                            <div className="overflow-hidden bg-white shadow-2xl rounded-2xl">
                                <div className="p-6 border-b border-gray-200">
                                    <h3 className="text-xl font-bold text-gray-900">Upload Foto Profil</h3>
                                    <p className="mt-1 text-sm text-gray-500">Pilih foto terbaik untuk profil Anda</p>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div className="p-6 text-center transition-colors border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-400">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="file-upload"
                                        />
                                        <label htmlFor="file-upload" className="cursor-pointer">
                                            <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            <p className="text-gray-600">Klik untuk memilih foto</p>
                                            <p className="mt-1 text-sm text-gray-400">PNG, JPG hingga 10MB</p>
                                        </label>
                                    </div>

                                    {previewUrl && (
                                        <div className="flex justify-center">
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                className="object-cover w-32 h-32 border-4 border-gray-200 rounded-full shadow-md"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end p-6 space-x-3 border-t border-gray-200">
                                    <button
                                        onClick={() => setModalOpen(false)}
                                        className="px-6 py-2 text-gray-700 transition-colors bg-gray-100 rounded-xl hover:bg-gray-200"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={handleUpload}
                                        disabled={!selectedFile || uploading}
                                        className="flex items-center px-6 py-2 space-x-2 text-white transition-all bg-blue-600 rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {uploading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                                                <span>Uploading...</span>
                                            </>
                                        ) : (
                                            <span>Simpan Foto</span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}