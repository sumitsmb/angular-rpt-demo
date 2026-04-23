# Angular RPT Demo

Angular 15 application configured to run on Replit.

## Stack
- Angular 15 (CLI + dev-server)
- TypeScript 4.9
- npm

## Dev
- Workflow `Start application` runs `npm start` (`ng serve`).
- Dev server bound to `0.0.0.0:5000` with `disableHostCheck: true` configured in `angular.json` (required for Replit's iframe proxy).

## Deployment
- Static deployment: builds with `npm run build`, serves `dist/angular-rpt-demo`.
