
default:
  @just --list

moderate:
  just run src

run *args:
  ./src/mod.ts {{args}}
