
# Shopify Symlinks for Component Based Directory Structure

This package serves as both a CLI tool and a build utility specifically for Shopify and so far only tested with Vite. This build process reflects my ideal development process for a Shopify theme. This project is my attempt to organize the architecture for large-scale Shopify websites.

This is my first npm package so it's definitely strict, unrefined and unoptimized. I welcome any feedback to improve this service for developers who share my thought process in organizing various components by their function and their relationships with other components.

 ## Features
* Uses Node fsPromise symbolic links to facilitate the creation of new components in this component based architecture. 

* Liquid files created in `components/` directory will be auto linked to their respective shopify theme location.

* Scripts in `components/` directory will be auto included in `main.js` and added to `assets/` directory.

* Created a `utilities/` directory where `symlinks.js` will bundle each file in folder to a single `utils.js` file in `assets/` directory

### Example Liquid File:
`header.liquid` file in `components/header/sections/` while running `npx shopify-symlinks` should create a `header.liquid` file in `sections/`. The origin is set to the newly created `sections/header.liquid`. Then a symlink is created to reference any changes from the `components/header/sections/header.liquid` file.

### Example JavaScript File:
`index.js` file in `components/header/index.js` while running `npx shopify-symlinks`
should create a `header.js` file in `assets/`. The origin is set to the newly created `assets/header.js`. Then a symlink is created to reference any changes from the `components/header/index.js` file.

`nav.js` file in `components/header/nav.js` while running `npx shopify-symlinks`
should create a `header_nav.js` file in `assets/`. The origin is set to the newly created `assets/header_nav.js`. Then a symlink is created to  reference any changes from the `components/header/nav.js` file.

The content of `polling.js` file in `utilities/` directory is bundled into `utils.js` file in `assets/` directory.

## Usage

### Installation
```
npm install -D shopify-symlinks 
```

optional `package.json`
```
  "scripts": {
    "dev": "shopify-symlinks"
  },
```


### Run Options
```
npx shopify-symlinks
```

run with custom entrypath
```
npx shopify-symlinks -- --entry custom/entry/path.js
```

watch with dynamic list of directories and default `main.js` entrypoint
```
npx shopify-symlinks -- --watch server,integrations
```

### Example Development to Production Process

1.
run `npx shopify-symlinks`
- Create file `components/sections/product.liquid` is moved to `sections/product.liquid`, the reference to the origin `components/sections/product.liquid` is saved. 
- `sections/product.liquid` becomes the new origin and the reference to the `components/sections/product.liquid` origin is retrieved.
- A symbolic link `sections/product.liquid` from `components/sections/product.liquid` is created.
- when pushing to github ,`sections/product.liquid` has the code and `components/sections/product.liquid` has the reference to `sections/product.liquid`.

2.
run `npm run pull`
- Section schema is created in `components/sections/product.liquid`.
- The contents of a particular section using that schema is updated in the Shopify Admin.
- In another terminal, run the command to retrieve the updated cusom settings.
- When viewing on shopify store, will just see a string local file reference to `components/sections/product.liquid`.

3.
on `npm run build` or `shopify theme share`
- Run `reverse-symlinks.js`.
- So now `sections/product.liquid` has the code and `components/sections/product.liquid` has the reference to `sections/product.liquid`.
- When viewing on shopify store, should see actual content of `product.liquid`.

 
 ## Example Implementation for Vite
 `vite.config.js`:
 ```
import { defineConfig } from 'vite';
import shopify from 'vite-plugin-shopify';

export default defineConfig({
  plugins: [
    shopify()
  ],
  build: {
    emptyOutDir: false,
    rollupOptions: {
      input: {
        main: './frontend/entrypoints/main.js',
        styles: './frontend/entrypoints/main.css',
      },
      output: {
        entryFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash][extname]',
        dir: 'assets',
      }
    }
  },
  resolve: {
    preserveSymlinks: true, // ensure vite follows symlink
  },
  server: { // ensure handling of symlinks and live reload
    watch: {
      usePolling: true, // watch for changes in symlinked files 
      interval: 200, // adjust since chokidar is default 100
      include: ['**/*.liquid'], // explicit to reinforce on change
    }
  }
});
 ```

 
## Added Dependencies
- **commander**: For command line.
- **chokidar**: To simplify file watching cross platform.
- **vite-plugin-shopify**: for Vite integration in Shopify themes.


## Future Updates

* optimize symbolic link initialization

* create symbolic link for `.css` files in the `components/` directory

* auto include peripheral directories specified to be watched in 

* auto update `.shopifyignore` with dynamic list of watched peripheral directories

* enforce or recommend pulling of only `templates/` and `config/settings_data.json` to prevent overwriting

* handle use with webpack and themekit

## Authors

* [@Daryl Blancaflor](djblanc360@gmail.com)

## Version History

* 2.0.0
  * fixed check of `
  * On `npm run dev` creates `components/` and `utilities/` directories if none exist
  * On `npm run dev` adds watched directories including `components/` and `utilities/` directories to a `.shopifyignore` file, create a `.shopifyignore` if none exist
