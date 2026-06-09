import { getProducts, saveProducts } from '@/lib/redis';
import { isAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  if (!isAdmin(request)) return Response.json({ error: 'unauthorized' }, { status: 401 });
  try {
    const products = await getProducts();
    const now = Date.now();
    products.forEach((p) => {
      p.count = 0;
      p.updatedAt = now;
    });
    await saveProducts(products);
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: 'reset_failed' }, { status: 500 });
  }
}
