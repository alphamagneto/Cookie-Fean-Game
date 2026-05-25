# Testing Guide for Bug Fixes

This document explains how to test all the fixes applied in the `bugfix/critical-issues` branch.

## Quick Start

### 1. Switch to the bugfix branch
```bash
git clone https://github.com/alphamagneto/Cookie-Fean-Game.git
cd Cookie-Fean-Game
git checkout bugfix/critical-issues
```

### 2. Run a local server
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if you have http-server installed)
http-server
```

### 3. Open in browser
Visit: `http://localhost:8000`

---

## What to Test

### Test 1: Audio Milestone Fix (Off-by-One Error)
**What was fixed:** Audio milestones now trigger correctly on the 5th, 8th, 10th, 16th catches instead of never triggering.

**How to test:**
1. Start a new game
2. Catch exactly **5 cookies** → You should hear the **"Fean laugh" sound**
3. Continue catching cookies
4. Catch your **8th cookie total** → You should hear the **"Ooh cookies" sound**
5. Catch your **10th cookie total** → You should hear **"Fean laugh" again**
6. Catch your **16th cookie total** → You should hear **"Ooh cookies" again**

**Expected Result:** ✅ Audio plays at catches 5, 10, 15, 20... AND 8, 16, 24...

---

### Test 2: Level-Up Sound
**What was fixed:** Level-up sound now plays when you advance to a new level.

**How to test:**
1. Start a new game
2. Catch cookies to accumulate **500 points** (each cookie = 10 points)
3. You should advance to **Level 2** and hear a **"level-up" sound**
4. Continue to **1000 points** for **Level 3** → Should hear level-up sound again

**Expected Result:** ✅ Level-up sound plays when advancing levels

---

### Test 3: Powerup Shield
**What was fixed:** Powerups now grant a 3-second shield that protects you from losing a life when you miss one cookie.

**How to test:**
1. Play the game until a **green glowing powerup** appears (falls from top)
2. **Catch the powerup** 
3. You should see a **green circle appear around your player** (the shield)
4. **Deliberately miss a falling cookie** while the shield is active
5. You should **NOT lose a life** (shield protects you)
6. **Wait 3 seconds** for the shield to expire
7. **Miss another cookie** → You **WILL lose a life** now (shield expired)

**Expected Result:** ✅ Shield activates, protects one miss, then expires after 3 seconds

---

### Test 4: Game Loop Memory Leak Fix
**What was fixed:** Fixed a bug where restarting the game could cause multiple animation frames to run simultaneously, causing lag and stuttering.

**How to test:**
1. Play a game until **Game Over** (lose all 3 lives)
2. Press **SPACE to restart**
3. Play another game and let it end again
4. Restart **3-4 more times** in succession
5. The game should remain **smooth and responsive** throughout

**Expected Result:** ✅ Game restarts smoothly without lag or stuttering

---

### Test 5: Audio Error Handling
**What was fixed:** Added null checks to prevent crashes if audio files fail to load.

**How to test:**
1. Open the browser **Developer Console** (Press `F12` → **Console** tab)
2. Play the game normally
3. Check the console for any **JavaScript errors**

**Expected Result:** ✅ No JavaScript errors. You may see `console.log` messages about missing images/audio, which is normal and expected if those files don't exist.

---

## Testing Checklist

Use this checklist to verify all fixes:

- [ ] **Audio Milestone Fix**: Hear "Fean laugh" on 5th catch, "Ooh cookies" on 8th catch
- [ ] **Audio Milestone Fix**: Hear sounds again on 10th, 16th, 20th catches (repeating pattern)
- [ ] **Level-Up Sound**: Hear level-up sound when advancing from Level 1 → 2
- [ ] **Powerup Shield**: Green circle appears when powerup is caught
- [ ] **Powerup Shield**: Missing a cookie while shield is active doesn't cost a life
- [ ] **Powerup Shield**: Shield expires after ~3 seconds
- [ ] **Game Restart**: Game remains smooth after restarting multiple times
- [ ] **Error Handling**: No JavaScript errors in console

---

## Troubleshooting

**Issue:** Game won't load
- Make sure you're running a local server (not opening `index.html` directly)
- Check that all files are in the correct directories

**Issue:** No sound effects
- Check if audio files exist in the `audio/` folder
- Check browser console for audio-related error messages
- This is OK! The game works without audio files; it just won't have sound

**Issue:** No character/cookie images
- Check if image files exist in the `images/` folder
- The game draws shapes instead if images are missing (expected fallback)

**Issue:** Game laggy after restart
- If still laggy, the memory leak fix may not be working
- Check browser console for errors
- Report this as an issue

---

## Next Steps

Once all tests pass:
1. Push your results back to the main branch
2. Create a **Pull Request** from `bugfix/critical-issues` → `main`
3. Merge the fixes into production

Enjoy the improved game! 🍪
