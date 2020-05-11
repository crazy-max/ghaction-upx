[![GitHub release](https://img.shields.io/github/release/crazy-max/ghaction-upx.svg?style=flat-square)](https://github.com/crazy-max/ghaction-upx/releases/latest)
[![GitHub marketplace](https://img.shields.io/badge/marketplace-upx--github--action-blue?logo=github&style=flat-square)](https://github.com/marketplace/actions/upx-github-action)
[![Test workflow](https://img.shields.io/github/workflow/status/crazy-max/ghaction-upx/test?label=test&logo=github&style=flat-square)](https://github.com/crazy-max/ghaction-upx/actions?workflow=test)
[![Codecov](https://img.shields.io/codecov/c/github/crazy-max/ghaction-upx?logo=codecov&style=flat-square)](https://codecov.io/gh/crazy-max/ghaction-upx)
[![Become a sponsor](https://img.shields.io/badge/sponsor-crazy--max-181717.svg?logo=github&style=flat-square)](https://github.com/sponsors/crazy-max)
[![Paypal Donate](https://img.shields.io/badge/donate-paypal-00457c.svg?logo=paypal&style=flat-square)](https://www.paypal.me/crazyws)

## About

GitHub Action for [UPX](https://github.com/upx/upx), the Ultimate Packer for eXecutables.

## Usage

```yaml
name: upx

on:
  pull_request:
  push:

jobs:
  upx:
    runs-on: ubuntu-latest
    steps:
      -
        name: Checkout
        uses: actions/checkout@v2
      -
        name: Run UPX
        uses: crazy-max/ghaction-upx@v1
        with:
          version: latest
          file: ./bin/mybinary
          args: -fq
```

## Customizing

### inputs

Following inputs can be used as `step.with` keys

| Name          | Type    | Default   | Description                     |
|---------------|---------|-----------|---------------------------------|
| `version`     | String  | `latest`  | UPX version. Example: `v3.95`   |
| `file`        | String  |           | File to compress (**required**) |
| `args`        | String  |           | Arguments to pass to UPX        |

## Limitation

This action is only available for Linux and Windows [virtual environments](https://help.github.com/en/articles/virtual-environments-for-github-actions#supported-virtual-environments-and-hardware-resources).

## How can I help ?

All kinds of contributions are welcome :raised_hands:! The most basic way to show your support is to star :star2: the project, or to raise issues :speech_balloon: You can also support this project by [**becoming a sponsor on GitHub**](https://github.com/sponsors/crazy-max) :clap: or by making a [Paypal donation](https://www.paypal.me/crazyws) to ensure this journey continues indefinitely! :rocket:

Thanks again for your support, it is much appreciated! :pray:

## License

MIT. See `LICENSE` for more details.
