import { NextRequest, NextResponse } from 'next/server';
import { RoleService } from '@/lib/backend/services';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const service = new RoleService();
    const data = await service.getRoleById(id);
    if (!data) return NextResponse.json({ success: false, error: 'Role not found' }, { status: 404 });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch role' }, { status: 500 });
  }
}
