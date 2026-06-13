import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import {
    User, Mail, Shield, Calendar, LogOut,
    Settings, Wallet, BarChart3, TrendingUp, Moon, Sun
} from 'lucide-react'

const Profile = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const { user, logout, updatePreferences } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const [activeSection, setActiveSection] = useState(searchParams.get('tab') || 'overview')
    const [isUpdating, setIsUpdating] = useState(false)

    useEffect(() => {
        const tab = searchParams.get('tab')
        if (tab && ['overview', 'security', 'preferences'].includes(tab)) {
            setActiveSection(tab)
        }
    }, [searchParams])

    const handleSectionChange = (section) => {
        setActiveSection(section)
        setSearchParams({ tab: section })
    }

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: <User className="h-4 w-4" /> },
        { id: 'security', label: 'Security', icon: <Shield className="h-4 w-4" /> },
        { id: 'preferences', label: 'Preferences', icon: <Settings className="h-4 w-4" /> },
    ]

    const stats = [
        {
            label: 'Holdings',
            value: user?.holdings?.length || 0,
            icon: <Wallet className="h-4 w-4 sm:h-5 sm:w-5" />,
        },
        {
            label: 'Type',
            value: user?.googleId ? 'Google' : 'Email',
            icon: <Shield className="h-4 w-4 sm:h-5 sm:w-5" />,
        },
        {
            label: 'Since',
            value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A',
            icon: <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />,
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
        <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 pb-6 sm:pb-8 border-b border-zinc-100 dark:border-zinc-800 transition-colors">
                    <div className="relative flex-shrink-0">
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.name}
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border border-zinc-100 dark:border-zinc-800 transition-colors" />
                        ) : (
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center border border-zinc-100 dark:border-zinc-800 transition-colors">
                                <span className="text-xl sm:text-2xl font-black text-white dark:text-zinc-900">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                            <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight transition-colors truncate">{user?.name}</h1>
                            {user?.username && (
                                <span className="text-xs sm:text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest transition-colors">@{user.username}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm font-bold text-zinc-500 dark:text-zinc-500 transition-colors flex-wrap">
                            <span className="flex items-center gap-1.5">
                                <Mail className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                <span className="truncate">{user?.email}</span>
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                        <span className="inline-flex items-center px-2 sm:px-2.5 py-1 rounded border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-[10px] sm:text-xs font-black text-zinc-500 dark:text-zinc-400 transition-colors uppercase tracking-widest">
                            <TrendingUp className="h-3 w-3 mr-1 sm:mr-1.5" />
                            Investor
                        </span>
                        {user?.googleId && (
                            <span className="inline-flex items-center px-2 sm:px-2.5 py-1 rounded border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-950/20 text-[10px] sm:text-xs font-black text-emerald-600 dark:text-emerald-400 transition-colors uppercase tracking-widest">
                                Verified
                            </span>
                        )}
                    </div>
                </div>

                {/* Stats Row - Responsive grid */}
                <div className="grid grid-cols-3 gap-px bg-zinc-100 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden transition-all duration-300">
                    {stats.map((stat, idx) => (
                        <div key={stat.label} className="bg-white dark:bg-zinc-900 p-3 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 transition-colors">
                            <div className="text-zinc-300 dark:text-zinc-600 transition-colors">
                                {stat.icon}
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest transition-colors">{stat.label}</p>
                                <p className="text-sm sm:text-lg font-black text-zinc-900 dark:text-zinc-100 tabular-nums truncate transition-colors">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Grid - Stack on mobile */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">

                    {/* Sidebar - Horizontal scroll on mobile */}
                    <div className="lg:col-span-3">
                        <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0">
                            {menuItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => handleSectionChange(item.id)}
                                    className={`flex items-center gap-2 sm:gap-3 px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-widest transition-all whitespace-nowrap flex-shrink-0 lg:w-full ${activeSection === item.id
                                        ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-lg shadow-zinc-200 dark:shadow-none'
                                        : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                                        }`}
                                >
                                    <span className={activeSection === item.id ? '' : 'text-zinc-300 dark:text-zinc-600'}>
                                        {item.icon}
                                    </span>
                                    {item.label}
                                </button>
                            ))}
                            <div className="lg:pt-4 lg:mt-4 lg:border-t lg:border-zinc-100 dark:lg:border-zinc-800 flex-shrink-0 transition-colors">
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-2 sm:gap-3 px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-600 dark:hover:text-rose-400 transition-all whitespace-nowrap lg:w-full"
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
                            <div className="space-y-4 sm:space-y-6 animate-fade-in">
                                <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-zinc-100 dark:border-zinc-800 transition-colors">
                                    <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-100 transition-colors uppercase tracking-tight">Account Details</h3>
                                    <button className="text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors uppercase tracking-widest">
                                        Edit Profile
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    {[
                                        { label: 'Full Name', value: user?.name },
                                        { label: 'Username', value: user?.username ? `@${user.username}` : '—' },
                                        { label: 'Email', value: user?.email },
                                        { label: 'Authentication', value: user?.googleId ? 'Google OAuth 2.0' : 'Email Terminal' },
                                        { label: 'Portfolio Size', value: `${user?.holdings?.length || 0} holdings` },
                                        { label: 'Account Status', value: user?.googleId ? 'Verified Account' : 'Standard Terminal' },
                                    ].map((item) => (
                                        <div key={item.label} className="space-y-1">
                                            <p className="text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest transition-colors">{item.label}</p>
                                            <p className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 break-words transition-colors">{item.value || '—'}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Security */}
                        {activeSection === 'security' && (
                            <div className="space-y-4 sm:space-y-6 animate-fade-in">
                                <div className="pb-3 sm:pb-4 border-b border-zinc-100 dark:border-zinc-800 transition-colors">
                                    <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-100 transition-colors uppercase tracking-tight">Security</h3>
                                </div>

                                <div className="space-y-3 sm:space-y-4">
                                    <div className="p-4 border border-zinc-100 dark:border-zinc-800 rounded-2xl transition-all">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 sm:p-2.5 bg-zinc-50 dark:bg-zinc-800 rounded-lg flex-shrink-0 transition-colors">
                                                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-zinc-500 dark:text-zinc-400" />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-xs sm:text-sm font-black text-zinc-900 dark:text-zinc-100 transition-colors uppercase tracking-tight">Authentication</h4>
                                                <p className="text-[10px] sm:text-xs font-bold text-zinc-400 dark:text-zinc-500 mt-1 uppercase tracking-wider transition-colors">
                                                    {user?.googleId ? 'Secured with Google OAuth 2.0' : 'Email terminal and access key authentication'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 border border-zinc-100 dark:border-zinc-800 rounded-2xl transition-all">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 sm:p-2.5 bg-zinc-50 dark:bg-zinc-800 rounded-lg flex-shrink-0 transition-colors">
                                                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-zinc-500 dark:text-zinc-400" />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-xs sm:text-sm font-black text-zinc-900 dark:text-zinc-100 transition-colors uppercase tracking-tight">Session Expiry</h4>
                                                <p className="text-[10px] sm:text-xs font-bold text-zinc-400 dark:text-zinc-500 mt-1 uppercase tracking-wider transition-colors">Sessions expire after 30 days of inactivity</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Preferences */}
                        {activeSection === 'preferences' && (
                            <div className="space-y-4 sm:space-y-6 animate-fade-in">
                                <div className="pb-3 sm:pb-4 border-b border-zinc-100 dark:border-zinc-800 transition-colors">
                                    <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-100 transition-colors uppercase tracking-tight">Preferences</h3>
                                </div>

                                <div className="space-y-2 sm:space-y-4">
                                    {/* Dark Mode Toggle */}
                                    <div className="flex items-center justify-between py-3 sm:py-4 border-b border-zinc-50 dark:border-zinc-800/50 gap-3 transition-colors">
                                        <div className="min-w-0 flex items-center gap-3 sm:gap-4">
                                            <div className="p-2 sm:p-2.5 bg-zinc-50 dark:bg-zinc-800 rounded-lg transition-colors">
                                                {theme === 'light' ? (
                                                    <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-zinc-500 dark:text-zinc-400" />
                                                ) : (
                                                    <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="text-xs sm:text-sm font-black text-zinc-900 dark:text-zinc-100 transition-colors uppercase tracking-tight">Dark Mode</h4>
                                                <p className="text-[10px] sm:text-[11px] font-bold text-zinc-400 dark:text-zinc-500 mt-0.5 uppercase tracking-wider transition-colors">Toggle between light and dark theme</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={async () => {
                                                toggleTheme();
                                                await handlePreferenceChange('theme', theme === 'light' ? 'dark' : 'light');
                                            }}
                                            className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 flex-shrink-0 ${theme === 'dark' ? 'bg-zinc-100' : 'bg-zinc-200'}`}
                                            aria-pressed={theme === 'dark'}
                                        >
                                            <span
                                                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white dark:bg-zinc-900 transition-transform duration-300 ease-in-out ${theme === 'dark' ? 'translate-x-5.5' : 'translate-x-1'}`}
                                            />
                                        </button>
                                    </div>

                                    {/* Auto-refresh Toggle */}
                                    <div className="flex items-center justify-between py-3 sm:py-4 border-b border-zinc-50 dark:border-zinc-800/50 gap-3 transition-colors">
                                        <div className="min-w-0">
                                            <h4 className="text-xs sm:text-sm font-black text-zinc-900 dark:text-zinc-100 transition-colors uppercase tracking-tight">Auto-refresh Prices</h4>
                                            <p className="text-[10px] sm:text-[11px] font-bold text-zinc-400 dark:text-zinc-500 mt-0.5 uppercase tracking-wider transition-colors">Update every 10 seconds during market hours</p>
                                        </div>
                                        <button
                                            onClick={() => handlePreferenceChange('autoRefresh', user?.preferences?.autoRefresh === false ? true : false)}
                                            disabled={isUpdating}
                                            className={`relative inline-flex h-4 sm:h-5 w-8 sm:w-10 items-center rounded-full transition-all flex-shrink-0 ${user?.preferences?.autoRefresh !== false ? 'bg-zinc-900 dark:bg-zinc-100' : 'bg-zinc-200'} ${isUpdating ? 'opacity-50' : ''}`}
                                        >
                                            <span className={`inline-block h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 transform rounded-full transition-all ${user?.preferences?.autoRefresh !== false ? 'translate-x-4.5 sm:translate-x-5.5 bg-white dark:bg-zinc-900' : 'translate-x-1 bg-white'}`} />
                                        </button>
                                    </div>

                                    {/* Currency */}
                                    <div className="flex items-center justify-between py-3 sm:py-4 border-b border-zinc-50 dark:border-zinc-800/50 gap-3 transition-colors">
                                        <div className="min-w-0">
                                            <h4 className="text-xs sm:text-sm font-black text-zinc-900 dark:text-zinc-100 transition-colors uppercase tracking-tight">Currency</h4>
                                            <p className="text-[10px] sm:text-[11px] font-bold text-zinc-400 dark:text-zinc-500 mt-0.5 uppercase tracking-wider transition-colors">Display currency for portfolio values</p>
                                        </div>
                                        <span className="text-xs sm:text-sm font-black text-zinc-900 dark:text-zinc-100 tabular-nums flex-shrink-0 transition-colors">
                                            {user?.preferences?.currency || 'NPR'}
                                        </span>
                                    </div>

                                    {/* Notifications Toggle */}
                                    <div className="flex items-center justify-between py-3 sm:py-4 border-b border-zinc-50 dark:border-zinc-800/50 gap-3 transition-colors">
                                        <div className="min-w-0">
                                            <h4 className="text-xs sm:text-sm font-black text-zinc-900 dark:text-zinc-100 transition-colors uppercase tracking-tight">Market Notifications</h4>
                                            <p className="text-[10px] sm:text-[11px] font-bold text-zinc-400 dark:text-zinc-500 mt-0.5 uppercase tracking-wider transition-colors">Alerts for significant price changes</p>
                                        </div>
                                        <button
                                            onClick={() => handlePreferenceChange('notifications', !user?.preferences?.notifications)}
                                            disabled={isUpdating}
                                            className={`relative inline-flex h-4 sm:h-5 w-8 sm:w-10 items-center rounded-full transition-all flex-shrink-0 ${user?.preferences?.notifications ? 'bg-zinc-900 dark:bg-zinc-100' : 'bg-zinc-200'} ${isUpdating ? 'opacity-50' : ''}`}
                                        >
                                            <span className={`inline-block h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 transform rounded-full transition-all ${user?.preferences?.notifications ? 'translate-x-4.5 sm:translate-x-5.5 bg-white dark:bg-zinc-900' : 'translate-x-1 bg-white'}`} />
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