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
            iconBg: 'bg-red-50',
            iconColor: 'text-red-600',
            icon: AlertCircle,
            buttonBg: 'bg-red-600',
            buttonHover: 'hover:bg-red-700',
            buttonShadow: 'shadow-red-200',
            border: 'border-red-200',
            label: 'SELL ORDER'
        },
        warning: {
            iconBg: 'bg-amber-50',
            iconColor: 'text-amber-600',
            icon: AlertTriangle,
            buttonBg: 'bg-amber-600',
            buttonHover: 'hover:bg-amber-700',
            buttonShadow: 'shadow-amber-200',
            border: 'border-amber-200',
            label: 'WARNING'
        },
        success: {
            iconBg: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
            icon: CheckCircle,
            buttonBg: 'bg-emerald-600',
            buttonHover: 'hover:bg-emerald-700',
            buttonShadow: 'shadow-emerald-200',
            border: 'border-emerald-200',
            label: 'BUY ORDER'
        },
        info: {
            iconBg: 'bg-slate-50',
            iconColor: 'text-slate-600',
            icon: Shield,
            buttonBg: 'bg-slate-900',
            buttonHover: 'hover:bg-slate-800',
            buttonShadow: 'shadow-slate-200',
            border: 'border-slate-200',
            label: 'CONFIRM'
        }
    };

    const theme = colors[isDanger ? 'danger' : isWarning ? 'warning' : isSuccess ? 'success' : 'info'];
    const IconComponent = theme.icon;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-200">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 scale-100 border border-slate-200 mx-2 sm:mx-0">
                
                {/* Market Status Bar */}
                <div className={`px-3 sm:px-4 py-2 ${theme.iconBg} border-b ${theme.border} flex items-center justify-between`}>
                    <span className={`text-[10px] font-bold tracking-widest ${theme.iconColor}`}>
                        {theme.label}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                        NEPSE • {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
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
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
                        >
                            <X className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                    </div>

                    <div className="mt-3 sm:mt-4">
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">{title}</h3>
                    </div>
                </div>

                {/* Message */}
                <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{message}</p>
                    
                    {/* Risk Disclosure for Danger/Warning */}
                    {(isDanger || isWarning) && (
                        <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <p className="text-[10px] sm:text-xs text-slate-500">
                                <span className="font-semibold text-slate-700">Note:</span> This action is irreversible. Please verify all details before confirming.
                            </p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="bg-slate-50 p-4 sm:p-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 sm:gap-3 border-t border-slate-200">
                    <button
                        onClick={onClose}
                        className="px-4 sm:px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all active:scale-95 w-full sm:w-auto"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`px-4 sm:px-5 py-2.5 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all active:scale-95 shadow-lg w-full sm:w-auto ${theme.buttonBg} ${theme.buttonHover} ${theme.buttonShadow}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;