# TPL Font Reader

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)](http://makeapullrequest.com)
[![GitHub Pages](https://img.shields.io/website?url=https%3A%2F%2Fas280093.github.io%2Ftpl-font-reader)](https://as280093.github.io/tpl-font-reader)
![GitHub package.json version](https://img.shields.io/github/package-json/v/as280093/tpl-font-reader)
[![CI](https://github.com/as280093/tpl-font-reader/actions/workflows/ci.yml/badge.svg)](https://github.com/as280093/tpl-font-reader/actions/workflows/ci.yml)

> A web tool that finds missing fonts in Tool Presets(.tpl) files.

---

So, here's the deal: I use Photoshop a lot, and something that really annoys me is when I install a new .tpl file, and some fonts are missing. Photoshop doesn't even bother telling me—it just switches everything to Myriad Pro like nothing happened. And honestly, that's super frustrating.

I got tired of guessing what fonts were missing and manually fixing things, so I decided to make this little tool. It's simple: it helps you figure out what fonts are missing from your .tpl files so you don't have to deal with surprises or wasted time.

I made this for myself initially, but if it helps someone else too, then that's even better! 😊

## Features

- Shows you which fonts are missing from your .tpl files
- Lets you copy font names with one click
- Includes quick links to find the fonts you need
- Works right in your browser - no installation needed

---

## Known Issues

1. Font Detection Accuracy
   - Bold/Italic detection may show false positives
   - Some font styles might not be detected correctly on macOS
   - Multiple font checks needed for reliability

2. Performance
   - Large .tpl files may take longer to process
   - Font detection runs multiple times for accuracy

3. Browser Compatibility
   - Best experience in Chrome/Firefox
   - Font detection may vary across browsers

---

## Link

[GitHub Pages](https://as280093.github.io/tpl-font-reader)

## How to run it locally

```bash
git clone https://github.com/as280093/tpl-font-reader.git
```

```bash
npm install
```

```bash
npm run dev
```

---

## Support this project

If this saved you from the Myriad Pro surprise:

- Give it a star! It helps others find the tool
- Share it with your designer friends
- [Report any issues](https://github.com/as280093/tpl-font-reader/issues) you find

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
Before reporting a new issue check if there are already opened issues.

## License

MIT - do whatever you want with it

---

*Made with ❤️ by [as280093](https://github.com/as280093)*
