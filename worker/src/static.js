const frontendHTML = `<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🐱</text></svg>" />
    <title>Виш-лист 🎁</title>
    <link rel="stylesheet" href="/assets/index-3aprlJl5.css">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/assets/index-C14AnF-l.js"></script>
  </body>
</html>`

const adminHTML = `<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🐱</text></svg>" />
    <title>Панель именинницы 🎂</title>
    <link rel="stylesheet" href="/admin/assets/index-DkwQu-hQ.css">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/admin/assets/index-D2eYraT6.js"></script>
  </body>
</html>`

export function getFrontendHTML() {
  return new Response(frontendHTML, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  })
}

export function getAdminHTML() {
  return new Response(adminHTML, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  })
}
