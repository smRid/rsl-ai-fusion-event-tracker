# AI Fusion Tracker for Raid: Shadow Legends

Production-quality MVP web app for generating an interactive Raid: Shadow Legends fusion tracker from an uploaded official fusion calendar image.

## File Structure

```text
app/
  api/extract-calendar/route.ts
  tracker/page.tsx
  globals.css
  layout.tsx
  page.tsx
components/
  tracker/
    EventEditorModal.tsx
    ImportExportPanel.tsx
    ManualEventForm.tsx
    ProgressPanel.tsx
    TimelineEventBar.tsx
    TimelineGrid.tsx
    TrackerDashboard.tsx
  upload/UploadCalendar.tsx
lib/
  date-utils.ts
  fusion-prompt.ts
  fusion-schema.ts
  ollama.ts
  local-storage.ts
  tracker-utils.ts
types/
  fusion.ts
assets/
  Fusion_schedule_EN.png
  sample event tracker.png
```

## Setup

Install dependencies:

```bash
npm install
```

Create `.env` and set your Ollama configuration:

```bash
OLLAMA_API_KEY=your_ollama_api_key_here
OLLAMA_MODEL=qwen3-vl:235b-cloud
OLLAMA_BASE_URL=https://ollama.com
```

For Ollama Cloud, `OLLAMA_API_KEY` is required and `OLLAMA_BASE_URL` should be `https://ollama.com`. For local Ollama, set `OLLAMA_BASE_URL=http://localhost:11434` and omit `OLLAMA_API_KEY` only if your local server does not require authentication. Do not use `NEXT_PUBLIC_` for any API key. The app only calls Ollama from the secure Next.js API route.

## Run Locally

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Test Upload

1. Open the homepage.
2. Upload an official Raid fusion calendar image, such as `assets/Fusion_schedule_EN.png`.
3. Click `Generate Timeline`.
4. After Ollama returns data, the app saves the tracker to `localStorage` and opens `/tracker`.
5. Mark events as pending, earned, or skipped.
6. Refresh the page to confirm the tracker persists.
7. Use export/import JSON to verify tracker backup and restore.
8. Use reset to clear `localStorage` and return to the upload flow.

## Built Features

- Drag-and-drop image upload with preview.
- Client-side image type and 20MB size validation.
- Secure `/api/extract-calendar` route using Ollama-compatible chat image input.
- Server-side Ollama API key usage only.
- Strict TypeScript tracker/event model.
- Zod validation and normalization for AI output.
- Timeline dashboard with tournament and event lanes.
- Editable event modal with validation.
- Manual add, edit, delete, and needs-review support.
- Status tracking for pending, earned, and skipped events.
- Progress calculator for earned, skipped, pending, remaining, and risk status.
- `localStorage` persistence using key `rsl-ai-fusion-tracker`.
- JSON export/import with validation.
- Reset flow.
- Fan-made disclaimer.

## Known Limitations

- Ollama extraction quality depends on calendar image clarity, visible text, and whether the selected model supports image input.
- The app does not persist uploaded image previews after refresh.
- No database, authentication, or cloud storage by design.
- Manual timeline overlap avoidance is simple stacked rows for MVP.

## Recommended Improvements

- Add automated unit tests for normalization, dates, and progress calculations.
- Add optional manual tracker creation when no API key is configured.
- Add confidence scores if the AI extraction prompt/model starts returning them.
- Add richer mobile event list filtering by status and category.
