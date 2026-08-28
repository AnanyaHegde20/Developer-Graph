import { NextRequest, NextResponse } from 'next/server';
import { DeveloperService } from '@/lib/backend/services';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get('q') || undefined;
    const service = new DeveloperService();
    const data = q ? await service.searchDevelopers(q) : await service.getAllDevelopers();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch developers' }, { status: 500 });
  }
}
