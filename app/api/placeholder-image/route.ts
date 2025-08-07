import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const height = parseInt(searchParams.get('height') || '150', 10);
  const width = parseInt(searchParams.get('width') || '200', 10);
  const query = searchParams.get('query') || 'Placeholder';

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
      <rect width="${width}" height="${height}" fill="#e0e0e0"/>
      <text x="50%" y="50%" font-family="sans-serif" font-size="${Math.min(height / 5, width / 10)}" fill="#999999" text-anchor="middle" alignment-baseline="middle">${query}</text>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable', 
    },
  });
}
