import { NextRequest, NextResponse } from 'next/server';
import { SkillService } from '@/lib/backend/services';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const service = new SkillService();
    const data = await service.getRelatedSkills(id);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch related skills' }, { status: 500 });
  }
}
