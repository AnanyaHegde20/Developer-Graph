import { NextRequest, NextResponse } from 'next/server';
import { RecommendationService } from '@/lib/backend/services';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const service = new RecommendationService();
    const data = await service.getProjectRecommendations(id);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch recommendations' }, { status: 500 });
  }
}
