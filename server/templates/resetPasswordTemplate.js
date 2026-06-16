export const resetPasswordTemplate = ({ name = 'Friend', code, appName = 'SplitMate', expiryMinutes = 10 }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${appName} Password Reset</title>
  <style>
    body { margin: 0; padding: 0; background: #f5f7fb; font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #102a43; }
    .email-body { width: 100%; background: #f5f7fb; padding: 24px 16px; box-sizing: border-box; }
    .email-card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 28px 90px rgba(15, 23, 42, 0.12); }
    .gradient-header { background: linear-gradient(135deg, #0ea5e9 0%, #9333ea 100%); padding: 40px 24px 32px; color: #ffffff; text-align: center; }
    .logo { display: inline-flex; align-items: center; gap: 12px; font-weight: 700; font-size: 20px; letter-spacing: -0.03em; }
    .logo-mark { width: 42px; height: 42px; border-radius: 16px; background: rgba(255,255,255,0.18); display: grid; place-items: center; }
    .logo-mark span { font-size: 20px; font-weight: 800; color: #ffffff; }
    .headline { font-size: 28px; line-height: 1.15; margin: 24px 0 8px; }
    .headline span { display: block; font-size: 18px; color: rgba(255,255,255,0.92); margin-top: 8px; }
    .content { padding: 32px 28px 36px; }
    .intro { font-size: 16px; line-height: 1.75; margin: 0 0 24px; color: #334155; }
    .code-box { display: inline-flex; justify-content: center; align-items: center; width: 100%; max-width: 320px; margin: 0 auto 28px; padding: 18px 0; border-radius: 18px; background: #eff6ff; border: 1px dashed #bfdbfe; font-size: 32px; letter-spacing: 0.28em; font-weight: 700; color: #0f172a; }
    .action-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 20px; padding: 22px; margin-bottom: 24px; }
    .action-card p { margin: 0; color: #475569; font-size: 14px; line-height: 1.8; }
    .button { display: inline-block; text-decoration: none; background: #0ea5e9; color: #ffffff; font-weight: 700; padding: 14px 22px; border-radius: 14px; margin-top: 12px; }
    .footer { padding: 0 28px 28px; font-size: 13px; color: #64748b; line-height: 1.7; }
    .footer a { color: #0ea5e9; text-decoration: none; }
    @media (max-width: 520px) {
      .gradient-header { padding: 32px 16px 28px; }
      .headline { font-size: 24px; }
      .code-box { font-size: 28px; }
      .content { padding: 24px 18px 28px; }
      .footer { padding: 0 18px 20px; }
    }
  </style>
</head>
<body>
  <div class="email-body">
    <div class="email-card">
      <div class="gradient-header">
        <div class="logo">
          <div class="logo-mark"><span>S</span></div>
          <div>${appName}</div>
        </div>
        <h1 class="headline">Password reset request</h1>
        <span>Use this code to reset your SplitMate password securely.</span>
      </div>
      <div class="content">
        <p class="intro">Hi ${name},</p>
        <p class="intro">We received a request to reset your SplitMate password. Enter the code below to continue. The code expires in ${expiryMinutes} minutes.</p>
        <div class="code-box">${code}</div>
        <div class="action-card">
          <p><strong>Didn’t request this?</strong> If you didn’t request a password reset, you can safely ignore this email and your password will stay secure.</p>
        </div>
        <a href="https://splitmate.app/reset-password" class="button">Reset my password</a>
      </div>
      <div class="footer">
        <p>Need extra security? Keep your password private and never share it with anyone.</p>
        <p>If you have questions, visit our support center or contact us at support@splitmate.app.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;
