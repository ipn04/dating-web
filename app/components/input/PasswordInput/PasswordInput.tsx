import { useState } from 'react';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  errorMessages?: string | boolean | React.ReactNode | undefined;
  isInvalid?: string | boolean | React.ReactNode | undefined;
}

export default function PasswordInput({
  value,
  onChange,
  placeholder = 'Password',
  errorMessages,
  isInvalid,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShow = () => setShowPassword(!showPassword);

  return (
    <div className="relative w-full">
      <label htmlFor="password" className={`block text-sm font-medium mb-1 ${errorMessages || isInvalid ? 'text-red-500' : ''}`}>
        Password
      </label>
      <div
        className={`flex items-center justify-between rounded-lg p-3 border ${
          errorMessages || isInvalid ? 'border-red-500 text-red-500' : 'border-gray-300'
        }`}
      >
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className={`w-full border-none focus:outline-none ${errorMessages || isInvalid ? 'text-red-500' : ''}`}
        />
        <button
          type="button"
          onClick={toggleShow}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>
      {errorMessages && (
        <p className="text-red-500 text-xs font-bold mt-1">{errorMessages}</p>
      )}
    </div>
  );
}
