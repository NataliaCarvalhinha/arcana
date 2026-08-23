# Calendar Integration

Arcana supports external calendars through a browser-only provider layer. Phase 1 ships a Google Calendar provider that uses the Google Identity Services token model and the Calendar API in read-only mode.

## Toki Flow

Arcana does not call Toki directly. To use Toki commitments in Arcana:

1. Connect or subscribe Toki to Google Calendar.
2. Confirm the Toki events appear in Google Calendar.
3. In Arcana, open `Configuracoes -> Calendario -> Integracao externa`.
4. Enter a public Google OAuth Web Client ID, connect Google, choose calendars, and sync.

The effective data path is:

```text
Toki -> Google Calendar -> Arcana
```

The settings card includes a Toki status block with that flow. Arcana does not verify a Toki account, request Toki credentials, or depend on undocumented Toki APIs.

## OAuth And Privacy

The Google provider requests `https://www.googleapis.com/auth/calendar.readonly`.

Arcana is static-site compatible and never stores a client secret, refresh token, or server-side credential. The browser access token is kept in `sessionStorage` only and is cleared on disconnect or browser-session end.

By default, Arcana stores external events as private busy blocks. Event titles and locations are replaced with `Busy`. Enable `Guardar titulos e locais dos eventos neste navegador` only if you want those details cached locally in IndexedDB and included in normal Arcana state.

Portable exports and Obsidian payloads sanitize OAuth-shaped token fields as a defensive measure.

## Data Model

External events normalize to:

- `id`
- `externalId`
- `provider`
- `calendarId`
- `title`
- `description`
- `status`
- `start`
- `end`
- `allDay`
- `busy`
- `transparency`
- `location`
- `sourceUrl`
- `updatedAt`
- `importedAt`

Google `transparent` events are treated as free time. Cancelled/deleted events remove matching cached events during sync.

## Planning Behavior

`getBusyIntervals(date)` combines Weekly Routine blocks and selected external calendar events. Free-time planning subtracts both sources before generating the Arcana plan.

The settings card includes:

- selected calendars
- manual sync
- disconnect
- privacy toggle
- all-day blocking preference
- default buffers before and after events

Sync reads a bounded window around the present, keeps paginated Google API results complete through `nextPageToken`, and performs a throttled refresh on startup when already connected.

All-day events are optional blockers. They do not block planning unless `Eventos de dia inteiro bloqueiam planejamento` is enabled.

If a cached external event later overlaps the current daily plan, Sanctuary shows a conflict warning and offers recalculation. Arcana does not discard the existing plan automatically.

External events with a location render an `Abrir no mapa` link that opens Google Maps search. Arcana does not use a Maps API key.

## Offline And Errors

Sync is manually triggered and throttled to avoid repeated API calls. On API or network failure, Arcana keeps the last successful local cache and records the error in settings.

The calendar view renders Routine, External, Arcana Plan, and Completed Activity sources with filters. External events are informational and cannot be completed from Arcana.

## References

- Google Identity Services token model: https://developers.google.com/identity/oauth2/web/guides/use-token-model
- Google Calendar events list: https://developers.google.com/calendar/api/v3/reference/events/list
- Google Calendar calendar list: https://developers.google.com/calendar/api/v3/reference/calendarList/list
