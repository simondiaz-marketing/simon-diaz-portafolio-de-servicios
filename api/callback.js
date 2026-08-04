export default async function handler(req, res) {
  const { code } = req.query;
  const clientId = process.env.OAUTH_CLIENT_ID;
  const clientSecret = process.env.OAUTH_CLIENT_SECRET;

  if (!code) {
    return res.status(400).send('Falta el parámetro de código de autorización.');
  }

  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(400).send(`Error de autenticación en GitHub: ${data.error_description || data.error}`);
    }

    const token = data.access_token;

    // Enviar el script para comunicarse con el panel de administración
    res.setHeader('Content-Type', 'text/html');
    res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="utf-8">
        <title>Autenticando...</title>
      </head>
      <body>
        <p>Autenticación exitosa. Redirigiendo al panel...</p>
        <script>
          (function() {
            function receiveMessage(e) {
              window.opener.postMessage(
                'authorization:github:success:${JSON.stringify({ token, provider: 'github' })}',
                e.origin
              );
            }
            window.addEventListener("message", receiveMessage, false);
            // Iniciar intercambio con Decap CMS
            window.opener.postMessage("authorizing:github", "*");
          })();
        </script>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Error en callback:', error);
    res.status(500).send(`Error interno del servidor: ${error.message}`);
  }
}
