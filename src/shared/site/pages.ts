/*
 * Texto das páginas institucionais. A mesma fonte alimenta a tela (React) e o
 * HTML pré-renderizado, para o Google ler exatamente o que o visitante vê.
 * `{email}` é trocado pelo e-mail de contato.
 */

export interface PageSection {
   heading?: string
   paragraphs: string[]
}

export interface PageContent {
   path: string
   /** Título da aba e dos resultados de busca. */
   title: string
   description: string
   heading: string
   sections: PageSection[]
}

export const HOW_TO_PLAY: PageSection[] = [
   {
      paragraphs: [
         'Cada desafio dá um número-alvo, um algarismo e uma quantidade. O objetivo é montar uma conta que resulte no alvo usando só aquele algarismo, exatamente aquela quantidade de vezes. Algarismos lado a lado formam um número: dois algarismos 4 podem virar 44.',
         'Por exemplo, para formar 24 com quatro algarismos 4, uma resposta é 4 × 4 + 4 + 4. Quase sempre existe mais de um caminho, e qualquer conta correta vale.',
      ],
   },
   {
      heading: 'Os três níveis',
      paragraphs: [
         'Fácil: soma, subtração, multiplicação, fração e parênteses.',
         'Médio: tudo do Fácil, mais potência e raiz quadrada.',
         'Difícil: tudo do Médio, mais o fatorial (5! = 5 × 4 × 3 × 2 × 1 = 120).',
      ],
   },
   {
      heading: 'Ajudas',
      paragraphs: [
         'O olho ao lado da conta mostra o resultado enquanto você escreve. A dica revela o começo de uma solução. Se nada der certo, dá para pedir a solução completa, mas aí o desafio fica marcado como não resolvido.',
      ],
   },
]

export const STATIC_PAGES: PageContent[] = [
   {
      path: '/sobre/',
      title: 'Sobre o algarism.io',
      description:
         'O que é o algarism.io: três desafios de matemática por dia, em que você forma um número usando um único algarismo.',
      heading: 'Sobre o algarism.io',
      sections: [
         {
            paragraphs: [
               'O algarism.io é um jogo diário de matemática. Todo dia saem três desafios novos, um fácil, um médio e um difícil, e em cada um você precisa formar um número usando um único algarismo, uma quantidade exata de vezes.',
               'A ideia vem de um quebra-cabeça clássico, o dos "quatro quatros": escrever os números usando apenas quatro algarismos 4 e as operações da matemática. Aqui o algarismo, a quantidade e o alvo mudam todos os dias.',
            ],
         },
         { heading: 'Como se joga', paragraphs: HOW_TO_PLAY[0].paragraphs },
         HOW_TO_PLAY[1],
         HOW_TO_PLAY[2],
         {
            heading: 'Um desafio novo por dia',
            paragraphs: [
               'Os desafios viram à meia-noite, no horário do seu aparelho. Os dias anteriores continuam abertos: o calendário no topo do jogo e a página "Todos os desafios" levam a qualquer um deles.',
               'Não é preciso criar conta. O seu progresso fica guardado no próprio navegador, e é por isso que ele não acompanha você de um aparelho para outro.',
            ],
         },
         {
            heading: 'Para quem é',
            paragraphs: [
               'Para quem gosta de quebra-cabeças numéricos e para quem quer treinar cálculo mental e ordem das operações. Professores podem usar o desafio do dia como aquecimento de aula: o nível Fácil só pede as quatro operações, e o Médio e o Difícil trazem potência, raiz e fatorial.',
            ],
         },
      ],
   },
   {
      path: '/privacidade/',
      title: 'Política de Privacidade',
      description:
         'Como o algarism.io trata dados: o progresso do jogo fica no seu navegador, e como funcionam os cookies e os anúncios.',
      heading: 'Política de Privacidade',
      sections: [
         {
            paragraphs: [
               'Esta política explica quais dados o algarism.io trata quando você usa o site. Ela segue a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).',
            ],
         },
         {
            heading: 'O que fica guardado no seu aparelho',
            paragraphs: [
               'O jogo não tem cadastro e não pede nome, e-mail nem qualquer outro dado pessoal. O seu progresso (as contas que você montou, os desafios resolvidos e se pediu dica ou solução) fica no armazenamento local do seu navegador. Essas informações não são enviadas para nós e você pode apagá-las a qualquer momento limpando os dados do site no navegador.',
            ],
         },
         {
            heading: 'Dados técnicos de acesso',
            paragraphs: [
               'Para o site funcionar, o seu navegador se conecta aos serviços que o hospedam e que entregam os desafios e as fontes da página (Cloudflare, Supabase e Google Fonts). Como em qualquer acesso na internet, esses serviços recebem dados técnicos, como endereço IP, tipo de navegador e horário do acesso, e os tratam segundo as políticas de privacidade de cada um.',
            ],
         },
         {
            heading: 'Cookies e anúncios',
            paragraphs: [
               'O site pode exibir anúncios do Google AdSense. Quando eles estão ativos, o Google e os parceiros dele usam cookies e identificadores para exibir e medir anúncios, inclusive anúncios personalizados com base nas suas visitas a este e a outros sites.',
               'Os anúncios só são carregados depois que você aceita os cookies no aviso que aparece na primeira visita. Se você recusar, o jogo funciona normalmente, sem anúncios. Para mudar de ideia, use o link "Preferências de cookies" no rodapé.',
               'Você também pode desativar a publicidade personalizada do Google em adssettings.google.com e saber como o Google usa os dados de sites parceiros em policies.google.com/technologies/partner-sites.',
            ],
         },
         {
            heading: 'Seus direitos',
            paragraphs: [
               'A LGPD garante a você, entre outros, os direitos de confirmar se há tratamento de dados, acessar, corrigir e pedir a exclusão deles, além de revogar o consentimento. Para exercer esses direitos ou tirar dúvidas, escreva para {email}.',
            ],
         },
         {
            heading: 'Mudanças nesta política',
            paragraphs: [
               'Esta política pode ser atualizada quando o site mudar. A versão em vigor é sempre a publicada nesta página.',
            ],
         },
      ],
   },
   {
      path: '/termos/',
      title: 'Termos de Uso',
      description:
         'As regras de uso do algarism.io, o jogo diário de desafios de matemática.',
      heading: 'Termos de Uso',
      sections: [
         {
            paragraphs: [
               'Ao usar o algarism.io você concorda com estes termos. Se não concordar, basta não usar o site.',
            ],
         },
         {
            heading: 'O serviço',
            paragraphs: [
               'O algarism.io é um jogo gratuito de desafios de matemática, oferecido como está. Fazemos o possível para mantê-lo no ar e com os desafios corretos, mas não garantimos funcionamento sem interrupções nem ausência de erros. Desafios, regras e recursos podem mudar ou sair do ar sem aviso.',
            ],
         },
         {
            heading: 'Uso permitido',
            paragraphs: [
               'Você pode jogar e compartilhar os seus resultados à vontade, inclusive em sala de aula. Não é permitido tentar derrubar o site, sobrecarregar os servidores com acessos automatizados, obter os desafios antes da liberação ou copiar o site para republicá-lo.',
            ],
         },
         {
            heading: 'Propriedade intelectual',
            paragraphs: [
               'O nome, a marca, o mascote, os textos, o visual e o código do algarism.io pertencem aos seus criadores. Marcas de terceiros citadas no site pertencem aos respectivos donos.',
            ],
         },
         {
            heading: 'Anúncios e links externos',
            paragraphs: [
               'O site pode exibir anúncios e links para sites de terceiros. Não nos responsabilizamos pelo conteúdo, pelos produtos nem pelas práticas desses sites.',
            ],
         },
         {
            heading: 'Limitação de responsabilidade',
            paragraphs: [
               'Na extensão permitida pela lei, o algarism.io não responde por perdas decorrentes do uso do site ou da impossibilidade de usá-lo, incluindo a perda do progresso guardado no navegador.',
            ],
         },
         {
            heading: 'Mudanças e contato',
            paragraphs: [
               'Estes termos podem ser atualizados; a versão em vigor é a publicada nesta página. Eles seguem as leis do Brasil. Dúvidas: {email}.',
            ],
         },
      ],
   },
   {
      path: '/contato/',
      title: 'Contato',
      description:
         'Fale com o algarism.io: dúvidas, sugestões e avisos de erro nos desafios.',
      heading: 'Contato',
      sections: [
         {
            paragraphs: [
               'Achou um erro em um desafio, tem uma sugestão ou quer falar sobre o uso do jogo em sala de aula? Escreva para {email}.',
               'Se a mensagem for sobre um desafio específico, conte o dia e o nível (Fácil, Médio ou Difícil) e, se puder, a conta que você tentou. Isso ajuda a encontrar o problema.',
            ],
         },
      ],
   },
]
