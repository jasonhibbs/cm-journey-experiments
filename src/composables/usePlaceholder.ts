export async function streetnames() {
  const data = await fetch('/src/stubs/london-ipsum.txt')
  const text = await data.text()
  const lines = text.split('\n').sort(() => 0.5 - Math.random())
  return lines.join(' ')
}
