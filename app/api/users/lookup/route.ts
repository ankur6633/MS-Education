import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';

type IdentifierType = 'email' | 'mobile';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseIdentifier(raw: string): { type: IdentifierType; value: string } | null {
	const trimmed = raw.trim();
	if (emailRegex.test(trimmed.toLowerCase())) {
		return { type: 'email', value: trimmed.toLowerCase() };
	}
	const digits = trimmed.replace(/\D/g, '');
	if (digits.length === 10) {
		return { type: 'mobile', value: digits };
	}
	return null;
}

export async function POST(request: NextRequest) {
	try {
		const { identifier } = await request.json();
		if (!identifier || typeof identifier !== 'string') {
			return NextResponse.json({ success: false, error: 'Identifier is required' }, { status: 400 });
		}

		const parsed = parseIdentifier(identifier);
		if (!parsed) {
			return NextResponse.json(
				{ success: false, error: 'Enter a valid email address or 10-digit mobile number' },
				{ status: 400 }
			);
		}

		await connectDB();

		const query = parsed.type === 'email' ? { email: parsed.value } : { mobile: parsed.value };
		const user = await User.findOne(query);

		return NextResponse.json({
			success: true,
			exists: !!user,
			identifierType: parsed.type,
			identifier: parsed.value,
			user: user
				? {
						_id: user._id,
						name: user.name,
						email: user.email,
						mobile: user.mobile,
				  }
				: null,
		});
	} catch (error) {
		console.error('Identifier lookup error:', error);
		return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
}


