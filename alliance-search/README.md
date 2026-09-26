# Alliance Activity — v3

The operator confirmed that the v3 alliance-search backend was updated before publication of this matching frontend. Live KRZ aggregate validation remains pending; deployment confirmation alone does not establish roster timestamp compatibility.

The operator observed numeric Unix-second-scale last_active_at and boolean online in one Player Search response. last_login is never used. The backend validates finite numeric seconds, a conservative 2000 UTC plausibility floor, valid UTC conversion and at most five minutes of clock skew. Millisecond-scale values are rejected. Each alliance snapshot must pass its own representation check before activity is enabled. A live KRZ roster validation has not yet occurred.

Version 3 returns disjoint activity counts: <24h, 1–3 days, 3–7 days, 7+ days and unknown. Exact 24h/3d/7d boundaries enter the next group. The five groups partition returned members; a separate recorded_within_7d_count is cumulative and never added to those cards. Missing identities suppress reliable counts and coverage. Coverage compares returned count with reported membership; online observation coverage is explicit.

The admin-only response includes activity_validation: aggregate input types, validity counts and min/max derived age in days at acquisition. No names, IDs or raw timestamps appear in that object. It supports the next authorized KRZ diagnostic without additional member lookups. The previous v2 response could not recover these original values.

UI: compact mobile summary; provider freshness and roster coverage; Reported online in this snapshot; explicit warning that provider data may be up to 60 minutes old. Needs attention (7+ days/unknown) and Full Roster remain collapsed. Optional members show only name, public ID with copy, rank, last recorded activity and snapshot online state. No combat/profile clutter, scores or historical storage.

Authorization is unchanged: restored Supabase session plus active profile, can_search_players=true and must_change_password=false. The function verifies permission before and after retrieval. Unauthorized direct access follows the existing admin login/account flow. Both themes, six languages and RTL remain supported.

Backend source: ../kingshot169-backend/supabase/functions/alliance-search/ (not Git-backed). See backend docs/alliance-activity.md for validation fields and rollout constraints. Player Search, secrets, SQL, other Edge Functions and shared theme/language runtime are unchanged. Backend and frontend v3 must be coordinated after review; older response versions fail closed.
