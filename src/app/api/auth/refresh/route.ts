import { clearTokens, setTokens } from '@/helpers/server/auth/actions';
import { apiUrl } from '@/utils/apiUrl';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
    const cookieStore = cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (!refreshToken) {
        return NextResponse.json({ error: 'No refresh token provided' }, { status: 401 });
    }

    try {
        // Call your API to refresh tokens
        const response = await fetch(`${apiUrl}/auth/refresh`, {
            method: 'POST',
            body: JSON.stringify({ refresh_token: refreshToken }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error('Failed to refresh token');
        }

        const { access_token, refresh_token } = await response.json();

        setTokens(access_token, refresh_token)

        return NextResponse.json({ success: true });
    } catch (error) {
        clearTokens()
        return NextResponse.json({ error: 'Failed to refresh token' }, { status: 401 });
    }
}
