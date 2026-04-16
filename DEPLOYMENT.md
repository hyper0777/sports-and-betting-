# Deployment & Environment Setup Guide

This guide explains how to deploy your Sports Hub application to Netlify and configure all necessary environment variables.

## Environment Variables Required

Create a `.env` file in the root directory with these variables:

```env
# Supabase (Required for authentication and betting)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# The Odds API (Optional - for betting odds)
VITE_THE_ODDS_API_KEY=your_odds_api_key

# AllSportsAPI (Optional - for live match data)
VITE_ALLSPORTS_API_KEY=your_allsports_api_key
```

## Getting API Keys

### 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. In Project Settings → API:
   - Copy your `Project URL` → `VITE_SUPABASE_URL`
   - Copy your `anon public` key → `VITE_SUPABASE_ANON_KEY`
4. Create the database tables using the SQL schema provided in the code comments

### 2. The Odds API (Optional)

1. Visit [the-odds-api.com](https://www.the-odds-api.com/)
2. Sign up for a free account
3. Copy your API key → `VITE_THE_ODDS_API_KEY`
4. The free tier includes sufficient requests for development

### 3. AllSportsAPI Key

1. Visit [rapidapi.com](https://rapidapi.com)
2. Search for "AllSportsAPI2"
3. Subscribe to the API (free tier available)
4. Copy your API key → `VITE_ALLSPORTS_API_KEY`

⚠️ **Important**: Never commit `.env` files to git. These are automatically ignored.

## Deploying to Netlify

### Option 1: Via Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify deploy
```

### Option 2: Via GitHub Integration

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Connect your GitHub repository
5. Netlify will automatically detect the build settings from `netlify.toml`
6. In Site Settings → Build & Deploy → Environment, add all environment variables

### Option 3: Manual Deployment

1. Build locally: `npm run build`
2. Upload the `dist` folder to Netlify
3. Configure environment variables in Netlify UI

## Configuring Environment Variables on Netlify

1. Go to your Netlify site dashboard
2. Navigate to **Site Settings** → **Build & Deploy** → **Environment**
3. Click **Edit variables**
4. Add all required environment variables:

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | Your Supabase URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `VITE_THE_ODDS_API_KEY` | Your Odds API key (optional) |
| `VITE_ALLSPORTS_API_KEY` | Your AllSportsAPI key (optional) |

5. Click **Save** and trigger a new deploy

## Supabase Database Setup

Run this SQL in your Supabase SQL Editor to create required tables:

```sql
-- Bankroll table for user balances
create table bankroll (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  initial_amount decimal(10, 2) not null,
  current_balance decimal(10, 2) not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id)
);

-- Bets table for tracking bets
create table bets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  match_id varchar not null,
  match_name varchar not null,
  betting_on varchar not null,
  stake decimal(10, 2) not null,
  odds decimal(10, 4) not null,
  result varchar check (result in ('win', 'loss', 'pending')),
  profit decimal(10, 2) not null default 0,
  created_at timestamp with time zone default now(),
  settled_at timestamp with time zone
);

-- Enable Row Level Security
alter table bankroll enable row level security;
alter table bets enable row level security;

-- RLS Policies
create policy "Users can view their own bankroll" on bankroll
  for select using (auth.uid() = user_id);
create policy "Users can insert their own bankroll" on bankroll
  for insert with check (auth.uid() = user_id);
create policy "Users can update their own bankroll" on bankroll
  for update using (auth.uid() = user_id);

create policy "Users can view their own bets" on bets
  for select using (auth.uid() = user_id);
create policy "Users can insert their own bets" on bets
  for insert with check (auth.uid() = user_id);
create policy "Users can update their own bets" on bets
  for update using (auth.uid() = user_id);
```

## SEO & Sitemap

Your site is configured with:
- ✅ Comprehensive meta tags in `index.html`
- ✅ XML sitemap at `/sitemap.xml`
- ✅ `robots.txt` for search engine crawlers
- ✅ Open Graph tags for social media
- ✅ JSON-LD structured data
- ✅ Security headers via `netlify.toml`

Update the domain in:
- `public/sitemap.xml` - change `scorehub.example.com` to your actual domain
- `index.html` - update the canonical URL and Open Graph URLs

## Building & Testing Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Type checking
npm run typecheck
```

## Troubleshooting

### 401/403 API Errors
- Check that API keys are correctly set in Netlify environment variables
- Verify API keys are valid and haven't expired
- Check API rate limits

### Auth Not Working
- Ensure Supabase environment variables are set
- Check Supabase project is active
- Verify Row Level Security (RLS) policies are enabled

### Betting Features Not Working
- Ensure database tables are created in Supabase
- Check that user is authenticated before accessing betting
- Verify RLS policies allow user operations

## Performance Monitoring

After deployment, monitor:
- Build time
- Page load time (Lighthouse)
- API response times
- User authentication flow

Visit your Netlify Analytics dashboard for detailed metrics.

## Need Help?

- Netlify Docs: https://docs.netlify.com/
- Supabase Docs: https://supabase.com/docs
- GitHub Issues: Check project repository for bug reports
