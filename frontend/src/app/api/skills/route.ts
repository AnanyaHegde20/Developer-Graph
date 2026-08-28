import { NextRequest, NextResponse } from 'next/server';
import { SkillService } from '@/lib/backend/services';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get('q') || undefined;
    const service = new SkillService();
    const data = q ? await service.searchSkills(q) : await service.getAllSkills();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch skills' }, { status: 500 });
  }
}
