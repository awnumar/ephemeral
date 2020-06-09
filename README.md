# Ephemeral

Web-based end-to-end encrypted chat application.

**This is an experiment and is not intended for production use. _No guarantees of security are given._**

## Instructions

1. Install dependencies.

```bash
make install
```

2. Build web-app files.

```bash
make build
```

3. Launch the service.

```bash
make run
```

Once step **1** has been run once, subsequent runs may simply call:

```bash
make
```

which will automatically execute steps **2** and **3**. Step **1** does not have to be repeated unless `make clean` is run.

### Web-app

To launch the frontend web-app independently of the server, see the `README.md` file within the web-app directory.
