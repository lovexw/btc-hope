# Testing Guide for Bug Fixes

## How to Test the Fixes

### 1. Test Canvas Reuse Fix

**Expected Behavior:** Charts should recreate without errors when clicking the calculate button multiple times.

**Test Steps:**
1. Open the application in a browser
2. Set investment parameters (any values are fine)
3. Select at least one strategy
4. Click "开始回测分析" button
5. Wait for results to appear
6. **Without changing any parameters**, click "开始回测分析" again
7. Repeat step 6 several times (3-5 times)

**Success Criteria:**
- ✅ No console errors about "Canvas is already in use"
- ✅ Charts update correctly each time
- ✅ No duplicate chart instances
- ✅ Smooth animation and rendering

**How to Check Console:**
- Press F12 or right-click → "Inspect" → "Console" tab
- Look for red error messages

### 2. Test Date Adapter Fix

**Expected Behavior:** Time-based x-axis should display dates correctly without errors.

**Test Steps:**
1. Open the application in a browser
2. Open browser console (F12 → Console)
3. Set investment parameters and run a backtest
4. Look at the charts that appear

**Success Criteria:**
- ✅ No console errors about "date adapter is not provided"
- ✅ X-axis shows dates in "MMM yyyy" format (e.g., "Jan 2020")
- ✅ Hover over chart points shows correct dates in tooltips
- ✅ Both portfolio chart and price chart display correctly

**Common Date Formats to Verify:**
- X-axis labels: "Jan 2020", "Feb 2020", etc.
- Tooltips: Should show full date when hovering
- No "NaN" or "Invalid Date" text

### 3. Test Strategy Descriptions

**Expected Behavior:** Each strategy card should show detailed description with emoji icons.

**Test Steps:**
1. Run backtest with ALL 6 strategies selected:
   - ☑ HODL 持有策略
   - ☑ 定投策略 (DCA)
   - ☑ 高抛策略
   - ☑ 低吸策略
   - ☑ 网格交易
   - ☑ 均线交叉

2. Scroll through the results cards

**Success Criteria for Each Strategy:**
- ✅ Description starts with 📍 (strategy logic icon)
- ✅ Description contains 💰 (profit mechanism icon)
- ✅ Description is 2-3 sentences long
- ✅ Explains HOW the strategy works
- ✅ Explains HOW it generates profit
- ✅ Mentions best use cases or investor types

**Example Descriptions to Verify:**

**HODL:**
- Should mention: one-time purchase, hold until end, price appreciation
- Should say: suitable for long-term believers

**DCA:**
- Should mention: monthly fixed investment, cost averaging
- Should include the dollar amount ($500 by default)
- Should say: suitable for salary workers

**High Sell:**
- Should mention: sell 50% when rises 30%
- Should explain: lock in profits during rallies
- Should say: good for bull markets

**Buy Dip:**
- Should mention: buy when drops 20% from high
- Should explain: accumulate at lower prices
- Should say: "别人恐惧我贪婪" approach

**Grid Trading:**
- Should mention: 50/50 split, 10% intervals
- Should explain: profit from oscillation
- Should say: good for ranging/choppy markets

**MA Cross:**
- Should mention: 7-day and 30-day moving averages
- Should explain: golden cross / death cross
- Should say: good for trending markets, less effective in chop

### 4. Full Integration Test

**Test all fixes together:**

1. Open application in fresh browser tab (hard refresh: Ctrl+Shift+R)
2. Open browser console
3. Set parameters:
   - Initial investment: $10,000
   - Start date: 2020-01-01
   - End date: 2023-12-31
   - DCA amount: $500
4. Select all 6 strategies
5. Click "开始回测分析"
6. Wait for results
7. Verify all 3 fixes:
   - No console errors
   - Charts display with proper dates
   - All strategy descriptions are detailed
8. Click "开始回测分析" again (same parameters)
9. Verify no canvas reuse errors

**Final Success Criteria:**
- ✅ Zero errors in console
- ✅ All charts render perfectly
- ✅ Can calculate multiple times without errors
- ✅ All 6 strategy descriptions are informative
- ✅ Page is fully functional

### 5. Mobile/Responsive Test

**Optional but recommended:**

1. Open browser dev tools (F12)
2. Toggle device emulation (phone icon)
3. Select a mobile device (e.g., iPhone 12)
4. Run the same tests above
5. Verify descriptions are readable and don't overflow

### Troubleshooting

**If you see canvas errors:**
- Check that Chart.js destroy() is being called
- Verify chart variable is set to null after destroy
- Look at app.js lines 120-124 and 224-227

**If you see date adapter errors:**
- Verify index.html includes chartjs-adapter-date-fns script tag
- Check that it loads before app.js
- Try hard refresh (Ctrl+Shift+R)

**If descriptions are missing or brief:**
- Check strategies.js has all 6 descriptions updated
- Look for 📍 and 💰 emoji in descriptions
- Verify description property in return statements

## Browser Compatibility

Test in multiple browsers if possible:
- ✅ Chrome/Edge (Chromium-based)
- ✅ Firefox
- ✅ Safari (if on Mac)

All modern browsers should work without issues.
