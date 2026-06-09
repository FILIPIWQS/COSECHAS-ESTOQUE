import { getProducts, saveProducts, redisConfigured } from '@/lib/redis';
import { isAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export async function GET() {
  if (!redisConfigured) {
    return Response.json({ error: 'db_not_configured' }, { status: 503 });
  }
  try {
    const products = await getProducts();
    return Response.json({ products });
  } catch (e) {
    return Response.json({ error: 'read_failed' }, { status: 500 });
  }
}

export async function POST(request) {
  if (!isAdmin(request)) return Response.json({ error: 'unauthorized' }, { status: 401 });
  try {
    const body = await request.json();
    const name = String(body.name || '').trim();
    if (!name) return Response.json({ error: 'name_required' }, { status: 400 });
    const unit = String(body.unit || '').trim();
    const par = Math.max(0, Number(body.par) || 0);
    const products = await getProducts();
    const product = { id: genId(), name, unit, par, count: 0, updatedAt: Date.now() };
    products.push(product);
    await saveProducts(products);
    return Response.json({ product });
  } catch (e) {
    return Response.json({ error: 'create_failed' }, { status: 500 });
  }
}

export async function PUT(request) {
  if (!isAdmin(request)) return Response.json({ error: 'unauthorized' }, { status: 401 });
  try {
    const body = await request.json();
    const id = body.id;
    if (!id) return Response.json({ error: 'id_required' }, { status: 400 });
    const products = await getProducts();
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) return Response.json({ error: 'not_found' }, { status: 404 });
    const p = products[idx];
    if (body.name !== undefined) p.name = String(body.name).trim();
    if (body.unit !== undefined) p.unit = String(body.unit).trim();
    if (body.par !== undefined) p.par = Math.max(0, Number(body.par) || 0);
    p.updatedAt = Date.now();
    products[idx] = p;
    await saveProducts(products);
    return Response.json({ product: p });
  } catch (e) {
    return Response.json({ error: 'update_failed' }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!isAdmin(request)) return Response.json({ error: 'unauthorized' }, { status: 401 });
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return Response.json({ error: 'id_required' }, { status: 400 });
    const products = await getProducts();
    const filtered = products.filter((p) => p.id !== id);
    await saveProducts(filtered);
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: 'delete_failed' }, { status: 500 });
  }
}
