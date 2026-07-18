# Generated brand assets: do not hand-edit

Every file in this directory except this README (`skillerr-mark-*.png`,
`skillerr-mark.png`, `favicon.ico`, `apple-touch-icon.png`, `og-banner.png`)
is **generated**, not authored here. The single source of truth is:

```
skillerr/assets/skillerr-mark.svg            (sibling repo: dot-skill/skillerr)
  → node skillerr/scripts/build-brand.mjs
  → skillerr/assets/{skillerr-mark-*.png, favicon.ico, apple-touch-icon.png, og-banner.png}
```

## Re-copying after a rebrand

There is **no automated cross-repo pipeline** wiring `skillerr`'s asset
build into this site yet (`skillerr-com` and `skillerr` are separate git
repos with no shared CI). That's a known gap, not an oversight; treat
wiring it up as a follow-up contribution (see `skillerr`'s
[`docs/ROADMAP.md`](https://github.com/dot-skill/skillerr/blob/main/docs/ROADMAP.md)
"Next" section for the kind of thing that belongs there).

Until then, after any change to `skillerr/assets/skillerr-mark.svg`, manually
re-run the generator in the `skillerr` repo and copy the outputs here:

```bash
# from a checkout of dot-skill/skillerr
node scripts/build-brand.mjs

# from a checkout of dot-skill/skillerr-com
cp ../skillerr/assets/skillerr-mark-{32,64,128,256,512,1024}.png docs/public/assets/
cp ../skillerr/assets/skillerr-mark.png docs/public/assets/
cp ../skillerr/assets/favicon.ico docs/public/assets/
cp ../skillerr/assets/apple-touch-icon.png docs/public/assets/
cp ../skillerr/assets/og-banner.png docs/public/assets/
```

`docs/.vitepress/config.ts` references these by filename (favicon links,
theme logo, `og:image` / `twitter:image` meta tags), keep filenames stable
across regenerations so that wiring doesn't need to change too.
