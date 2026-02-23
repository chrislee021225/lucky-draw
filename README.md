<<<<<<< HEAD
# lucky-draw
lucky draw for events
=======
# Lucky Draw System

A simple, browser-based lucky draw system for club events. Draw winners from a pool of tickets and automatically manage the remaining pool.

## Features

- **Custom Ticket Format**: Color-Letter-Number (e.g., `Blue-A-23`)
- **Progressive Drawing**: Automatically removes winners from the pool
- **Undo Function**: Undo the most recent draw if needed
- **Draw History**: Track all draws with timestamps
- **Export to CSV**: Download all results
- **Auto-Save**: Data persists in browser (even if you refresh)
- **Offline-Ready**: Works without internet after loading

## Quick Start

### Option 1: Test Locally

1. Open `index.html` in any modern browser
2. Click "Generate Sample 100 Tickets" to get started quickly
3. Click "Start Drawing"
4. Enter prize name and number of winners
5. Click "DRAW"

### Option 2: Deploy to GitHub Pages (FREE)

#### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Name it: `lucky-draw` (or any name you like)
3. Make it **Public**
4. Don't add README (we already have files)
5. Click "Create repository"

#### Step 2: Upload Files

In your terminal/command prompt, navigate to this folder and run:

```bash
git init
git add .
git commit -m "Initial lucky draw system"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/lucky-draw.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your actual GitHub username.

#### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings**
3. Scroll to **Pages** (in left sidebar)
4. Under "Source", select **main** branch
5. Click **Save**
6. Wait 1-2 minutes
7. Your site will be live at: `https://YOUR-USERNAME.github.io/lucky-draw`

### Option 3: Deploy to Vercel (FREE - Alternative)

1. Go to https://vercel.com
2. Sign up/Login (can use GitHub)
3. Click "Add New Project"
4. Import your GitHub repository
5. Click "Deploy"
6. Done! You'll get a URL like: `https://lucky-draw.vercel.app`

## How to Use

### Setup Phase

You have 3 ways to build your ticket list:

#### Option 1: Use Dropdowns (Easiest!)
1. Select **Color** from dropdown (Blue, Red, Green, Orange)
2. Select **Letter** from dropdown (A, B, C, D, E)
3. Select **Number** from dropdown (1-100)
4. Click "Add Ticket to List" to add one ticket
5. OR click "Add Range (1-100)" to add all 100 numbers with selected color/letter

#### Option 2: Manual Entry
1. Type tickets directly in the text box (one per line)
   - Format: `Color-Letter-Number`
   - Example: `Blue-A-23`

#### Option 3: Generate Sample
1. Click "Generate Sample 100" for random testing tickets

**Then**: Click "Start Drawing" to begin!

### Drawing Phase

1. **Enter Prize Name**: e.g., "Prize C", "Grand Prize"
2. **Enter Number of Winners**: e.g., 15
3. **Click DRAW**: System randomly selects winners
4. **Winners Display**: See the winning tickets
5. **Repeat**: Continue for next prizes

### Important Features

- **Pool Counter**: Top right shows remaining tickets
- **History Panel**: Right side shows all previous draws
- **Undo**: Click "Undo Last Draw" if you made a mistake (only affects most recent draw)
- **Export**: Click "Export to CSV" to download all results
- **Auto-Save**: Everything saves automatically to browser

### Example Draw Sequence

```
Start: 100 tickets in pool
Draw 1: Prize C - 15 winners → 85 tickets remain
Draw 2: Prize B - 10 winners → 75 tickets remain
Draw 3: Prize A - 5 winners → 70 tickets remain
Draw 4: Grand Prize - 1 winner → 69 tickets remain
```

## Tips for Event Day

1. **Test Before Event**: Run through a practice session
2. **Export Backup**: Click "Export to CSV" before starting to have a backup
3. **Offline Mode**: Load the page once, and it works offline
4. **Projection**: Use fullscreen mode (F11) for better visibility
5. **Undo Safety**: Only undo immediately after a draw if needed

## Browser Compatibility

Works on:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Data Storage

- Data is stored in your browser's localStorage
- Survives page refreshes
- Cleared if you clear browser data or use "Reset All"
- Not shared between browsers/devices

## Troubleshooting

### "Invalid ticket format" error
- Make sure each ticket follows: `Color-Letter-Number`
- Valid colors: Blue, Red, Green, Orange (capital first letter)
- Valid letters: A, B, C, D, E (capital)
- Valid numbers: 1-100

### Data disappeared
- Don't clear browser cache during event
- Export to CSV frequently
- Don't use incognito/private mode

### Need to restart
- Click "Reset All" to start fresh
- Warning: This deletes everything!

## File Structure

```
lucky-draw/
├── index.html          # Main page
├── styles.css          # Styling
├── app.js              # Application logic
├── lucky-draw-plan.md  # Planning document
└── README.md           # This file
```

## Support

For issues or questions:
1. Check this README
2. Test in a different browser
3. Try the "Reset All" button
4. Re-download the files from GitHub

## License

Free to use for any club/organization events!

---

**Built for one-time club events. Simple, practical, and it just works!**
>>>>>>> 6e19c6b (initial commit: lucky draw system)
