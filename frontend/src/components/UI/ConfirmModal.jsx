import { AlertCircle, X, AlertTriangle, CheckCircle, Shield } from 'lucide-react';

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Execute",
    cancelText = "Cancel",
    type = "danger"
}) => {
    if (!isOpen) return null;

    const isDanger = type === "danger";
    const isWarning = type === "warning";
    const isSuccess = type === "success";

    // Stock market themed color configurations
    const colors = {
        danger: {
            iconBg: 'bg-rose-50 dark:bg-rose-950/20',
            iconColor: 'text-rose-600 dark:text-rose-400',
            icon: AlertCircle,
            buttonBg: 'bg-rose-600 dark:bg-rose-500',
            buttonHover: 'hover:bg-rose-700 dark:hover:bg-rose-600',
            buttonShadow: 'shadow-rose-100 dark:shadow-none',
            border: 'border-rose-100 dark:border-rose-900/30',
            label: 'SELL ORDER'
        },
        warning: {
            iconBg: 'bg-amber-50 dark:bg-amber-950/20',
            iconColor: 'text-amber-600 dark:text-amber-400',
            icon: AlertTriangle,
            buttonBg: 'bg-amber-600 dark:bg-amber-500',
            buttonHover: 'hover:bg-amber-700 dark:hover:bg-amber-600',
            buttonShadow: 'shadow-amber-100 dark:shadow-none',
            border: 'border-amber-100 dark:border-amber-900/30',
            label: 'WARNING'
        },
        success: {
            iconBg: 'bg-emerald-50 dark:bg-emerald-950/20',
            iconColor: 'text-emerald-600 dark:text-emerald-400',
            icon: CheckCircle,
            buttonBg: 'bg-emerald-600 dark:bg-emerald-500',
            buttonHover: 'hover:bg-emerald-700 dark:hover:bg-emerald-600',
            buttonShadow: 'shadow-emerald-100 dark:shadow-none',
            border: 'border-emerald-100 dark:border-emerald-900/30',
            label: 'BUY ORDER'
        },
        info: {
            iconBg: 'bg-zinc-50 dark:bg-zinc-800',
            iconColor: 'text-zinc-600 dark:text-zinc-400',
            icon: Shield,
            buttonBg: 'bg-zinc-900 dark:bg-zinc-100',
            buttonHover: 'hover:bg-zinc-800 dark:hover:bg-zinc-200',
            buttonShadow: 'shadow-zinc-100 dark:shadow-none',
            border: 'border-zinc-100 dark:border-zinc-800',
            label: 'CONFIRM'
        }
    };

    const theme = colors[isDanger ? 'danger' : isWarning ? 'warning' : isSuccess ? 'success' : 'info'];
    const IconComponent = theme.icon;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-zinc-950/60 backdrop-blur-md transition-all duration-300">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 scale-100 border border-zinc-100 dark:border-zinc-800 mx-2 sm:mx-0">

                {/* Market Status Bar */}
                <div className={`px-4 sm:px-6 py-2.5 ${theme.iconBg} border-b ${theme.border} flex items-center justify-between transition-colors`}>
                    <span className={`text-[10px] font-black tracking-widest ${theme.iconColor}`}>
                        {theme.label}
                    </span>
                    <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase">
                        NEPSE TRACKER • {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </span>
                </div>

                {/* Header */}
                <div className="p-4 sm:p-6 pb-3 sm:pb-4">
                    <div className="flex items-start justify-between gap-3">
                        <div className={`p-2.5 sm:p-3 rounded-xl ${theme.iconBg} flex-shrink-0`}>
                            <IconComponent className={`h-5 w-5 sm:h-6 sm:w-6 ${theme.iconColor}`} />
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2.5 text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-all flex-shrink-0"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="mt-3 sm:mt-4">
                        <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter transition-colors">{title}</h3>
                    </div>
                </div>

                <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                    <p className="text-xs sm:text-sm font-bold text-zinc-500 dark:text-zinc-400 leading-relaxed transition-colors">{message}</p>

                    {/* Risk Disclosure for Danger/Warning */}
                    {(isDanger || isWarning) && (
                        <div className="mt-4 sm:mt-5 p-3 sm:p-4 bg-zinc-50 dark:bg-zinc-950/50 rounded-xl border border-zinc-100 dark:border-zinc-800 transition-colors">
                            <p className="text-[10px] sm:text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
                                <span className="text-zinc-900 dark:text-zinc-100">Note:</span> This action is irreversible. Please verify all details before confirming.
                            </p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="bg-zinc-50 dark:bg-zinc-950/20 p-4 sm:p-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 sm:gap-3 border-t border-zinc-100 dark:border-zinc-800 transition-colors">
                    <button
                        onClick={onClose}
                        className="px-5 sm:px-6 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all active:scale-95 w-full sm:w-auto"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`px-5 sm:px-6 py-3 text-white dark:text-zinc-900 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl w-full sm:w-auto ${theme.buttonBg} ${theme.buttonHover} ${theme.buttonShadow}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;