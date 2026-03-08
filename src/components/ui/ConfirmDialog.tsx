import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
  details?: Array<{ label: string; value: string }>;
  isSubmitting?: boolean;
}

const variantStyles = {
  danger: {
    icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
    confirmBg: 'bg-red-500 hover:bg-red-600',
    border: 'border-red-500/20',
  },
  warning: {
    icon: <AlertTriangle className="w-6 h-6 text-orange-500" />,
    confirmBg: 'bg-orange-500 hover:bg-orange-600',
    border: 'border-orange-500/20',
  },
  info: {
    icon: <Info className="w-6 h-6 text-blue-500" />,
    confirmBg: 'bg-blue-500 hover:bg-blue-600',
    border: 'border-blue-500/20',
  },
  success: {
    icon: <CheckCircle className="w-6 h-6 text-emerald-500" />,
    confirmBg: 'bg-emerald-500 hover:bg-emerald-600',
    border: 'border-emerald-500/20',
  },
};

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'info',
  details,
  isSubmitting = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const styles = variantStyles[variant];

  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#13141C] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl"
      >
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className={`w-12 h-12 rounded-xl border ${styles.border} flex items-center justify-center flex-shrink-0`}>
              {styles.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{message}</p>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {details && (
            <div className="bg-[#0A0B10] rounded-xl p-4 mb-6 space-y-2">
              {details.map((detail, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">{detail.label}</span>
                  <span className="font-medium text-slate-200">{detail.value}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors disabled:opacity-50"
            >
              {cancelLabel}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className={`flex-1 px-4 py-3 rounded-xl ${styles.confirmBg} text-white font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
