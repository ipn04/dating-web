interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  errorMessages?: string | boolean | React.ReactNode | undefined;
  isInvalid?: string | boolean | React.ReactNode | undefined;
  disabled?: boolean;
}

export default function EmailInput({
  value,
  onChange,
  placeholder = 'Email',
  errorMessages,
  isInvalid,
  disabled,
}: EmailInputProps) {
  return (
    <div className="relative w-full">
      <label htmlFor="email" className={`block text-sm font-medium mb-1 ${errorMessages || isInvalid ? 'text-red-500' : ''}`}>
        Email
      </label>
      <input
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full border border-gray-300 rounded-lg p-3 focus:outline-none ${errorMessages || isInvalid ? 'border-red-500 text-red-500' : 'border-gray-300'}`}
        disabled={disabled}
      />
      {errorMessages && (
        <p className="text-red-500 text-xs font-bold mt-1">{errorMessages}</p>
      )}
    </div>
  );
}
