import * as core from "./core.ts";

test(
  "prints a schema for relational polymorphism with a default type",
  core.test(__filename, ["polymorphic_default"], {}),
);
