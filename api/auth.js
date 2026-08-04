export default function handler(req, res) {
  const clientId = process.env.OAUTH_CLIENT_ID;
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  
  // URL de callback de nuestra propia API
  const redirectUri = `${protocol}://${host}/api/callback`;
  
  const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo,user&redirect_uri=${encodeURIComponent(redirectUri)}`;
  
  res.redirect(githubUrl);
}
