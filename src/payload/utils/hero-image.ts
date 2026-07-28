import sharp from 'sharp'

export async function makeHeroImage(): Promise<Buffer> {
  const panels = Array.from({ length: 8 }, (_, i) => {
    const x = 1180 + i * 155
    const shade = i % 2 === 0 ? '#4a3f33' : '#3d342a'
    return `<rect x="${x}" y="120" width="148" height="1260" fill="${shade}"/>
      <rect x="${x + 138}" y="120" width="4" height="1260" fill="#2a241e"/>`
  }).join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="1500">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#221e1a"/>
        <stop offset="1" stop-color="#332c25"/>
      </linearGradient>
      <radialGradient id="light" cx="0.72" cy="0.18" r="0.9">
        <stop offset="0" stop-color="#d6b27c" stop-opacity="0.4"/>
        <stop offset="0.6" stop-color="#d6b27c" stop-opacity="0.08"/>
        <stop offset="1" stop-color="#d6b27c" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="2400" height="1500" fill="url(#bg)"/>
    ${panels}
    <rect y="1380" width="2400" height="120" fill="#1b1713"/>
    <rect width="2400" height="1500" fill="url(#light)"/>
  </svg>`
  return sharp(Buffer.from(svg)).jpeg({ quality: 85 }).toBuffer()
}
