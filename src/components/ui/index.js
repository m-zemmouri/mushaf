// src/components/ui/Button.jsx
export const Button = ({ variant = 'default', className = '', children, ...props }) => {
	const baseStyles = 'px-4 py-2 rounded-md font-medium transition-colors'
	const variantStyles = {
		default: 'bg-emerald-700 text-white hover:bg-emerald-600',
		ghost: 'bg-transparent hover:bg-gray-100',
	}

	return (
		<button className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
			{children}
		</button>
	)
}

// src/components/ui/Card.jsx
export const Card = ({ children, className = '' }) => <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>{children}</div>

export const CardContent = ({ children, className = '' }) => <div className={`p-6 ${className}`}>{children}</div>

// src/components/ui/Input.jsx
export const Input = ({ className = '', ...props }) => <input className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${className}`} {...props} />

export const Select = ({ value, onChange, children, className }) => {
	return (
		<select value={value} onChange={onChange} className={`border rounded-md p-2 ${className}`}>
			{children}
		</select>
	)
}
