import { NextRequest, NextResponse } from 'next/server';
import { ProjectService } from '@/lib/backend/services';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get('q') || undefined;
    const service = new ProjectService();
    const data = q ? await service.searchProjects(q) : await service.getAllProjects();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch projects' }, { status: 500 });
  }
}
