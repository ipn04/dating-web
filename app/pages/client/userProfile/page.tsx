'use client';

import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { IRootState } from '@/app/config/store';
import Image from 'next/image';
import { Camera, User, Mail, Calendar, FileText, Save, X } from 'lucide-react';
import { useUpdateUserMutation } from '@/app/reducer/user/UserApi';
import { usePageTitle } from '@/app/shared/PageTitle/PageTitle';

export default function UserProfilePage() {
  usePageTitle('Profile');
  const userProfile = useSelector((state: IRootState) => state.User.userProfile);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    bio: '',
    email: '',
    profile: null as File | null,
  });
  const [updateUser] = useUpdateUserMutation();

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userProfile) {
      setTimeout(() => {
        setFormData({
          name: userProfile.name || '',
          age: userProfile.age?.toString() || '',
          bio: userProfile.bio || '',
          email: userProfile.email || '',
          profile: userProfile.profile || null,
        });
        setProfileImage(userProfile.profile || null);
      }, 0);
    }
  }, [userProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setFormData(prev => ({ ...prev, profile: file }));

    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setProfileImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isUnchanged =
    userProfile &&
    formData.name === userProfile.name &&
    formData.age === userProfile.age.toString() &&
    formData.bio === userProfile.bio &&
    !previewImage;

  const handleSave = async () => {
    const name = formData.name.trim();
    const age = formData.age.trim();
    const bio = formData.bio.trim();
    const profile = formData.profile;

    if (!name) {
      alert('Name is required');
      return;
    }
    if (!age || Number(age) <= 0) {
      alert('Please enter a valid age');
      return;
    }
    if (!bio) {
      alert('Bio is required');
      return;
    }

    if (!profile && !profileImage) {
      alert('Profile image is required');
      return;
    }

    try {
      const newData = new FormData();
      newData.append('name', formData.name);
      newData.append('bio', formData.bio);
      newData.append('age', formData.age.toString());

      if (profile) {
        newData.append('profile', profile);
      }

      await updateUser({
        data: newData,
      }).unwrap();


      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const displayImage = previewImage || profileImage;

  return (
    <div className="min-h-screen w-full px-0 lg:px-4 bg-fa rounded-xl flex items-center justify-center py-8">
      <div className="w-full">
        <div className="shadow-md shadow-2xl overflow-hidden">
          <div className="px-8 py-6">
            <h1 className="text-xl lg:text-3xl font-bold primary-light text-center">
              Edit Your Profile
            </h1>
            <p className="primary-light text-center mt-2">
              Update your information and profile picture
            </p>
          </div>

          <div className="p-4 lg:p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                <div className="w-32 h-32 relative rounded-full overflow-hidden border-4 border-gradient-to-r from-pink-500 to-purple-600 shadow-xl">
                  {displayImage ? (
                    <Image
                      src={displayImage}
                      alt="User Avatar"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center font-bold text-4xl w-full h-full">
                      {formData.name?.slice(0, 2).toUpperCase() || 'NA'}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleImageClick}
                  disabled={isUploading}
                  className="absolute bottom-0 right-0 w-10 h-10 bg-section-border rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera className="w-5 h-5 text-white" />
                  )}
                </button>

                {displayImage && (
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-0 right-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  >
                    <X className="w-4 h-4 primary-light" />
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              <p className="text-sm primary-light mt-3 text-center">
                Click the camera icon to upload a new photo
                <br />
                <span className="text-xs">Max size: 5MB</span>
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold primary-light mb-2">
                  <User className="w-4 h-4 primary-light" />
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border-2 border-gray-200 primary-light rounded-xl focus:border-gray-300 focus:ring-2 focus:ring-gray-200 transition-all outline-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold primary-light mb-2">
                  <Calendar className="w-4 h-4 primary-light" />
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Enter your age"
                  className="w-full px-4 py-3 border-2 border-gray-200 primary-light rounded-xl focus:border-gray-300 focus:ring-2 focus:ring-gray-200 transition-all outline-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold primary-light mb-2">
                  <FileText className="w-4 h-4 primary-light" />
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Write something about yourself..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 primary-light rounded-xl focus:border-gray-300 focus:ring-2 focus:ring-gray-200 transition-all outline-none resize-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold primary-light mb-2">
                  <Mail className="w-4 h-4 primary-light" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed
                </p>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  onClick={handleSave}
                  disabled={isUnchanged}
                  className={`flex-1 flex text-primary items-center justify-center gap-2 bg-section-background px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all ${isUnchanged ? 'opacity-50 cursor-not-allowed hover:shadow-none' : ''}`}
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}