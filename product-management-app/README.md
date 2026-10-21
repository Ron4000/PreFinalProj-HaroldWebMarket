# Harold Market Product Management App

A responsive React + Vite product catalog and inventory manager created for the Computer Communication Development Institute pre-final exam. Product and category data come from DummyJSON; products created in the form are held in React state for the current session.

## Run locally

```sh
npm install
npm run dev
```

Use `npm run build` to create a production build and `npm run preview` to preview it locally.

## Folder structure

```text
src/
  main.jsx
  App.jsx
  index.css
  components/   shared navigation, product cards, forms, cart, and totals
  pages/        home and product detail pages
  styles/       application component and page styles
  utils/        DummyJSON helpers, product normalization, currency formatting
```

## Assumptions

- The app requests all products available in the DummyJSON catalog when the API is available. If the main product request fails, five local sample products are shown and a retry notice remains visible; category and featured-product failures fall back to the loaded catalog.
- New products, cart contents, and category selection are session-only React state. DummyJSON's simulated product-creation endpoint is intentionally not used.
- Inventory subtotal means unit price multiplied by on-hand stock. Cart line totals instead use the number of units in the cart.
- The image field accepts an HTTP(S) image URL. A product category is required and comes from the live category list (or the local sample categories if that list is unavailable).
- The catalog uses a warm editorial palette by default and follows the operating system's dark color-scheme preference. Colors, spacing, typography, radii, shadows, and motion timings are centralized as CSS custom properties in `src/index.css`.
