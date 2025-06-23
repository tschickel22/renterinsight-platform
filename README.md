# Renter Insight CRM/DMS – Modular Architecture

This repository contains the full modular source for Renter Insight's RV/MH CRM and dealership management system. Each module is deployed independently and consumed by the core shell app (`renterinsight-core`).

## Structure

- `renterinsight-core/`: Main shell UI and routing host
- `apps/`: Independent feature modules (12 total)
- `shared/`: Common libraries for auth, UI, and API calls

## How to Use

1. Clone this repo and push to GitHub
2. Import each module folder into Bolt.new
3. Follow architecture guide in root documentation
4. Start with renterinsight-core, then attach modules

Includes Bolt manifest and OpenAPI for invoice-payments.
