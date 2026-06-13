import { AlertCircle, X, AlertTriangle, CheckCircle, Shield } from 'lucide-react'

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'danger'
}) => {
    if (!isOpen) return null

    const config = {
        danger: { icon: AlertCircle, cls: 'down', label: 'CONFIRM REMOVE', btn: 'var(--color-down)' },
        warning: { icon: AlertTriangle, cls: 'accent', label: 'WARNING', btn: 'var(--color-accent)' },
        success: { icon: CheckCircle, cls: 'up', label: 'CONFIRM', btn: 'var(--color-up)' },
        info: { icon: Shield, cls: 'text-ink', label: 'CONFIRM', btn: 'var(--color-ink)' },
    }
    const theme = config[type] || config.info
    const Icon = theme.icon
    const now = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/40">
            <div className="panel shadow-xl w-full max-w-sm overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 bg-sunk border-b border-line">
                    <span className={`label ${theme.cls}`}>{theme.label}</span>
                    <span className="label">{now} · NEPSE·TERM</span>
                </div>

                <div className="p-4">
                    <div className="flex items-start gap-3">
                        <Icon className={`h-5 w-5 ${theme.cls} shrink-0 mt-0.5`} />
                        <div className="flex-1">
                            <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
                            <p className="text-[13px] text-muted mt-1 leading-relaxed">{message}</p>
                        </div>
                        <button onClick={onClose} className="text-faint hover:text-ink transition-colors"><X className="h-4 w-4" /></button>
                    </div>
                </div>

                <div className="flex justify-end gap-2 px-4 py-3 bg-sunk border-t border-line">
                    <button onClick={onClose} className="btn btn-ghost">{cancelText}</button>
                    <button onClick={() => { onConfirm(); onClose() }} className="btn text-white" style={{ background: theme.btn }}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmModal
