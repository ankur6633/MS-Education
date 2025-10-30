'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Edit, Trash2, Eye, LogOut, BookOpen, Video, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';

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
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchCourses = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(`/api/courses?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }

      const data = await response.json();
      setCourses(data.courses);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to fetch courses');
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, searchTerm]);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user.role !== 'admin') {
      router.push('/admin/login');
      return;
    }
    
    fetchCourses();
  }, [session, status, router, fetchCourses]);

  // Debounced search effect
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user.role !== 'admin') {
      return;
    }

    const timeoutId = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 1 }));
      fetchCourses();
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [searchTerm, fetchCourses, session, status]);

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }

      toast.success('Course deleted successfully');
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course');
      
    }
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

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!session || session.user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <BookOpen className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {session.user.username}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-8">
           <div className="flex-1 max-w-md">
             <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <Search className="h-5 w-5 text-gray-400" />
               </div>
               <input
                 type="text"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                 placeholder="Search courses..."
               />
             </div>
           </div>
          
          <Link
            href="/admin/courses/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Link>
        </div>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No courses</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new course.
            </p>
            <div className="mt-6">
              <Link
                href="/admin/courses/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="aspect-w-16 aspect-h-9">
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    width={800}
                    height={192}
                    className="w-full h-48 object-cover"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {course.title}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${course.badgeColor} text-white`}>
                      {course.badge}
                    </span>
                  </div>
                  
                  <p className="mt-1 text-sm text-primary-600 font-medium">
                    {course.hindiTitle}
                  </p>
                  
                  <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                    {course.description}
                  </p>
                  
                  <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Video className="h-4 w-4 mr-1" />
                      {course.videos.length} videos
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      {course.pdfs.length} PDFs
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <div className="text-gray-600">
                      {course.isPaid ? (
                        <span className="font-semibold">₹{course.currentPrice?.toLocaleString()}</span>
                      ) : (
                        <span className="font-semibold text-green-600">Free</span>
                      )}
                      {course.discount && (
                        <span className="ml-2 text-green-600 font-medium">{course.discount}% OFF</span>
                      )}
                    </div>
                    <div className="text-gray-500">
                      {course.duration} • {course.students} students
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Created {new Date(course.createdAt).toLocaleDateString()}
                    </span>
                    
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/admin/courses/${course._id}`}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Link>
                      <Link
                        href={`/admin/courses/${course._id}/edit`}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteCourse(course._id)}
                        className="inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} results
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-3 py-1 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <span className="px-3 py-1 text-sm text-gray-700">
                Page {pagination.page} of {pagination.pages}
              </span>
              
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-1 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
