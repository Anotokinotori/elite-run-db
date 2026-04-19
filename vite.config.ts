/// <reference types="vitest/config" />
import type { IncomingMessage, ServerResponse } from "node:http";
import { defineConfig, type Connect } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

const ENKA_PROXY_PREFIX = "/api/enka/uid/";
const ENKA_PROXY_HEADERS = {
  Accept: "application/json,text/html;q=0.9,*/*;q=0.8",
  "Accept-Language": "ja,en-US;q=0.9,en;q=0.8",
  Referer: "https://enka.network/",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
};

function isHtmlLikeResponse(contentType: string | null, body: string) {
  return (contentType ?? "").includes("text/html") || /^\s*<!doctype html/i.test(body) || /^\s*<html/i.test(body);
}

function json(res: ServerResponse, statusCode: number, payload: unknown) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

async function handleEnkaProxy(req: IncomingMessage, res: ServerResponse) {
  const url = req.url ? new URL(req.url, "http://localhost") : null;
  const pathname = url?.pathname ?? "";

  if (!pathname.startsWith(ENKA_PROXY_PREFIX)) {
    return false;
  }

  const uid = pathname.slice(ENKA_PROXY_PREFIX.length).trim();

  if (!/^\d{9}$/.test(uid)) {
    json(res, 400, {
      message: "UIDは9桁の数字で入力してください。",
    });
    return true;
  }

  try {
    const response = await fetch(`https://enka.network/api/uid/${uid}`, {
      headers: ENKA_PROXY_HEADERS,
    });
    const contentType = response.headers.get("content-type") ?? "application/json; charset=utf-8";
    const body = await response.text();

    if (!response.ok || isHtmlLikeResponse(contentType, body)) {
      json(res, 502, {
        message:
          "Enka.Network 側で認証確認が入り、プロフィールを取得できませんでした。少し時間をおいてもう一度お試しください。",
      });
      return true;
    }

    res.statusCode = response.status;
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "no-store");
    res.end(body);
  } catch {
    json(res, 502, {
      message: "Enka.Network へ接続できませんでした。時間をおいて再度お試しください。",
    });
  }

  return true;
}

function attachEnkaProxy(server: { middlewares: { use: (handler: Connect.NextHandleFunction) => void } }) {
  server.middlewares.use((req, res, next) => {
    void handleEnkaProxy(req, res)
      .then((handled) => {
        if (!handled) {
          next();
        }
      })
      .catch(next);
  });
}

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/**/*.test.ts"],
  },
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "enka-proxy",
      configureServer(server) {
        attachEnkaProxy(server);
      },
      configurePreviewServer(server) {
        attachEnkaProxy(server);
      },
    },
  ],
});
