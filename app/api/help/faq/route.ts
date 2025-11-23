import { NextRequest, NextResponse } from 'next/server';

// FAQ data - in production, this could come from a database
const faqData = [
  {
    id: '1',
    question: 'How do I enroll in a course?',
    answer: 'Browse our courses page, select a course you\'re interested in, and click the "Enroll" button. You\'ll need to be logged in to enroll.',
    category: 'enrollment'
  },
  {
    id: '2',
    question: 'Are the courses free or paid?',
    answer: 'We offer both free and paid courses. Free courses are clearly marked, and paid courses show their pricing on the course page.',
    category: 'pricing'
  },
  {
    id: '3',
    question: 'How do I access my enrolled courses?',
    answer: 'Once enrolled, you can access all your courses from the "My Purchases" page in your dashboard.',
    category: 'access'
  },
  {
    id: '4',
    question: 'Can I download course materials?',
    answer: 'Yes, course materials including PDFs and videos are available for download once you\'re enrolled in a course.',
    category: 'materials'
  },
  {
    id: '5',
    question: 'How do I get a certificate?',
    answer: 'Certificates are automatically generated when you complete a course. You can view and download them from the "Accomplishments" page.',
    category: 'certificates'
  },
  {
    id: '6',
    question: 'How do I update my profile?',
    answer: 'You can update your profile information, including name, email, and profile picture, from the Settings page.',
    category: 'profile'
  },
  {
    id: '7',
    question: 'What if I forget my password?',
    answer: 'Use the "Forgot Password" link on the login page to reset your password. You\'ll receive instructions via email.',
    category: 'account'
  },
  {
    id: '8',
    question: 'Can I change my email address?',
    answer: 'Yes, you can update your email address from the Settings page. You\'ll need to verify the new email address.',
    category: 'account'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let faqs = faqData;
    if (category) {
      faqs = faqData.filter(faq => faq.category === category);
    }

    return NextResponse.json({
      success: true,
      faqs
    });
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

