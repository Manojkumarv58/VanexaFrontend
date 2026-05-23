import { motion } from 'framer-motion';

export default function Button({
  children, variant = 'primary', size = 'md',
  loading = false, className = '', as: Tag = 'button', ...props
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-2xl transition-all disabled:opacity-60 disabled:cursor-not-allowed select-none';

  const variants = {
    primary:   'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 active:scale-95',
    secondary: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-0.5 active:scale-95',
    outline:   'border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-600 hover:text-white active:scale-95',
    ghost:     'text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:scale-95',
    danger:    'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-lg shadow-rose-200 hover:-translate-y-0.5 active:scale-95',
    dark:      'bg-gray-900 text-white hover:bg-gray-800 active:scale-95',
  };

  const sizes = {
    xs: 'px-3 py-1.5 text-xs',
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
    xl: 'px-9 py-4 text-lg',
  };

  return (
    <Tag
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Loading...
        </>
      ) : children}
    </Tag>
  );
}
