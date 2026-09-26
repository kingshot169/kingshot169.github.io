(() => {
  const P = window.KSPreferences, $ = (id) => document.getElementById(id);
  const URL = "https://iqjvzhgodwufvepegwyj.supabase.co",
    KEY = "sb_publishable_yLRLyVxBPBEoJob1kOznZg_bJoqlg-j";
  const client = window.supabase?.createClient(URL, KEY);
  let session = null,
    result = null,
    revision = 0,
    request = null,
    authRequest = null,
    expiry = null,
    checking = false;
  const errors = {
    invalid_request: "Check the kingdom and case-sensitive tag.",
    too_large: "Check the kingdom and case-sensitive tag.",
    not_found: "Alliance not found.",
    busy: "Search is busy. Please try again later.",
    timeout: "Search timed out. Please try again later.",
    unavailable: "Alliance data is unavailable.",
    malformed: "Alliance data is unavailable.",
  };
  const text = (node, value) => P.setRawText(node, String(value ?? ""));
  const label = (tag, key, params) => {
    const node = document.createElement(tag);
    P.setText(node, key, params);
    return node;
  };
  const raw = (tag, value) => {
    const node = document.createElement(tag);
    text(node, value);
    return node;
  };
  const fmt = (v) =>
    v == null
      ? P.text("Unavailable")
      : new Intl.NumberFormat(P.getLanguage(), { maximumFractionDigits: 1 })
        .format(v);
  function clear() {
    revision++;
    request?.abort();
    request = null;
    result = null;
    $("results").hidden = true;
    $("roster").replaceChildren();
    $("attention").replaceChildren();
    $("activity").replaceChildren();
    text($("identity"), "");
    text($("leader"), "");
    $("roster-section").open = false;
    $("attention-section").open = false;
    $("search").disabled = false;
  }
  function redirect(password = false) {
    clear();
    session = null;
    $("tool").hidden = true;
    location.replace(password ? "../admin/account/?required=1" : "../admin/");
  }
  async function check() {
    const previous = result, previousUser = session?.user.id;
    clear();
    const own = revision;
    session = null;
    checking = true;
    clearTimeout(expiry);
    authRequest?.abort();
    authRequest = new AbortController();
    const auth = authRequest;
    $("tool").hidden = true;
    $("auth-panel").hidden = false;
    $("auth-retry").hidden = true;
    P.setText($("auth-message"), "Checking your session…");
    let timer;
    try {
      await Promise.race([
        (async () => {
          const found = await client?.auth.getSession();
          if (own !== revision || auth.signal.aborted) return;
          if (found?.error) throw Error("session");
          const candidate = found?.data?.session;
          if (
            !candidate || !candidate.user?.id ||
            typeof candidate.access_token !== "string" ||
            !Number.isFinite(candidate.expires_at) ||
            candidate.expires_at * 1000 <= Date.now()
          ) {
            redirect();
            return;
          }
          const r = await fetch(URL + "/functions/v1/admin-profile", {
            headers: {
              apikey: KEY,
              Authorization: "Bearer " + candidate.access_token,
            },
            signal: auth.signal,
            cache: "no-store",
          });
          if (own !== revision || auth.signal.aborted) return;
          if (r.status === 401 || r.status === 403) {
            redirect();
            return;
          }
          if (!r.ok) throw Error("profile");
          const data = await r.json(), p = data.profile;
          if (own !== revision || auth.signal.aborted) return;
          if (
            data.ok !== true || p?.user_id !== candidate.user.id ||
            p?.is_active !== true
          ) {
            redirect();
            return;
          }
          if (p.must_change_password === true) {
            redirect(true);
            return;
          }
          if (
            p.must_change_password !== false || p.can_search_players !== true
          ) {
            redirect();
            return;
          }
          if (candidate.expires_at * 1000 <= Date.now()) {
            redirect();
            return;
          }
          session = candidate;
          checking = false;
          $("auth-panel").hidden = true;
          $("tool").hidden = false;
          if (previousUser === candidate.user.id && previous) {
            result = previous;
            $("results").hidden = false;
            render();
          }
          expiry = setTimeout(
            () => redirect(),
            Math.max(0, candidate.expires_at * 1000 - Date.now()),
          );
        })(),
        new Promise((_, reject) => {
          timer = setTimeout(() => {
            auth.abort();
            reject(Error("timeout"));
          }, 10000);
        }),
      ]);
    } catch {
      if (own === revision) {
        session = null;
        checking = false;
        $("tool").hidden = true;
        P.setText(
          $("auth-message"),
          "Unable to check your session. Please try again.",
        );
        $("auth-retry").hidden = false;
      }
    } finally {
      clearTimeout(timer);
    }
  }
  function member(m) {
    const card = document.createElement("article");
    card.className = "member";
    card.append(
      raw("h3", m.name),
      label("p", "Player ID {id}", {
        id: m.player_id ?? P.text("Unavailable"),
      }),
      label("p", "Alliance rank: {rank}", {
        rank: m.alliance_rank_label || fmt(m.alliance_rank),
      }),
    );
    if (result.freshness.activity_verified) {
      card.append(
        label("p", "Last recorded activity: {time}", {
          time: m.last_active_at
            ? P.dateTime(m.last_active_at)
            : P.text("Activity unknown"),
        }),
      );
    } else card.append(label("p", "Activity unknown"));
    card.append(
      label("p", "Reported online in snapshot: {value}", {
        value: P.text(
          m.online === true ? "Yes" : m.online === false ? "No" : "Unavailable",
        ),
      }),
    );
    if (m.player_id) {
      const copy = label("button", "Copy Player ID");
      copy.type = "button";
      copy.onclick = async () => {
        try {
          await navigator.clipboard.writeText(m.player_id);
          P.setText($("message"), "Player ID copied.");
        } catch {
          P.setText(
            $("message"),
            "Copy unavailable. Select the Player ID manually.",
          );
        }
      };
      card.append(copy);
    }
    return card;
  }
  function roster() {
    if (!result || !$("roster-section").open) {
      $("roster").replaceChildren();
      return;
    }
    const query = $("query").value.toLocaleLowerCase();
    const members = result.members.filter((m) =>
      !query || m.name.toLocaleLowerCase().includes(query) ||
      (m.player_id || "").includes(query)
    );
    P.setText($("shown"), "Showing {shown} of {total} members.", {
      shown: members.length,
      total: result.members.length,
    });
    $("roster").replaceChildren(...members.map(member));
  }
  function attention() {
    const host = $("attention");
    host.replaceChildren();
    if (!result || !$("attention-section").open) return;
    for (
      const [bucket, title] of [["older_than_7d", "Activity older than 7d"], [
        "unknown",
        "Activity unknown",
      ]]
    ) {
      const rows = result.members.filter((m) => m.activity_bucket === bucket);
      const section = document.createElement("details");
      section.className = "attention-group";
      const summary = label("summary", title);
      summary.append(" (" + fmt(rows.length) + ")");
      section.append(summary);
      const list = document.createElement("div");
      section.append(list);
      section.addEventListener("toggle", () => {
        list.replaceChildren(...(section.open ? rows.map(member) : []));
      });
      host.append(section);
    }
  }
  function render() {
    if (!result || !session) return;
    const a = result.alliance, s = result.summary, f = result.freshness;
    text($("identity"), "[" + a.tag + "] " + a.name);
    P.setText($("leader"), "State {state} · Leader: {name}", {
      state: a.kingdom,
      name: a.leader_name || P.text("Unavailable"),
    });
    P.setText(
      $("coverage"),
      "Members: {reported}; returned: {returned}; coverage: {coverage}%.",
      {
        reported: fmt(a.member_count_reported),
        returned: fmt(s.roster_returned),
        coverage: fmt(s.roster_coverage_percent),
      },
    );
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
    $("stale").hidden = !f.stale;
    $("unverified").hidden = f.activity_verified;
    $("windows-note").hidden = !f.activity_verified;
    const rows = [
      ["Recorded active within 24h", s.active_24h_count],
      ["Recorded active within 3d", s.active_3d_count],
      ["Recorded active within 7d", s.active_7d_count],
      ["Activity older than 7d", s.older_than_7d_count],
      ["Activity unknown", s.activity_unknown_count],
    ];
    $("activity").replaceChildren(...rows.map(([key, value]) => {
      const e = document.createElement("div");
      e.className = "metric";
      e.append(label("span", key), raw("strong", fmt(value)));
      return e;
    }));
    P.setText($("online"), "Reported online in snapshot: {value}", {
      value: fmt(s.reported_online_count),
    });
    P.setText(
      $("online-coverage"),
      "Online status known for {known} of {total} returned members.",
      { known: fmt(s.online_known_count), total: fmt(s.roster_returned) },
    );
    roster();
    attention();
  }
  $("search-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (checking || !session || session.expires_at * 1000 <= Date.now()) {
      await check();
      return;
    }
    clear();
    const own = revision, token = session.access_token;
    const kingdom = Number($("kingdom").value), tag = $("tag").value;
    if (
      !Number.isInteger(kingdom) || kingdom < 1 || kingdom > 999999 ||
      !/^[A-Za-z0-9_-]{1,8}$/.test(tag)
    ) {
      P.setText($("message"), errors.invalid_request);
      return;
    }
    request = new AbortController();
    const active = request;
    let slow, timeout;
    $("search").disabled = true;
    P.setText($("message"), "Searching alliance…");
    try {
      slow = setTimeout(() => {
        if (own === revision) {
          P.setText(
            $("message"),
            "MightPulse is refreshing data. This may take up to 90 seconds.",
          );
        }
      }, 8000);
      timeout = setTimeout(() => active.abort(), 115000);
      const r = await fetch(URL + "/functions/v1/alliance-search", {
        method: "POST",
        headers: {
          apikey: KEY,
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ kingdom, tag }),
        signal: active.signal,
        cache: "no-store",
      });
      const data = await r.json();
      if (own !== revision) return;
      if (r.status === 401 || r.status === 403) {
        redirect(data.code === "password_change_required");
        return;
      }
      if (!r.ok || data.ok !== true) throw Error(data.code || "unavailable");
      if (
        data.version !== 2 || data.access !== "admin" ||
        !Array.isArray(data.members) || !data.alliance || !data.summary ||
        !data.freshness
      ) throw Error("malformed");
      if (
        !session || session.access_token !== token ||
        session.expires_at * 1000 <= Date.now()
      ) {
        redirect();
        return;
      }
      result = data;
      $("results").hidden = false;
      P.setText($("message"), "Alliance loaded.");
      render();
    } catch (e) {
      if (own === revision) {
        P.setText(
          $("message"),
          active.signal.aborted
            ? errors.timeout
            : errors[e.message] || errors.unavailable,
        );
      }
    } finally {
      clearTimeout(slow);
      clearTimeout(timeout);
      if (own === revision) $("search").disabled = false;
    }
  });
  for (const id of ["kingdom", "tag"]) {
    $(id).addEventListener("input", () => {
      clear();
      P.setText($("message"), "");
    });
  }
  $("query").addEventListener("input", roster);
  $("roster-section").addEventListener("toggle", roster);
  $("attention-section").addEventListener("toggle", attention);
  $("auth-retry").onclick = check;
  client?.auth.onAuthStateChange((event) => {
    if (event !== "INITIAL_SESSION") {
      clear();
      session = null;
      $("tool").hidden = true;
      setTimeout(check, 0);
    }
  });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) check();
  });
  window.addEventListener("focus", () => {
    if (!checking) check();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clear();
      session = null;
      $("tool").hidden = true;
    } else check();
  });
  window.addEventListener("pagehide", () => {
    clear();
    session = null;
    authRequest?.abort();
    clearTimeout(expiry);
    $("tool").hidden = true;
  });
  window.addEventListener("ks-language-rendered", render);
  P.mount();
  check();
})();
