import { NextRequest, NextResponse } from 'next/server';
import { ProjectService } from '@/lib/backend/services';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const service = new ProjectService();
    const data = await service.getProjectById(id);
    if (!data) return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch project' }, { status: 500 });
  }
}
