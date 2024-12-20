# recognition-pca

## Get started

1. Install dependencies

   ```bash
   npm install
   ```
2. run all the cells in pca.ipynb file to generate models files( do this only once, if you don't have the pkl files in backend)

3. Start the app

   ```bash
    npx expo start
   ```

4. Start the django server

   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## To fix Something went wrong

- replace with your address ip (pc ip).

exemple: pc address is 192.168.1.35 using the ipconfig in cmd

```bash
setx /M REACT_NATIVE_PACKAGER_HOSTNAME 192.168.1.35
```

# Be aware:

- Do not change the tailwindcss version, the one that works is tailwindcss@3.3.2
- Do not change the nativewind version, the one that works for this project is nativewind@2.0.11
- if you find in package.json file 

```js
"tailwindcss": "^3.3.2",
```
- remove the '^', it becomes

```js
"tailwindcss": "3.3.2",
```

- then run

```bash
npm i
```

# Work with local backend:
- if you are working with windows and android, make sure to include your pc address into ALLOWED_HOSTS and CORS_ALLOWED_ORIGINS in backend/backend/settings.py

# Build command:

- Android
```bash
expo build -p android
```

- Ios
```bash
expo build -p ios
```