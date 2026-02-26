interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'cyan' | 'outline'
  className?: string
}

export default function Badge({
  children,
  variant = 'default',
  className = '',
}: BadgeProps) {
  const base = 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium'

  const variants = {
    default: 'bg-slate-700 text-gray-300',
    cyan: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
    outline: 'border border-slate-600 text-gray-400',
  }

  return (
    <span className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
