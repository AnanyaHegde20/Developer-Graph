import { NextRequest, NextResponse } from 'next/server';
import { RecommendationService } from '@/lib/backend/services';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string; roleId: string }> }) {
  try {
    const { id, roleId } = await params;
    const service = new RecommendationService();
    const data = await service.getSkillGapAnalysis(id, roleId);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch skill gap' }, { status: 500 });
  }
}
