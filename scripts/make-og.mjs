/**
 * Builds public/og.jpg — the 1200x630 card shown when the site is linked.
 * Run with `npm run og` after changing the portrait or the strapline.
 */
import sharp from 'sharp';

const W = 1200;
const H = 630;
const PORTRAIT_W = 470;

const portrait = await sharp('src/assets/portrait.jpg')
	.resize({ width: PORTRAIT_W })
	.extract({ left: 0, top: 26, width: PORTRAIT_W, height: H })
	.toBuffer();

const text = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="#fbfaf7"/>
  <text x="80" y="300" font-family="Newsreader, Georgia, 'Times New Roman', serif" font-size="82" fill="#211f1c">Lenny McCline</text>
  <rect x="80" y="350" width="560" height="1" fill="#e2ded5"/>
  <text x="80" y="398" font-family="'JetBrains Mono', Menlo, monospace" font-size="21" letter-spacing="2" fill="#8a857c">lennymccline.com</text>
</svg>`);

await sharp(text)
	.composite([{ input: portrait, left: W - PORTRAIT_W, top: 0 }])
	.jpeg({ quality: 88 })
	.toFile('public/og.jpg');

console.log(`public/og.jpg written (${W}x${H})`);
