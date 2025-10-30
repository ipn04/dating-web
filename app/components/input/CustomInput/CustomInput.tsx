'use client';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  errorMessages?: string | boolean | React.ReactNode | undefined;
  id: string;
  disabled?: boolean;
}

export default function CustomInput({
  value,
  onChange,
  type = 'text',
  placeholder = '',
  errorMessages,
  id,
  disabled,
}: TextInputProps) {
  return (
    <div className="relative w-full">
      <label
        htmlFor={id}
        className={`block text-sm font-medium mb-1
          ${errorMessages ? 'text-red-500 peer-focus:text-red-500' : ''}
        `}
      >
        {placeholder || id}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`peer w-full border rounded-lg p-4 focus:outline-none ${
          errorMessages
            ? 'border-red-500 text-red-500'
            : 'border-gray-300'
        }`}
        disabled={disabled}
      />
      {errorMessages && (
        <p className="text-red-500 text-xs font-bold mt-1">{errorMessages}</p>
      )}
    </div>
  );
}
