import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, and message are required.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      receivedAt: new Date().toISOString(),
      data: body,
      message: 'Thank you! Your message has been received.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Internal server error processing form submission.' },
      { status: 500 }
    );
  }
}
