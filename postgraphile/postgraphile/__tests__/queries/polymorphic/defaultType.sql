select
  __events__."id"::text as "0",
  __events__."code"::text as "1",
  __events__."actor" as "2",
  to_char(__events__."created_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "3"
from "polymorphic_default"."events" as __events__
order by __events__."id" asc;

select
  __paid_events__."amount"::text as "0"
from "polymorphic_default"."paid_events" as __paid_events__
where (
  __paid_events__."id" = $1::"int4"
);