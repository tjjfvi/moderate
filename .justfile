
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

run *args:
  ./src/mod.ts {{args}}
