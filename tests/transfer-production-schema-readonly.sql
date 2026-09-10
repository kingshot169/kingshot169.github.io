-- Metadata only. Run using an authorized read-only production connection.
-- Does not invoke the rate limiter, inspect application rows, or mutate data.
begin read only;
set local statement_timeout = '10s';

select n.nspname as schema_name, c.relname as table_name,
       a.attname as column_name, pg_catalog.format_type(a.atttypid,a.atttypmod) as data_type,
       a.attnotnull as not_null, a.attidentity as identity_kind,
       a.attgenerated as generated_kind,
       pg_catalog.pg_get_expr(d.adbin,d.adrelid) as default_expression
from pg_catalog.pg_class c
join pg_catalog.pg_namespace n on n.oid=c.relnamespace
join pg_catalog.pg_attribute a on a.attrelid=c.oid
left join pg_catalog.pg_attrdef d on d.adrelid=c.oid and d.adnum=a.attnum
where n.nspname='public' and c.relname in ('admin_profiles','admin_audit_log')
  and a.attnum>0 and not a.attisdropped
order by c.relname,a.attnum;

select p.oid::regprocedure as exact_signature,
       pg_catalog.pg_get_function_arguments(p.oid) as arguments_and_defaults,
       pg_catalog.pg_get_function_result(p.oid) as returned_structure,
       p.prosecdef as security_definer, p.proconfig as function_settings,
       p.proacl as explicit_acl
from pg_catalog.pg_proc p
join pg_catalog.pg_namespace n on n.oid=p.pronamespace
where n.nspname='public' and p.proname='check_public_rate_limit';

select c.relname as table_name,c.relrowsecurity as rls_enabled,
       c.relforcerowsecurity as rls_forced,c.relacl as explicit_acl
from pg_catalog.pg_class c
join pg_catalog.pg_namespace n on n.oid=c.relnamespace
where n.nspname='public' and c.relname in ('admin_profiles','admin_audit_log');

select con.conrelid::regclass as table_name,con.conname,
       pg_catalog.pg_get_constraintdef(con.oid) as definition
from pg_catalog.pg_constraint con
where con.conrelid in (to_regclass('public.admin_profiles'),to_regclass('public.admin_audit_log'))
order by table_name,con.conname;

select t.tgrelid::regclass as table_name,t.tgname,t.tgenabled,
       pg_catalog.pg_get_triggerdef(t.oid) as definition
from pg_catalog.pg_trigger t
where t.tgrelid in (to_regclass('public.admin_profiles'),to_regclass('public.admin_audit_log'))
  and not t.tgisinternal;
rollback;
