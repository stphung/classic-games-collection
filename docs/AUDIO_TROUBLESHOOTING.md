# Audio Troubleshooting Guide

## Testing Steps

1. **Open test-audio.html in your browser**
2. **Open browser console (F12)**
3. **Check the console logs for:**
   - "AudioEngine initialized" message
   - "Registered snake with sounds" message
   - "Registered breakout with sounds" message
   - AudioContext state (should show "running" or "suspended")

4. **Click "Test Direct Sound" button first**
   - This tests if your browser can play sounds at all
   - Should hear a beep and see "Direct sound test executed" in console

5. **Click any game sound button**
   - Check console for "Playing sound:" messages
   - Look for any error messages

## Common Issues and Fixes

### Issue: "AudioContext state: suspended"
- **Cause**: Browser blocks audio until user interaction
- **Fix**: Click any button to resume the context

### Issue: "Sound blocked: globally muted"
- **Cause**: The global mute button is active
- **Fix**: Click the mute button (🔇) to unmute

### Issue: "Sound not found"
- **Cause**: Module loading issue
- **Fix**: Refresh the page and check if sounds are registered

### Issue: No console output at all
- **Cause**: JavaScript error preventing code execution
- **Fix**: Check for red error messages in console

## Debug Information
The audio engine now logs:
- When initialized
- When sounds are registered
- When sounds are played
- Current mute state
- AudioContext state

## Browser Compatibility
- Chrome/Edge: Should work after first click
- Firefox: Should work after first click
- Safari: May need explicit user gesture to start audio