import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import {
    User, Mail, Shield, Calendar, LogOut,
    Settings, Wallet, BarChart3, TrendingUp
} from 'lucide-react'

const Profile = () => {
    const { user, logout } = useAuth()
    const [activeSection, setActiveSection] = useState('overview')

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: <User className="h-4 w-4" /> },
        { id: 'security', label: 'Security', icon: <Shield className="h-4 w-4" /> },
        { id: 'preferences', label: 'Preferences', icon: <Settings className="h-4 w-4" /> },
    ]

    const stats = [
        {
            label: 'Total Holdings',
            value: user?.holdings?.length || 0,
            icon: <Wallet className="h-5 w-5" />,
            color: 'bg-indigo-100 text-indigo-600'
        },
        {
            label: 'Account Type',
            value: user?.googleId ? 'Google' : 'Email',
            icon: <Shield className="h-5 w-5" />,
            color: 'bg-green-100 text-green-600'
        },
        {
            label: 'Member Since',
            value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A',
            icon: <Calendar className="h-5 w-5" />,
            color: 'bg-amber-100 text-amber-600'
        },
    ]

    return (
        <div className="page-enter space-y-6">
            {/* Profile Header */}
            <div className="card relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-white to-purple-50 pointer-events-none" />
                <div className="relative flex flex-col md:flex-row items-center gap-6 p-2">
                    <div className="relative">
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.name}
                                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-primary-100" />
                        ) : (
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center ring-4 ring-primary-100">
                                <span className="text-3xl font-bold text-white">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                            </div>
                        )}
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-2xl font-extrabold text-gray-900">{user?.name}</h1>
                        {user?.username && (
                            <p className="text-sm font-medium text-primary-600 mt-1 justify-center md:justify-start flex">@{user.username}</p>
                        )}
                        <p className="text-gray-500 flex items-center gap-2 justify-center md:justify-start mt-1">
                            <Mail className="h-4 w-4" /> {user?.email}
                        </p>
                        <div className="flex items-center gap-2 mt-3 justify-center md:justify-start">
                            <span className="badge badge-primary">
                                <TrendingUp className="h-3 w-3 mr-1" /> NEPSE Investor
                            </span>
                            {user?.googleId && <span className="badge badge-success">Google Verified</span>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map(stat => (
                    <div key={stat.label} className="card stat-card">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                    <div className="card p-2">
                        <nav className="space-y-1">
                            {menuItems.map(item => (
                                <button key={item.id} onClick={() => setActiveSection(item.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeSection === item.id
                                        ? 'bg-primary-50 text-primary-700'
                                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                        }`}>
                                    {item.icon} {item.label}
                                </button>
                            ))}
                            <button onClick={logout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all">
                                <LogOut className="h-4 w-4" /> Sign Out
                            </button>
                        </nav>
                    </div>
                </div>

                <div className="lg:col-span-3">
                    {activeSection === 'overview' && (
                        <div className="card space-y-6">
                            <h3 className="text-lg font-bold text-gray-900">Account Information</h3>
                            <div className="space-y-4">
                                {[
                                    { icon: <User className="h-4 w-4" />, label: 'Full Name', value: user?.name },
                                    { icon: <User className="h-4 w-4" />, label: 'Username', value: user?.username ? `@${user.username}` : 'N/A' },
                                    { icon: <Mail className="h-4 w-4" />, label: 'Email Address', value: user?.email },
                                    { icon: <Shield className="h-4 w-4" />, label: 'Authentication', value: user?.googleId ? 'Google OAuth' : 'Email & Password' },
                                    { icon: <BarChart3 className="h-4 w-4" />, label: 'Portfolio Size', value: `${user?.holdings?.length || 0} holdings` },
                                ].map(item => (
                                    <div key={item.label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <span className="text-gray-400">{item.icon}</span>
                                            <span className="text-sm text-gray-500">{item.label}</span>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeSection === 'security' && (
                        <div className="card space-y-6">
                            <h3 className="text-lg font-bold text-gray-900">Security Settings</h3>
                            <div className="border border-gray-200 rounded-xl p-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                                        <Shield className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Authentication Method</h4>
                                        <p className="text-sm text-gray-500">
                                            {user?.googleId ? 'Your account is secured with Google OAuth 2.0' : 'Your account uses email and password authentication'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="border border-gray-200 rounded-xl p-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                                        <Calendar className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Session Management</h4>
                                        <p className="text-sm text-gray-500">Your sessions expire after 30 days for security.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'preferences' && (
                        <div className="card space-y-6">
                            <h3 className="text-lg font-bold text-gray-900">Preferences</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Auto-refresh Prices</h4>
                                        <p className="text-sm text-gray-500">Update prices every 10 seconds during market hours</p>
                                    </div>
                                    <div className="w-12 h-7 bg-primary-600 rounded-full relative cursor-pointer">
                                        <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Currency</h4>
                                        <p className="text-sm text-gray-500">Display currency for portfolio values</p>
                                    </div>
                                    <span className="badge badge-primary">NPR (Rs.)</span>
                                </div>
                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Market Notifications</h4>
                                        <p className="text-sm text-gray-500">Get notified about significant price changes</p>
                                    </div>
                                    <div className="w-12 h-7 bg-gray-300 rounded-full relative cursor-pointer">
                                        <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Profile
