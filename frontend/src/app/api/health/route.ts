import { NextResponse } from 'next/server';
import { connectDatabase } from '@/lib/backend/database/connection';

export async function GET() {
  try {
    const driver = await connectDatabase();
    const session = driver.session();
    try {
      await session.run('RETURN 1');
      return NextResponse.json({ status: 'ok', database: 'connected' });
    } finally {
      await session.close();
    }
  } catch (error) {
    return NextResponse.json({ status: 'error', database: 'disconnected' }, { status: 503 });
  }
}
