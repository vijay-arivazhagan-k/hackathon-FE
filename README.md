# Invoice Processing Frontend

React + Vite + TypeScript + MUI interface for AI Invoice Processing system.

## Pages
- Dashboard: duration & status filters, insights, card list
- Report: date range & category & status filters, local insights, Excel export
- Pending Requests: all pending items
- Categories: edit category amount, request count, status
- Request Detail: view & update status with mandatory comments

## Setup
```powershell
npm install
npm run dev
```
App will start at http://localhost:5173 (default Vite port).

Set backend base URL in `src/api.ts` if different.

## Environment Overrides
Create `.env` (using Vite style) if later needed for `VITE_API_URL`.
