
# moderate<sub><sup> &nbsp;–&nbsp; A simple tool to generate `mod.ts` files</sup></sub>

Installation:

```sh
deno install --allow-read --allow-write https://deno.land/x/moderate/mod.ts
```

Then, in `mod.ts` files that you want generated, append
```ts
// moderate
```

and run
```sh
moderate
```

`moderate` will leave all content before the comment untouched.

You can globally exclude files on the command line with `--exclude` (e.g.
`moderate --exclude _*`), or exclude files in a specific `mod.ts` with:
```ts
// moderate --exclude foo.ts
```


