interface Env {
  GSCSC_KV: KVNamespace;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const key = url.searchParams.get("key");

    if (!key || !/^[a-zA-Z0-9_-]+$/.test(key)) {
      return new Response(JSON.stringify({ success: false, error: "Invalid or missing key parameter" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const raw = await context.env.GSCSC_KV.get(key);
    if (!raw) {
      return new Response(JSON.stringify({ success: true, data: null }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });
    }

    return new Response(raw, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err?.message || "Error reading KV" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body: any = await context.request.json();
    const key = body?.key;
    const data = body?.data !== undefined ? body.data : body;

    if (!key || !/^[a-zA-Z0-9_-]+$/.test(key)) {
      return new Response(JSON.stringify({ success: false, error: "Invalid or missing key" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const dataString = typeof data === "string" ? data : JSON.stringify(data);
    await context.env.GSCSC_KV.put(key, dataString);

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err?.message || "Error writing KV" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};
