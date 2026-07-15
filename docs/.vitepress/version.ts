// Single source of truth for version strings shown on this site.
//
// Both numbers are read from the actual installed `skillerr`/`@skillerr/protocol`
// packages (the same ones this site depends on and that ship to npm) instead of
// being hand-typed in prose, which is what let the footer/docs drift to
// "Draft 0.5.0" long after the protocol and packages moved to 1.0+.
//
// packageVersion: the `skillerr` npm package version (reference CLI/libraries).
// protocolVersion: PROTOCOL_VERSION — the protocol spec's own maturity version,
//   a distinct axis from packageVersion (see docs/PROTOCOL.md's compatibility table).
import { createRequire } from "node:module";
import { PROTOCOL_VERSION } from "@skillerr/protocol";

const require = createRequire(import.meta.url);

export const packageVersion: string = require("skillerr/package.json").version;
export const protocolVersion: string = PROTOCOL_VERSION;
