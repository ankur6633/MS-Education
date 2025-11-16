import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { profileUpdateSchema } from '@/lib/validators/profileSchema';

// Helper to extract email from session, header, or query param
async function getRequestEmail(request: NextRequest): Promise<string | null> {
	// Try NextAuth session (admin sessions)
	try {
		const session = await getServerSession(authOptions);
		if (session?.user?.email) {
			return session.user.email;
		}
	} catch {}

	// Try custom header set by frontend (UserProvider context)
	const headerEmail = request.headers.get('x-user-email');
	if (headerEmail) return headerEmail;

	// Fallback to query param
	const { searchParams } = new URL(request.url);
	const queryEmail = searchParams.get('email');
	if (queryEmail) return queryEmail;

	return null;
}

// GET /api/users/profile - fetch current user's profile
export async function GET(request: NextRequest) {
	try {
		await connectDB();

		const email = await getRequestEmail(request);
		if (!email) {
			return NextResponse.json({ error: 'Unauthorized - Email required' }, { status: 401 });
		}

		const user = await User.findOne({ email });
		if (!user) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		return NextResponse.json({
			success: true,
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
				mobile: user.mobile,
				address: (user as any).address ?? '',
				interestField: (user as any).interestField ?? '',
				// Include interests array for clients that use multiple interests
				interests: Array.isArray((user as any).interests) ? (user as any).interests : [],
				bio: (user as any).bio ?? '',
				skills: Array.isArray((user as any).skills) ? (user as any).skills : [],
				enrolledCourses: user.enrolledCourses ?? [],
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
				profileImage: (user as any).profileImage ?? undefined
			}
		});
	} catch (error) {
		console.error('Error fetching user profile:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

// PUT /api/users/profile - update current user's profile
export async function PUT(request: NextRequest) {
	try {
		await connectDB();

		const email = await getRequestEmail(request);
		if (!email) {
			return NextResponse.json({ error: 'Unauthorized - Email required' }, { status: 401 });
		}

		const body = await request.json();
		// Validate payload
		const parsed = profileUpdateSchema.safeParse(body);
		if (!parsed.success) {
			const message = parsed.error.issues?.[0]?.message || 'Invalid payload';
			return NextResponse.json({ success: false, error: message }, { status: 400 });
		}
		let { name, mobile, email: newEmail, address, interestField, bio, skills, profileImage, interests } = parsed.data as any;
		// Normalize mobile to exactly 10 digits
		if (mobile) {
			mobile = mobile.replace(/\D/g, '').slice(0, 10);
		}

		const user = await User.findOne({ email });
		if (!user) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		// If mobile is changing, ensure uniqueness
		if (mobile && mobile !== user.mobile) {
			const existing = await User.findOne({ mobile });
			if (existing) {
				return NextResponse.json(
					{ success: false, error: 'Mobile number already in use' },
					{ status: 409 }
				);
			}
			user.mobile = mobile;
		}

		// If email is changing, ensure uniqueness
		if (newEmail && newEmail !== user.email) {
			const existingByEmail = await User.findOne({ email: newEmail });
			if (existingByEmail) {
				return NextResponse.json(
					{ success: false, error: 'Email already in use' },
					{ status: 409 }
				);
			}
			user.email = newEmail;
		}

		// Update basic and additional fields
		if (name) user.name = name;
		if (address !== undefined) (user as any).address = address;
		if (interestField !== undefined) (user as any).interestField = interestField;
		if (bio !== undefined) (user as any).bio = bio;
		if (profileImage !== undefined) (user as any).profileImage = profileImage;
		// Merge interests from either 'interests' or legacy 'interestField'
		if (interests !== undefined) {
			if (Array.isArray(interests)) {
				(user as any).interests = interests.map((s: string) => s.trim()).filter(Boolean);
			} else if (typeof interests === 'string') {
				(user as any).interests = interests.split(',').map((s: string) => s.trim()).filter(Boolean);
			}
		} else if (typeof interestField === 'string' && interestField.trim().length > 0) {
			(user as any).interests = interestField.split(',').map((s: string) => s.trim()).filter(Boolean);
		}
		// Normalize skills
		if (skills !== undefined && Array.isArray(skills)) {
			(user as any).skills = skills.map(s => s.trim()).filter(Boolean);
		} else if (typeof skills === 'string') {
			(user as any).skills = skills.split(',').map(s => s.trim()).filter(Boolean);
		}

		await user.save();

		return NextResponse.json({
			success: true,
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
				mobile: user.mobile,
				address: (user as any).address ?? '',
				interestField: (user as any).interestField ?? '',
				interests: Array.isArray((user as any).interests) ? (user as any).interests : [],
				bio: (user as any).bio ?? '',
				skills: Array.isArray((user as any).skills) ? (user as any).skills : [],
				enrolledCourses: user.enrolledCourses ?? [],
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
				profileImage: (user as any).profileImage ?? undefined
			}
		});
	} catch (error) {
		console.error('Error updating user profile:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}


