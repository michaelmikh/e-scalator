## About

---

EScalator is a CLI application designed to simplify process of resizing large (or not) images. Some aspects of this software are implemented in order to gain new knowledge and experience with number of modern technologies (i.e. flow, babel, etc.).

## Installation

---

### <b>Notice: </b> This way of installation is <i>not yet supported</i>.

Installation via `npm`:

```sh
$ npm i -g e-scalator
```

Installation via `yarn`:

```sh
$ yarn global add e-scalator
```

## Usage

---

In order to see full list of valid options, use:

```sh
$ e-scalator --help
```

To get rid of re-typing **source** and **destination** folders, application supports fetching these parameters from your `env`. Just provide `ES_SOURCE_DIR` and `ES_DESTINATION_DIR` paths, app will resolve it each time it is launched.

## Dependencies

---

-   [Sharp](https://github.com/lovell/sharp) (image processing library)
-   [Commander.js](https://github.com/tj/commander.js) (powerful cli-arguments processor)

## TODO:

-   Write & perform unit tests

---

## License

This project is licensed under the terms of the [MIT](LICENSE) license.
