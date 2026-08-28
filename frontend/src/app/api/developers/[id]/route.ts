import { NextRequest, NextResponse } from 'next/server';
import { DeveloperService } from '@/lib/backend/services';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const service = new DeveloperService();
    const data = await service.getDeveloperSummary(id);
    if (!data) return NextResponse.json({ success: false, error: 'Developer not found' }, { status: 404 });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch developer' }, { status: 500 });
  }
}
