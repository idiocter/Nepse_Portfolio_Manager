import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
    User, Mail, Shield, Calendar, LogOut,
    Settings, Wallet, TrendingUp
} from 'lucide-react'

const Profile = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const { user, logout, updatePreferences } = useAuth()
    const [activeSection, setActiveSection] = useState(searchParams.get('tab') || 'overview')
    const [isUpdating, setIsUpdating] = useState(false)

    useEffect(() => {
        const tab = searchParams.get('tab')
        if (tab && ['overview', 'security', 'preferences'].includes(tab)) setActiveSection(tab)
    }, [searchParams])

    const handleSectionChange = (section) => { setActiveSection(section); setSearchParams({ tab: section }) }

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: <User className="h-3.5 w-3.5" /> },
        { id: 'security', label: 'Security', icon: <Shield className="h-3.5 w-3.5" /> },
        { id: 'preferences', label: 'Preferences', icon: <Settings className="h-3.5 w-3.5" /> },
    ]

    const stats = [
        { label: 'HOLDINGS', value: user?.holdings?.length || 0, icon: <Wallet className="h-4 w-4" /> },
        { label: 'AUTH', value: user?.googleId ? 'Google' : 'Email', icon: <Shield className="h-4 w-4" /> },
        { label: 'SINCE', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A', icon: <Calendar className="h-4 w-4" /> },
    ]

    const handlePreferenceChange = async (key, value) => {
        if (isUpdating) return
        setIsUpdating(true)
        try { await updatePreferences({ [key]: value }) }
        catch (error) { console.error('Failed to update preference:', error) }
        finally { setIsUpdating(false) }
    }

    const Toggle = ({ on, onClick, disabled }) => (
        <button onClick={onClick} disabled={disabled}
            className={`relative inline-flex h-5 w-9 items-center rounded-[3px] border transition-colors flex-shrink-0 ${on ? 'bg-ink border-ink' : 'bg-sunk border-line'} ${disabled ? 'opacity-50' : ''}`}>
            <span className={`inline-block h-3.5 w-3.5 transform transition-transform ${on ? 'translate-x-[18px] bg-paper' : 'translate-x-[2px] bg-faint'}`} />
        </button>
    )

    return (
        <div className="max-w-[1100px] mx-auto px-4 py-6 space-y-6">
            {/* Header */}
            <div className="panel p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-[3px] object-cover border border-line" />
                ) : (
                    <div className="w-14 h-14 rounded-[3px] bg-ink flex items-center justify-center">
                        <span className="text-xl font-semibold text-paper">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-0.5">
                        <h1 className="text-xl font-bold text-ink tracking-tight truncate">{user?.name}</h1>
                        {user?.username && <span className="label">@{user.username}</span>}
                    </div>
                    <span className="flex items-center gap-1.5 text-[13px] text-muted font-mono">
                        <Mail className="h-3.5 w-3.5" /> {user?.email}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="chip"><TrendingUp className="h-3 w-3" /> INVESTOR</span>
                    {user?.googleId && <span className="chip up border-[var(--color-up)]/40">VERIFIED</span>}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 border border-line divide-x divide-[var(--color-line)]">
                {stats.map(stat => (
                    <div key={stat.label} className="bg-panel p-4 flex items-center gap-3">
                        <span className="text-faint">{stat.icon}</span>
                        <div className="min-w-0">
                            <p className="label">{stat.label}</p>
                            <p className="text-[15px] font-semibold text-ink tnum truncate">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Sidebar */}
                <div className="lg:col-span-3">
                    <div className="flex lg:flex-col gap-1 overflow-x-auto no-scrollbar">
                        {menuItems.map(item => (
                            <button key={item.id} onClick={() => handleSectionChange(item.id)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-[3px] text-[13px] font-medium transition-colors whitespace-nowrap lg:w-full ${activeSection === item.id ? 'bg-ink text-paper' : 'text-muted hover:text-ink hover:bg-sunk'}`}>
                                {item.icon} {item.label}
                            </button>
                        ))}
                        <button onClick={logout}
                            className="flex items-center gap-2 px-3 py-2 rounded-[3px] text-[13px] font-medium down hover:bg-[var(--color-down)]/8 transition-colors whitespace-nowrap lg:w-full lg:mt-2 lg:border-t lg:border-line lg:rounded-none lg:pt-3">
                            <LogOut className="h-3.5 w-3.5" /> Sign Out
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-9 panel p-5">
                    {activeSection === 'overview' && (
                        <div>
                            <div className="flex items-center justify-between pb-3 mb-4 border-b border-line">
                                <h3 className="text-[14px] font-semibold text-ink">Account Details</h3>
                                <button className="label hover:text-ink">EDIT</button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                                {[
                                    { label: 'FULL NAME', value: user?.name },
                                    { label: 'USERNAME', value: user?.username ? `@${user.username}` : '—' },
                                    { label: 'EMAIL', value: user?.email },
                                    { label: 'AUTHENTICATION', value: user?.googleId ? 'Google OAuth 2.0' : 'Email + Password' },
                                    { label: 'PORTFOLIO SIZE', value: `${user?.holdings?.length || 0} holdings` },
                                    { label: 'ACCOUNT STATUS', value: user?.googleId ? 'Verified' : 'Standard' },
                                ].map(item => (
                                    <div key={item.label}>
                                        <p className="label mb-1">{item.label}</p>
                                        <p className="text-[13px] font-medium text-ink break-words">{item.value || '—'}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeSection === 'security' && (
                        <div>
                            <div className="pb-3 mb-4 border-b border-line">
                                <h3 className="text-[14px] font-semibold text-ink">Security</h3>
                            </div>
                            <div className="space-y-2">
                                {[
                                    { icon: <Shield className="h-4 w-4" />, t: 'Authentication', d: user?.googleId ? 'Secured with Google OAuth 2.0' : 'Email and password authentication' },
                                    { icon: <Calendar className="h-4 w-4" />, t: 'Session Expiry', d: 'Sessions expire after 30 days of inactivity' },
                                ].map(row => (
                                    <div key={row.t} className="flex items-start gap-3 p-3 border border-line rounded-[3px]">
                                        <span className="text-faint mt-0.5">{row.icon}</span>
                                        <div>
                                            <h4 className="text-[13px] font-semibold text-ink">{row.t}</h4>
                                            <p className="text-[12px] text-muted mt-0.5">{row.d}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeSection === 'preferences' && (
                        <div>
                            <div className="pb-3 mb-4 border-b border-line">
                                <h3 className="text-[14px] font-semibold text-ink">Preferences</h3>
                            </div>
                            <div className="divide-y divide-[var(--color-line)]">
                                <div className="flex items-center justify-between py-3">
                                    <div>
                                        <h4 className="text-[13px] font-semibold text-ink">Auto-refresh Prices</h4>
                                        <p className="text-[12px] text-muted mt-0.5">Update every 10 seconds during market hours</p>
                                    </div>
                                    <Toggle on={user?.preferences?.autoRefresh !== false} disabled={isUpdating}
                                        onClick={() => handlePreferenceChange('autoRefresh', user?.preferences?.autoRefresh === false)} />
                                </div>
                                <div className="flex items-center justify-between py-3">
                                    <div>
                                        <h4 className="text-[13px] font-semibold text-ink">Currency</h4>
                                        <p className="text-[12px] text-muted mt-0.5">Display currency for portfolio values</p>
                                    </div>
                                    <span className="text-[13px] font-semibold text-ink tnum">{user?.preferences?.currency || 'NPR'}</span>
                                </div>
                                <div className="flex items-center justify-between py-3">
                                    <div>
                                        <h4 className="text-[13px] font-semibold text-ink">Market Notifications</h4>
                                        <p className="text-[12px] text-muted mt-0.5">Alerts for significant price changes</p>
                                    </div>
                                    <Toggle on={!!user?.preferences?.notifications} disabled={isUpdating}
                                        onClick={() => handlePreferenceChange('notifications', !user?.preferences?.notifications)} />
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
