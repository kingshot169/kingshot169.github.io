(() => {
  const P = window.KSPreferences,
    $ = (id) => document.getElementById(id),
    KEY = "sb_publishable_yLRLyVxBPBEoJob1kOznZg_bJoqlg-j",
    URL = "https://iqjvzhgodwufvepegwyj.supabase.co";
  const client = window.supabase?.createClient(URL, KEY);
  let result = null, controller = null, generation = 0, expiry = null;
  const labels = {
    active_24h: "Recorded active within 24h",
    active_7d: "Recorded active within 7d",
    older_than_7d: "Activity older than 7d",
    unknown: "Activity unknown",
  };
  const errors = {
    invalid_request: "Check the kingdom and case-sensitive tag.",
    too_large: "Check the kingdom and case-sensitive tag.",
    not_found: "Alliance not found.",
    busy: "Search is busy. Please try again later.",
    timeout: "Search timed out. Please try again later.",
    unavailable: "Alliance data is unavailable.",
    malformed: "Alliance data is unavailable.",
    sign_in: "Sign in to an active admin account for details.",
    forbidden: "Admin activity access denied.",
  };
  const raw = (tag, value) => {
    const e = document.createElement(tag);
    e.textContent = String(value ?? "");
    e.translate = false;
    return e;
  };
  const label = (tag, key, params) => {
    const e = document.createElement(tag);
    P.setText(e, key, params);
    return e;
  };
  const fmt = (v) =>
    v === null || v === undefined
      ? P.text("Unavailable")
      : new Intl.NumberFormat(P.getLanguage(), { maximumFractionDigits: 1 })
        .format(v);
  const msg = (key) => P.setText($("message"), key);
  function safeImage(url) {
    try {
      const u = new window.URL(url);
      return u.protocol === "https:" &&
          ["mightpulse.com", "api.mightpulse.com"].includes(u.hostname) &&
          !u.username && !u.password
        ? u.href
        : null;
    } catch {
      return null;
    }
  }
  function picture(url) {
    const img = document.createElement("img");
    img.alt = "";
    img.loading = "lazy";
    img.referrerPolicy = "no-referrer";
    img.src = url;
    img.onerror = () => img.replaceWith(placeholder());
    return img;
  }
  function placeholder() {
    const e = document.createElement("span");
    e.className = "avatar-placeholder";
    e.setAttribute("aria-hidden", "true");
    e.textContent = "◇";
    return e;
  }
  function metrics(host, rows) {
    host.replaceChildren(...rows.map(([key, value]) => {
      const e = document.createElement("div");
      e.className = "metric";
      e.append(label("span", key), raw("strong", fmt(value)));
      return e;
    }));
  }
  function clear() {
    ++generation;
    controller?.abort();
    controller = null;
    clearTimeout(expiry);
    result = null;
    $("results").hidden = true;
    $("roster").replaceChildren();
    $("search").disabled = false;
  }
  function render() {
    if (!result) return;
    const { alliance: a, summary: s, freshness: f } = result;
    $("identity").textContent = `[${a.tag}] ${a.name}`;
    P.setText($("leader"), "Leader: {name}", {
      name: a.leader_name || P.text("Unavailable"),
    });
    const flag = safeImage(a.flag_url);
    $("flag").hidden = !flag;
    if (flag) {
      $("flag").src = flag;
      $("flag").onerror = () => {
        $("flag").hidden = true;
      };
    } else $("flag").removeAttribute("src");
    metrics($("overview"), [
      ["Kingdom ID", a.kingdom],
      ["Reported members", a.member_count_reported],
      ["Reported alliance power", a.power],
      ["Power rank", a.power_rank],
      ["Average member power", s.average_power],
      ["Median member power", s.median_power],
    ]);
    P.setText(
      $("freshness"),
      f.freshness_known
        ? "Provider age: {age}s; local cache age: {cache}s."
        : "Provider freshness unknown; local cache age: {cache}s.",
      {
        age: fmt(f.estimated_provider_age_seconds),
        cache: fmt(f.our_cache_age_seconds),
      },
    );
    P.setText(
      $("coverage"),
      "Roster: {returned}/{reported}; coverage: {coverage}%. Power known: {known}.",
      {
        returned: fmt(s.roster_returned),
        reported: fmt(a.member_count_reported),
        coverage: fmt(s.roster_coverage_percent),
        known: fmt(s.power_known_count),
      },
    );
    if (!s.roster_complete) {
      $("coverage").append(
        " ",
        P.text(
          "Roster completeness is uncertain; statistics describe returned members only.",
        ),
      );
    }
    $("stale").hidden = !f.stale;
    $("unverified").hidden = f.activity_verified;
    const leadership = false; // Publication: activity semantics remain unverified.
    $("activity-panel").hidden = !leadership;
    $("bucket-filter").hidden = !leadership;
    $("activity-sort").hidden = !leadership || !f.activity_verified;
    $("activity-sort").disabled = !leadership || !f.activity_verified;
    if (leadership) {
      metrics($("activity"), [
        ["Recorded active within 24h", s.active_24h_count],
        ["Recorded active within 7d", s.active_7d_count],
        ["Activity older than 7d", s.older_than_7d_count],
        ["Activity unknown", s.activity_unknown_count],
        ["Reported online", s.reported_online_count],
        ["24h-active power share (%)", s.active_24h_power_percent],
      ]);
    } else $("activity").replaceChildren();
    roster();
  }
  function roster() {
    if (!result) return;
    const query = $("query").value.toLocaleLowerCase(),
      rank = $("rank").value,
      b = $("bucket").value,
      sort = $("sort").value;
    const members = result.members.filter((m) =>
      (!query || m.name.toLocaleLowerCase().includes(query) ||
        (m.player_id || "").includes(query)) &&
      (!rank || String(m.alliance_rank) === rank) &&
      (result.access !== "leadership" || !b || m.activity_bucket === b ||
        (b === "active_7d" && m.activity_bucket === "active_24h"))
    );
    const value = (m) =>
      sort === "last_active_at"
        ? (result.access === "leadership"
          ? (m.last_active_at ? Date.parse(m.last_active_at) : null)
          : ({
            active_24h: 3,
            active_7d: 2,
            older_than_7d: 1,
          }[m.activity_bucket] ?? null))
        : m[sort];
    members.sort((a, b) => {
      const x = value(a), y = value(b);
      return x == null ? (y == null ? 0 : 1) : y == null ? -1 : y - x;
    });
    P.setText($("shown"), "Showing {shown} of {total} members.", {
      shown: members.length,
      total: result.members.length,
    });
    $("roster").replaceChildren(...members.map((m) => {
      const card = document.createElement("article");
      card.className = "member";
      const avatar = safeImage(m.avatar_url);
      card.append(avatar ? picture(avatar) : placeholder());
      card.append(
        raw("h3", m.name),
        raw("p", m.player_id ?? P.text("Unavailable")),
      );
      const dl = document.createElement("dl");
      for (
        const [key, v] of [
          ["Power", m.power],
          ["Town-center level", m.town_center_level],
          ["Kills", m.kills],
          ["Alliance rank", m.alliance_rank],
        ]
      ) dl.append(label("dt", key), raw("dd", fmt(v)));
      if (m.alliance_rank_label) card.append(raw("p", m.alliance_rank_label));
      card.append(dl);
      if (result.access === "leadership") {
        card.append(label("p", labels[m.activity_bucket] || labels.unknown));
      }
      if (result.access === "leadership") {
        card.append(
          label("p", "Last recorded activity: {time}", {
            time: m.last_active_at
              ? P.dateTime(m.last_active_at)
              : P.text("Unavailable"),
          }),
          label("p", "Reported online: {value}", {
            value: P.text(
              m.online === true
                ? "Yes"
                : m.online === false
                ? "No"
                : "Unavailable",
            ),
          }),
        );
      }
      if (m.player_id) {
        const copy = label("button", "Copy Player ID");
        copy.type = "button";
        copy.onclick = async () => {
          try {
            await navigator.clipboard.writeText(m.player_id);
            msg("Player ID copied.");
          } catch {
            msg("Copy unavailable. Select the Player ID manually.");
          }
        };
        card.append(copy);
      }
      return card;
    }));
  }
  $("search-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    clear();
    const own = generation, details = false; // Public-only until activity semantics are established.
    const kingdom = Number($("kingdom").value), tag = $("tag").value;
    if (
      !Number.isInteger(kingdom) || kingdom < 1 || kingdom > 999999 ||
      !/^[A-Za-z0-9_-]{1,8}$/.test(tag)
    ) {
      msg(errors.invalid_request);
      return;
    }
    const requestController = new AbortController();
    controller = requestController;
    const signal = requestController.signal;
    let slow, timeout;
    $("search").disabled = true;
    msg("Searching alliance…");
    try {
      let token = KEY, expires = null;
      if (details) {
        const session = (await client?.auth.getSession())?.data?.session;
        if (own !== generation) return;
        if (
          !session || !Number.isFinite(session.expires_at) ||
          session.expires_at * 1000 <= Date.now()
        ) throw Error("sign_in");
        token = session.access_token;
        expires = session.expires_at * 1000;
      }
      slow = setTimeout(() => {
        if (own === generation) {
          msg("MightPulse is refreshing data. This may take up to 90 seconds.");
        }
      }, 8000);
      timeout = setTimeout(() => requestController.abort(), 115000);
      const response = await fetch(URL + "/functions/v1/alliance-search", {
        method: "POST",
        headers: {
          apikey: KEY,
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kingdom,
          tag,
          ...(details ? { details: true } : {}),
        }),
        signal,
        cache: "no-store",
      });
      const body = await response.json();
      if (own !== generation) return;
      if (!response.ok || body.ok !== true) {
        throw Error(body.code || "unavailable");
      }
      if (
        !Array.isArray(body.members) || !body.alliance || !body.summary ||
        !body.freshness || body.access !== "public" ||
        body.members.some((m) =>
          ["uid", "fid", "last_active_at", "online", "activity_bucket"].some(
            (k) => Object.hasOwn(m, k),
          )
        )
      ) throw Error("unavailable");
      if (expires && expires <= Date.now()) throw Error("sign_in");
      result = body;
      $("results").hidden = false;
      const rank = $("rank");
      rank.replaceChildren(label("option", "All ranks"));
      rank.firstChild.value = "";
      for (
        const r of [
          ...new Set(
            body.members.map((m) => m.alliance_rank).filter((v) => v !== null),
          ),
        ].sort((a, b) => b - a)
      ) {
        const o = raw("option", r);
        o.value = r;
        rank.append(o);
      }
      msg("Alliance loaded.");
      render();
      if (expires) {
        expiry = setTimeout(() => {
          clear();
          msg(errors.sign_in);
        }, Math.max(0, expires - Date.now()));
      }
    } catch (e) {
      if (own === generation) {
        msg(
          signal.aborted
            ? errors.timeout
            : (errors[e.message] || errors.unavailable),
        );
      }
    } finally {
      clearTimeout(slow);
      clearTimeout(timeout);
      if (own === generation) $("search").disabled = false;
    }
  });
  for (const id of ["query", "rank", "bucket", "sort"]) {
    $(id).addEventListener("input", roster);
  }
  for (const id of ["kingdom", "tag", "details"]) {
    $(id).addEventListener("input", () => {
      clear();
      msg("");
    });
  }
  client?.auth.onAuthStateChange((event) => {
    if (event !== "INITIAL_SESSION") {
      clear();
      msg("");
    }
  });
  window.addEventListener("pagehide", clear);
  // Clear protected data when leaving the page; require a fresh server check on return.
  document.addEventListener("visibilitychange", () => {
    if (
      document.hidden &&
      ($("details").checked || result?.access === "leadership")
    ) clear();
  });
  window.addEventListener("ks-language-rendered", render);
  P.mount();
})();
