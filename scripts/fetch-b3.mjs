import { mkdir, writeFile } from 'node:fs/promises'

const SYMBOLS = [
  '^BVSP',
  'PETR4',
  'VALE3',
  'ITUB4',
  'BBDC4',
  'ABEV3',
  'B3SA3',
  'WEGE3',
  'BBAS3',
  'ITSA4',
  'MGLU3',
  'PETR3',
]

const NAMES = {
  '^BVSP': 'Ibovespa',
  PETR4: 'Petrobras',
  PETR3: 'Petrobras ON',
  VALE3: 'Vale',
  ITUB4: 'Itaú',
  BBDC4: 'Bradesco',
  ABEV3: 'Ambev',
  B3SA3: 'B3',
  WEGE3: 'WEG',
  BBAS3: 'Banco do Brasil',
  ITSA4: 'Itaúsa',
  MGLU3: 'Magazine Luiza',
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function fetchOne(symbol, token) {
  const url = `https://brapi.dev/api/quote/${encodeURIComponent(symbol)}?token=${token}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  const item = json.results?.[0]
  if (!item) throw new Error('sem resultado')
  return {
    symbol: item.symbol,
    name: NAMES[item.symbol] ?? item.shortName ?? item.symbol,
    price: item.regularMarketPrice,
    currency: 'BRL',
    changePercent: item.regularMarketChangePercent ?? 0,
  }
}

async function main() {
  const token = process.env.BRAPI_TOKEN
  if (!token) {
    console.warn('BRAPI_TOKEN ausente; pulando snapshot da B3.')
    return
  }

  const quotes = []
  for (const symbol of SYMBOLS) {
    try {
      quotes.push(await fetchOne(symbol, token))
    } catch (error) {
      console.warn(`B3: ${symbol} indisponível (${error.message}).`)
    }
    await sleep(200)
  }

  if (!quotes.length) {
    console.warn('Nenhuma cotação retornada; mantendo snapshot anterior.')
    return
  }

  await mkdir('public/market', { recursive: true })
  await writeFile(
    'public/market/b3.json',
    JSON.stringify({ updatedAt: Date.now(), quotes }, null, 2),
  )
  console.log(`b3.json gravado com ${quotes.length} cotações.`)
}

main().catch((error) => {
  console.error('Falha ao gerar o snapshot da B3:', error)
  process.exit(0)
})
