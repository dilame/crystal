select
  __events__."id"::text as "0",
  __events__."code"::text as "1",
  __events__."actor" as "2"
from "polymorphic_default"."events" as __events__
where (
  __events__."id" = $1::"int4"
);

select
  __paid_events__."id"::text as "0",
  __paid_events__."amount"::text as "1",
  __events__."code"::text as "2",
  __events__."actor" as "3"
from "polymorphic_default"."paid_events" as __paid_events__
left outer join "polymorphic_default"."events" as __events__
on (
/* WHERE becoming ON */ (
  __events__."id" = __paid_events__."id"
))
where (
  __paid_events__."id" = $1::"int4"
);