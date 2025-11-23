import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Google OAuth Callback Handler
 * 
 * IMPORTANT: When using response_type=id_token, Google returns the token
 * in the URL hash fragment (#), not query parameters (?). Hash fragments
 * are only accessible to client-side JavaScript, not server-side code.
 * 
 * This route returns an HTML page that:
 * 1. Reads the hash fragment from the URL
 * 2. Extracts the id_token
 * 3. Sends it to /api/users/google-login for verification
 * 4. Sends the result back to the opener window via postMessage
 */
export async function GET(request: NextRequest) {
  // Return an HTML page that handles the OAuth callback client-side
  return new NextResponse(
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Completing Sign In...</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: #f9fafb;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .container {
      text-align: center;
    }
    .spinner {
      border: 3px solid #f3f4f6;
      border-top: 3px solid #3b82f6;
      border-radius: 50%;
      width: 48px;
      height: 48px;
      animation: spin 1s linear infinite;
      margin: 0 auto 16px;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .message {
      color: #6b7280;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="spinner"></div>
    <p class="message">Completing sign in...</p>
  </div>
  <script>
    (function() {
      // Extract hash fragment from URL (id_token response type uses hash, not query params)
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      
      const idToken = params.get('id_token');
      const state = params.get('state');
      const error = params.get('error');
      const errorDescription = params.get('error_description');

      // Log for debugging (only in development)
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Google OAuth Callback:', {
          hasIdToken: !!idToken,
          hasState: !!state,
          hasError: !!error,
          error: error,
          errorDescription: errorDescription
        });
      }

      // Check if we have an opener window (popup flow)
      if (!window.opener) {
        // No opener - redirect to home page
        window.location.href = '/';
        return;
      }

      // Handle error from Google
      if (error) {
        const errorMsg = errorDescription || error || 'Authentication failed';
        window.opener.postMessage({
          type: 'GOOGLE_AUTH_ERROR',
          error: errorMsg
        }, window.location.origin);
        window.close();
        return;
      }

      // Handle missing token
      if (!idToken) {
        window.opener.postMessage({
          type: 'GOOGLE_AUTH_ERROR',
          error: 'No token received from Google. Please try again.'
        }, window.location.origin);
        window.close();
        return;
      }

      // Send idToken to server for verification and user creation
      fetch('/api/users/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: idToken })
      })
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          if (data.success) {
            // Success - send user data to opener
            window.opener.postMessage({
              type: 'GOOGLE_AUTH_SUCCESS',
              user: data.user,
              isNewUser: data.isNewUser
            }, window.location.origin);
          } else {
            // Server returned error
            window.opener.postMessage({
              type: 'GOOGLE_AUTH_ERROR',
              error: data.error || 'Authentication failed'
            }, window.location.origin);
          }
          window.close();
        })
        .catch(function(err) {
          console.error('Google login API error:', err);
          window.opener.postMessage({
            type: 'GOOGLE_AUTH_ERROR',
            error: 'Failed to process authentication. Please try again.'
          }, window.location.origin);
          window.close();
        });
    })();
  </script>
</body>
</html>`,
    {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    }
  );
}

