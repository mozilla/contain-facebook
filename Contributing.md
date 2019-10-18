# Contributing

Everyone is welcome to contribute to facebook-containers. Reach out to team members if you have questions:

- IRC: #containers on irc.mozilla.org
- Email: containers@mozilla.com

## Filing bugs

If you find a bug with facebook-container, please file a issue.

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

## Installing
1. Fork the repo
2. Clone your forked repo, base your branch off `master` and start coding!

## Running
After you make changes to your local copy. You can test to see your changes in two ways
1. Install `web-ext` tool and run to see your changes
2. go to `about:debugging` in your browser and select `load temporary Add-on`
3. Select `container-facebook` from your source dir and then select the `manifest.json` file to load the extension
4. you can `reload` after you make new changes to see them in effect.

## Testing

TBD


## Sending Pull Requests

Patches should be submitted as pull requests. When submitting patches as PRs:

- You agree to license your code under the project's open source license (MPL 2.0).
- Base your branch off the current master (see below for an example workflow).
- Add both your code and new tests if relevant.
- Run npm test to make sure all tests still pass.
- Please do not include merge commits in pull requests; include only commits with the new relevant code.







