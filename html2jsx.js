const fs = require('fs');

const html = fs.readFileSync('stitch_ui.html', 'utf8');

// Extract everything inside <body>...</body>
const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
if (!bodyMatch) {
  console.error("No body found");
  process.exit(1);
}
let body = bodyMatch[1];

// 1. Replace class="..." with className="..."
body = body.replace(/class="/g, 'className="');

// 2. Replace style="..." with style={{ ... }}
// The HTML has `style="font-variation-settings: 'FILL' 1;"`
// We'll replace this specifically as it's the only inline style used.
body = body.replace(/style="font-variation-settings:\s*'FILL'\s*1;"/g, "style={{ fontVariationSettings: \"'FILL' 1\" }}");
body = body.replace(/style="width:\s*([^;"]+);?"/g, "style={{ width: '$1' }}");

// 3. Make sure <input> and <img> are closed properly
// Regex to close empty tags if they aren't closed
body = body.replace(/(<(input|img)[^>]*?[^\/])>/g, '$1 />');

// 4. Remove HTML comments
body = body.replace(/<!--[\s\S]*?-->/g, '');

fs.writeFileSync('stitch_ui.jsx', body);
console.log('Converted HTML to stitch_ui.jsx');
