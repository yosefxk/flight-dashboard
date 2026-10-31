import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const backendBase = process.env.BACKEND_INTERNAL_URL || "http://flight_dashboard_backend:8001";
  const searchParams = request.nextUrl.searchParams.toString();
  const targetUrl = `${backendBase}/api/flights${searchParams ? `?${searchParams}` : ""}`;

  try {
    const res = await fetch(targetUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch from backend service", details: String(error) },
      { status: 502 }
    );
  }
}

export async function POST(request: NextRequest) {
  const backendBase = process.env.BACKEND_INTERNAL_URL || "http://flight_dashboard_backend:8001";
  const targetUrl = `${backendBase}/api/flights/refresh`;

  try {
    const res = await fetch(targetUrl, {
      method: "POST",
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to trigger refresh on backend service", details: String(error) },
      { status: 502 }
    );
  }
}
