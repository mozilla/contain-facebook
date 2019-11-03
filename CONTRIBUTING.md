# Contributing

Everyone is welcome to contribute to facebook containers. Reach out to team members if you have questions:

- IRC: #containers on irc.mozilla.org
- Email: containers@mozilla.com

## Filing bugs

If you find a bug with containers, please file a issue.

Check first if the bug might already exist: https://github.com/mozilla/contain-facebook/issues

[Open an issue](https://github.com/mozilla/contain-facebook/issues/new)

1. Visit about:support
2. Click "Copy raw data to clipboard" and paste into the bug. Alternatively copy the following sections into the issue:
  - Application Basics
  - Nightly Features (if you are in nightly)
  - Extensions
  - Experimental Features
3. Include clear steps to reproduce the issue you have experienced.
4. Include screenshots if possible.

## Development

1. `npm install`
2. `./node_modules/.bin/web-ext run -s src/`

### Testing
`npm test`

### Sending Pull Requests

Patches should be submitted as pull requests. When submitting patches as PRs:

- You agree to license your code under the project's open source license (MPL 2.0).
- Base your branch off the current master (see below for an example workflow).
- Add both your code and new tests if relevant.
- Run npm test to make sure all tests still pass.
- Please do not include merge commits in pull requests; include only commits with the new relevant code.
