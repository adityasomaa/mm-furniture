import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

// eslint-config-next 16 exports ready-made flat-config arrays from its subpaths.
// FlatCompat is not needed and in fact throws a circular-reference error on ESLint 10.
//
// Pinned to ESLint 9: the eslint-plugin-react bundled inside eslint-config-next 16.2
// still uses the pre-10 rule context API and throws `contextOrFilename.getFilename is
// not a function` on ESLint 10.
const config = [
  ...coreWebVitals,
  ...typescript,
  {
    ignores: ['.next/**', 'node_modules/**', 'scripts/**', 'public/**', '.cache/**'],
  },
  {
    rules: {
      // CatalogImage serves the build-time derivative ladder on purpose; next/image
      // would re-optimise static files at runtime for no gain. See CatalogImage.tsx.
      '@next/next/no-img-element': 'off',
    },
  },
];

export default config;
