# yoko-client

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
