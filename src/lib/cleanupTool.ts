// Cleanup tool for fixing corrupted localStorage issues
export function cleanupLocalStorage() {
  console.group('🧹 Running localStorage Cleanup');

  try {
    // List all current keys
    console.log('Current localStorage keys:', Object.keys(localStorage));

    // Remove specific auth-related keys
    const authKeys = ['accessToken', 'refreshToken', 'rememberMe', 'user'];
    authKeys.forEach(key => {
      if (localStorage.getItem(key) !== null) {
        console.log(`Removing ${key}`);
        localStorage.removeItem(key);
      }
    });

    // Clear everything if requested
    console.log('Clearing all localStorage...');
    localStorage.clear();

    console.log('✅ Cleanup complete');
    console.log('Remaining keys:', Object.keys(localStorage));
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  }

  console.groupEnd();
}

// Make it available globally for easy access
if (typeof window !== 'undefined') {
  (window as any).cleanupStorage = cleanupLocalStorage;

  // Auto-run cleanup on page load if there's a flag
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('cleanup') === 'true') {
    console.log('Auto-running cleanup due to URL parameter');
    cleanupLocalStorage();
    // Remove the cleanup parameter from URL
    urlParams.delete('cleanup');
    const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
    window.history.replaceState({}, '', newUrl);
  }
}