import { NextRequest, NextResponse } from 'next/server';
import { RoleService } from '@/lib/backend/services';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get('q') || undefined;
    const service = new RoleService();
    const data = q ? await service.searchRoles(q) : await service.getAllRoles();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch roles' }, { status: 500 });
  }
}
