export const restPaswordPage =`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Reset Password</title>
  <style>
    body { font-family: sans-serif; max-width: 400px; margin: 60px auto; }
    input { display: block; width: 100%; margin: 6px 0 14px; padding: 8px; font-size: 14px; }
    button { padding: 10px 20px; font-size: 14px; cursor: pointer; }
    #message { margin-top: 14px; font-size: 14px; }
  </style>
</head>
<body>
  <h2>Reset Password</h2>

  <label>New Password</label>
  <input type="password" id="new-password" placeholder="Enter new password" />

  <label>Confirm Password</label>
  <input type="password" id="confirm-password" placeholder="Confirm new password" />

  <button onclick="resetPassword()">Reset Password</button>

  <p id="message"></p>

  <script>
    async function resetPassword() {
      const newPassword = document.getElementById('new-password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      const message = document.getElementById('message');

      if (!newPassword || !confirmPassword) {
        message.textContent = 'Please fill in both fields.';
        return;
      }

      if (newPassword !== confirmPassword) {
        message.textContent = 'Passwords do not match.';
        return;
      }

      // Get token from URL query param: ?token=abc123
      const token = new URLSearchParams(window.location.search).get('token');

      try {
        const res = await fetch('/api/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, newPassword })
        });

        const data = await res.json();

        if (res.success) {
          message.textContent = 'Password reset successful!';
        } else {
          message.textContent = data.message || 'Something went wrong.';
        }
      } catch (err) {
        message.textContent = 'Network error. Is the server running?';
      }
    }
  </script>
</body>
</html>
`;