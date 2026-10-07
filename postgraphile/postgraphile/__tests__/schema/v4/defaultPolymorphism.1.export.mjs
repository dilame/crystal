import { PgExecutor, PgSelectSingleStep, TYPES, assertPgClassSingleStep, enumCodec, makeRegistry, recordCodec, sqlValueWithCodec } from "@dataplan/pg";
import { ConnectionStep, access, connection, constant, context, get as get2, inhibitOnNull, inspect, lambda, list, makeDecodeNodeId, makeGrafastSchema, markSyncAndSafe, object } from "grafast";
import { GraphQLError, Kind } from "graphql";
import { sql } from "pg-sql2";
const pkCols = ["id"];
const executor = new PgExecutor({
  name: "main",
  context() {
    const ctx = context();
    return object({
      pgSettings: ctx.get("pgSettings"),
      withPgClient: ctx.get("withPgClient")
    });
  }
});
const paidEventsIdentifier = sql.identifier("polymorphic_default", "paid_events");
const eventCodeCodec = enumCodec({
  name: "eventCode",
  identifier: sql.identifier("polymorphic_default", "event_code"),
  values: ["CREATED", "PAID", "REFUNDED"],
  description: undefined,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "polymorphic_default",
      name: "event_code"
    }
  }
});
const paidEventsCodec = recordCodec({
  name: "paidEvents",
  identifier: paidEventsIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      identicalVia: "eventsByMyId"
    },
    amount: {
      codec: TYPES.numeric,
      notNull: true
    },
    code: {
      codec: eventCodeCodec,
      notNull: true,
      hasDefault: undefined,
      via: "eventsByMyId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    created_at: {
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true,
      via: "eventsByMyId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    actor: {
      codec: TYPES.text,
      notNull: undefined,
      hasDefault: undefined,
      via: "eventsByMyId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic_default",
      name: "paid_events"
    },
    relationalInterfaceCodecName: "events"
  },
  executor: executor
});
const eventsIdentifier = sql.identifier("polymorphic_default", "events");
const spec_events = {
  name: "events",
  identifier: eventsIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    code: {
      codec: eventCodeCodec,
      notNull: true
    },
    created_at: {
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true
    },
    actor: {
      codec: TYPES.text
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic_default",
      name: "events"
    },
    tags: {
      __proto__: null,
      interface: "mode:relational type:code",
      defaultType: true,
      type: "PAID references:paid_events"
    }
  },
  executor: executor,
  polymorphism: {
    mode: "relational",
    typeAttributes: ["code"],
    types: {
      __proto__: null,
      PAID: {
        name: "PaidEvent",
        references: "paid_events",
        relationName: "paidEventsByTheirId"
      }
    },
    defaultType: {
      name: "EventDefault"
    }
  }
};
const eventsCodec = recordCodec(spec_events);
const paid_events_resourceOptionsConfig = {
  executor: executor,
  name: "paid_events",
  identifier: "main.polymorphic_default.paid_events",
  from: paidEventsIdentifier,
  codec: paidEventsCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "polymorphic_default",
      name: "paid_events"
    }
  },
  uniques: [{
    attributes: pkCols,
    isPrimary: true
  }]
};
const eventsUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const events_resourceOptionsConfig = {
  executor: executor,
  name: "events",
  identifier: "main.polymorphic_default.events",
  from: eventsIdentifier,
  codec: eventsCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "polymorphic_default",
      name: "events"
    },
    tags: {
      interface: "mode:relational type:code",
      defaultType: true,
      type: "PAID references:paid_events"
    }
  },
  uniques: eventsUniques
};
const registry = makeRegistry({
  pgExecutors: {
    __proto__: null,
    main: executor
  },
  pgCodecs: {
    __proto__: null,
    paidEvents: paidEventsCodec,
    int4: TYPES.int,
    numeric: TYPES.numeric,
    text: TYPES.text,
    varchar: TYPES.varchar,
    bpchar: TYPES.bpchar,
    eventCode: eventCodeCodec,
    timestamptz: TYPES.timestamptz,
    events: eventsCodec,
    LetterAToDEnum: enumCodec({
      name: "LetterAToDEnum",
      identifier: TYPES.text.sqlType,
      values: [{
        value: "A",
        description: "The letter A"
      }, {
        value: "B",
        description: "The letter B"
      }, {
        value: "C",
        description: "The letter C"
      }, {
        value: "D",
        description: "The letter D"
      }],
      extensions: {
        isEnumTableEnum: true,
        enumTableEnumDetails: {
          serviceName: "main",
          schemaName: "enum_tables",
          tableName: "abcd",
          constraintType: "p",
          constraintName: "abcd_pkey"
        },
        tags: {
          name: "LetterAToD"
        }
      }
    }),
    LetterAToDViaViewEnum: enumCodec({
      name: "LetterAToDViaViewEnum",
      identifier: TYPES.text.sqlType,
      values: [{
        value: "A",
        description: "The letter A"
      }, {
        value: "B",
        description: "The letter B"
      }, {
        value: "C",
        description: "The letter C"
      }, {
        value: "D",
        description: "The letter D"
      }],
      extensions: {
        isEnumTableEnum: true,
        enumTableEnumDetails: {
          serviceName: "main",
          schemaName: "enum_tables",
          tableName: "abcd_view",
          constraintType: "p",
          constraintName: "FAKE_enum_tables_abcd_view_primaryKey_5"
        },
        tags: {
          name: "LetterAToDViaView"
        }
      }
    }),
    EmptyEnumEnum: enumCodec({
      name: "EmptyEnumEnum",
      identifier: TYPES.text.sqlType,
      values: [],
      extensions: {
        isEnumTableEnum: true,
        enumTableEnumDetails: {
          serviceName: "main",
          schemaName: "enum_tables",
          tableName: "empty_enum",
          constraintType: "p",
          constraintName: "empty_enum_pkey"
        },
        tags: {
          name: "EmptyEnum"
        }
      }
    }),
    EnumTheFirstEnum: enumCodec({
      name: "EnumTheFirstEnum",
      identifier: TYPES.text.sqlType,
      values: [{
        value: "a1",
        description: "Desc A1"
      }, {
        value: "a2",
        description: "Desc A2"
      }, {
        value: "a3",
        description: "Desc A3"
      }, {
        value: "a4",
        description: "Desc A4"
      }],
      extensions: {
        isEnumTableEnum: true,
        enumTableEnumDetails: {
          serviceName: "main",
          schemaName: "enum_tables",
          tableName: "lots_of_enums",
          constraintType: "u",
          constraintName: "enum_1"
        },
        tags: {
          name: "EnumTheFirst"
        }
      }
    }),
    EnumTheSecondEnum: enumCodec({
      name: "EnumTheSecondEnum",
      identifier: TYPES.varchar.sqlType,
      values: [{
        value: "b1",
        description: "Desc B1"
      }, {
        value: "b2",
        description: "Desc B2"
      }, {
        value: "b3",
        description: "Desc B3"
      }, {
        value: "b4",
        description: "Desc B4"
      }],
      extensions: {
        isEnumTableEnum: true,
        enumTableEnumDetails: {
          serviceName: "main",
          schemaName: "enum_tables",
          tableName: "lots_of_enums",
          constraintType: "u",
          constraintName: "enum_2"
        },
        tags: {
          name: "EnumTheSecond"
        }
      }
    }),
    LotsOfEnumsEnum3Enum: enumCodec({
      name: "LotsOfEnumsEnum3Enum",
      identifier: TYPES.bpchar.sqlType,
      values: [{
        value: "c1",
        description: "Desc C1"
      }, {
        value: "c2",
        description: "Desc C2"
      }, {
        value: "c3",
        description: "Desc C3"
      }, {
        value: "c4",
        description: "Desc C4"
      }],
      extensions: {
        isEnumTableEnum: true,
        enumTableEnumDetails: {
          serviceName: "main",
          schemaName: "enum_tables",
          tableName: "lots_of_enums",
          constraintType: "u",
          constraintName: "enum_3"
        },
        tags: {
          name: "LotsOfEnumsEnum3"
        }
      }
    }),
    LotsOfEnumsEnum4Enum: enumCodec({
      name: "LotsOfEnumsEnum4Enum",
      identifier: TYPES.text.sqlType,
      values: [{
        value: "d1",
        description: "Desc D1"
      }, {
        value: "d2",
        description: "Desc D2"
      }, {
        value: "d3",
        description: "Desc D3"
      }, {
        value: "d4",
        description: "Desc D4"
      }],
      extensions: {
        isEnumTableEnum: true,
        enumTableEnumDetails: {
          serviceName: "main",
          schemaName: "enum_tables",
          tableName: "lots_of_enums",
          constraintType: "u",
          constraintName: "enum_4"
        },
        tags: {
          name: "LotsOfEnumsEnum4"
        }
      }
    }),
    SimpleEnumEnum: enumCodec({
      name: "SimpleEnumEnum",
      identifier: TYPES.text.sqlType,
      values: [{
        value: "Foo",
        description: "The first metasyntactic variable"
      }, {
        value: "Bar",
        description: null
      }, {
        value: "Baz",
        description: "The third metasyntactic variable, very similar to its predecessor"
      }, {
        value: "Qux",
        description: null
      }],
      extensions: {
        isEnumTableEnum: true,
        enumTableEnumDetails: {
          serviceName: "main",
          schemaName: "enum_tables",
          tableName: "simple_enum",
          constraintType: "p",
          constraintName: "simple_enum_pkey"
        },
        tags: {
          name: "SimpleEnum"
        }
      }
    }),
    EntityKindsEnum: enumCodec({
      name: "EntityKindsEnum",
      identifier: TYPES.text.sqlType,
      values: [{
        value: "photos",
        description: undefined
      }, {
        value: "locations",
        description: undefined
      }, {
        value: "profiles",
        description: undefined
      }],
      extensions: {
        isEnumTableEnum: true,
        enumTableEnumDetails: {
          serviceName: "main",
          schemaName: "partitions",
          tableName: "entity_kinds",
          constraintType: "p",
          constraintName: "entity_kinds_pkey"
        },
        tags: {
          name: "EntityKinds"
        }
      }
    }),
    EnumTableTransportationEnum: enumCodec({
      name: "EnumTableTransportationEnum",
      identifier: TYPES.text.sqlType,
      values: [{
        value: "CAR",
        description: undefined
      }, {
        value: "BIKE",
        description: undefined
      }, {
        value: "SUBWAY",
        description: undefined
      }],
      extensions: {
        isEnumTableEnum: true,
        enumTableEnumDetails: {
          serviceName: "main",
          schemaName: "function_returning_enum",
          tableName: "enum_table",
          constraintType: "u",
          constraintName: "transportation_enum"
        },
        tags: {
          name: "EnumTableTransportation"
        }
      }
    }),
    LengthStatusEnum: enumCodec({
      name: "LengthStatusEnum",
      identifier: TYPES.text.sqlType,
      values: [{
        value: "ok",
        description: undefined
      }, {
        value: "too_short",
        description: undefined
      }],
      extensions: {
        isEnumTableEnum: true,
        enumTableEnumDetails: {
          serviceName: "main",
          schemaName: "function_returning_enum",
          tableName: "length_status",
          constraintType: "p",
          constraintName: "length_status_pkey"
        },
        tags: {
          name: "LengthStatus"
        }
      }
    }),
    StageOptionsEnum: enumCodec({
      name: "StageOptionsEnum",
      identifier: TYPES.text.sqlType,
      values: [{
        value: "pending",
        description: undefined
      }, {
        value: "round 1",
        description: undefined
      }, {
        value: "round 2",
        description: undefined
      }, {
        value: "rejected",
        description: undefined
      }, {
        value: "hired",
        description: undefined
      }],
      extensions: {
        isEnumTableEnum: true,
        enumTableEnumDetails: {
          serviceName: "main",
          schemaName: "function_returning_enum",
          tableName: "stage_options",
          constraintType: "p",
          constraintName: "stage_options_pkey"
        },
        tags: {
          name: "StageOptions"
        }
      }
    })
  },
  pgResources: {
    __proto__: null,
    paid_events: paid_events_resourceOptionsConfig,
    events: events_resourceOptionsConfig
  },
  pgRelations: {
    __proto__: null,
    events: {
      __proto__: null,
      paidEventsByTheirId: {
        localCodec: eventsCodec,
        remoteResourceOptions: paid_events_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["id"],
        isUnique: true,
        isReferencee: true
      }
    },
    paidEvents: {
      __proto__: null,
      eventsByMyId: {
        localCodec: paidEventsCodec,
        remoteResourceOptions: events_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["id"],
        isUnique: true
      }
    }
  }
});
const resource_paid_eventsPgResource = registry.pgResources["paid_events"];
const makeTableNodeIdHandler = ({
  typeName,
  nodeIdCodec,
  resource,
  identifier,
  pk,
  deprecationReason
}) => {
  return {
    typeName,
    codec: nodeIdCodec,
    plan($record) {
      return list([constant(identifier, false), ...pk.map(attribute => $record.get(attribute))]);
    },
    getSpec($list) {
      return Object.fromEntries(pk.map((attribute, index) => [attribute, inhibitOnNull(access($list, [index + 1]))]));
    },
    getIdentifiers(value) {
      return value.slice(1);
    },
    get(spec) {
      return resource.get(spec);
    },
    match(obj) {
      return obj[0] === identifier;
    },
    deprecationReason
  };
};
const base64JSONNodeIdCodec = {
  name: "base64JSON",
  encode: markSyncAndSafe(function base64JSONEncode(value) {
    return Buffer.from(JSON.stringify(value), "utf8").toString("base64");
  }),
  decode: markSyncAndSafe(function base64JSONDecode(value) {
    return JSON.parse(Buffer.from(value, "base64").toString("utf8"));
  })
};
const nodeIdHandler_PaidEvent = makeTableNodeIdHandler({
  typeName: "PaidEvent",
  identifier: "paid_events",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_paid_eventsPgResource,
  pk: pkCols
});
const rawNodeIdCodec = {
  name: "raw",
  encode: markSyncAndSafe(function rawEncode(value) {
    return typeof value === "string" ? value : null;
  }),
  decode: markSyncAndSafe(function rawDecode(value) {
    return typeof value === "string" ? value : null;
  })
};
const nodeIdCodecs = {
  __proto__: null,
  raw: rawNodeIdCodec,
  base64JSON: base64JSONNodeIdCodec,
  pipeString: {
    name: "pipeString",
    encode: markSyncAndSafe(function pipeStringEncode(value) {
      return Array.isArray(value) ? value.join("|") : null;
    }),
    decode: markSyncAndSafe(function pipeStringDecode(value) {
      return typeof value === "string" ? value.split("|") : null;
    })
  }
};
const PaidEvent_createdAtPlan = $record => {
  return $record.get("created_at");
};
const EMPTY_OBJECT = Object.freeze({});
const resource_eventsPgResource = registry.pgResources["events"];
const nodeIdHandlerByTypeName = {
  __proto__: null,
  Query: {
    typeName: "Query",
    codec: rawNodeIdCodec,
    match(specifier) {
      return specifier === "query";
    },
    getIdentifiers(_value) {
      return [];
    },
    getSpec() {
      return "irrelevant";
    },
    get() {
      return constant(EMPTY_OBJECT);
    },
    plan() {
      return constant`query`;
    }
  },
  EventDefault: {
    typeName: "EventDefault",
    codec: base64JSONNodeIdCodec,
    plan($record) {
      return list([constant("EventDefault", false), ...eventsUniques[0].attributes.map(attribute => $record.get(attribute))]);
    },
    getSpec($list) {
      const spec = eventsUniques[0].attributes.reduce((memo, attribute, index) => {
        memo[attribute] = inhibitOnNull(access($list, [index + 1]));
        return memo;
      }, Object.create(null));
      return spec;
    },
    getIdentifiers(value) {
      return value.slice(1);
    },
    get(spec) {
      return resource_eventsPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "EventDefault";
    }
  },
  PaidEvent: nodeIdHandler_PaidEvent
};
const decodeNodeId = makeDecodeNodeId(Object.values(nodeIdHandlerByTypeName));
function findTypeNameMatch(specifier) {
  if (!specifier) return null;
  for (const [typeName, typeSpec] of Object.entries(nodeIdHandlerByTypeName)) {
    const value = specifier[typeSpec.codec.name];
    if (value != null && typeSpec.match(value)) {
      return typeName;
    }
  }
  return null;
}
const events_pkColumnsByRelatedCodecName = Object.fromEntries([["paidEvents", pkCols]]);
const Event_typeNameFromType = ((interfaceTypeName, polymorphism) => {
  function typeNameFromType(typeVal) {
    if (typeof typeVal !== "string") return null;
    return polymorphism.types[typeVal]?.name ?? (polymorphism.mode === "relational" ? polymorphism.defaultType?.name : undefined) ?? null;
  }
  typeNameFromType.displayName = `${interfaceTypeName}_typeNameFromType`;
  return typeNameFromType;
})("Event", spec_events.polymorphism);
function toString(value) {
  return "" + value;
}
const EMPTY_OBJECT2 = Object.freeze({});
const specForHandlerCache = new Map();
function specForHandler(handler) {
  const existing = specForHandlerCache.get(handler);
  if (existing) {
    return existing;
  }
  const spec = markSyncAndSafe(function spec(nodeId) {
    // We only want to return the specifier if it matches
    // this handler; otherwise return null.
    if (nodeId == null) return null;
    try {
      const specifier = handler.codec.decode(nodeId);
      if (handler.match(specifier)) {
        return specifier;
      }
    } catch {
      // Ignore errors
    }
    return null;
  }, `specifier_${handler.typeName}_${handler.codec.name}`);
  specForHandlerCache.set(handler, spec);
  return spec;
}
const nodeFetcher_EventDefault = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandlerByTypeName.EventDefault));
  return nodeIdHandlerByTypeName.EventDefault.get(nodeIdHandlerByTypeName.EventDefault.getSpec($decoded));
};
const nodeFetcher_PaidEvent = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_PaidEvent));
  return nodeIdHandler_PaidEvent.get(nodeIdHandler_PaidEvent.getSpec($decoded));
};
function applyFirstArg(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function applyLastArg(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function applyOffsetArg(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function applyBeforeArg(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function applyAfterArg(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function qbWhereBuilder(qb) {
  return qb.whereBuilder();
}
const applyConditionArgToConnection = (_condition, $connection, arg) => {
  const $select = $connection.getSubplan();
  arg.apply($select, qbWhereBuilder);
};
function applyOrderByArgToConnection(parent, $connection, value) {
  const $select = $connection.getSubplan();
  value.apply($select);
}
const totalCountConnectionPlan = $connection => $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
function applyAttributeCondition(attributeName, attributeCodec, $condition, val) {
  $condition.where({
    type: "attribute",
    attribute: attributeName,
    callback(expression) {
      return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, attributeCodec)}`;
    }
  });
}
const PaidEventCondition_idApply = ($condition, val) => applyAttributeCondition("id", TYPES.int, $condition, val);
const PaidEventsOrderBy_ID_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "id",
    direction: "ASC"
  });
  queryBuilder.setOrderIsUnique();
};
const PaidEventsOrderBy_ID_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "id",
    direction: "DESC"
  });
  queryBuilder.setOrderIsUnique();
};
const PaidEventsOrderBy_CODE_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "code",
    direction: "DESC"
  });
};
const PaidEventsOrderBy_CREATED_AT_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "created_at",
    direction: "DESC"
  });
};
const PaidEventsOrderBy_ACTOR_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "actor",
    direction: "DESC"
  });
};
export const typeDefs = /* GraphQL */`type PaidEvent implements Node & Event {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  amount: BigFloat!
  code: EventCode!
  createdAt: Datetime!
  actor: String
}

"""An object with a globally unique \`ID\`."""
interface Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
}

interface Event implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  code: EventCode!
  createdAt: Datetime!
  actor: String
}

enum EventCode {
  CREATED
  PAID
  REFUNDED
}

"""
A point in time as described by the [ISO
8601](https://en.wikipedia.org/wiki/ISO_8601) and, if it has a timezone, [RFC
3339](https://datatracker.ietf.org/doc/html/rfc3339) standards. Input values
that do not conform to both ISO 8601 and RFC 3339 may be coerced, which may lead
to unexpected results.
"""
scalar Datetime

"""
A floating point number that requires more precision than IEEE 754 binary 64
"""
scalar BigFloat

type EventDefault implements Event & Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  code: EventCode!
  createdAt: Datetime!
  actor: String
}

"""The root query type which gives access points into the data universe."""
type Query implements Node {
  """
  Exposes the root query type nested one level down. This is helpful for Relay 1
  which can only query top level fields if they are in a particular form.
  """
  query: Query!

  """
  The root query type must be a \`Node\` to work well with Relay 1 mutations. This just resolves to \`query\`.
  """
  nodeId: ID!

  """Fetches an object given its globally unique \`ID\`."""
  node(
    """The globally unique \`ID\`."""
    nodeId: ID!
  ): Node

  """Get a single \`PaidEvent\`."""
  paidEventById(id: Int!): PaidEvent

  """Reads a single \`EventDefault\` using its globally unique \`ID\`."""
  eventDefault(
    """
    The globally unique \`ID\` to be used in selecting a single \`EventDefault\`.
    """
    nodeId: ID!
  ): EventDefault

  """Reads a single \`PaidEvent\` using its globally unique \`ID\`."""
  paidEvent(
    """The globally unique \`ID\` to be used in selecting a single \`PaidEvent\`."""
    nodeId: ID!
  ): PaidEvent

  """Reads and enables pagination through a set of \`PaidEvent\`."""
  allPaidEvents(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Only read the last \`n\` values of the set."""
    last: Int

    """
    Skip the first \`n\` values from our \`after\` cursor, an alternative to cursor
    based pagination. May not be used with \`last\`.
    """
    offset: Int

    """Read all values in the set before (above) this cursor."""
    before: Cursor

    """Read all values in the set after (below) this cursor."""
    after: Cursor

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: PaidEventCondition

    """The method to use when ordering \`PaidEvent\`."""
    orderBy: [PaidEventsOrderBy!] = [PRIMARY_KEY_ASC]
  ): PaidEventsConnection

  """Reads and enables pagination through a set of \`Event\`."""
  allEvents(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Only read the last \`n\` values of the set."""
    last: Int

    """
    Skip the first \`n\` values from our \`after\` cursor, an alternative to cursor
    based pagination. May not be used with \`last\`.
    """
    offset: Int

    """Read all values in the set before (above) this cursor."""
    before: Cursor

    """Read all values in the set after (below) this cursor."""
    after: Cursor

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: EventCondition

    """The method to use when ordering \`Event\`."""
    orderBy: [EventsOrderBy!] = [PRIMARY_KEY_ASC]
  ): EventsConnection
}

"""A connection to a list of \`PaidEvent\` values."""
type PaidEventsConnection {
  """A list of \`PaidEvent\` objects."""
  nodes: [PaidEvent]!

  """
  A list of edges which contains the \`PaidEvent\` and cursor to aid in pagination.
  """
  edges: [PaidEventsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`PaidEvent\` you could get from the connection."""
  totalCount: Int!
}

"""A \`PaidEvent\` edge in the connection."""
type PaidEventsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`PaidEvent\` at the end of the edge."""
  node: PaidEvent
}

"""A location in a connection that can be used for resuming pagination."""
scalar Cursor

"""Information about pagination in a connection."""
type PageInfo {
  """When paginating forwards, are there more items?"""
  hasNextPage: Boolean!

  """When paginating backwards, are there more items?"""
  hasPreviousPage: Boolean!

  """When paginating backwards, the cursor to continue."""
  startCursor: Cursor

  """When paginating forwards, the cursor to continue."""
  endCursor: Cursor
}

"""
A condition to be used against \`PaidEvent\` object types. All fields are tested
for equality and combined with a logical ‘and.’
"""
input PaidEventCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`amount\` field."""
  amount: BigFloat

  """Checks for equality with the object’s \`code\` field."""
  code: EventCode

  """Checks for equality with the object’s \`createdAt\` field."""
  createdAt: Datetime

  """Checks for equality with the object’s \`actor\` field."""
  actor: String
}

"""Methods to use when ordering \`PaidEvent\`."""
enum PaidEventsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  AMOUNT_ASC
  AMOUNT_DESC
  CODE_ASC
  CODE_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
  ACTOR_ASC
  ACTOR_DESC
}

"""A connection to a list of \`Event\` values."""
type EventsConnection {
  """A list of \`Event\` objects."""
  nodes: [Event]!

  """
  A list of edges which contains the \`Event\` and cursor to aid in pagination.
  """
  edges: [EventsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Event\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Event\` edge in the connection."""
type EventsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Event\` at the end of the edge."""
  node: Event
}

"""
A condition to be used against \`Event\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input EventCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`code\` field."""
  code: EventCode

  """Checks for equality with the object’s \`createdAt\` field."""
  createdAt: Datetime

  """Checks for equality with the object’s \`actor\` field."""
  actor: String
}

"""Methods to use when ordering \`Event\`."""
enum EventsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  CODE_ASC
  CODE_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
  ACTOR_ASC
  ACTOR_DESC
}`;
export const objects = {
  Query: {
    assertStep() {
      return true;
    },
    plans: {
      allEvents: {
        plan() {
          return connection(resource_eventsPgResource.find());
        },
        args: {
          first: applyFirstArg,
          last: applyLastArg,
          offset: applyOffsetArg,
          before: applyBeforeArg,
          after: applyAfterArg,
          condition: applyConditionArgToConnection,
          orderBy: applyOrderByArgToConnection
        }
      },
      allPaidEvents: {
        plan() {
          return connection(resource_paid_eventsPgResource.find());
        },
        args: {
          first: applyFirstArg,
          last: applyLastArg,
          offset: applyOffsetArg,
          before: applyBeforeArg,
          after: applyAfterArg,
          condition: applyConditionArgToConnection,
          orderBy: applyOrderByArgToConnection
        }
      },
      eventDefault(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_EventDefault($nodeId);
      },
      node(_$root, fieldArgs) {
        return fieldArgs.getRaw("nodeId");
      },
      nodeId($parent) {
        const specifier = nodeIdHandlerByTypeName.Query.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Query.codec.name].encode);
      },
      paidEvent(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_PaidEvent($nodeId);
      },
      paidEventById(_$root, {
        $id
      }) {
        return resource_paid_eventsPgResource.get({
          id: $id
        });
      },
      query() {
        return constant(EMPTY_OBJECT2);
      }
    }
  },
  EventDefault: {
    assertStep: assertPgClassSingleStep,
    plans: {
      createdAt: PaidEvent_createdAtPlan,
      nodeId($parent) {
        const specifier = nodeIdHandlerByTypeName.EventDefault.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.EventDefault.codec.name].encode);
      }
    }
  },
  EventsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  PaidEvent: {
    assertStep: assertPgClassSingleStep,
    plans: {
      createdAt: PaidEvent_createdAtPlan,
      nodeId($parent) {
        const specifier = nodeIdHandler_PaidEvent.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_PaidEvent.codec.name].encode);
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of pkCols) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_paid_eventsPgResource.get(spec);
    }
  },
  PaidEventsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  }
};
export const interfaces = {
  Event: {
    toSpecifier(step) {
      if (step instanceof PgSelectSingleStep &&
      // NOTE: don't compare `resource` directly since it
      // could be a function.
      step.resource.codec !== resource_eventsPgResource.codec) {
        // Assume it's a child; return description of base
        const pkColumns = events_pkColumnsByRelatedCodecName[step.resource.codec.name];
        if (!pkColumns) {
          throw new Error(`Expected a relational record for ${resource_eventsPgResource.name}, but '${step.resource.codec.name}' does not seem to be related!`);
        }
        return object(Object.fromEntries(eventsUniques[0].attributes.map((attrName, idx) => [attrName, get2(step, pkColumns[idx])])));
      } else {
        // Assume it is or describes the base:
        return object(Object.fromEntries(eventsUniques[0].attributes.map(attrName => [attrName, get2(step, attrName)])));
      }
    },
    planType($specifier, {
      $original
    }) {
      const $inStep = $original ?? $specifier;
      // A PgSelectSingleStep representing the base relational table
      const $base = (() => {
        if ($inStep instanceof PgSelectSingleStep) {
          if ($inStep.resource.codec === resource_eventsPgResource.codec) {
            // It's the core table; that's what we want!
            return $inStep;
          } else {
            // Assume it's a child; get base record by primary key
            // PERF: ideally we'd use relationship
            // traversal instead, this would both be
            // shorter and also cacheable.
            const stepPk = $inStep.resource.uniques.find(u => u.isPrimary)?.attributes;
            if (!stepPk) {
              throw new Error(`Expected a relational record for ${resource_eventsPgResource.name}, but found one for ${$inStep.resource.name} which has no primary key!`);
            }
            if (stepPk.length !== eventsUniques[0].attributes.length) {
              throw new Error(`Expected a relational record for ${resource_eventsPgResource.name}, but found one for ${$inStep.resource.name} which has a primary key with a different number of columns!`);
            }
            return resource_eventsPgResource.get(Object.fromEntries(eventsUniques[0].attributes.map((attrName, idx) => [attrName, get2($inStep, stepPk[idx])])));
          }
        } else {
          // Assume it's an object representing the base table
          return resource_eventsPgResource.get(Object.fromEntries(eventsUniques[0].attributes.map(attrName => [attrName, get2($inStep, attrName)])));
        }
      })();
      const $typeVal = get2($base, "code");
      const $__typename = lambda($typeVal, Event_typeNameFromType, true);
      return {
        $__typename,
        planForType(type) {
          if (spec_events.polymorphism.mode === "relational" && spec_events.polymorphism.defaultType && type.name === spec_events.polymorphism.defaultType.name) {
            // The default type exposes only the base
            // table's shared attributes, so it is planned
            // directly from the base record.
            return $base;
          }
          const spec = Object.values(spec_events.polymorphism.types).find(s => s.name === type.name);
          if (!spec) {
            throw new Error(`${this} Could not find matching name for relational polymorphic '${type.name}'`);
          }
          return $base.singleRelation(spec.relationName);
        }
      };
    }
  },
  Node: {
    planType($nodeId) {
      const $specifier = decodeNodeId($nodeId);
      const $__typename = lambda($specifier, findTypeNameMatch, true);
      return {
        $__typename,
        planForType(type) {
          const spec = nodeIdHandlerByTypeName[type.name];
          if (spec) {
            return spec.get(spec.getSpec(access($specifier, [spec.codec.name])));
          } else {
            throw new Error(`Failed to find handler for ${type.name}`);
          }
        }
      };
    }
  }
};
export const inputObjects = {
  EventCondition: {
    plans: {
      actor($condition, val) {
        return applyAttributeCondition("actor", TYPES.text, $condition, val);
      },
      code($condition, val) {
        return applyAttributeCondition("code", eventCodeCodec, $condition, val);
      },
      createdAt($condition, val) {
        return applyAttributeCondition("created_at", TYPES.timestamptz, $condition, val);
      },
      id: PaidEventCondition_idApply
    }
  },
  PaidEventCondition: {
    plans: {
      actor($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("eventsByMyId");
        const expression = sql`${alias}.${sql.identifier("actor")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
        $condition.where(condition);
      },
      amount($condition, val) {
        return applyAttributeCondition("amount", TYPES.numeric, $condition, val);
      },
      code($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("eventsByMyId");
        const expression = sql`${alias}.${sql.identifier("code")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, eventCodeCodec)}`;
        $condition.where(condition);
      },
      createdAt($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("eventsByMyId");
        const expression = sql`${alias}.${sql.identifier("created_at")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.timestamptz)}`;
        $condition.where(condition);
      },
      id: PaidEventCondition_idApply
    }
  }
};
export const scalars = {
  BigFloat: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`BigFloat can only parse string values (kind='${ast.kind}')`);
    }
  },
  Cursor: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`Cursor can only parse string values (kind='${ast.kind}')`);
    }
  },
  Datetime: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`Datetime can only parse string values (kind='${ast.kind}')`);
    }
  }
};
export const enums = {
  EventsOrderBy: {
    values: {
      ACTOR_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "actor",
          direction: "ASC"
        });
      },
      ACTOR_DESC: PaidEventsOrderBy_ACTOR_DESCApply,
      CODE_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "code",
          direction: "ASC"
        });
      },
      CODE_DESC: PaidEventsOrderBy_CODE_DESCApply,
      CREATED_AT_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "created_at",
          direction: "ASC"
        });
      },
      CREATED_AT_DESC: PaidEventsOrderBy_CREATED_AT_DESCApply,
      ID_ASC: PaidEventsOrderBy_ID_ASCApply,
      ID_DESC: PaidEventsOrderBy_ID_DESCApply,
      PRIMARY_KEY_ASC(queryBuilder) {
        eventsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        eventsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  PaidEventsOrderBy: {
    values: {
      ACTOR_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("eventsByMyId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("actor")}`,
          codec: TYPES.text,
          direction: "ASC"
        });
      },
      ACTOR_DESC: PaidEventsOrderBy_ACTOR_DESCApply,
      AMOUNT_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "amount",
          direction: "ASC"
        });
      },
      AMOUNT_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "amount",
          direction: "DESC"
        });
      },
      CODE_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("eventsByMyId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("code")}`,
          codec: eventCodeCodec,
          direction: "ASC"
        });
      },
      CODE_DESC: PaidEventsOrderBy_CODE_DESCApply,
      CREATED_AT_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("eventsByMyId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("created_at")}`,
          codec: TYPES.timestamptz,
          direction: "ASC"
        });
      },
      CREATED_AT_DESC: PaidEventsOrderBy_CREATED_AT_DESCApply,
      ID_ASC: PaidEventsOrderBy_ID_ASCApply,
      ID_DESC: PaidEventsOrderBy_ID_DESCApply,
      PRIMARY_KEY_ASC(queryBuilder) {
        pkCols.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        pkCols.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  }
};
export const schema = makeGrafastSchema({
  typeDefs: typeDefs,
  objects: objects,
  interfaces: interfaces,
  inputObjects: inputObjects,
  scalars: scalars,
  enums: enums
});
