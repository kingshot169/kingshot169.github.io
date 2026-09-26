import { chromium } from "npm:playwright@1.55.1";
import { strict as assert } from "node:assert";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url)),
  artifacts = await Deno.makeTempDir({ prefix: "alliance-activity-browser-" });
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
const session = {
  user: { id: "admin-a" },
  access_token: "synthetic-token",
  expires_at: Math.floor(Date.now() / 1000) + 3600,
};
const fixture = () => ({
  ok: true,
  version: 3,
  access: "admin",
  alliance: {
    name: "Mock alliance <img onerror=alert(1)>",
    tag: "KRZ",
    kingdom: 169,
    leader_name: "Leader",
    member_count_reported: 98,
  },
  summary: {
    roster_returned: 98,
    roster_coverage_percent: 100,
    roster_complete: true,
    identity_complete: true,
    active_24h_count: 52,
    active_3d_count: 21,
    active_7d_count: 13,
    older_than_7d_count: 8,
    activity_unknown_count: 4,
    reported_online_count: 21,
    online_known_count: 90,
  },
  freshness: {
    activity_verified: true,
    freshness_known: true,
    estimated_provider_age_seconds: 96,
    our_cache_age_seconds: 0,
    stale: false,
  },
  members: Array.from({ length: 98 }, (_, i) => ({
    name: "Member " + i,
    player_id: String(10000 + i),
    alliance_rank: 4,
    alliance_rank_label: "R4",
    last_active_at: i < 94 ? "2026-09-20T12:00:00Z" : null,
    online: i < 21 ? true : i < 90 ? false : null,
    activity_bucket: i < 52
      ? "active_24h"
      : i < 73
      ? "active_3d"
      : i < 86
      ? "active_7d"
      : i < 94
      ? "older_than_7d"
      : "unknown",
  })),
});
async function setup(
  {
    lang = "en",
    theme = "dark",
    profile = {},
    signedIn = session,
    defer = false,
    profileStatus = 200,
    activityVerified = true,
  } = {},
) {
  const context = await browser.newContext({
      viewport: { width: lang === "en" ? 1280 : 390, height: 900 },
    }),
    page = await context.newPage(),
    calls = [],
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await context.addInitScript(({ lang, theme, signedIn }) => {
    localStorage.setItem("ks-language", lang);
    localStorage.setItem("ks-theme", theme);
    window.mockSession = signedIn;
  }, { lang, theme, signedIn });
  let release;
  const wait = new Promise((resolve) => release = resolve);
  await context.route("**/*", async (route) => {
    const u = route.request().url();
    if (u.includes("/admin/account/")) {
      return route.fulfill({
        contentType: "text/html",
        body: "<p>Account</p>",
      });
    }
    if (u.startsWith("http://127.0.0.1:8773/")) return route.continue();
    if (u.includes("supabase-js")) {
      return route.fulfill({
        contentType: "text/javascript",
        body:
          "window.supabase={createClient(){return {auth:{getSession:async()=>({data:{session:window.mockSession}}),onAuthStateChange(fn){window.mockAuthChange=(event,s)=>{window.mockSession=s;fn(event,s)}},signOut:async()=>({})}}}};",
      });
    }
    if (u.endsWith("/admin-profile")) {
      if (defer) await wait;
      return route.fulfill({
        status: profileStatus,
        json: {
          ok: profileStatus === 200,
          profile: {
            user_id: "admin-a",
            is_active: true,
            can_search_players: true,
            must_change_password: false,
            username: "mock",
            ...profile,
          },
        },
      });
    }
    if (u.endsWith("/alliance-search")) {
      calls.push(route.request().postDataJSON());
      assert.equal(
        route.request().headers().authorization,
        "Bearer synthetic-token",
      );
      const data = fixture();
      if (!activityVerified) {
        data.freshness.activity_verified = false;
        for (
          const key of [
            "active_24h_count",
            "active_3d_count",
            "active_7d_count",
            "older_than_7d_count",
          ]
        ) data.summary[key] = null;
        data.summary.activity_unknown_count = 98;
        data.members.forEach((m) => {
          m.last_active_at = null;
          m.activity_bucket = "unknown";
        });
      }
      return route.fulfill({ json: data });
    }
    throw Error("Unexpected external request");
  });
  return { context, page, calls, errors, release };
}
let passed = 0;
try {
  {
    const { context, page } = await setup({ activityVerified: false });
    await page.goto("http://127.0.0.1:8773/alliance-search/");
    await page.waitForSelector("#tool:visible");
    await page.locator("#tag").fill("KRZ");
    await page.locator("#search").click();
    await page.waitForSelector("#results:visible");
    assert.equal(await page.locator("#unverified").isVisible(), true);
    assert.equal(await page.locator("#windows-note").isVisible(), false);
    assert.equal(await page.locator(".member").count(), 0);
    await context.close();
    passed++;
  }
  for (const lang of ["en", "ko", "es", "pt", "fr", "ar"]) {
    for (const theme of ["dark", "light"]) {
      const { context, page, calls, errors } = await setup({ lang, theme });
      await page.goto("http://127.0.0.1:8773/alliance-search/");
      await page.waitForSelector("#tool:visible");
      await page.locator("#tag").fill("KRZ");
      await page.locator("#search").click();
      await page.waitForSelector("#results:visible");
      assert.deepEqual(calls, [{ kingdom: 169, tag: "KRZ" }]);
      assert.equal(await page.locator(".member").count(), 0);
      assert.equal(
        await page.locator("#roster-section").getAttribute("open"),
        null,
      );
      assert.equal(
        await page.locator("#attention-section").getAttribute("open"),
        null,
      );
      for (const id of ["coverage", "freshness", "online", "windows-note"]) {
        assert.equal(await page.locator("#" + id).isVisible(), true);
      }
      assert.equal(await page.locator("#identity img").count(), 0);
      assert.equal(
        await page.locator("#activity strong").allTextContents().then((a) =>
          a.reduce((sum, v) => sum + Number(v), 0)
        ),
        98,
      );
      if (lang === "en") {
        assert.match(
          await page.locator("#online").textContent(),
          /Reported online in this snapshot/,
        );
      }
      if (lang === "en") {
        assert.match(
          await page.locator("#results").textContent(),
          /up to 60 minutes old/,
        );
        assert.doesNotMatch(
          await page.locator("#results").textContent(),
          /Online now/,
        );
      }
      assert.equal(await page.locator("#unverified").isVisible(), false);
      assert.equal(
        await page.evaluate(() =>
          document.documentElement.scrollWidth <= innerWidth + 1
        ),
        true,
      );
      assert.equal(
        await page.locator("#results").evaluate((e) =>
          e.getBoundingClientRect().height < 1200
        ),
        true,
      );
      await page.screenshot({
        path: artifacts + "/" + lang + "-" + theme + ".png",
        fullPage: true,
      });
      await page.locator("#attention-section > summary").click();
      assert.equal(await page.locator(".attention-group").count(), 2);
      assert.equal(await page.locator(".member").count(), 0);
      await page.locator("#roster-section > summary").click();
      await page.waitForFunction(() =>
        document.querySelectorAll("#roster .member").length === 98
      );
      assert.equal(
        await page.locator("#roster").textContent().then((t) =>
          /Kills|Power|Town-center/.test(t)
        ),
        false,
      );
      await page.locator("#query").fill("10005");
      assert.equal(await page.locator("#roster .member").count(), 1);
      await page.locator("#query").fill("");
      assert.equal(await page.locator("#roster .member").count(), 98);
      await page.locator("#roster-section > summary").click();
      await page.waitForFunction(() =>
        document.querySelectorAll("#roster .member").length === 0
      );
      assert.equal(
        await page.getAttribute("html", "dir"),
        lang === "ar" ? "rtl" : "ltr",
      );
      assert.equal(await page.getAttribute("html", "data-theme"), theme);
      assert.deepEqual(
        await page.evaluate(() => KSPreferences.getMissing()),
        [],
      );
      if (lang === "en" && theme === "dark") {
        await page.goto("http://127.0.0.1:8773/");
        assert.equal(
          await page.locator('a[href="./alliance-search/"]').count(),
          0,
        );
        await page.goto("http://127.0.0.1:8773/admin/");
        await page.waitForSelector("#dashboard:visible");
        assert.equal(
          await page.locator('a[href="../alliance-search/"]').count(),
          1,
        );
      }
      assert.deepEqual(errors, []);
      await context.close();
      passed++;
    }
  }
  for (
    const options of [
      { signedIn: null },
      { profile: { can_search_players: false } },
      { profile: { is_active: false } },
      { profile: { can_search_players: null } },
      { profileStatus: 403 },
    ]
  ) {
    const { context, page, calls } = await setup(options);
    await page.goto("http://127.0.0.1:8773/alliance-search/");
    await page.waitForURL("**/admin/");
    assert.equal(calls.length, 0);
    if (options.profile?.can_search_players === false) {
      await page.waitForSelector("#dashboard:visible");
      assert.equal(
        await page.locator('a[href="../alliance-search/"]').count(),
        0,
      );
    }
    await context.close();
    passed++;
  }
  {
    const { context, page, calls } = await setup({
      profile: { must_change_password: true },
    });
    await page.goto("http://127.0.0.1:8773/alliance-search/");
    await page.waitForURL("**/admin/account/?required=1");
    assert.equal(calls.length, 0);
    await context.close();
    passed++;
  }
  {
    const { context, page, calls, release } = await setup({ defer: true });
    await page.goto("http://127.0.0.1:8773/alliance-search/");
    assert.equal(await page.locator("#tool").isVisible(), false);
    assert.equal(await page.locator("#auth-panel").isVisible(), true);
    assert.equal(page.url().includes("/admin/"), false);
    release();
    await page.waitForSelector("#tool:visible");
    assert.equal(calls.length, 0);
    await page.locator("#tag").fill("KRZ");
    await page.locator("#search").click();
    await page.waitForSelector("#results:visible");
    await page.evaluate(() => window.mockAuthChange("SIGNED_OUT", null));
    await page.waitForURL("**/admin/");
    assert.equal(calls.length, 1);
    await context.close();
    passed++;
  }
  console.log(
    "PASS " + passed +
      " Alliance Activity scenarios: 98-member compact layout, lazy collapsed roster, strict admin/session gate, dashboard/home links, six languages, themes, RTL. Screenshots: " +
      artifacts,
  );
} finally {
  await browser.close();
  await server.shutdown();
}
