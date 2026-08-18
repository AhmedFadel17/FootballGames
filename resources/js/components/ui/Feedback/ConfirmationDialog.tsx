import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'

interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  isLoading?: boolean
}

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info',
  isLoading = false
}: ConfirmationDialogProps) {
  const variantStyles = {
    danger: {
      icon: 'delete_forever',
      iconBg: 'bg-error/10',
      iconText: 'text-error',
      buttonBg: 'bg-error hover:bg-error/90 text-on-error',
      border: 'border-error/20',
      glow: 'shadow-[0_0_20px_rgba(255,180,171,0.15)]'
    },
    warning: {
      icon: 'warning',
      iconBg: 'bg-yellow-500/10',
      iconText: 'text-yellow-500',
      buttonBg: 'bg-yellow-500 hover:bg-yellow-600 text-black',
      border: 'border-yellow-500/20',
      glow: 'shadow-[0_0_20px_rgba(234,179,8,0.15)]'
    },
    info: {
      icon: 'info',
      iconBg: 'bg-primary/10',
      iconText: 'text-primary',
      buttonBg: 'bg-primary hover:bg-primary/90 text-on-primary',
      border: 'border-primary/20',
      glow: 'shadow-[0_0_20px_rgba(221,183,255,0.15)]'
    }
  }

  const styles = variantStyles[variant]

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-[#060e20]/80 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className={`relative transform overflow-hidden rounded-2xl bg-surface-container-high p-8 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border ${styles.border} ${styles.glow}`}>
                <div className="flex items-start gap-5">
                  <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${styles.iconBg}`}>
                    <span className={`material-symbols-outlined text-2xl ${styles.iconText}`}>
                      {styles.icon}
                    </span>
                  </div>
                  <div className="mt-0 text-left">
                    <Dialog.Title as="h3" className="text-xl font-headline font-bold text-on-surface">
                      {title}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-on-surface-variant/80 leading-relaxed">
                        {description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex flex-col sm:flex-row-reverse gap-3">
                  <button
                    type="button"
                    disabled={isLoading}
                    className={`inline-flex w-full justify-center rounded-xl px-6 py-3 text-sm font-bold shadow-sm transition-all active:scale-95 sm:ml-0 sm:w-auto ${styles.buttonBg} disabled:opacity-50`}
                    onClick={onConfirm}
                  >
                    {isLoading ? (
                      <span className="material-symbols-outlined animate-spin text-xl">sync</span>
                    ) : (
                      confirmText
                    )}
                  </button>
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-xl bg-surface-container px-6 py-3 text-sm font-bold text-on-surface border border-outline-variant/10 hover:bg-surface-variant transition-all active:scale-95 sm:mt-0 sm:w-auto"
                    onClick={onClose}
                  >
                    {cancelText}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
