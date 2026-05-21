export type Locale = 'pt' | 'en' | 'es' | 'zh' | 'ru'

export interface LocaleMeta {
  code: Locale
  label: string
  flag: string
}

export const LOCALES: LocaleMeta[] = [
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
]

export const DEFAULT_LOCALE: Locale = 'pt'

const pt = {
  'header.tagline': 'Calculadora de Investimentos',
  'nav.home': 'Início',
  'nav.simulator': 'Simulador',
  'nav.compare': 'Comparar',
  'nav.history': 'Histórico',

  'theme.toLight': 'Mudar para tema claro',
  'theme.toDark': 'Mudar para tema escuro',
  'language.label': 'Idioma',

  'footer.disclaimer':
    'As simulações são estimativas e não constituem recomendação de investimento.',
  'footer.rights': '© {year} InvestCalc. Todos os direitos reservados.',

  'category.fixed-income': 'Renda Fixa',
  'category.savings': 'Poupança',
  'category.treasury': 'Tesouro Direto',
  'risk.low': 'Baixo',
  'risk.medium': 'Médio',
  'risk.high': 'Alto',
  'liquidity.daily': 'Diária',
  'liquidity.maturity': 'No vencimento',

  'investment.poupanca.desc':
    'Aplicação de baixo risco e liquidez diária, isenta de imposto de renda para pessoa física.',
  'investment.cdb.desc':
    'Certificado de Depósito Bancário com rentabilidade atrelada ao CDI e cobertura do FGC.',
  'investment.lci-lca.desc':
    'Letras de Crédito Imobiliário e do Agronegócio, isentas de IR e protegidas pelo FGC.',
  'investment.tesouro-selic.desc':
    'Título público pós-fixado atrelado à taxa Selic, ideal para reserva de emergência.',
  'investment.tesouro-prefixado.desc':
    'Título público com taxa de rentabilidade definida no momento da compra.',
  'investment.tesouro-ipca.desc':
    'Título público híbrido que paga a inflação (IPCA) mais uma taxa prefixada.',

  'home.badge': 'Renda fixa descomplicada',
  'home.hero.title': 'Descubra quanto seu dinheiro pode render',
  'home.hero.subtitle':
    'Simule investimentos de renda fixa, compare opções e tome decisões com base em números reais — sem planilhas e sem complicação.',
  'home.hero.ctaPrimary': 'Começar a simular',
  'home.hero.ctaSecondary': 'Comparar investimentos',
  'home.features.simulate.title': 'Simule com aportes',
  'home.features.simulate.desc':
    'Projete juros compostos com aportes mensais e veja o resultado já com IR descontado.',
  'home.features.compare.title': 'Compare lado a lado',
  'home.features.compare.desc':
    'Coloque diferentes investimentos no mesmo cenário e encontre o melhor retorno líquido.',
  'home.features.info.title': 'Informação clara',
  'home.features.info.desc':
    'Risco, liquidez, cobertura do FGC e tributação de cada aplicação em um só lugar.',
  'home.types.title': 'Tipos de investimento',
  'home.types.compareAll': 'Comparar todos',
  'home.card.exempt': 'Isento IR',
  'home.card.taxed': 'IR',
  'home.card.risk': 'Risco {risk}',
  'home.card.liquidity': 'Liquidez: {value}',

  'simulator.title': 'Simulador',
  'simulator.subtitle':
    'Projete o crescimento do seu investimento com aportes mensais e veja o resultado já com o desconto do imposto de renda.',
  'simulator.form.title': 'Parâmetros da simulação',
  'simulator.form.type': 'Tipo de investimento',
  'simulator.form.typePlaceholder': 'Selecione',
  'simulator.form.initial': 'Valor inicial (R$)',
  'simulator.form.monthly': 'Aporte mensal (R$)',
  'simulator.form.period': 'Período (meses)',
  'simulator.badge.perYear': '{rate} ao ano',
  'simulator.badge.risk': 'Risco {risk}',
  'simulator.badge.exempt': 'Isento de IR',
  'simulator.badge.taxed': 'Tributável (IR)',
  'simulator.save': 'Salvar simulação',

  'result.invested': 'Total investido',
  'result.netInterest': 'Rendimento líquido',
  'result.tax': 'Imposto de renda',
  'result.taxWithRate': 'Imposto de renda ({rate})',
  'result.netBalance': 'Valor final líquido',

  'chart.growth.title': 'Evolução do patrimônio',
  'chart.growth.gross': 'Saldo bruto',
  'chart.growth.invested': 'Total investido',
  'chart.monthLabel': 'Mês {n}',
  'chart.monthSuffix': 'm',

  'save.title': 'Salvar simulação',
  'save.desc': 'Dê um nome para encontrá-la depois no histórico.',
  'save.nameLabel': 'Nome',
  'save.namePlaceholder': 'Ex.: Reserva de emergência',
  'common.cancel': 'Cancelar',
  'common.save': 'Salvar',

  'comparison.title': 'Comparar investimentos',
  'comparison.subtitle':
    'Aplique o mesmo cenário a diferentes investimentos e descubra qual entrega o melhor retorno líquido.',
  'comparison.controls.title': 'Cenário de comparação',
  'comparison.controls.initial': 'Valor inicial (R$)',
  'comparison.controls.monthly': 'Aporte mensal (R$)',
  'comparison.controls.period': 'Período (meses)',
  'comparison.controls.selected': 'Investimentos comparados',
  'comparison.empty.title': 'Selecione ao menos um investimento',
  'comparison.empty.desc':
    'Escolha os investimentos acima para visualizar a comparação de retornos.',
  'comparison.chart.title': 'Valor final líquido por investimento',
  'comparison.chart.net': 'Líquido',
  'comparison.table.title': 'Detalhamento',
  'comparison.table.investment': 'Investimento',
  'comparison.table.rate': 'Taxa a.a.',
  'comparison.table.gross': 'Bruto',
  'comparison.table.tax': 'IR',
  'comparison.table.net': 'Líquido',
  'comparison.table.best': 'Melhor retorno',
  'comparison.table.exempt': 'Isento',

  'history.title': 'Histórico',
  'history.subtitle':
    'Todas as simulações que você salvou ficam guardadas aqui, no seu navegador.',
  'history.empty.title': 'Nenhuma simulação salva',
  'history.empty.desc':
    'Faça uma simulação e clique em salvar para acompanhar seus cenários por aqui.',
  'history.empty.action': 'Ir para o simulador',
  'history.card.period': 'Período',
  'history.card.invested': 'Investido',
  'history.card.interest': 'Rendimento',
  'history.card.final': 'Valor final',
  'history.card.open': 'Abrir no simulador',
  'history.card.delete': 'Excluir simulação',
  'history.unnamed': 'Simulação sem nome',

  'duration.year': 'ano',
  'duration.years': 'anos',
  'duration.month': 'mês',
  'duration.months': 'meses',
  'duration.and': ' e ',
  'preset.yearSuffix': 'a',
  'preset.monthSuffix': 'm',
}

export type TranslationKey = keyof typeof pt
type Dictionary = Record<TranslationKey, string>

const en: Dictionary = {
  'header.tagline': 'Investment Calculator',
  'nav.home': 'Home',
  'nav.simulator': 'Simulator',
  'nav.compare': 'Compare',
  'nav.history': 'History',

  'theme.toLight': 'Switch to light theme',
  'theme.toDark': 'Switch to dark theme',
  'language.label': 'Language',

  'footer.disclaimer':
    'Simulations are estimates and do not constitute investment advice.',
  'footer.rights': '© {year} InvestCalc. All rights reserved.',

  'category.fixed-income': 'Fixed Income',
  'category.savings': 'Savings',
  'category.treasury': 'Treasury Bonds',
  'risk.low': 'Low',
  'risk.medium': 'Medium',
  'risk.high': 'High',
  'liquidity.daily': 'Daily',
  'liquidity.maturity': 'At maturity',

  'investment.poupanca.desc':
    'Low-risk investment with daily liquidity, exempt from income tax for individuals.',
  'investment.cdb.desc':
    'Bank Deposit Certificate with returns tied to the CDI rate and FGC protection.',
  'investment.lci-lca.desc':
    'Real estate and agribusiness credit notes, income-tax exempt and FGC protected.',
  'investment.tesouro-selic.desc':
    'Floating-rate government bond tied to the Selic rate, ideal for an emergency fund.',
  'investment.tesouro-prefixado.desc':
    'Government bond with a return rate fixed at the moment of purchase.',
  'investment.tesouro-ipca.desc':
    'Hybrid government bond paying inflation (IPCA) plus a fixed rate.',

  'home.badge': 'Fixed income made simple',
  'home.hero.title': 'Find out how much your money can grow',
  'home.hero.subtitle':
    'Simulate fixed-income investments, compare options and make decisions based on real numbers — no spreadsheets, no hassle.',
  'home.hero.ctaPrimary': 'Start simulating',
  'home.hero.ctaSecondary': 'Compare investments',
  'home.features.simulate.title': 'Simulate with contributions',
  'home.features.simulate.desc':
    'Project compound interest with monthly contributions and see the result with income tax already deducted.',
  'home.features.compare.title': 'Compare side by side',
  'home.features.compare.desc':
    'Put different investments in the same scenario and find the best net return.',
  'home.features.info.title': 'Clear information',
  'home.features.info.desc':
    'Risk, liquidity, FGC coverage and taxation of each investment in one place.',
  'home.types.title': 'Investment types',
  'home.types.compareAll': 'Compare all',
  'home.card.exempt': 'Tax exempt',
  'home.card.taxed': 'Taxed',
  'home.card.risk': '{risk} risk',
  'home.card.liquidity': 'Liquidity: {value}',

  'simulator.title': 'Simulator',
  'simulator.subtitle':
    'Project the growth of your investment with monthly contributions and see the result with income tax already deducted.',
  'simulator.form.title': 'Simulation parameters',
  'simulator.form.type': 'Investment type',
  'simulator.form.typePlaceholder': 'Select',
  'simulator.form.initial': 'Initial amount (R$)',
  'simulator.form.monthly': 'Monthly contribution (R$)',
  'simulator.form.period': 'Period (months)',
  'simulator.badge.perYear': '{rate} per year',
  'simulator.badge.risk': '{risk} risk',
  'simulator.badge.exempt': 'Tax exempt',
  'simulator.badge.taxed': 'Taxable (income tax)',
  'simulator.save': 'Save simulation',

  'result.invested': 'Total invested',
  'result.netInterest': 'Net return',
  'result.tax': 'Income tax',
  'result.taxWithRate': 'Income tax ({rate})',
  'result.netBalance': 'Final net amount',

  'chart.growth.title': 'Wealth growth',
  'chart.growth.gross': 'Gross balance',
  'chart.growth.invested': 'Total invested',
  'chart.monthLabel': 'Month {n}',
  'chart.monthSuffix': 'm',

  'save.title': 'Save simulation',
  'save.desc': 'Give it a name to find it later in your history.',
  'save.nameLabel': 'Name',
  'save.namePlaceholder': 'E.g.: Emergency fund',
  'common.cancel': 'Cancel',
  'common.save': 'Save',

  'comparison.title': 'Compare investments',
  'comparison.subtitle':
    'Apply the same scenario to different investments and find out which delivers the best net return.',
  'comparison.controls.title': 'Comparison scenario',
  'comparison.controls.initial': 'Initial amount (R$)',
  'comparison.controls.monthly': 'Monthly contribution (R$)',
  'comparison.controls.period': 'Period (months)',
  'comparison.controls.selected': 'Compared investments',
  'comparison.empty.title': 'Select at least one investment',
  'comparison.empty.desc':
    'Choose the investments above to view the return comparison.',
  'comparison.chart.title': 'Final net amount by investment',
  'comparison.chart.net': 'Net',
  'comparison.table.title': 'Breakdown',
  'comparison.table.investment': 'Investment',
  'comparison.table.rate': 'Rate p.a.',
  'comparison.table.gross': 'Gross',
  'comparison.table.tax': 'Tax',
  'comparison.table.net': 'Net',
  'comparison.table.best': 'Best return',
  'comparison.table.exempt': 'Exempt',

  'history.title': 'History',
  'history.subtitle':
    'Every simulation you saved is stored here, in your browser.',
  'history.empty.title': 'No saved simulations',
  'history.empty.desc':
    'Run a simulation and click save to keep track of your scenarios here.',
  'history.empty.action': 'Go to the simulator',
  'history.card.period': 'Period',
  'history.card.invested': 'Invested',
  'history.card.interest': 'Return',
  'history.card.final': 'Final amount',
  'history.card.open': 'Open in simulator',
  'history.card.delete': 'Delete simulation',
  'history.unnamed': 'Untitled simulation',

  'duration.year': 'year',
  'duration.years': 'years',
  'duration.month': 'month',
  'duration.months': 'months',
  'duration.and': ' and ',
  'preset.yearSuffix': 'y',
  'preset.monthSuffix': 'm',
}

const es: Dictionary = {
  'header.tagline': 'Calculadora de Inversiones',
  'nav.home': 'Inicio',
  'nav.simulator': 'Simulador',
  'nav.compare': 'Comparar',
  'nav.history': 'Historial',

  'theme.toLight': 'Cambiar a tema claro',
  'theme.toDark': 'Cambiar a tema oscuro',
  'language.label': 'Idioma',

  'footer.disclaimer':
    'Las simulaciones son estimaciones y no constituyen una recomendación de inversión.',
  'footer.rights': '© {year} InvestCalc. Todos los derechos reservados.',

  'category.fixed-income': 'Renta Fija',
  'category.savings': 'Ahorro',
  'category.treasury': 'Bonos del Tesoro',
  'risk.low': 'Bajo',
  'risk.medium': 'Medio',
  'risk.high': 'Alto',
  'liquidity.daily': 'Diaria',
  'liquidity.maturity': 'Al vencimiento',

  'investment.poupanca.desc':
    'Inversión de bajo riesgo y liquidez diaria, exenta del impuesto sobre la renta para personas físicas.',
  'investment.cdb.desc':
    'Certificado de Depósito Bancario con rendimiento ligado a la tasa CDI y cobertura del FGC.',
  'investment.lci-lca.desc':
    'Letras de Crédito Inmobiliario y del Agronegocio, exentas de impuestos y protegidas por el FGC.',
  'investment.tesouro-selic.desc':
    'Bono público de tasa flotante ligado a la tasa Selic, ideal para un fondo de emergencia.',
  'investment.tesouro-prefixado.desc':
    'Bono público con una tasa de rendimiento fijada en el momento de la compra.',
  'investment.tesouro-ipca.desc':
    'Bono público híbrido que paga la inflación (IPCA) más una tasa fija.',

  'home.badge': 'Renta fija sin complicaciones',
  'home.hero.title': 'Descubre cuánto puede rendir tu dinero',
  'home.hero.subtitle':
    'Simula inversiones de renta fija, compara opciones y toma decisiones basadas en números reales, sin hojas de cálculo ni complicaciones.',
  'home.hero.ctaPrimary': 'Empezar a simular',
  'home.hero.ctaSecondary': 'Comparar inversiones',
  'home.features.simulate.title': 'Simula con aportes',
  'home.features.simulate.desc':
    'Proyecta el interés compuesto con aportes mensuales y ve el resultado con el impuesto ya descontado.',
  'home.features.compare.title': 'Compara lado a lado',
  'home.features.compare.desc':
    'Coloca diferentes inversiones en el mismo escenario y encuentra el mejor rendimiento neto.',
  'home.features.info.title': 'Información clara',
  'home.features.info.desc':
    'Riesgo, liquidez, cobertura del FGC y tributación de cada inversión en un solo lugar.',
  'home.types.title': 'Tipos de inversión',
  'home.types.compareAll': 'Comparar todas',
  'home.card.exempt': 'Exento',
  'home.card.taxed': 'Con impuesto',
  'home.card.risk': 'Riesgo {risk}',
  'home.card.liquidity': 'Liquidez: {value}',

  'simulator.title': 'Simulador',
  'simulator.subtitle':
    'Proyecta el crecimiento de tu inversión con aportes mensuales y ve el resultado con el impuesto sobre la renta ya descontado.',
  'simulator.form.title': 'Parámetros de la simulación',
  'simulator.form.type': 'Tipo de inversión',
  'simulator.form.typePlaceholder': 'Selecciona',
  'simulator.form.initial': 'Monto inicial (R$)',
  'simulator.form.monthly': 'Aporte mensual (R$)',
  'simulator.form.period': 'Período (meses)',
  'simulator.badge.perYear': '{rate} al año',
  'simulator.badge.risk': 'Riesgo {risk}',
  'simulator.badge.exempt': 'Exento de impuesto',
  'simulator.badge.taxed': 'Tributable (impuesto)',
  'simulator.save': 'Guardar simulación',

  'result.invested': 'Total invertido',
  'result.netInterest': 'Rendimiento neto',
  'result.tax': 'Impuesto sobre la renta',
  'result.taxWithRate': 'Impuesto sobre la renta ({rate})',
  'result.netBalance': 'Monto final neto',

  'chart.growth.title': 'Evolución del patrimonio',
  'chart.growth.gross': 'Saldo bruto',
  'chart.growth.invested': 'Total invertido',
  'chart.monthLabel': 'Mes {n}',
  'chart.monthSuffix': 'm',

  'save.title': 'Guardar simulación',
  'save.desc': 'Dale un nombre para encontrarla luego en el historial.',
  'save.nameLabel': 'Nombre',
  'save.namePlaceholder': 'Ej.: Fondo de emergencia',
  'common.cancel': 'Cancelar',
  'common.save': 'Guardar',

  'comparison.title': 'Comparar inversiones',
  'comparison.subtitle':
    'Aplica el mismo escenario a diferentes inversiones y descubre cuál ofrece el mejor rendimiento neto.',
  'comparison.controls.title': 'Escenario de comparación',
  'comparison.controls.initial': 'Monto inicial (R$)',
  'comparison.controls.monthly': 'Aporte mensual (R$)',
  'comparison.controls.period': 'Período (meses)',
  'comparison.controls.selected': 'Inversiones comparadas',
  'comparison.empty.title': 'Selecciona al menos una inversión',
  'comparison.empty.desc':
    'Elige las inversiones de arriba para ver la comparación de rendimientos.',
  'comparison.chart.title': 'Monto final neto por inversión',
  'comparison.chart.net': 'Neto',
  'comparison.table.title': 'Detalle',
  'comparison.table.investment': 'Inversión',
  'comparison.table.rate': 'Tasa anual',
  'comparison.table.gross': 'Bruto',
  'comparison.table.tax': 'Impuesto',
  'comparison.table.net': 'Neto',
  'comparison.table.best': 'Mejor rendimiento',
  'comparison.table.exempt': 'Exento',

  'history.title': 'Historial',
  'history.subtitle':
    'Todas las simulaciones que guardaste quedan aquí, en tu navegador.',
  'history.empty.title': 'No hay simulaciones guardadas',
  'history.empty.desc':
    'Haz una simulación y haz clic en guardar para seguir tus escenarios aquí.',
  'history.empty.action': 'Ir al simulador',
  'history.card.period': 'Período',
  'history.card.invested': 'Invertido',
  'history.card.interest': 'Rendimiento',
  'history.card.final': 'Monto final',
  'history.card.open': 'Abrir en el simulador',
  'history.card.delete': 'Eliminar simulación',
  'history.unnamed': 'Simulación sin nombre',

  'duration.year': 'año',
  'duration.years': 'años',
  'duration.month': 'mes',
  'duration.months': 'meses',
  'duration.and': ' y ',
  'preset.yearSuffix': 'a',
  'preset.monthSuffix': 'm',
}

const zh: Dictionary = {
  'header.tagline': '投资计算器',
  'nav.home': '首页',
  'nav.simulator': '模拟器',
  'nav.compare': '比较',
  'nav.history': '历史记录',

  'theme.toLight': '切换到浅色主题',
  'theme.toDark': '切换到深色主题',
  'language.label': '语言',

  'footer.disclaimer': '模拟结果仅为估算，不构成投资建议。',
  'footer.rights': '© {year} InvestCalc。保留所有权利。',

  'category.fixed-income': '固定收益',
  'category.savings': '储蓄',
  'category.treasury': '国债',
  'risk.low': '低',
  'risk.medium': '中',
  'risk.high': '高',
  'liquidity.daily': '每日',
  'liquidity.maturity': '到期时',

  'investment.poupanca.desc':
    '低风险、每日流动性的投资，个人免缴所得税。',
  'investment.cdb.desc':
    '银行存款凭证，收益与 CDI 利率挂钩，并受 FGC 保障。',
  'investment.lci-lca.desc':
    '房地产和农业信贷票据，免所得税并受 FGC 保护。',
  'investment.tesouro-selic.desc':
    '与 Selic 利率挂钩的浮动利率国债，适合作为应急储备金。',
  'investment.tesouro-prefixado.desc':
    '购买时即确定收益率的国债。',
  'investment.tesouro-ipca.desc':
    '混合型国债，支付通胀（IPCA）加上一个固定利率。',

  'home.badge': '让固定收益更简单',
  'home.hero.title': '了解您的资金能增长多少',
  'home.hero.subtitle':
    '模拟固定收益投资，比较各种选项，并基于真实数据做出决策——无需表格，无需烦恼。',
  'home.hero.ctaPrimary': '开始模拟',
  'home.hero.ctaSecondary': '比较投资',
  'home.features.simulate.title': '按月投入模拟',
  'home.features.simulate.desc':
    '按月投入计算复利，并查看已扣除所得税后的结果。',
  'home.features.compare.title': '并排比较',
  'home.features.compare.desc':
    '将不同投资置于同一情景，找出最佳净回报。',
  'home.features.info.title': '清晰的信息',
  'home.features.info.desc':
    '在同一处查看每种投资的风险、流动性、FGC 保障与税收。',
  'home.types.title': '投资类型',
  'home.types.compareAll': '比较全部',
  'home.card.exempt': '免税',
  'home.card.taxed': '应税',
  'home.card.risk': '风险：{risk}',
  'home.card.liquidity': '流动性：{value}',

  'simulator.title': '模拟器',
  'simulator.subtitle':
    '按月投入预测您的投资增长，并查看已扣除所得税后的结果。',
  'simulator.form.title': '模拟参数',
  'simulator.form.type': '投资类型',
  'simulator.form.typePlaceholder': '请选择',
  'simulator.form.initial': '初始金额（R$）',
  'simulator.form.monthly': '每月投入（R$）',
  'simulator.form.period': '期限（月）',
  'simulator.badge.perYear': '每年 {rate}',
  'simulator.badge.risk': '风险：{risk}',
  'simulator.badge.exempt': '免所得税',
  'simulator.badge.taxed': '应税（所得税）',
  'simulator.save': '保存模拟',

  'result.invested': '投入总额',
  'result.netInterest': '净收益',
  'result.tax': '所得税',
  'result.taxWithRate': '所得税（{rate}）',
  'result.netBalance': '税后最终金额',

  'chart.growth.title': '财富增长',
  'chart.growth.gross': '税前余额',
  'chart.growth.invested': '投入总额',
  'chart.monthLabel': '第 {n} 月',
  'chart.monthSuffix': '月',

  'save.title': '保存模拟',
  'save.desc': '为它命名，方便日后在历史记录中查找。',
  'save.nameLabel': '名称',
  'save.namePlaceholder': '例如：应急储备金',
  'common.cancel': '取消',
  'common.save': '保存',

  'comparison.title': '比较投资',
  'comparison.subtitle':
    '将同一情景应用于不同投资，找出哪种能带来最佳净回报。',
  'comparison.controls.title': '比较情景',
  'comparison.controls.initial': '初始金额（R$）',
  'comparison.controls.monthly': '每月投入（R$）',
  'comparison.controls.period': '期限（月）',
  'comparison.controls.selected': '比较的投资',
  'comparison.empty.title': '请至少选择一种投资',
  'comparison.empty.desc': '选择上方的投资以查看回报比较。',
  'comparison.chart.title': '各投资的税后最终金额',
  'comparison.chart.net': '净额',
  'comparison.table.title': '明细',
  'comparison.table.investment': '投资',
  'comparison.table.rate': '年利率',
  'comparison.table.gross': '税前',
  'comparison.table.tax': '所得税',
  'comparison.table.net': '净额',
  'comparison.table.best': '最佳回报',
  'comparison.table.exempt': '免税',

  'history.title': '历史记录',
  'history.subtitle': '您保存的所有模拟都存储在此处，保存在您的浏览器中。',
  'history.empty.title': '没有已保存的模拟',
  'history.empty.desc': '运行一次模拟并点击保存，即可在此跟踪您的方案。',
  'history.empty.action': '前往模拟器',
  'history.card.period': '期限',
  'history.card.invested': '已投入',
  'history.card.interest': '收益',
  'history.card.final': '最终金额',
  'history.card.open': '在模拟器中打开',
  'history.card.delete': '删除模拟',
  'history.unnamed': '未命名的模拟',

  'duration.year': '年',
  'duration.years': '年',
  'duration.month': '个月',
  'duration.months': '个月',
  'duration.and': ' ',
  'preset.yearSuffix': '年',
  'preset.monthSuffix': '月',
}

const ru: Dictionary = {
  'header.tagline': 'Калькулятор инвестиций',
  'nav.home': 'Главная',
  'nav.simulator': 'Калькулятор',
  'nav.compare': 'Сравнить',
  'nav.history': 'История',

  'theme.toLight': 'Переключить на светлую тему',
  'theme.toDark': 'Переключить на тёмную тему',
  'language.label': 'Язык',

  'footer.disclaimer':
    'Расчёты являются ориентировочными и не являются инвестиционной рекомендацией.',
  'footer.rights': '© {year} InvestCalc. Все права защищены.',

  'category.fixed-income': 'Фиксированный доход',
  'category.savings': 'Сбережения',
  'category.treasury': 'Государственные облигации',
  'risk.low': 'Низкий',
  'risk.medium': 'Средний',
  'risk.high': 'Высокий',
  'liquidity.daily': 'Ежедневно',
  'liquidity.maturity': 'При погашении',

  'investment.poupanca.desc':
    'Инвестиция с низким риском и ежедневной ликвидностью, освобождённая от подоходного налога для физических лиц.',
  'investment.cdb.desc':
    'Банковский депозитный сертификат с доходностью, привязанной к ставке CDI, и защитой FGC.',
  'investment.lci-lca.desc':
    'Кредитные ноты в сфере недвижимости и агробизнеса, освобождённые от налога и защищённые FGC.',
  'investment.tesouro-selic.desc':
    'Государственная облигация с плавающей ставкой, привязанной к ставке Selic, идеальна для резервного фонда.',
  'investment.tesouro-prefixado.desc':
    'Государственная облигация с доходностью, зафиксированной в момент покупки.',
  'investment.tesouro-ipca.desc':
    'Гибридная государственная облигация, выплачивающая инфляцию (IPCA) плюс фиксированную ставку.',

  'home.badge': 'Фиксированный доход — это просто',
  'home.hero.title': 'Узнайте, насколько может вырасти ваш капитал',
  'home.hero.subtitle':
    'Моделируйте инвестиции с фиксированным доходом, сравнивайте варианты и принимайте решения на основе реальных цифр — без таблиц и сложностей.',
  'home.hero.ctaPrimary': 'Начать расчёт',
  'home.hero.ctaSecondary': 'Сравнить инвестиции',
  'home.features.simulate.title': 'Расчёт с пополнениями',
  'home.features.simulate.desc':
    'Рассчитайте сложные проценты с ежемесячными пополнениями и увидьте результат уже с вычетом налога.',
  'home.features.compare.title': 'Сравнение рядом',
  'home.features.compare.desc':
    'Поместите разные инвестиции в один сценарий и найдите лучшую чистую доходность.',
  'home.features.info.title': 'Понятная информация',
  'home.features.info.desc':
    'Риск, ликвидность, покрытие FGC и налогообложение каждой инвестиции в одном месте.',
  'home.types.title': 'Виды инвестиций',
  'home.types.compareAll': 'Сравнить все',
  'home.card.exempt': 'Без налога',
  'home.card.taxed': 'Облагается',
  'home.card.risk': 'Риск: {risk}',
  'home.card.liquidity': 'Ликвидность: {value}',

  'simulator.title': 'Калькулятор',
  'simulator.subtitle':
    'Спрогнозируйте рост вашей инвестиции с ежемесячными пополнениями и увидьте результат уже с вычетом подоходного налога.',
  'simulator.form.title': 'Параметры расчёта',
  'simulator.form.type': 'Вид инвестиции',
  'simulator.form.typePlaceholder': 'Выберите',
  'simulator.form.initial': 'Начальная сумма (R$)',
  'simulator.form.monthly': 'Ежемесячный взнос (R$)',
  'simulator.form.period': 'Срок (месяцев)',
  'simulator.badge.perYear': '{rate} в год',
  'simulator.badge.risk': 'Риск: {risk}',
  'simulator.badge.exempt': 'Без налога',
  'simulator.badge.taxed': 'Облагается налогом',
  'simulator.save': 'Сохранить расчёт',

  'result.invested': 'Всего вложено',
  'result.netInterest': 'Чистый доход',
  'result.tax': 'Подоходный налог',
  'result.taxWithRate': 'Подоходный налог ({rate})',
  'result.netBalance': 'Итоговая сумма (чистая)',

  'chart.growth.title': 'Рост капитала',
  'chart.growth.gross': 'Сумма до налога',
  'chart.growth.invested': 'Всего вложено',
  'chart.monthLabel': 'Месяц {n}',
  'chart.monthSuffix': 'м',

  'save.title': 'Сохранить расчёт',
  'save.desc': 'Дайте название, чтобы найти его позже в истории.',
  'save.nameLabel': 'Название',
  'save.namePlaceholder': 'Напр.: Резервный фонд',
  'common.cancel': 'Отмена',
  'common.save': 'Сохранить',

  'comparison.title': 'Сравнить инвестиции',
  'comparison.subtitle':
    'Примените один и тот же сценарий к разным инвестициям и узнайте, какая даёт лучшую чистую доходность.',
  'comparison.controls.title': 'Сценарий сравнения',
  'comparison.controls.initial': 'Начальная сумма (R$)',
  'comparison.controls.monthly': 'Ежемесячный взнос (R$)',
  'comparison.controls.period': 'Срок (месяцев)',
  'comparison.controls.selected': 'Сравниваемые инвестиции',
  'comparison.empty.title': 'Выберите хотя бы одну инвестицию',
  'comparison.empty.desc':
    'Выберите инвестиции выше, чтобы увидеть сравнение доходности.',
  'comparison.chart.title': 'Итоговая чистая сумма по инвестициям',
  'comparison.chart.net': 'Чистая',
  'comparison.table.title': 'Детализация',
  'comparison.table.investment': 'Инвестиция',
  'comparison.table.rate': 'Ставка в год',
  'comparison.table.gross': 'До налога',
  'comparison.table.tax': 'Налог',
  'comparison.table.net': 'Чистая',
  'comparison.table.best': 'Лучшая доходность',
  'comparison.table.exempt': 'Без налога',

  'history.title': 'История',
  'history.subtitle':
    'Все сохранённые вами расчёты хранятся здесь, в вашем браузере.',
  'history.empty.title': 'Нет сохранённых расчётов',
  'history.empty.desc':
    'Выполните расчёт и нажмите «Сохранить», чтобы отслеживать свои сценарии здесь.',
  'history.empty.action': 'Перейти к калькулятору',
  'history.card.period': 'Срок',
  'history.card.invested': 'Вложено',
  'history.card.interest': 'Доход',
  'history.card.final': 'Итоговая сумма',
  'history.card.open': 'Открыть в калькуляторе',
  'history.card.delete': 'Удалить расчёт',
  'history.unnamed': 'Расчёт без названия',

  'duration.year': 'год',
  'duration.years': 'лет',
  'duration.month': 'месяц',
  'duration.months': 'месяцев',
  'duration.and': ' и ',
  'preset.yearSuffix': 'г',
  'preset.monthSuffix': 'м',
}

export const TRANSLATIONS: Record<Locale, Dictionary> = { pt, en, es, zh, ru }
