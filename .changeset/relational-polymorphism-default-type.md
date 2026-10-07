---
"graphile-build-pg": patch
"@dataplan/pg": patch
---

Add a `@defaultType` smart tag for `@interface mode:relational` polymorphic
tables. When present, any discriminator value that has no matching `@type` tag
resolves to a generated default object type (named via the
`pgPolymorphismDefaultTypeName` inflector) that implements the interface and
exposes only the shared attributes of the base table, rather than resolving to
`null`. This is analogous to the `default` case of a `switch` statement.
