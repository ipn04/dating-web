'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { trim } from 'lodash';
import PasswordInput from '@/app/components/input/PasswordInput/PasswordInput';
import EmailInput from '@/app/components/input/EmailInput/EmailInput';
import { useLoginMutation } from '@/app/reducer/user/UserApi';
import { usePageTitle } from '@/app/shared/PageTitle/PageTitle';

export default function LoginPage() {
  usePageTitle('Login');

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
    setLoading(true);

    const newData = {
      email: trim(data.email),
      password: data.password,
    };

    try {
      await loginRequest(newData).unwrap();
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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-fa primary-light p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        { errorMessage && (
          <div className="text-header-text p-3 rounded mb-4 text-center">
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
              disabled={loading}
            />
          </div>
          <div className='mb-4'>
            <PasswordInput
              value={data.password}
              onChange={(value) => setData({ ...data, password: value })}
              errorMessages={errors.password}
              isInvalid={errorMessage}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className={`w-full font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
              loading
                ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                : 'bg-section-background text-gray-500 hover:bg-section-hover cursor-pointer'
            }`}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </>
            ) : (
              'Login'
            )}
          </button>
          <p className="text-sm text-center primary-light mt-4">
            Dont have an account?{' '}
            <Link href="/pages/auth/signup" className="primary-light font-bold cursor-pointer hover:underline">
              SignUp
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}