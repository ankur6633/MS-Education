'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { ArrowLeft, Upload, X, LogOut, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
// Removed direct Cloudinary import - using API route instead

const courseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  hindiTitle: z.string().min(1, 'Hindi title is required').max(200, 'Hindi title must be less than 200 characters'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters'),
  isPaid: z.boolean(),
  currentPrice: z.number().optional(),
  originalPrice: z.number().optional(),
  duration: z.string().min(1, 'Duration is required'),
  students: z.string().min(1, 'Students count is required'),
  rating: z.number().min(0).max(5),
  reviews: z.number().min(0),
});

type CourseForm = z.infer<typeof courseSchema>;

interface Course {
  _id: string;
  title: string;
  hindiTitle: string;
  description: string;
  thumbnail: string;
  isPaid: boolean;
  currentPrice?: number;
  originalPrice?: number;
  discount?: number;
  duration: string;
  students: string;
  rating: number;
  reviews: number;
  features: string[];
  badge: string;
  badgeColor: string;
  image: string;
  theme: string;
  videos: Array<{ title: string; url: string; duration: number }>;
  pdfs: Array<{ title: string; url: string }>;
  createdAt: string;
  updatedAt: string;
}

export default function EditCourse({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [features, setFeatures] = useState<string[]>(['']);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [formHasChanges, setFormHasChanges] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CourseForm>({
    resolver: zodResolver(courseSchema),
  });

  const isPaid = watch('isPaid');

  const addFeature = () => {
    setFeatures([...features, '']);
  };

  const removeFeature = (index: number) => {
    if (features.length > 1) {
      setFeatures(features.filter((_, i) => i !== index));
    }
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
    setFormHasChanges(true);
  };

  const refreshCourseData = () => {
    setHasInitialized(false);
    fetchCourse();
  };

  useEffect(() => {
    if (!session || session.user.role !== 'admin') {
      router.push('/admin/login');
      return;
    }
    
    // Only fetch course data if not initialized and form doesn't have changes
    if (!hasInitialized && !formHasChanges) {
      fetchCourse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, router, params.id, hasInitialized, formHasChanges]);

  // Add a focus event listener to refresh data when user comes back to the page
  useEffect(() => {
    const handleFocus = () => {
      // Only refresh if the page has been initialized, course exists, and form doesn't have changes
      if (hasInitialized && course && !formHasChanges) {
        // Small delay to ensure any updates from other tabs are reflected
        setTimeout(() => {
          refreshCourseData();
        }, 100);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasInitialized, course, formHasChanges]);

  const fetchCourse = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/courses/${params.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch course');
      }

      const courseData = await response.json();
      setCourse(courseData);
      setThumbnailPreview(courseData.thumbnail);
      
      // Set features from course data
      if (courseData.features && courseData.features.length > 0) {
        setFeatures(courseData.features);
      } else {
        setFeatures(['']);
      }
      
      // Reset form with course data
      reset({
        title: courseData.title,
        hindiTitle: courseData.hindiTitle || '',
        description: courseData.description,
        isPaid: courseData.isPaid,
        currentPrice: courseData.currentPrice,
        originalPrice: courseData.originalPrice,
        duration: courseData.duration || '',
        students: courseData.students || '',
        rating: courseData.rating || 0,
        reviews: courseData.reviews || 0,
      });
      
      setHasInitialized(true);
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Failed to fetch course');
      router.push('/admin');
    } finally {
      setIsLoading(false);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(course?.thumbnail || '');
  };

  const handleLogout = async () => {
    try {
      await signOut({ 
        callbackUrl: '/admin/login',
        redirect: true 
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed. Please try again.');
    }
  };

  const onSubmit = async (data: CourseForm) => {
    // Filter out empty features
    const validFeatures = features.filter(feature => feature.trim() !== '');
    if (validFeatures.length === 0) {
      toast.error('Please add at least one feature');
      return;
    }

    setIsUploading(true);

    try {
      let thumbnailUrl = course?.thumbnail;

      // Upload new thumbnail if selected
      if (thumbnail) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', thumbnail);
        uploadFormData.append('folder', 'mseducation/thumbnails');

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload thumbnail');
        }

        const uploadResult = await uploadResponse.json();
        thumbnailUrl = uploadResult.url;
      }

      // Calculate discount if both prices are provided
      let discount = undefined;
      if (data.currentPrice && data.originalPrice && data.originalPrice > data.currentPrice) {
        discount = Math.round(((data.originalPrice - data.currentPrice) / data.originalPrice) * 100);
      }

      // Update course
      const response = await fetch(`/api/courses/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          features: validFeatures,
          discount,
          badge: course?.badge || 'NEW',
          badgeColor: course?.badgeColor || 'bg-blue-500',
          image: course?.image || '📚',
          theme: course?.theme || 'default',
          thumbnail: thumbnailUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update course');
      }

      toast.success('Course updated successfully');
      
      // Update local state with the updated course data
      const updatedCourseData = await response.json();
      setCourse(updatedCourseData);
      
      // Reset the form with updated data to maintain consistency
      reset({
        title: updatedCourseData.title,
        hindiTitle: updatedCourseData.hindiTitle || '',
        description: updatedCourseData.description,
        isPaid: updatedCourseData.isPaid,
        currentPrice: updatedCourseData.currentPrice,
        originalPrice: updatedCourseData.originalPrice,
        duration: updatedCourseData.duration || '',
        students: updatedCourseData.students || '',
        rating: updatedCourseData.rating || 0,
        reviews: updatedCourseData.reviews || 0,
      });
      
      // Update features if they changed
      if (updatedCourseData.features && updatedCourseData.features.length > 0) {
        setFeatures(updatedCourseData.features);
      }
      
      // Reset form changes flag after successful update
      setFormHasChanges(false);
      
      // Don't redirect immediately, let user see the success message
      setTimeout(() => {
        router.push(`/admin/courses/${params.id}`);
      }, 1500);
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Failed to update course');
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Course not found</h2>
          <Link
            href="/admin"
            className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Link
                href={`/admin/courses/${course._id}`}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Course
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Edit Course</h1>
              <button
                onClick={refreshCourseData}
                className="ml-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                title="Refresh course data"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Basic Information</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Course Title *
                </label>
                <input
                  {...register('title')}
                  type="text"
                  onChange={(e) => {
                    register('title').onChange(e);
                    setFormHasChanges(true);
                  }}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter course title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="hindiTitle" className="block text-sm font-medium text-gray-700">
                  Hindi Title *
                </label>
                <input
                  {...register('hindiTitle')}
                  type="text"
                  onChange={(e) => {
                    register('hindiTitle').onChange(e);
                    setFormHasChanges(true);
                  }}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter Hindi course title"
                />
                {errors.hindiTitle && (
                  <p className="mt-1 text-sm text-red-600">{errors.hindiTitle.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Course Description *
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  onChange={(e) => {
                    register('description').onChange(e);
                    setFormHasChanges(true);
                  }}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter course description"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Course Type
                </label>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="false"
                      checked={!isPaid}
                      onChange={() => {
                        setValue('isPaid', false);
                        setFormHasChanges(true);
                      }}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Free</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="true"
                      checked={isPaid}
                      onChange={() => {
                        setValue('isPaid', true);
                        setFormHasChanges(true);
                      }}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Paid</span>
                  </label>
                </div>
              </div>

              {/* Pricing Information */}
              {isPaid && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="currentPrice" className="block text-sm font-medium text-gray-700">
                        Current Price (₹)
                      </label>
                      <input
                        {...register('currentPrice', { valueAsNumber: true })}
                        type="number"
                        min="0"
                        onChange={(e) => {
                          register('currentPrice').onChange(e);
                          setFormHasChanges(true);
                        }}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        placeholder="15999"
                      />
                      {errors.currentPrice && (
                        <p className="mt-1 text-sm text-red-600">{errors.currentPrice.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700">
                        Original Price (₹)
                      </label>
                      <input
                        {...register('originalPrice', { valueAsNumber: true })}
                        type="number"
                        min="0"
                        onChange={(e) => {
                          register('originalPrice').onChange(e);
                          setFormHasChanges(true);
                        }}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        placeholder="25999"
                      />
                      {errors.originalPrice && (
                        <p className="mt-1 text-sm text-red-600">{errors.originalPrice.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Course Thumbnail</h2>
            
            <div className="space-y-4">
              {thumbnailPreview ? (
                <div className="relative">
                  <Image
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    width={800}
                    height={192}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeThumbnail}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="thumbnail" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Upload thumbnail image
                        </span>
                        <span className="mt-1 block text-sm text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </span>
                      </label>
                      <input
                        id="thumbnail"
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="sr-only"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Course Details */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Course Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                  Duration *
                </label>
                <input
                  {...register('duration')}
                  type="text"
                  onChange={(e) => {
                    register('duration').onChange(e);
                    setFormHasChanges(true);
                  }}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., 6 Months"
                />
                {errors.duration && (
                  <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="students" className="block text-sm font-medium text-gray-700">
                  Students Count *
                </label>
                <input
                  {...register('students')}
                  type="text"
                  onChange={(e) => {
                    register('students').onChange(e);
                    setFormHasChanges(true);
                  }}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., 12,500+"
                />
                {errors.students && (
                  <p className="mt-1 text-sm text-red-600">{errors.students.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                  Rating (0-5) *
                </label>
                <input
                  {...register('rating', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  onChange={(e) => {
                    register('rating').onChange(e);
                    setFormHasChanges(true);
                  }}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="4.8"
                />
                {errors.rating && (
                  <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="reviews" className="block text-sm font-medium text-gray-700">
                  Reviews Count *
                </label>
                <input
                  {...register('reviews', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  onChange={(e) => {
                    register('reviews').onChange(e);
                    setFormHasChanges(true);
                  }}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="2850"
                />
                {errors.reviews && (
                  <p className="mt-1 text-sm text-red-600">{errors.reviews.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Course Features */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Course Features</h2>
            
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter feature (e.g., Live Classes)"
                  />
                  {features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                + Add Feature
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4">
            <Link
              href={`/admin/courses/${course._id}`}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isUploading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Updating...' : 'Update Course'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
