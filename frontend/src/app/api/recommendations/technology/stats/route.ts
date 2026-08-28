import { NextResponse } from 'next/server';
import { RecommendationService } from '@/lib/backend/services';

export async function GET() {
  try {
    const service = new RecommendationService();
    const data = await service.getTechnologyUsageStats();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch technology stats' }, { status: 500 });
  }
}
