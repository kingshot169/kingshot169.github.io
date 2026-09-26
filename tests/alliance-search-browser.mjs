import { chromium } from "npm:playwright@1.55.1";
import { strict as assert } from "node:assert";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
const artifacts = await Deno.makeTempDir({
  prefix: "alliance-search-browser-",
});
const server = Deno.serve(
  { hostname: "127.0.0.1", port: 8773, onListen() {} },
  async (req) => {
    let path = new URL(req.url).pathname;
    if (path.includes("..")) return new Response("", { status: 403 });
    if (path.endsWith("/")) path += "index.html";
    try {
      return new Response(await Deno.readFile(root + path), {
        headers: {
          "Content-Type": path.endsWith(".js")
            ? "text/javascript"
            : path.endsWith(".css")
            ? "text/css"
            : "text/html",
        },
      });
    } catch {
      return new Response("", { status: 404 });
    }
  },
);
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
function data(details = false, tag = "kRZ") {
  return {
    ok: true,
    access: details ? "leadership" : "public",
    alliance: {
      name: "<img src=x onerror=alert(1)>",
      tag,
      kingdom: 169,
      leader_name: "Mock leader",
      member_count_reported: 4,
      power: 100000000000,
      power_rank: 2,
      flag_url: null,
    },
    summary: {
      roster_returned: 3,
      roster_coverage_percent: 75,
      roster_complete: false,
      power_known_count: 3,
      average_power: 2000000000,
      median_power: 2000000000,
      ...(details
        ? {
          active_24h_count: 1,
          active_7d_count: 2,
          older_than_7d_count: 0,
          activity_unknown_count: 1,
          reported_online_count: 1,
          online_known_count: 2,
          active_24h_power_percent: 50,
        }
        : {}),
    },
    freshness: {
      ...(details ? { activity_verified: true } : {}),
      freshness_known: false,
      our_cache_age_seconds: 10,
      stale: true,
    },
    members: [
      {
        name: "First <script>alert(1)</script>",
        player_id: "12345",
        power: 3000000000,
        town_center_level: 30,
        kills: null,
        alliance_rank: 5,
        avatar_url: null,
        ...(details
          ? {
            activity_bucket: "active_24h",
            last_active_at: "2026-09-26T11:00:00Z",
            online: true,
          }
          : {}),
      },
      {
        name: "Second",
        player_id: "12346",
        power: 2000000000,
        town_center_level: 25,
        kills: 200,
        alliance_rank: 4,
        avatar_url: "javascript:alert(1)",
        ...(details
          ? {
            activity_bucket: "active_7d",
            last_active_at: "2026-09-24T11:00:00Z",
            online: false,
          }
          : {}),
      },
      {
        name: "Unknown",
        player_id: null,
        power: 1000000000,
        town_center_level: 20,
        kills: 300,
        alliance_rank: null,
        avatar_url: null,
        ...(details
          ? {
            activity_bucket: "unknown",
            last_active_at: null,
            online: null,
          }
          : {}),
      },
    ],
  };
}
let passed = 0;
try {
  for (const lang of ["en", "ko", "es", "pt", "fr", "ar"]) {
    for (const theme of ["dark", "light"]) {
      const context = await browser.newContext({
          viewport: { width: lang === "en" ? 1280 : 390, height: 900 },
        }),
        page = await context.newPage(),
        errors = [],
        consoleErrors = [],
        calls = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (message) => {
        if (
          message.type() === "error" &&
          !message.text().includes("Failed to load resource")
        ) consoleErrors.push(message.text());
      });
      let code = null, gate = null;
      await context.addInitScript(({ lang, theme }) => {
        localStorage.setItem("ks-language", lang);
        localStorage.setItem("ks-theme", theme);
      }, { lang, theme });
      await context.addInitScript(() => {
        Object.defineProperty(navigator, "clipboard", {
          configurable: true,
          value: { writeText: async (value) => window.copiedPlayerId = value },
        });
      });
      await context.route("**/*", async (route) => {
        const url = route.request().url();
        if (url.startsWith("http://127.0.0.1:8773/")) return route.continue();
        if (url.includes("supabase-js")) {
          return route.fulfill({
            contentType: "text/javascript",
            body:
              `window.supabase={createClient(){return {auth:{getSession:async()=>({data:{session:{access_token:'mock',expires_at:Date.now()/1000+3600}}}),onAuthStateChange(fn){window.mockAuthChange=fn}}}}};`,
          });
        }
        if (url.endsWith("/alliance-search")) {
          const body = route.request().postDataJSON();
          calls.push(body);
          if (gate) await gate;
          if (code) {
            const status = code === "not_found"
              ? 404
              : code === "busy"
              ? 429
              : 503;
            return route.fulfill({ status, json: { ok: false, code } });
          }
          const result = data(body.details, body.tag);
          if (!body.details) {
            assert.equal(
              result.members.some((member) =>
                Object.hasOwn(member, "activity_bucket") ||
                Object.hasOwn(member, "last_active_at") ||
                Object.hasOwn(member, "online")
              ),
              false,
            );
            for (
              const key of [
                "active_24h_count",
                "active_7d_count",
                "older_than_7d_count",
                "activity_unknown_count",
                "reported_online_count",
                "active_24h_power_percent",
              ]
            ) assert.equal(Object.hasOwn(result.summary, key), false);
          }
          return route.fulfill({ json: result });
        }
        throw Error("Unexpected external request: " + url);
      });
      await page.goto("http://127.0.0.1:8773/alliance-search/");
      await page.locator("#tag").fill("kRZ");
      await page.locator("#search").click();
      await page.waitForSelector("#results:visible");
      assert.equal(calls[0].tag, "kRZ");
      assert.equal(calls[0].kingdom, 169);
      assert.equal(
        await page.locator(".member").first().locator("dd").nth(2)
          .textContent(),
        await page.evaluate(() => KSPreferences.text("Unavailable")),
      );
      assert.equal(await page.locator(".member").count(), 3);
      assert.equal(await page.locator("#identity img").count(), 0);
      assert.equal(await page.locator("#activity-panel").isVisible(), false);
      assert.equal(await page.locator("#bucket-filter").isVisible(), false);
      assert.equal(await page.locator(".member script").count(), 0);
      assert.equal(
        await page.locator(".member").first().textContent().then((t) =>
          t.includes("2026-09")
        ),
        false,
      );
      assert.equal(
        await page.locator(".member").first().textContent().then((t) =>
          t.includes("Activity unknown") || t.includes("Recorded active")
        ),
        false,
      );
      await page.locator("#query").fill("12346");
      assert.equal(await page.locator(".member").count(), 1);
      await page.locator("#query").fill("");
      await page.locator(".member button").first().click();
      await page.waitForFunction(() =>
        document.getElementById("message").textContent ===
          KSPreferences.text("Player ID copied.")
      );
      assert.equal(await page.evaluate(() => window.copiedPlayerId), "12345");
      await page.locator("#rank").selectOption("5");
      assert.equal(await page.locator(".member").count(), 1);
      await page.locator("#rank").selectOption("");
      await page.locator("#sort").selectOption("kills");
      assert.match(
        await page.locator(".member").first().textContent(),
        /Unknown/,
      );
      assert.equal(
        await page.evaluate(() =>
          document.documentElement.scrollWidth <= innerWidth + 1
        ),
        true,
      );
      assert.equal(
        await page.getAttribute("html", "dir"),
        lang === "ar" ? "rtl" : "ltr",
      );
      assert.equal(await page.getAttribute("html", "data-theme"), theme);
      assert.equal(await page.locator("#details").isDisabled(), true);
      assert.equal(await page.locator("#details").isVisible(), false);
      assert.equal(await page.locator("#freshness").isVisible(), true);
      assert.equal(await page.locator("#coverage").isVisible(), true);
      assert.equal(await page.locator(".avatar-placeholder").count(), 3);
      assert.equal(calls.some((c) => c.details), false);
      await page.evaluate(() => window.mockAuthChange("SIGNED_OUT", null));
      assert.equal(await page.locator("#results").isVisible(), false);
      code = "not_found";
      await page.locator("#search").click();
      await page.waitForFunction(() =>
        !document.getElementById("search").disabled
      );
      assert.equal(await page.locator("#results").isVisible(), false);
      code = null;
      await page.locator("#search").click();
      await page.waitForSelector("#results:visible");
      if (lang === "en") {
        code = "busy";
        await page.locator("#tag").fill("KRZ");
        await page.locator("#search").click();
        await page.waitForFunction(() =>
          !document.getElementById("search").disabled
        );
        assert.match(await page.locator("#message").textContent(), /busy/i);
        code = "unavailable";
        await page.locator("#search").click();
        await page.waitForFunction(() =>
          !document.getElementById("search").disabled
        );
        assert.match(
          await page.locator("#message").textContent(),
          /unavailable/i,
        );
        code = null;
        await page.locator("#tag").fill("aLT");
        await page.locator("#search").click();
        await page.waitForSelector("#results:visible");
        assert.equal(calls.at(-1).tag, "aLT");
        assert.match(await page.locator("#identity").textContent(), /^\[aLT\]/);
        let release;
        gate = new Promise((resolve) => release = resolve);
        await page.locator("#tag").fill("KRZ");
        await page.locator("#search").click();
        await page.waitForFunction(() =>
          document.getElementById("message").textContent.includes("refreshing")
        );
        release();
        gate = null;
        await page.waitForSelector("#results:visible");
        await page.setViewportSize({ width: 640, height: 450 });
        assert.equal(
          await page.evaluate(() =>
            document.documentElement.scrollWidth <= innerWidth + 1
          ),
          true,
        );
      }
      await page.screenshot({
        path: artifacts + "/" + lang + "-" + theme + ".png",
        fullPage: true,
      });
      if (lang === "en" && theme === "dark") {
        await page.goto("http://127.0.0.1:8773/");
        assert.equal(
          await page.locator('a[href="./alliance-search/"]').count(),
          1,
        );
      }
      assert.deepEqual(
        await page.evaluate(() => KSPreferences.getMissing()),
        [],
      );
      assert.deepEqual(errors, []);
      assert.deepEqual(consoleErrors, []);
      await context.close();
      passed++;
    }
  }
  console.log(
    `PASS ${passed} language/theme browser scenarios: roster, filters, safe rendering, details, session clearing, mobile, 200%-equivalent viewport. Screenshots: ${artifacts}`,
  );
} finally {
  await browser.close();
  await server.shutdown();
}
