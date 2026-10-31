# 003 · Database conventions

- **Date:** 2026-10-31
- **Origin:** design notes made before the repository, brought in by #145
- **Status:** accepted

## Question

Which conventions does Yoko's PostgreSQL database follow for ids, text columns and sets of allowed values?

## Short answer

- Every table has an `INT` id for internal queries and a UUIDv7 for anything the application exposes.
- Text columns use `text` with a CHECK constraint on length, not `varchar(n)`.
- Closed domains that rarely change use a CHECK constraint. Sets of values that the product may change use a lookup table.

## Id and UUID

- The `INT` id is used for joins and internal queries, because it is smaller and faster to index.
- The UUID is what the application sees, so ids can't be guessed or counted from the outside.
- The UUID is version 7. It is ordered by creation time, so it keeps the index healthy, unlike the random v4. See [UUID v1, v4, v6, v7 and Snowflake in MySQL](https://medium.com/@francocontigo/uuid-v1-v4-v6-v7-e-snowflake-no-mysql-e-um-pouco-mais-75b10bf705f6) (in Portuguese).

## `text` with CHECK

PostgreSQL stores text with [TOAST](https://www.postgresql.org/docs/current/storage-toast.html): short values stay in the main table, values over about 2 KB are compressed, and larger ones are split and stored in a separate table, leaving only a small pointer in the main row. So `text` costs nothing extra over `varchar(n)`.

A CHECK constraint on length still guards the limit. Raising it later means changing the rule, not the column type.

## CHECK constraint or lookup table

Ask: **who decides the set of valid values, and how often does that change?**

- **The technical team, at design time, and it rarely changes:** use a CHECK constraint. This is the database protecting integrity, not bad coupling. Example: weekdays, a closed domain by definition.
- **The product team, possibly at any time, maybe from an admin panel:** use a lookup table, so the schema stays stable while the values change. Examples: order statuses, product categories, user profiles.

The structure (tables, columns, types, relations) should change rarely. The content (allowed values, specific rules) should be able to change without a deploy, and business rule changes shouldn't need a schema migration.

Domain rules, which behave like laws of nature, fit CHECK constraints: a birth date can't be in the future, a price can't be negative.

Some cases sit in between. State codes are a closed list, but a long one, they may grow if other countries come in, and they are usually used by more than one table. A lookup table fits better there.

Not every rule has to live in the database. Ask what the data is for: some rules can be guaranteed by the application alone, as long as the application is secure.

Avoid the [One True Lookup Table](https://oracle-base.com/articles/misc/one-true-lookup-tables-otlt) anti-pattern: one lookup table per domain, not a single generic table for every list.

## Further reading

- Michael J. Hernandez, [_Database Design for Mere Mortals_](https://ptgmedia.pearsoncmg.com/images/9780321884497/samplepages/0321884493.pdf) (sample pages)
- Bill Karwin, [_SQL Antipatterns_](https://pragprog.com/titles/bksqla/sql-antipatterns/) (Pragmatic Bookshelf)
- Redgate, [Five Simple Database Design Errors You Should Avoid](https://www.red-gate.com/simple-talk/databases/sql-server/database-administration-sql-server/five-simple-database-design-errors-you-should-avoid/)
- [How to decide your data modeling and delivery](https://medium.com/@francocontigo/como-decidir-sua-modelagem-e-entrega-de-dados-4e538c41abad) (in Portuguese)
