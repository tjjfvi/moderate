
default:
  @just --list

fmt:
  deno fmt

fmt-check:
  deno fmt --check

check:
  deno cache src/mod.ts

moderate:
  just run src

test:
  just run test

run *args:
  ./src/mod.ts {{args}}
