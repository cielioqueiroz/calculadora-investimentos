export type Locale = 'pt' | 'en'

export interface LocaleMeta {
  code: Locale
  label: string
  short: string
}

export const LOCALES: LocaleMeta[] = [
  { code: 'pt', label: 'Português', short: 'PT' },
  { code: 'en', label: 'English', short: 'EN' },
]

export const DEFAULT_LOCALE: Locale = 'pt'

const pt = {
  'app.tagline': 'Calculadora de investimentos',
  'nav.calculator': 'Calculadora',
  'nav.market': 'Mercado',
  'nav.compare': 'Comparar',
  'nav.history': 'Histórico',

  'theme.toLight': 'Mudar para tema claro',
  'theme.toDark': 'Mudar para tema escuro',
  'language.label': 'Idioma',

  'footer.disclaimer': 'Estimativas. Não é recomendação de investimento.',
  'footer.createdBy': 'Criado por',
  'footer.rights': '© {year} Ciélio Queiroz. Todos os direitos reservados.',

  'category.fixed-income': 'Renda fixa',
  'category.savings': 'Poupança',
  'category.treasury': 'Tesouro Direto',
  'category.variable-income': 'Renda variável',
  'category.crypto': 'Cripto',
  'risk.low': 'Baixo',
  'risk.medium': 'Médio',
  'risk.high': 'Alto',
  'liquidity.daily': 'Diária',
  'liquidity.maturity': 'No vencimento',

  'investment.poupanca.desc':
    'Liquidez diária e isenção de IR para pessoa física. Rende 70% da Selic mais TR quando a Selic passa de 8,5% ao ano.',
  'investment.cdb.desc':
    'Empréstimo ao banco com prazo e taxa combinados, quase sempre atrelados ao CDI. Coberto pelo FGC até R$ 250 mil por instituição.',
  'investment.lci-lca.desc':
    'Letras de crédito imobiliário e do agronegócio. Isentas de IR para pessoa física, com carência mínima e cobertura do FGC.',
  'investment.tesouro-selic.desc':
    'Título público pós-fixado que acompanha a Selic. Não perde valor no resgate antecipado, o que o torna comum em reserva de emergência.',
  'investment.tesouro-prefixado.desc':
    'Taxa travada na compra. Rende o combinado se levado ao vencimento; antes disso, o preço oscila com os juros.',
  'investment.tesouro-ipca.desc':
    'Paga IPCA mais uma taxa fixa, então protege o poder de compra ao longo do prazo.',
  'investment.acoes.desc':
    'Frações de empresas listadas na B3. O retorno vem de valorização e dividendos, sem garantia de nenhum dos dois.',
  'investment.fii.desc':
    'Cotas de fundos de imóveis e papéis do setor. Distribuem rendimento mensal isento de IR para pessoa física.',
  'investment.etf.desc':
    'Cesta que replica um índice e é negociada como uma ação. Diversifica em uma ordem só.',
  'investment.dolar.desc':
    'Exposição cambial. Costuma subir quando o real perde valor, o que amortece parte do risco local.',
  'investment.cripto.desc':
    'Ativos digitais sem lastro e sem garantia. Oscilações de dois dígitos em um único dia são normais.',

  'simulator.title': 'Calculadora',
  'simulator.form.title': 'Parâmetros',
  'simulator.form.type': 'Investimento',
  'simulator.form.typePlaceholder': 'Selecione',
  'simulator.form.initial': 'Valor inicial (R$)',
  'simulator.form.monthly': 'Aporte mensal (R$)',
  'simulator.form.period': 'Prazo (meses)',
  'simulator.form.expectedRate': 'Retorno esperado (% a.a.)',
  'simulator.form.volatilityWarning': 'Ativo volátil: retorno não garantido.',
  'simulator.form.target': 'Meta (R$)',
  'simulator.form.inflation': 'Inflação (% a.a.)',
  'simulator.mode.project': 'Projetar valor',
  'simulator.mode.goal': 'Planejar meta',
  'simulator.badge.perYear': '{rate} a.a.',
  'simulator.badge.risk': 'Risco {risk}',
  'simulator.badge.exempt': 'Isento de IR',
  'simulator.badge.taxed': 'IR na fonte',
  'simulator.save': 'Salvar',

  'result.invested': 'Investido',
  'result.netInterest': 'Rendimento',
  'result.tax': 'IR',
  'result.taxWithRate': 'IR ({rate})',
  'result.netBalance': 'Valor final líquido',
  'result.realBalance': 'Em valor de hoje',
  'result.realHint': 'inflação de {rate} a.a. descontada',

  'chart.growth.title': 'Evolução',
  'chart.growth.gross': 'Saldo',
  'chart.growth.invested': 'Investido',
  'chart.monthLabel': 'Mês {n}',
  'chart.monthSuffix': 'm',

  'save.title': 'Salvar simulação',
  'save.desc': 'Dê um nome para reencontrá-la no histórico.',
  'save.nameLabel': 'Nome',
  'save.namePlaceholder': 'Ex.: reserva de emergência',
  'common.cancel': 'Cancelar',
  'common.save': 'Salvar',

  'comparison.title': 'Comparar',
  'comparison.controls.title': 'Cenário',
  'comparison.controls.initial': 'Valor inicial (R$)',
  'comparison.controls.monthly': 'Aporte mensal (R$)',
  'comparison.controls.period': 'Prazo (meses)',
  'comparison.controls.selected': 'Investimentos',
  'comparison.empty.title': 'Nenhum investimento selecionado',
  'comparison.empty.desc': 'Escolha ao menos um acima.',
  'comparison.chart.title': 'Rendimento líquido no período',
  'comparison.chart.net': 'Rendimento',
  'comparison.table.title': 'Detalhamento',
  'comparison.table.investment': 'Investimento',
  'comparison.table.rate': 'Taxa a.a.',
  'comparison.table.gross': 'Bruto',
  'comparison.table.tax': 'IR',
  'comparison.table.net': 'Líquido',
  'comparison.table.best': 'Melhor',
  'comparison.table.exempt': 'Isento',
  'catalog.title': 'Como cada um funciona',
  'catalog.category': 'Categoria',
  'catalog.risk': 'Risco',
  'catalog.liquidity': 'Liquidez',
  'catalog.tax': 'IR',
  'catalog.fgc': 'FGC',
  'catalog.fgc.yes': 'Sim',
  'catalog.fgc.no': 'Não',
  'catalog.tax.exempt': 'Isento',
  'catalog.tax.regressive': '22,5% a 15%',
  'catalog.tax.flat': '15%',

  'history.title': 'Histórico',
  'history.empty.title': 'Nada salvo ainda',
  'history.empty.desc': 'Simulações salvas ficam guardadas neste navegador.',
  'history.empty.action': 'Abrir calculadora',
  'history.card.period': 'Prazo',
  'history.card.invested': 'Investido',
  'history.card.interest': 'Rendimento',
  'history.card.final': 'Final',
  'history.card.open': 'Abrir na calculadora',
  'history.card.delete': 'Excluir',
  'history.unnamed': 'Sem nome',

  'duration.year': 'ano',
  'duration.years': 'anos',
  'duration.month': 'mês',
  'duration.months': 'meses',
  'duration.and': ' e ',
  'preset.yearSuffix': 'a',
  'preset.monthSuffix': 'm',

  'market.title': 'Mercado',
  'market.economies': 'Câmbio',
  'market.crypto': 'Cripto',
  'market.b3': 'B3',
  'market.col.asset': 'Ativo',
  'market.col.price': 'Preço',
  'market.col.change': 'Dia',
  'market.col.trend': 'Tendência',
  'market.col.cap': 'Valor de mercado',
  'market.simulate': 'Simular',
  'market.simulateOn': 'Simular {symbol} na calculadora',
  'market.fresh.now': 'ao vivo',
  'market.fresh.ago': 'há {value}',
  'market.fresh.delayed': 'atrasado',
  'market.fresh.demo': 'demonstração',
  'market.unit.s': 's',
  'market.unit.m': 'min',
  'market.unit.h': 'h',
  'market.unit.d': 'd',
}

export type TranslationKey = keyof typeof pt
type Dictionary = Record<TranslationKey, string>

const en: Dictionary = {
  'app.tagline': 'Investment calculator',
  'nav.calculator': 'Calculator',
  'nav.market': 'Market',
  'nav.compare': 'Compare',
  'nav.history': 'History',

  'theme.toLight': 'Switch to light theme',
  'theme.toDark': 'Switch to dark theme',
  'language.label': 'Language',

  'footer.disclaimer': 'Estimates only. Not investment advice.',
  'footer.createdBy': 'Built by',
  'footer.rights': '© {year} Ciélio Queiroz. All rights reserved.',

  'category.fixed-income': 'Fixed income',
  'category.savings': 'Savings',
  'category.treasury': 'Treasury bonds',
  'category.variable-income': 'Equities',
  'category.crypto': 'Crypto',
  'risk.low': 'Low',
  'risk.medium': 'Medium',
  'risk.high': 'High',
  'liquidity.daily': 'Daily',
  'liquidity.maturity': 'At maturity',

  'investment.poupanca.desc':
    'Daily liquidity and no income tax for individuals. Pays 70% of the Selic rate plus TR while Selic stays above 8.5% a year.',
  'investment.cdb.desc':
    'A loan to a bank at an agreed term and rate, usually tracking the CDI. Covered by the FGC up to R$ 250k per institution.',
  'investment.lci-lca.desc':
    'Real estate and agribusiness credit notes. Income-tax exempt for individuals, with a minimum holding period and FGC coverage.',
  'investment.tesouro-selic.desc':
    'Floating government bond tracking the Selic rate. It does not lose value on early redemption, which is why it is common for emergency funds.',
  'investment.tesouro-prefixado.desc':
    'Rate locked at purchase. Pays exactly that if held to maturity; before then, the price moves with interest rates.',
  'investment.tesouro-ipca.desc':
    'Pays inflation (IPCA) plus a fixed spread, so it protects purchasing power over the term.',
  'investment.acoes.desc':
    'Slices of companies listed on B3. Returns come from price and dividends, with no guarantee of either.',
  'investment.fii.desc':
    'Shares in real estate funds. They distribute monthly income, tax-exempt for Brazilian individuals.',
  'investment.etf.desc':
    'A basket tracking an index, traded like a single stock. Diversifies in one order.',
  'investment.dolar.desc':
    'Currency exposure. It usually rises when the real weakens, offsetting part of the local risk.',
  'investment.cripto.desc':
    'Digital assets with no backing and no guarantee. Double-digit swings in a single day are normal.',

  'simulator.title': 'Calculator',
  'simulator.form.title': 'Parameters',
  'simulator.form.type': 'Investment',
  'simulator.form.typePlaceholder': 'Select',
  'simulator.form.initial': 'Initial amount (R$)',
  'simulator.form.monthly': 'Monthly deposit (R$)',
  'simulator.form.period': 'Term (months)',
  'simulator.form.expectedRate': 'Expected return (% p.a.)',
  'simulator.form.volatilityWarning': 'Volatile asset: return not guaranteed.',
  'simulator.form.target': 'Target (R$)',
  'simulator.form.inflation': 'Inflation (% p.a.)',
  'simulator.mode.project': 'Project value',
  'simulator.mode.goal': 'Plan a target',
  'simulator.badge.perYear': '{rate} p.a.',
  'simulator.badge.risk': '{risk} risk',
  'simulator.badge.exempt': 'Tax exempt',
  'simulator.badge.taxed': 'Taxed at source',
  'simulator.save': 'Save',

  'result.invested': 'Deposited',
  'result.netInterest': 'Earnings',
  'result.tax': 'Tax',
  'result.taxWithRate': 'Tax ({rate})',
  'result.netBalance': 'Net final value',
  'result.realBalance': "In today's money",
  'result.realHint': '{rate} a year of inflation removed',

  'chart.growth.title': 'Growth',
  'chart.growth.gross': 'Balance',
  'chart.growth.invested': 'Deposited',
  'chart.monthLabel': 'Month {n}',
  'chart.monthSuffix': 'm',

  'save.title': 'Save simulation',
  'save.desc': 'Give it a name to find it again in history.',
  'save.nameLabel': 'Name',
  'save.namePlaceholder': 'e.g. emergency fund',
  'common.cancel': 'Cancel',
  'common.save': 'Save',

  'comparison.title': 'Compare',
  'comparison.controls.title': 'Scenario',
  'comparison.controls.initial': 'Initial amount (R$)',
  'comparison.controls.monthly': 'Monthly deposit (R$)',
  'comparison.controls.period': 'Term (months)',
  'comparison.controls.selected': 'Investments',
  'comparison.empty.title': 'No investment selected',
  'comparison.empty.desc': 'Pick at least one above.',
  'comparison.chart.title': 'Net earnings over the term',
  'comparison.chart.net': 'Earnings',
  'comparison.table.title': 'Breakdown',
  'comparison.table.investment': 'Investment',
  'comparison.table.rate': 'Rate p.a.',
  'comparison.table.gross': 'Gross',
  'comparison.table.tax': 'Tax',
  'comparison.table.net': 'Net',
  'comparison.table.best': 'Best',
  'comparison.table.exempt': 'Exempt',
  'catalog.title': 'How each one works',
  'catalog.category': 'Category',
  'catalog.risk': 'Risk',
  'catalog.liquidity': 'Liquidity',
  'catalog.tax': 'Tax',
  'catalog.fgc': 'FGC',
  'catalog.fgc.yes': 'Yes',
  'catalog.fgc.no': 'No',
  'catalog.tax.exempt': 'Exempt',
  'catalog.tax.regressive': '22.5% to 15%',
  'catalog.tax.flat': '15%',

  'history.title': 'History',
  'history.empty.title': 'Nothing saved yet',
  'history.empty.desc': 'Saved simulations stay in this browser.',
  'history.empty.action': 'Open calculator',
  'history.card.period': 'Term',
  'history.card.invested': 'Deposited',
  'history.card.interest': 'Earnings',
  'history.card.final': 'Final',
  'history.card.open': 'Open in calculator',
  'history.card.delete': 'Delete',
  'history.unnamed': 'Untitled',

  'duration.year': 'year',
  'duration.years': 'years',
  'duration.month': 'month',
  'duration.months': 'months',
  'duration.and': ' and ',
  'preset.yearSuffix': 'y',
  'preset.monthSuffix': 'm',

  'market.title': 'Market',
  'market.economies': 'Currencies',
  'market.crypto': 'Crypto',
  'market.b3': 'B3',
  'market.col.asset': 'Asset',
  'market.col.price': 'Price',
  'market.col.change': 'Day',
  'market.col.trend': 'Trend',
  'market.col.cap': 'Market cap',
  'market.simulate': 'Simulate',
  'market.simulateOn': 'Simulate {symbol} in the calculator',
  'market.fresh.now': 'live',
  'market.fresh.ago': '{value} ago',
  'market.fresh.delayed': 'delayed',
  'market.fresh.demo': 'demo',
  'market.unit.s': 's',
  'market.unit.m': 'min',
  'market.unit.h': 'h',
  'market.unit.d': 'd',
}

export const TRANSLATIONS: Record<Locale, Dictionary> = { pt, en }
