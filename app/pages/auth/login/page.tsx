'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { trim } from 'lodash';
import PasswordInput from '@/app/components/input/PasswordInput/PasswordInput';
import EmailInput from '@/app/components/input/EmailInput/EmailInput';
import { useLoginMutation } from '@/app/reducer/user/UserApi';

export default function LoginPage() {
  const [ errorMessage, setErrorMessage ] = useState('');
  const [ errors, setErrors ] = useState({
    email: '',
    password: '',
  });
  const [ data, setData ] = useState({
    email: '',
    password: '',
  });
  const [ loading, setLoading ] = useState(false);

  const [ loginRequest ] = useLoginMutation();

  const validate = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    if (!trim(data.email)) {
      newErrors.email = '*Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    if (!data.password) {
      newErrors.password = '*Password is required';
      isValid = false;
    } else if (data.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handeLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({
      email: '',
      password: '',
    });

    if (!validate()) return;
    // setLoading(true);

    const newData = {
      email: trim(data.email),
      password: data.password,
    };

    try {
      const res = await loginRequest(newData).unwrap();
      console.log('Login successful:', res);
    } catch (
      error:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any
    ) {
      if (error.status === 401) {
        setErrorMessage(error?.response?.data.message || 'Invalid Email or Password.');
        return;
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white text-gray-700 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        { errorMessage && (
          <div className="text-red-500 p-3 rounded mb-4 text-center">
            {errorMessage}
          </div>
        )}
        <form className="space-y-2" onSubmit={handeLogin}>
          <div className='mb-4'>
            <EmailInput
              value={data.email}
              onChange={(value) => setData({ ...data, email: value })}
              errorMessages={errors.email}
              isInvalid={errorMessage}
            />
          </div>
          <div className='mb-4'>
            <PasswordInput
              value={data.password}
              onChange={(value) => setData({ ...data, password: value })}
              errorMessages={errors.password}
              isInvalid={errorMessage}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-400 text-white font-semibold py-3 rounded-lg hover:bg-green-500 transition-colors"
          >
            Login
          </button>
          <p className="text-sm text-center text-gray-500 mt-4">
            Dont have an account?{' '}
            <Link href="/pages/auth/signup" className="text-green-400 hover:underline">
              SignUp
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}