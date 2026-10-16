import { NextRequest, NextResponse } from "next/server";

const API_URL = "https://bobtronics-store-backend.onrender.com/api/v1";

async function proxyHandler(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await context.params;
  const pathArray = resolvedParams.path || [];
  const subPath = pathArray.join("/");
  const searchParams = req.nextUrl.search;
  const targetUrl = `${API_URL}/${subPath}${searchParams}`;

  const headers = new Headers();
  req.headers.forEach((value, key) => {
    if (key !== "host" && key !== "connection" && key !== "content-length") {
      headers.set(key, value);
    }
  });

  try {
    const body = ["GET", "HEAD"].includes(req.method) ? undefined : await req.text();
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      redirect: "follow",
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

export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyHandler(req, context);
}
export async function POST(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyHandler(req, context);
}
export async function PUT(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyHandler(req, context);
}
export async function PATCH(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyHandler(req, context);
}
export async function DELETE(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyHandler(req, context);
}
