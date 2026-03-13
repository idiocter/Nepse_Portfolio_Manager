import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import {
    User, Mail, Shield, Calendar, LogOut,
    Settings, Wallet, BarChart3, TrendingUp
} from 'lucide-react'

const Profile = () => {
    const { user, logout, updatePreferences } = useAuth()
    const [activeSection, setActiveSection] = useState('overview')
    const [isUpdating, setIsUpdating] = useState(false)

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
        },
        {
            label: 'Account Type',
            value: user?.googleId ? 'Google' : 'Email',
            icon: <Shield className="h-5 w-5" />,
        },
        {
            label: 'Member Since',
            value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A',
            icon: <Calendar className="h-5 w-5" />,
        },
    ]

    const handlePreferenceChange = async (key, value) => {
        if (isUpdating) return;
        setIsUpdating(true);
        try {
            await updatePreferences({ [key]: value });
        } catch (error) {
            console.error("Failed to update preference:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">

                {/* Profile Header - Minimal Card */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pb-8 border-b border-slate-200">
                    <div className="relative">
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.name}
                                className="w-20 h-20 rounded-lg object-cover border border-slate-200" />
                        ) : (
                            <div className="w-20 h-20 rounded-lg bg-slate-900 flex items-center justify-center border border-slate-200">
                                <span className="text-2xl font-bold text-white">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{user?.name}</h1>
                            {user?.username && (
                                <span className="text-sm font-medium text-slate-500">@{user.username}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                            <span className="flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5" />
                                {user?.email}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700">
                            <TrendingUp className="h-3 w-3 mr-1.5" />
                            Investor
                        </span>
                        {user?.googleId && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded border border-emerald-200 bg-emerald-50 text-xs font-medium text-emerald-700">
                                Verified
                            </span>
                        )}
                    </div>
                </div>

                {/* Stats Row - Horizontal Ticker Style */}
                <div className="grid grid-cols-3 gap-px bg-slate-200 border border-slate-200 rounded-lg overflow-hidden">
                    {stats.map((stat, idx) => (
                        <div key={stat.label} className="bg-white p-4 flex items-center gap-3">
                            <div className="text-slate-400">
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
                                <p className="text-lg font-bold text-slate-900 tabular-nums">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Sidebar */}
                    <div className="lg:col-span-3">
                        <div className="space-y-1">
                            {menuItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSection(item.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${activeSection === item.id
                                        ? 'bg-slate-900 text-white'
                                        : 'text-slate-600 hover:bg-slate-100'
                                        }`}
                                >
                                    <span className={activeSection === item.id ? 'text-white' : 'text-slate-400'}>
                                        {item.icon}
                                    </span>
                                    {item.label}
                                </button>
                            ))}
                            <div className="pt-4 mt-4 border-t border-slate-200">
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-9">

                        {/* Overview */}
                        {activeSection === 'overview' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                                    <h3 className="text-lg font-bold text-slate-900">Account Details</h3>
                                    <button className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors">
                                        Edit Profile
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        { label: 'Full Name', value: user?.name },
                                        { label: 'Username', value: user?.username ? `@${user.username}` : '—' },
                                        { label: 'Email', value: user?.email },
                                        { label: 'Authentication', value: user?.googleId ? 'Google OAuth' : 'Email & Password' },
                                        { label: 'Portfolio Size', value: `${user?.holdings?.length || 0} holdings` },
                                        { label: 'Account Status', value: user?.googleId ? 'Verified' : 'Standard' },
                                    ].map((item) => (
                                        <div key={item.label} className="space-y-1">
                                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{item.label}</p>
                                            <p className="text-sm font-semibold text-slate-900">{item.value || '—'}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Security */}
                        {activeSection === 'security' && (
                            <div className="space-y-6">
                                <div className="pb-4 border-b border-slate-200">
                                    <h3 className="text-lg font-bold text-slate-900">Security</h3>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 border border-slate-200 rounded-lg">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-slate-100 rounded-md">
                                                <Shield className="h-4 w-4 text-slate-600" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-slate-900">Authentication</h4>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    {user?.googleId ? 'Secured with Google OAuth 2.0' : 'Email and password authentication'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 border border-slate-200 rounded-lg">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-slate-100 rounded-md">
                                                <Calendar className="h-4 w-4 text-slate-600" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-slate-900">Session Expiry</h4>
                                                <p className="text-xs text-slate-500 mt-1">Sessions expire after 30 days of inactivity</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Preferences */}
                        {activeSection === 'preferences' && (
                            <div className="space-y-6">
                                <div className="pb-4 border-b border-slate-200">
                                    <h3 className="text-lg font-bold text-slate-900">Preferences</h3>
                                </div>

                                <div className="space-y-4">
                                    {/* Toggle Item */}
                                    <div className="flex items-center justify-between py-4 border-b border-slate-100">
                                        <div>
                                            <h4 className="text-sm font-semibold text-slate-900">Auto-refresh Prices</h4>
                                            <p className="text-xs text-slate-500 mt-0.5">Update every 10 seconds during market hours</p>
                                        </div>
                                        <button
                                            onClick={() => handlePreferenceChange('autoRefresh', user?.preferences?.autoRefresh === false ? true : false)}
                                            disabled={isUpdating}
                                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${user?.preferences?.autoRefresh !== false ? 'bg-slate-900' : 'bg-slate-300'} ${isUpdating ? 'opacity-50' : ''}`}
                                        >
                                            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${user?.preferences?.autoRefresh !== false ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                        </button>
                                    </div>

                                    {/* Currency */}
                                    <div className="flex items-center justify-between py-4 border-b border-slate-100">
                                        <div>
                                            <h4 className="text-sm font-semibold text-slate-900">Currency</h4>
                                            <p className="text-xs text-slate-500 mt-0.5">Display currency for portfolio values</p>
                                        </div>
                                        <span className="text-sm font-semibold text-slate-900 tabular-nums">
                                            {user?.preferences?.currency || 'NPR'}
                                        </span>
                                    </div>

                                    {/* Toggle Item */}
                                    <div className="flex items-center justify-between py-4 border-b border-slate-100">
                                        <div>
                                            <h4 className="text-sm font-semibold text-slate-900">Market Notifications</h4>
                                            <p className="text-xs text-slate-500 mt-0.5">Alerts for significant price changes</p>
                                        </div>
                                        <button
                                            onClick={() => handlePreferenceChange('notifications', !user?.preferences?.notifications)}
                                            disabled={isUpdating}
                                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${user?.preferences?.notifications ? 'bg-slate-900' : 'bg-slate-300'} ${isUpdating ? 'opacity-50' : ''}`}
                                        >
                                            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${user?.preferences?.notifications ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile