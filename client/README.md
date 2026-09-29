# yoko!

## Description

[Yoko!]("#") is a SPA that helps users with self-management.

## Features

### Recurring actions

Yoko! let's you manage actions that you need to keep track.
Eg. you need to know the amount of days since you stop eating junk food.

### Events

Yoko! let's you manage events that you need to keep track.
Eg. you need a place to keep the day of your friend's graduation and know the counting of days until the date.

### Tasks

Yoko! let's you manage daily tasks.

### Notes

Yoko! let's you manage your notes.

### Mood

Yoko! let's you register your mood and keep track of it.

## Project Setup

```sh
npm install
```

## Spec Kit

Spec Kit is installed as a project-development CLI from the official GitHub repository. It requires Python 3.11+ and [uv](https://docs.astral.sh/uv/).

```sh
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@v1.0.1
specify version
```

To initialize Spec Kit in this repository, run:

```sh
specify init --here --integration copilot
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## License

[MIT](./License.md)

---

Made with 💜 by Laura
