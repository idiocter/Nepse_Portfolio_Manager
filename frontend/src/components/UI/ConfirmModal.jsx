import React from 'react';
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 scale-100 border border-slate-200">
                
                {/* Market Status Bar */}
                <div className={`px-4 py-2 ${theme.iconBg} border-b ${theme.border} flex items-center justify-between`}>
                    <span className={`text-[10px] font-bold tracking-widest ${theme.iconColor}`}>
                        {theme.label}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                        NEPSE • {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </span>
                </div>

                {/* Header */}
                <div className="p-6 pb-4">
                    <div className="flex items-start justify-between">
                        <div className={`p-3 rounded-xl ${theme.iconBg}`}>
                            <IconComponent className={`h-6 w-6 ${theme.iconColor}`} />
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="mt-4">
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h3>
                    </div>
                </div>

                {/* Message */}
                <div className="px-6 pb-6">
                    <p className="text-sm text-slate-600 leading-relaxed">{message}</p>
                    
                    {/* Risk Disclosure for Danger/Warning */}
                    {(isDanger || isWarning) && (
                        <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <p className="text-xs text-slate-500">
                                <span className="font-semibold text-slate-700">Note:</span> This action is irreversible. Please verify all details before confirming.
                            </p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="bg-slate-50 p-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-slate-200">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all active:scale-95"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`px-5 py-2.5 text-white rounded-xl text-sm font-semibold transition-all active:scale-95 shadow-lg ${theme.buttonBg} ${theme.buttonHover} ${theme.buttonShadow}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;