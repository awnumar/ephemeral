# Instructions

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

Once step **1** has been run once, subsequent runs may simply call `make` which will automatically execute steps **2** and **3**.

Step **1** does not have to be repeated unless `make clean` is run.

### Webapp

To launch the frontend web-app independently of the server, see the `README.md` file within the webapp directory.
