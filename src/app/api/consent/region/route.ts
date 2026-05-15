import { NextResponse } from 'next/server';
import { detectCountryFromHeaders, isStrictConsentRegion } from '@/lib/consent/region';

export async function GET(req: Request) {
  const country = detectCountryFromHeaders(req.headers);
  const strict = isStrictConsentRegion(country);
  return NextResponse.json({ country, strict });
}
