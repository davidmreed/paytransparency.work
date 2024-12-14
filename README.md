# PayTransparency.work

PayTransparency.work is built by <a href="https://ktema.org">David Reed</a> using
<a href="https://kit.svelte.dev">SvelteKit</a>,
<a href="https://heroicons.com/">Heroicons</a>, and
<a href="https://tailwindcss.com/">Tailwind CSS</a>.

</p>
<p>
	United States map icons are from
	<a href="https://github.com/coryetzkorn/state-svg-defs">coryetzkorn</a> and originally derive from
	<a href="https://github.com/propublica/stateface">ProPublica's StateFace</a>. Canada map icons are
	derived from <a href="https://commons.wikimedia.org/wiki/File:Canada_blank_map.svg">Wikimedia's Canada
	map</a>.
</p>
<p>
	This site is <a href="https://github.com/davidmreed/paytransparency.work">open source</a> and
	available under the
	<a href="https://github.com/davidmreed/paytransparency.work/blob/main/LICENSE">MIT License</a>.
	Want to improve the site, or add more transparency data? Open a Pull Request on GitHub!
</p>

## Working on the Application

To work on PayTransparency.work, follow these steps.

### Using NPM

1. Ensure that you have `git` and `npm` (NodeJS 20) installed on your computer.
1. Clone the Git repo.
1. Run `npm install` in the repo to install dependencies.
1. Run `npx husky install` to add pre-commit Git hooks.
1. Run `npm run dev` to start the hot-reloading dev environment.
1. Run `npm run build` to build the static files. This is important to validate that changes don't impact SvelteKit's ability to statically render the entire site.

### Using Nix and Direnv

The PayTransparency.work repo is a Nix flake. If you want to use Nix to develop, it will automatically install the right Node version and manage all of the NPM dependencies for you.

1. Ensure that you have Nix set up on your computer.
1. If desired, set up `direnv` and optionally [`nix-direnv`](https://github.com/nix-community/nix-direnv).
1. Clone the Git repo.
1. Run `npx husky install` to add pre-commit Git hooks.

If you're using `direnv`:

1. `cd` into the repo.
1. Run `direnv allow` to permit the use of this repo's environment.
1. Run `npm run dev` to start the hot-reloading dev environment.
1. Run `npm run build` to build the static files. This is important to validate that changes don't impact SvelteKit's ability to statically render the entire site.

If you're not using `direnv`:

1. `cd` into the repo.
1. Run `nix develop` to start a dev shell. Note that the dev shell is isolated from any configuration of your usual shell.
1. Run `npm run dev` to start the hot-reloading dev environment.
1. Run `npm run build` to build the static files. This is important to validate that changes don't impact SvelteKit's ability to statically render the entire site.
