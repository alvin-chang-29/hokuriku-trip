-- Run once in your own Supabase project's SQL Editor.
-- The same family account signs in on all three devices.
begin;
create table if not exists public.family_trip (
 user_id uuid primary key references auth.users(id) on delete cascade,
 data jsonb not null,
 revision bigint not null default 1,
 updated_at timestamptz not null default now()
);
alter table public.family_trip enable row level security;
revoke all on public.family_trip from anon, authenticated;
grant select on public.family_trip to authenticated;
drop policy if exists "Read own family trip" on public.family_trip;
create policy "Read own family trip" on public.family_trip for select to authenticated using ((select auth.uid())=user_id);

create or replace function public.save_family_trip(expected_revision bigint, new_data jsonb)
returns jsonb language plpgsql security definer set search_path=''
as $$
declare
 owner_id uuid := auth.uid();
 current_row public.family_trip%rowtype;
 category text; item jsonb; allowed text[]; ids text[]; item_id text;
begin
 if owner_id is null then raise exception 'Authentication required'; end if;
 if expected_revision is null or expected_revision<0 then raise exception 'Invalid revision'; end if;
 if new_data is null or jsonb_typeof(new_data)<>'object' or octet_length(new_data::text)>2097152 then raise exception 'Invalid trip or exceeds 2 MB'; end if;
 if (new_data - array['itinerary','prep','arrival','restaurants','shopping'])<>'{}'::jsonb then raise exception 'Unknown fields: passports are device-only'; end if;
 foreach category in array array['itinerary','prep','arrival','restaurants','shopping'] loop
  if jsonb_typeof(new_data->category) is distinct from 'array' then raise exception 'Missing collection'; end if;
  allowed := case category when 'itinerary' then array['id','name','area','note','day'] when 'prep' then array['id','name','area','done'] when 'arrival' then array['id','name','area','done'] when 'restaurants' then array['id','name','area','cuisine','note'] else array['id','name','area','place','qty','price','done','note'] end;
  ids := array[]::text[];
  for item in select value from jsonb_array_elements(new_data->category) loop
   if jsonb_typeof(item)<>'object' then raise exception 'Invalid item'; end if;
   if (item-allowed)<>'{}'::jsonb or jsonb_typeof(item->'name') is distinct from 'string' or jsonb_typeof(item->'id') is distinct from 'string' then raise exception 'Invalid item fields'; end if;
   item_id := item->>'id';
   if item_id !~ '^[-a-zA-Z0-9_]+$' or item_id=any(ids) then raise exception 'Duplicate or invalid ID'; end if;
   ids := array_append(ids,item_id);
   if exists(select 1 from jsonb_each(item) as f where jsonb_typeof(f.value) not in ('string','number','boolean')) then raise exception 'Fields must be scalar'; end if;
   if category='itinerary' and not coalesce((item->>'day')=any(array['12/03（四）','12/04（五）','12/05（六）','12/06（日）','12/07（一）','12/08（二）','12/09（三）','12/10（四）']),false) then raise exception 'Invalid day'; end if;
  end loop;
 end loop;
 -- Serialize writers, including the first insert. Compare-and-swap prevents lost updates.
 perform pg_advisory_xact_lock(hashtextextended(owner_id::text,0));
 select * into current_row from public.family_trip where user_id=owner_id;
 if found then
  if current_row.revision<>expected_revision then return jsonb_build_object('ok',false,'revision',current_row.revision); end if;
  update public.family_trip set data=new_data,revision=revision+1,updated_at=now() where user_id=owner_id returning * into current_row;
 else
  if expected_revision<>0 then return jsonb_build_object('ok',false,'revision',0); end if;
  insert into public.family_trip(user_id,data) values(owner_id,new_data) returning * into current_row;
 end if;
 return jsonb_build_object('ok',true,'data',current_row.data,'revision',current_row.revision,'updated_at',current_row.updated_at);
end $$;
revoke all on function public.save_family_trip(bigint,jsonb) from public,anon;
grant execute on function public.save_family_trip(bigint,jsonb) to authenticated;
commit;
