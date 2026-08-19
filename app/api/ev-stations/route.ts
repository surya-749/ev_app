import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat') || '12.9716';
  const lng = searchParams.get('lng') || '77.5946';
  const maxResults = searchParams.get('maxResults') || '12';

  const ocmUrl = `https://api.openchargemap.io/v3/poi/?output=json&countrycode=IN&latitude=${lat}&longitude=${lng}&distance=30&distanceunit=KM&maxresults=${maxResults}&compact=true&verbose=false`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(ocmUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'EV-ChargeGrid-App'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({ success: true, data });
    }
  } catch (error) {
    // Silent failover to mock/fallback data without crashing client
  }

  return NextResponse.json({ success: false, data: [] });
}
