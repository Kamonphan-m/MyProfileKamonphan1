export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  category?: string | null;
  image?: string | null;
  image_url?: string | null;
  status?: string | null;
};

export type ProductInput = Omit<Product, 'id'>;

type CheckoutItem = {
  id: string;
  quantity: number;
};

type ApiErrorPayload = { error?: string; message?: string };

export class ApiError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');

function getApiBaseUrl() {
  if (!apiBaseUrl) {
    throw new ApiError('ยังไม่ได้ตั้งค่า EXPO_PUBLIC_API_URL สำหรับเชื่อมต่อ backend');
  }

  return apiBaseUrl;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, options);
  } catch {
    throw new ApiError('ไม่สามารถเชื่อมต่อ backend ได้ โปรดตรวจสอบ API URL และ server');
  }

  const contentType = response.headers.get('content-type') ?? '';
  const body = contentType.includes('application/json')
    ? ((await response.json()) as T | ApiErrorPayload)
    : undefined;

  if (!response.ok) {
    const errorBody = body as ApiErrorPayload | undefined;
    throw new ApiError(errorBody?.error ?? errorBody?.message ?? `คำขอล้มเหลว (${response.status})`, response.status);
  }

  return body as T;
}

function normalizeProduct(product: Product): Product {
  return {
    ...product,
    id: String(product.id),
    price: Number(product.price ?? 0),
    stock: Number(product.stock ?? 0),
  };
}

export async function getProducts() {
  const products = await request<Product[]>('/products');
  return products.map(normalizeProduct);
}

export async function getProduct(id: string) {
  try {
    return normalizeProduct(await request<Product>(`/products/${encodeURIComponent(id)}`));
  } catch (error) {
    // The deployed API currently exposes only GET /products. Keep edit mode
    // compatible while still using the backend as the source of truth.
    if (!(error instanceof ApiError) || error.status !== 404) throw error;

    const product = (await getProducts()).find((item) => item.id === String(id));
    if (!product) throw new ApiError('ไม่พบสินค้าที่ต้องการ', 404);
    return product;
  }
}

export async function createProduct(product: ProductInput) {
  return request<{ success: true; productId: number }>('/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
}

export async function updateProduct(id: string, product: Partial<ProductInput>) {
  return request<{ success: true }>(`/products/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
}

export async function deleteProduct(id: string) {
  return request<{ success: true }>(`/products/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function checkout(items: CheckoutItem[]) {
  return request<{ success: true }>('/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });
}
