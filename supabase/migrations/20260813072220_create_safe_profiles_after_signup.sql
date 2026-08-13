create or replace function public.handle_new_auth_user_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  safe_nickname text;
  safe_language text;
  safe_grade smallint;
  safe_interests text[];
begin
  safe_nickname := left(coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), split_part(coalesce(new.email, new.phone, 'Bridge Student'), '@', 1)), 30);
  if char_length(safe_nickname) < 2 then safe_nickname := 'Bridge Student'; end if;
  safe_language := left(coalesce(nullif(trim(new.raw_user_meta_data ->> 'native_language'), ''), '未设置 / Not set'), 40);
  if char_length(safe_language) < 2 then safe_language := '未设置 / Not set'; end if;
  begin safe_grade := (new.raw_user_meta_data ->> 'grade')::smallint;
  exception when others then safe_grade := null;
  end;
  if safe_grade not between 9 and 12 then safe_grade := null; end if;
  select coalesce(array_agg(left(value, 30)) filter (where char_length(value) between 1 and 30), '{}')
  into safe_interests
  from (select jsonb_array_elements_text(coalesce(new.raw_user_meta_data -> 'interests', '[]'::jsonb)) as value limit 8) interests;
  insert into public.profiles (id, nickname, native_language, grade, interests, role)
  values (new.id, safe_nickname, safe_language, safe_grade, safe_interests, 'student')
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function public.handle_new_auth_user_profile() from public, anon, authenticated;
drop trigger if exists create_profile_after_auth_signup on auth.users;
create trigger create_profile_after_auth_signup after insert on auth.users
for each row execute function public.handle_new_auth_user_profile();

insert into public.profiles (id, nickname, native_language, grade, interests, role)
select users.id,
  left(coalesce(nullif(trim(users.raw_user_meta_data ->> 'display_name'), ''), split_part(coalesce(users.email, users.phone, 'Bridge Student'), '@', 1)), 30),
  left(coalesce(nullif(trim(users.raw_user_meta_data ->> 'native_language'), ''), '未设置 / Not set'), 40),
  null, '{}', 'student'
from auth.users users
where not exists (select 1 from public.profiles profiles where profiles.id = users.id)
  and char_length(left(coalesce(nullif(trim(users.raw_user_meta_data ->> 'display_name'), ''), split_part(coalesce(users.email, users.phone, 'Bridge Student'), '@', 1)), 30)) >= 2;
