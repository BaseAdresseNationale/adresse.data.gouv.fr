import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const isBlogMaintenance = true; // TODO : Remplacer par la variable d'env `NEXT_PUBLIC_BLOG_MAINTENANCE_MODE`
  // const isBlogMaintenance = process.env.NEXT_PUBLIC_BLOG_MAINTENANCE_MODE === 'true';

  if (isBlogMaintenance && request.nextUrl.pathname.startsWith('/blog')) {

    const url = request.nextUrl.clone();
    url.pathname = '/blog-maintenance';

    const response = NextResponse.rewrite(url, { status: 503 }); // Rewrite garde l'URL originale dans le navigateur (meilleur pour SEO)
    response.headers.set('Retry-After', '3600'); // Indique de revenir dans 1 heure (en secondes)
    response.headers.set('X-Robots-Tag', 'noindex'); // Sécurité supplémentaire pour le SEO

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/blog/:path*'
  ],
};
