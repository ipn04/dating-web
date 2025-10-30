'use client';
import CustomInput from '@/app/components/input/CustomInput/CustomInput';
import EmailInput from '@/app/components/input/EmailInput/EmailInput';
import PasswordInput from '@/app/components/input/PasswordInput/PasswordInput';
import Link from 'next/link';
import { useState } from 'react';
import { trim } from 'lodash';
import Image from 'next/image';
import { useSignUpMutation } from '@/app/reducer/user/UserApi';
import { usePageTitle } from '@/app/shared/PageTitle/PageTitle';

export default function SignupPage() {
  usePageTitle('Sign Up');
  const [ loading, setLoading ] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    age: '',
    bio: '',
    email: '',
    password: '',
    profile: '',
  });
  console.log('Errors:', errors);

  const [data, setData] = useState({
    name: '',
    age: '',
    bio: '',
    email: '',
    password: '',
    profile: null as File | null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [ signUpRequest ] = useSignUpMutation();

  const validate = () => {
    const newErrors = { name: '', age: '', bio: '', email: '', password: '', profile: '' };
    let isValid = true;

    if (!data.name) {
      newErrors.name = '*Name is required';
      isValid = false;
    }

    if (!data.age) {
      newErrors.age = '*Age is required';
      isValid = false;
    }

    if (!trim(data.bio)) {
      newErrors.bio = '*Bio is required';
      isValid = false;
    }

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

    if (!data.profile) {
      newErrors.profile = '*Profile image is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({
      name: '',
      age: '',
      bio: '',
      email: '',
      password: '',
      profile: '',
    });

    if (!validate()) return;
    setLoading(true);

    const newData = new FormData();
    newData.append('name', data.name);
    newData.append('age', data.age.toString());
    newData.append('bio', trim(data.bio));
    newData.append('email', trim(data.email));
    newData.append('password', data.password);

    if (data.profile) {
      newData.append('profile', data.profile);
    }

    try {
      await signUpRequest(newData).unwrap();
    } catch (
      error:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any
    ) {
      if (error.status === 400) {
        const message = error?.response?.data?.message || '';

        if (message.toLowerCase().includes('password')) {
          setErrors((prev) => ({
            ...prev,
            password: '*' + message,
          }));
        }
        else if (message.toLowerCase().includes('email')) {
          setErrors((prev) => ({
            ...prev,
            email: '*' + message,
          }));
        }
        else {
          setErrors((prev) => ({
            ...prev,
            email: '*' + message,
          }));
        }
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, profile: 'Only PNG, JPG, JPEG, and WEBP files are allowed.' }));
      e.target.value = '';
      return;
    }

    setData({ ...data, profile: file });
    setPreviewUrl(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-fa primary-light p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        <form className="space-y-2" onSubmit={handleSignUp}>
          <div className="flex flex-col items-center mb-4">
            <label
              htmlFor="profile"
              className={`cursor-pointer flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed rounded-full ${
                errors.profile ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Profile Preview"
                  width={128}
                  height={128}
                  unoptimized
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-gray-400 text-sm">Upload</span>
              )}
            </label>
            <input
              id="profile"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfileUpload}
            />
            {errors.profile && (
              <p className="text-red-500 text-xs font-bold mt-1">{errors.profile}</p>
            )}
          </div>
          <div className='mb-4'>
            <CustomInput
              id="name"
              type="text"
              placeholder="Name"
              value={data.name}
              onChange={(value) => setData({ ...data, name: value })}
              errorMessages={errors.name}
            />
          </div>
          <div className='mb-4'>
            <CustomInput
              id="age"
              type="number"
              placeholder="Age"
              value={data.age}
              onChange={(value) => setData({ ...data, age: value })}
              errorMessages={errors.age}
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="bio"
              className={`block text-sm font-medium mb-1 ${
                errors.bio ? 'text-red-500' : ''
              }`}
            >
              Bio
            </label>
            <textarea
              id="bio"
              placeholder="Bio"
              className={`w-full border border-gray-300 rounded-lg p-3 focus:outline-none resize-none ${
                errors.bio ? 'border-red-500 text-red-500' : ''
              }`}
              value={data.bio}
              onChange={(e) => setData({ ...data, bio: e.target.value })}
              rows={3}
              disabled={loading}
            />
            {errors.bio && (
              <p className="text-red-500 text-xs font-bold">{errors.bio}</p>
            )}
          </div>
          <div className='mb-4'>
            <EmailInput
              value={data.email}
              onChange={(value) => setData({ ...data, email: value })}
              errorMessages={errors.email}
              disabled={loading}
            />
          </div>
          <div className='mb-4'>
            <PasswordInput
              value={data.password}
              onChange={(value) => setData({ ...data, password: value })}
              errorMessages={errors.password}
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
              'Sign Up'
            )}
          </button>

          <p className="text-sm text-center primary-light mt-4">
            Already have an account?{' '}
            <Link
              href="/pages/auth/login"
              className="primary-light font-bold cursor-pointer hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
