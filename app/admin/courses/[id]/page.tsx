'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Trash2, Plus, Video, FileText, Clock, Eye, LogOut , X} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import VideoUploader from '@/components/admin/VideoUploader';
import PDFUploader from '@/components/admin/PDFUploader';

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  isPaid: boolean;
  videos: Array<{ title: string; url: string; duration: number; order: number }>;
  pdfs: Array<{ title: string; url: string; order: number }>;
  createdAt: string;
  updatedAt: string;
}

export default function CourseDetail({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'videos' | 'pdfs'>('videos');
  const [selectedPDF, setSelectedPDF] = useState<string | null>(null);
  const [showPDFModal, setShowPDFModal] = useState(false);

  useEffect(() => {
    if (!session || session.user.role !== 'admin') {
      router.push('/admin/login');
      return;
    }
    
    fetchCourse();
  }, [session, router, params.id]);

  const fetchCourse = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/courses/${params.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch course');
      }

      const courseData = await response.json();
      setCourse(courseData);
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Failed to fetch course');
      router.push('/admin');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVideo = async (videoIndex: number) => {
    if (!confirm('Are you sure you want to delete this video?')) {
      return;
    }

    try {
      const response = await fetch(`/api/courses/${params.id}/videos/${videoIndex}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete video');
      }

      toast.success('Video deleted successfully');
      fetchCourse();
    } catch (error) {
      console.error('Error deleting video:', error);
      toast.error('Failed to delete video');
    }
  };

  const handleDeletePDF = async (pdfIndex: number) => {
    if (!confirm('Are you sure you want to delete this PDF?')) {
      return;
    }

    try {
      const response = await fetch(`/api/courses/${params.id}/pdfs/${pdfIndex}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete PDF');
      }

      toast.success('PDF deleted successfully');
      fetchCourse();
    } catch (error) {
      console.error('Error deleting PDF:', error);
      toast.error('Failed to delete PDF');
    }
  };

  const handleViewPDF = (pdfUrl: string) => {
    console.log('Opening PDF:', pdfUrl);
    setSelectedPDF(pdfUrl);
    setShowPDFModal(true);
  };

  const closePDFModal = () => {
    setShowPDFModal(false);
    setSelectedPDF(null);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
                href="/admin"
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
                <p className="text-sm text-gray-600">
                  Created {new Date(course.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href={`/admin/courses/${course._id}/edit`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Course
              </Link>
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
        {/* Course Overview */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-6">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-32 h-24 object-cover rounded-lg"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-2">
                <h2 className="text-xl font-semibold text-gray-900">{course.title}</h2>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  course.isPaid 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {course.isPaid ? 'Paid' : 'Free'}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <Video className="h-4 w-4 mr-1" />
                  {course.videos.length} videos
                </div>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  {course.pdfs.length} PDFs
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {course.videos.reduce((total, video) => total + video.duration, 0)} min total
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow-sm rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('videos')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'videos'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Video className="h-4 w-4 inline mr-2" />
                Videos ({course.videos.length})
              </button>
              <button
                onClick={() => setActiveTab('pdfs')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pdfs'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="h-4 w-4 inline mr-2" />
                PDFs ({course.pdfs.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'videos' ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Course Videos</h3>
                  <VideoUploader courseId={course._id} onUpload={fetchCourse} />
                </div>

                {course.videos.length === 0 ? (
                  <div className="text-center py-12">
                    <Video className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No videos</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Upload videos to get started.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {course.videos
                      .sort((a, b) => a.order - b.order)
                      .map((video, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center">
                                <Video className="h-6 w-6 text-gray-400" />
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">{video.title}</h4>
                              <p className="text-sm text-gray-500">
                                Duration: {formatDuration(video.duration)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <a
                              href={video.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </a>
                            <button
                              onClick={() => handleDeleteVideo(index)}
                              className="inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Course PDFs</h3>
                  <PDFUploader courseId={course._id} onUpload={fetchCourse} />
                </div>

                {course.pdfs.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No PDFs</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Upload PDFs to get started.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {course.pdfs
                      .sort((a, b) => a.order - b.order)
                      .map((pdf, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center">
                                <FileText className="h-6 w-6 text-gray-400" />
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">{pdf.title}</h4>
                              <p className="text-sm text-gray-500">PDF Document</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewPDF(pdf.url)}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </button>
                            <button
                              onClick={() => handleDeletePDF(index)}
                              className="inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* PDF Viewer Modal */}
      {showPDFModal && selectedPDF && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 overflow-y-auto h-full w-full z-50">
          <div className="relative top-4 mx-auto p-5 w-11/12 h-5/6">
            <div className="relative bg-white rounded-lg shadow-xl h-full flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">PDF Viewer</h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                  </div>
                  <a
                    href={selectedPDF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Open in New Tab 
                    
                  </a>
                  <button
                    onClick={closePDFModal}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-white bg-red-600 hover:bg-red-700"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Close
                  </button>
                </div>
              </div>
              <div className="flex-1 p-4">
                <iframe
                  src={selectedPDF}
                  className="w-full h-full border-0"
                  title="PDF Viewer"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
