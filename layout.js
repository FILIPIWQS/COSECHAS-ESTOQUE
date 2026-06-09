import { getProducts, saveProducts, redisConfigured } from '@/lib/redis';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  if (!redisConfigured) return Response.json({ error: 'db_not_configured' }, { status: 503 });
  try {
    const body = await request.json();
    const id = body.id;
    const count = Number(body.count);
    if (!id) return Response.json({ error: 'id_required' }, { status: 400 });
    if (Number.isNaN(count) || count < 0) {
      return Response.json({ error: 'invalid_count' }, { status: 400 });
    }
    const products = await getProducts();
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) return Response.json({ error: 'not_found' }, { status: 404 });
    products[idx].count = count;
    products[idx].updatedAt = Date.now();
    await saveProducts(products);
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: 'count_failed' }, { status: 500 });
  }
}
