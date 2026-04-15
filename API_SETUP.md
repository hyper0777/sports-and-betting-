# Real API Integration Setup

Your sports platform is configured to fetch live match data from API-Football and can also use Free Football API Data on RapidAPI.

## Getting Your API Key

1. Go to [RapidAPI AllSportsAPI](https://rapidapi.com/tipsters/api/allsportsapi2)
2. Click "Subscribe to Test" or "Pricing"
3. Choose a plan:
   - **Free Plan**: 100 requests/day (perfect for testing)
   - **Basic Plan**: More requests for production use
4. After subscribing, you'll get an API key on your dashboard

## Adding the API Key

Once you have your API key from RapidAPI:

1. In your project, the Edge Function is already deployed
2. Add the API key as a secret to your Supabase Edge Function
3. Configure the provider:

   - `FOOTBALL_API_PROVIDER=rapidapi` when using API-Football via RapidAPI (default)
   - `FOOTBALL_API_PROVIDER=free-football-api-data` when using `free-football-api-data.p.rapidapi.com`
   - `FOOTBALL_API_PROVIDER=apisports` when using an API-SPORTS direct subscription key

4. Use this command in your terminal:

```bash
supabase secrets set FOOTBALL_API_KEY=your_key_here FOOTBALL_API_PROVIDER=free-football-api-data
```

If you're using API-SPORTS directly, set `FOOTBALL_API_PROVIDER=apisports`.
If you prefer API-Football on RapidAPI, set `FOOTBALL_API_PROVIDER=rapidapi`.

## How It Works

1. **Edge Function**: The `live-scores` function fetches data from AllSportsAPI
2. **Frontend**: The app calls the Edge Function every 30 seconds to get fresh data
3. **Fallback**: If the API is unavailable, it uses simulated data
4. **Data Indicator**: The app shows which data source is being used (API, Simulated, or Edge Function)

## API Features

The API provides:
- Real-time match scores
- Live match status (scheduled, live, halftime, finished)
- Match events for today across available leagues
- Team information
- Venue details
- League information
- Optional Free Football API Data resource fetches for:
  - news (`resource=news`)
  - highlights (`resource=highlights`)
  - live events (`resource=live-events`)
  - match statistics (`resource=statistics&eventId=...`)
  - players (`resource=players&teamId=...`)
  - lineups (`resource=lineups&eventId=...`)
  - team statistics (`resource=team-statistics&teamId=...&leagueId=...`)
  - competitions (`resource=competitions`)
  - leagues (`resource=leagues`)

## Fetching All Free Football Resources

When `FOOTBALL_API_PROVIDER=free-football-api-data`, call the same edge function with query params:

```bash
GET /functions/v1/live-scores?resource=live-scores&date=2026-04-09
GET /functions/v1/live-scores?resource=news&date=2026-04-09
GET /functions/v1/live-scores?resource=highlights&date=2026-04-09
GET /functions/v1/live-scores?resource=live-events&date=2026-04-09
GET /functions/v1/live-scores?resource=statistics&eventId=12345
GET /functions/v1/live-scores?resource=players&teamId=33&season=2026
GET /functions/v1/live-scores?resource=lineups&eventId=12345
GET /functions/v1/live-scores?resource=team-statistics&teamId=33&leagueId=39&season=2026
GET /functions/v1/live-scores?resource=competitions&season=2026
GET /functions/v1/live-scores?resource=leagues&season=2026
```

For non-score resources, the edge function returns raw provider payload under `data`.

## Rate Limits

- **Free Plan**: 100 requests/day
- Updates every 30 seconds means ~2,880 requests/day
- Recommendation: Increase update interval or upgrade plan for production

## Monitoring

Check the data source indicator at the top of the page:
- Green dot: Live API data
- Blue dot: Edge Function
- Yellow dot: Simulated fallback data

## Alternative APIs

You can also use:
- **TheSportsDB** (free, limited data)
- **Sportradar** (premium, comprehensive)
- **API-Football** (recommended, good balance)

## Support

If you encounter issues:
1. Check your API key is valid
2. Verify you haven't exceeded rate limits
3. Check the browser console for errors
4. The app will automatically fall back to simulated data if the API fails
