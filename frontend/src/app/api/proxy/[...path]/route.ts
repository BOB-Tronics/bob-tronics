import { NextRequest, NextResponse } from "next/server";

const API_URL = "https://bobtronics-store-backend.onrender.com/api/v1";

export async function proxyHandler(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  const pathArray = resolvedParams.path || [];
  const subPath = pathArray.join("/");
  const searchParams = req.nextUrl.search;
  const targetUrl = `${API_URL}/${subPath}${searchParams}`;

  const headers = new Headers();
  req.headers.forEach((value, key) => {
    if (key !== "host" && key !== "connection") {
      headers.set(key, value);
    }
  });

  try {
    const body = ["GET", "HEAD"].includes(req.method) ? undefined : await req.text();
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
    });

    const data = await response.text();
    const resHeaders = new Headers();
    response.headers.forEach((val, key) => {
      resHeaders.set(key, val);
    });

    return new NextResponse(data, {
      status: response.status,
      headers: resHeaders,
    });
  } catch (error) {
    return NextResponse.json({ error: "Proxy fetch failed", details: String(error) }, { status: 500 });
  }
}

export { proxyHandler as GET, proxyHandler as POST, proxyHandler as PUT, proxyHandler as PATCH, proxyHandler as DELETE };
