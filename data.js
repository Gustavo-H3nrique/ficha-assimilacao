// Banco de dados de Características e Assimilações do Assimilação RPG

export const CARACTERISTICAS = [
  // 1 Ponto
  {
    id: "agricultor",
    nome: "Agricultor",
    custo: 1,
    requisitoText: "Geografia 1+",
    requisitos: { Geografia: 1 },
    descricao: "Em todas as jogadas do(a) Infectado(a) oriundas de questões agrárias ou biológicas acerca da vida vegetal cultivada pelo ser humano, ganha um [A] (Sucesso) adicional."
  },
  {
    id: "cavaleiro",
    nome: "Cavaleiro",
    custo: 1,
    requisitoText: "Nenhum",
    requisitos: {},
    descricao: "Todos os testes para conduzir animais de montaria podem transformar uma [B] (Adaptação) em [A] (Sucesso) em seu resultado."
  },
  {
    id: "estagio_avancado",
    nome: "Estágio Avançado",
    custo: 1,
    requisitoText: "Apenas na criação inicial",
    requisitos: { criacao: true },
    descricao: "Aumenta em 1 o Nível de Assimilação inicial, reduzindo consequentemente em 1 o Nível de Determinação. Requer aprovação do(a) Assimilador(a) para realizar a rolagem e escolha de Assimilações adicionais."
  },
  {
    id: "investigador_assimilation",
    nome: "Investigador da Assimilação",
    custo: 1,
    requisitoText: "Biologia 1+",
    requisitos: { Biologia: 1 },
    descricao: "Em todo teste relacionado ao entendimento sobre o funcionamento da Assimilação, o(a) Infectado(a) pode transformar uma [B] em um [A]."
  },
  {
    id: "pegada_forte",
    nome: "Pegada Forte",
    custo: 1,
    requisitoText: "Potência 2+",
    requisitos: { Potência: 2 },
    descricao: "Todos os testes envolvendo firmeza para se segurar em algo ou não deixar que uma pessoa ou objeto escape das suas mãos permitem transformar uma [B] em um [A] em seu resultado."
  },
  {
    id: "piloto",
    nome: "Piloto",
    custo: 1,
    requisitoText: "Nenhum",
    requisitos: {},
    descricao: "Todos os testes para condução de veículos permitem transformar uma [B] em um [A] em seu resultado."
  },
  {
    id: "punhos_de_ferro",
    nome: "Punhos de Ferro",
    custo: 1,
    requisitoText: "Potência 2+ e Resolução 2+",
    requisitos: { Potência: 2, Resolução: 2 },
    descricao: "Quando usar um Ponto de Determinação para manter um dado adicional realizando ações de combate desarmado, adicionalmente pode transformar uma [B] em um [A]."
  },
  {
    id: "saque_rapido",
    nome: "Saque Rápido",
    custo: 1,
    requisitoText: "Reação 2+",
    requisitos: { Reação: 2 },
    descricao: "O(a) Infectado(a) não gasta [B] para sacar ou guardar um Equipamento, mesmo quando em Conflito."
  },
  {
    id: "sono_leve",
    nome: "Sono Leve",
    custo: 1,
    requisitoText: "Nenhum",
    requisitos: {},
    descricao: "Permite ao(à) Infectado(a) fazer um teste de Percepção para não ser surpreendido(a) quando está dormindo."
  },
  {
    id: "trato_animais",
    nome: "Trato com Animais",
    custo: 1,
    requisitoText: "Influência 2+",
    requisitos: { Influência: 2 },
    descricao: "Sempre que fizer alguma jogada para influenciar amistosamente o comportamento de animais pode transformar uma [B] em um [A]."
  },
  {
    id: "viajado",
    nome: "Viajado",
    custo: 1,
    requisitoText: "Nenhum",
    requisitos: {},
    descricao: "Todas as jogadas que envolvem o contato com outras culturas e outros povos permitem anular uma [C] (Pressão) no resultado."
  },
  // 2 Pontos
  {
    id: "antecedente_marcante",
    nome: "Antecedente Marcante",
    custo: 2,
    requisitoText: "Nenhum",
    requisitos: {},
    descricao: "Quando o(a) Infectado(a) ativar o seu Evento Marcante adicione um d10 (1) na rolagem, sem alterar a quantidade de dados mantidos."
  },
  {
    id: "aparencia_inofensiva",
    nome: "Aparência Inofensiva",
    custo: 2,
    requisitoText: "Influência 2+",
    requisitos: { Influência: 2 },
    descricao: "Em testes em Conflito, pode gastar [B] ou [A] para aumentar o custo das ativações de Ameaças que o tenham como alvo no próximo turno. Cada [B] ou [A] aumenta o custo das ativações em uma [B] ou uma [C], respectivamente."
  },
  {
    id: "artes_marciais",
    nome: "Artes Marciais",
    custo: 2,
    requisitoText: "Atletismo 2+ e Reação 2+",
    requisitos: { Atletismo: 2, Reação: 2 },
    descricao: "Todo teste que envolva práticas de artes marciais (aplicando ou defendendo golpes) permite remover uma [C] no resultado."
  },
  {
    id: "atencao_redobrada",
    nome: "Atenção Redobrada",
    custo: 2,
    requisitoText: "Percepção 2+",
    requisitos: { Percepção: 2 },
    descricao: "Sempre que precisar reagir a um perigo súbito (armadilhas, desabamentos, emboscadas), pode transformar um número de [B] em [A] até o seu valor em Reação."
  },
  {
    id: "atirador_astuto",
    nome: "Atirador Astuto",
    custo: 2,
    requisitoText: "Furtividade 2+",
    requisitos: { Furtividade: 2 },
    descricao: "Em ações que testem pontaria para fazer um ataque, desde que protegido(a) por cobertura onde consiga se esconder, pode transformar uma [B] em um [A]."
  },
  {
    id: "batedor",
    nome: "Batedor",
    custo: 2,
    requisitoText: "Geografia 2+",
    requisitos: { Geografia: 2 },
    descricao: "Capaz de explorar a Região na metade do tempo e encontra marcos geográficos com sucesso em teste de Geografia ou Sobrevivência."
  },
  {
    id: "disciplinado",
    nome: "Disciplinado",
    custo: 2,
    requisitoText: "Nenhum",
    requisitos: {},
    descricao: "Desde que não perturbado por elemento externo fora de Conflito, pode ignorar uma [C] se fizer a ação com calma e levar o dobro do tempo."
  },
  {
    id: "dissimulado",
    nome: "Dissimulado",
    custo: 2,
    requisitoText: "Influência 2+ e (Expressão 1+ ou Furtividade 1+)",
    requisitos: { Influência: 2, or: ["Expressão", "Furtividade"] },
    descricao: "Facilidade para se passar por residente de outro Refúgio com vestuário local, obtendo êxito em teste de Expressão ou Furtividade."
  },
  {
    id: "escaldado",
    nome: "Escaldado",
    custo: 2,
    requisitoText: "Sagacidade 2+",
    requisitos: { Sagacidade: 2 },
    descricao: "Quando realizar testes de Percepção para notar segundas intenções (pedidos pelo Assimilador), pode transformar uma [B] em um [A] por teste."
  },
  {
    id: "frugal",
    nome: "Frugal",
    custo: 2,
    requisitoText: "Nenhum",
    requisitos: {},
    descricao: "Necessita de menos água e comida que o normal (pode ficar o dobro do tempo sem sofrer penalidades). Anula efeitos de aumento de consumo de Assimilações."
  },
  {
    id: "intimidador",
    nome: "Intimidador",
    custo: 2,
    requisitoText: "Nenhum",
    requisitos: {},
    descricao: "Em testes para intimidar, pode gastar 1 d para substituir o valor de Expressão pelo de outro Instinto aprovado (muda a quantidade de dados, não o tipo)."
  },
  {
    id: "maos_leves",
    nome: "Mãos-Leves",
    custo: 2,
    requisitoText: "Reação 2+ e Furtividade 2+",
    requisitos: { Reação: 2, Furtividade: 2 },
    descricao: "Sempre que fizer alguma jogada para roubar ou ocultar objetos à vista das pessoas, pode adicionar uma [B] ao resultado."
  },
  {
    id: "memoria_afiada",
    nome: "Memória Afiada",
    custo: 2,
    requisitoText: "Sagacidade 2+",
    requisitos: { Sagacidade: 2 },
    descricao: "Todos os testes que tenham relação com a lembrança de alguma informação garantem um [A] em seus resultados."
  },
  {
    id: "presenca_encantadora",
    nome: "Presença Encantadora",
    custo: 2,
    requisitoText: "Influência 3+",
    requisitos: { Influência: 3 },
    descricao: "Pode gastar 1 d antes de rolar os dados para anular todas as [C] do resultado do teste em interações sociais."
  },
  {
    id: "reliquia",
    nome: "Relíquia",
    custo: 2,
    requisitoText: "Nenhum",
    requisitos: {},
    descricao: "Inicia com um Artefato valioso. Não é limitado pela Escassez e pode ser consertado do estado Quebrado. Perder o item causa perda de 1 d."
  },
  {
    id: "sacrificio_heroico",
    nome: "Sacrifício Heroico",
    custo: 2,
    requisitoText: "Nenhum",
    requisitos: {},
    descricao: "Permite sofrer todo o dano físico no lugar de um aliado próximo, uma vez por sessão de jogo."
  },
  {
    id: "sentido_agucado",
    nome: "[Sentido] Aguçado",
    custo: 2,
    requisitoText: "Percepção 2+",
    requisitos: { Percepção: 2 },
    descricao: "Escolha um sentido (visão, audição, etc.). Testes de Percepção que utilizem este sentido ganham um [A] adicional."
  },
  // 3 Pontos
  {
    id: "companheiro_animal",
    nome: "Companheiro Animal",
    custo: 3,
    requisitoText: "Sobrevivência 1+",
    requisitos: { Sobrevivência: 1 },
    descricao: "Acompanhado por animal de pequeno/médio porte. Quando o animal auxilia em uma ação, adiciona uma [B] ao resultado do teste."
  },
  {
    id: "construtor",
    nome: "Construtor",
    custo: 3,
    requisitoText: "Engenharia 3+",
    requisitos: { Engenharia: 3 },
    descricao: "Realiza Construções de forma eficiente, sem necessidade de testes de Engenharia semanais para obter pontos de obra."
  },
  {
    id: "contra_ataque",
    nome: "Contra-Ataque",
    custo: 3,
    requisitoText: "Reação 2+",
    requisitos: { Reação: 2 },
    descricao: "Após sofrer um ataque em Conflito, o próximo teste do(a) Infectado(a) para Neutralizar aquela Ameaça adiciona um [A] ao resultado."
  },
  {
    id: "corpo_grande",
    nome: "Corpo Grande",
    custo: 3,
    requisitoText: "Atletismo 2+",
    requisitos: { Atletismo: 2 },
    descricao: "Testes de Resolução relacionados com resistência física podem ser realizados com o valor de Potência. Não afeta testes mentais."
  },
  {
    id: "determinacao_inabalavel",
    nome: "Determinação Inabalável",
    custo: 3,
    requisitoText: "Resolução 3+",
    requisitos: { Resolução: 3 },
    descricao: "Todos os testes relacionados ao Propósito do(a) Infectado(a) permitem transformar uma [B] em um [A] no resultado."
  },
  {
    id: "esquiva_precisa",
    nome: "Esquiva Precisa",
    custo: 3,
    requisitoText: "Reação 2+",
    requisitos: { Reação: 2 },
    descricao: "Pode investir [A] do seu resultado para impor penalidade [P] a ataques contra si até que seja pago ou o Conflito se encerre."
  },
  {
    id: "gambiarra",
    nome: "Gambiarra",
    custo: 3,
    requisitoText: "Sagacidade 2+",
    requisitos: { Sagacidade: 2 },
    descricao: "Permite modificar Características de Artefatos (customização de equipamentos)."
  },
  {
    id: "inabalavel",
    nome: "Inabalável",
    custo: 3,
    requisitoText: "Resolução 3+",
    requisitos: { Resolução: 3 },
    descricao: "Em testes de resistência mental/emocional, pode transformar [B] em [A] uma quantidade de vezes até o valor de Resolução por sessão."
  },
  {
    id: "olhar_minucioso",
    nome: "Olhar Minucioso",
    custo: 3,
    requisitoText: "Percepção 2+",
    requisitos: { Percepção: 2 },
    descricao: "Jogadas de Percepção ou Sagacidade para achar itens novos/escondidos ganham um [A] adicional."
  },
  {
    id: "orientacao",
    nome: "Orientação",
    custo: 3,
    requisitoText: "Geografia 2+ ou Sobrevivência 2+",
    requisitos: { or: ["Geografia", "Sobrevivência"], val: 2 },
    descricao: "Dificilmente se perde; testes de Geografia/Sobrevivência para rastreamento ou localização ganham uma [B] adicional."
  },
  {
    id: "parkour",
    nome: "Parkour",
    custo: 3,
    requisitoText: "Reação 2+",
    requisitos: { Reação: 2 },
    descricao: "Testes de escalada, pulos, saltos, equilíbrio ou passagens apertadas ganham uma [B] adicional."
  },
  {
    id: "primeiros_socorros",
    nome: "Primeiros Socorros",
    custo: 3,
    requisitoText: "Medicina 2+",
    requisitos: { Medicina: 2 },
    descricao: "Sempre que realizar jogadas que visem cuidar de ferimentos e doenças, adiciona um [A] em seu resultado."
  },
  {
    id: "racional",
    nome: "Racional",
    custo: 3,
    requisitoText: "Erudição 2+",
    requisitos: { Erudição: 2 },
    descricao: "Testes de Resolução relacionados com resistência mental podem ser realizados com Sagacidade. Não afeta testes físicos."
  },
  {
    id: "recuperacao_rapida",
    nome: "Recuperação Rápida",
    custo: 3,
    requisitoText: "Resolução 2+",
    requisitos: { Resolução: 2 },
    descricao: "Toda vez que ativa a Recuperação de Saúde, regenera dois pontos de Saúde adicionais."
  },
  {
    id: "resiliente",
    nome: "Resiliente",
    custo: 3,
    requisitoText: "Assimilação 2+",
    requisitos: { Assimilação: 2 },
    descricao: "Uma vez por Conflito, ao sofrer dano, pode gastar Pontos de Assimilação para reduzir o dano sofrido na mesma proporção."
  },
  {
    id: "vaso_ruim",
    nome: "Vaso Ruim",
    custo: 3,
    requisitoText: "Resolução 2+",
    requisitos: { Resolução: 2 },
    descricao: "Anula a primeira ativação que levaria à sua morte. Só pode ser usado novamente após cumprir uma Clareza de Propósito."
  },
  // 4 Pontos
  {
    id: "heroi_local",
    nome: "Herói Local",
    custo: 4,
    requisitoText: "Influência 3+",
    requisitos: { Influência: 3 },
    descricao: "Uma vez por arco de história, pode gastar seu Evento Marcante para evitar que o Refúgio perca um nível de Moral."
  },
  {
    id: "macgyver",
    nome: "MacGyver",
    custo: 4,
    requisitoText: "Sagacidade 2+ e Manufaturas 2+",
    requisitos: { Sagacidade: 2, Manufaturas: 2 },
    descricao: "Uma vez por sessão, constrói um Artefato com a característica Improvisado e outra característica nível 1 durando até o fim da cena."
  },
  {
    id: "suporte",
    nome: "Suporte",
    custo: 4,
    requisitoText: "Influência 2+ e Reação 2+",
    requisitos: { Influência: 2, Reação: 2 },
    descricao: "Sempre que usar a ação Ajudar Aliado para transferir [A] a outros Infectados, adiciona um [A] extra."
  },
  // 5 Pontos
  {
    id: "mira_fatal",
    nome: "Mira Fatal",
    custo: 5,
    requisitoText: "Armas 3+ e (Percepção 3+ ou Reação 3+)",
    requisitos: { Armas: 3, or: ["Percepção", "Reação"], val: 3 },
    descricao: "Em ataques de pontaria, pode gastar 2 d para dobrar o número de [A] investidos em Neutralização de Ameaça."
  },
  {
    id: "motivar_aliado",
    nome: "Motivar Aliado",
    custo: 5,
    requisitoText: "Expressão 3+",
    requisitos: { Expressão: 3 },
    descricao: "Ao usar Apoiar Aliado, cada [B] anula duas [C] do mesmo aliado. Pode ser ativado até o valor de Influência por sessão."
  }
];

export const ASSIMILACOES = {
  evolutivas: {
    suit: "Copas",
    suitSymbol: "♥",
    nome: "Assimilações Evolutivas",
    descricao: "Desenvolvem o corpo sem deformidades ou dor, ampliando habilidades naturais.",
    cartas: [
      {
        carta: "Ás de Copas",
        nome: "Assimilação Sensitiva",
        mutações: [
          { cost: "A", name: "Sensibilidade", desc: "Gasta 1 e para sentir a presença de criaturas assimiladas em até 30m pela cena." },
          { cost: "AA", name: "Consciência", desc: "Mantenha um dado adicional em qualquer teste que inclua Percepção." },
          { cost: "AAA", name: "Discernimento", desc: "Adicione [B] a um dado mantido que já possua [B] nos testes de Ação." },
          { cost: "AAAA", name: "Presciência", req: 3, desc: "E 3+: No início da sessão, rola 2 dados e substitui por rolagens da mesa posteriormente." },
          { cost: "AAAAA", name: "Complicar", req: 5, desc: "E 5+: Gasta 1 d para fazer alguém rolar novamente um dado." },
          { cost: "AAAAAA", name: "Vidência", req: 7, desc: "E 7+: Prevê Crises, permitindo ao Assimilador adiar seu efeito por até 24h para contra-medidas." }
        ]
      },
      {
        carta: "2 de Copas",
        nome: "Assimilação Reativa",
        mutações: [
          { cost: "A", name: "Ligeiro", desc: "Recebe +1 ponto em Reação (pode ultrapassar o limite máximo)." },
          { cost: "AA", name: "Rápido", desc: "Sempre que realizar teste com Reação, pode usar 1 e para adicionar [A]." },
          { cost: "AAA", name: "Preciso", desc: "Sempre que realizar teste com Reação, anula as [C] do resultado." },
          { cost: "AAAA", name: "Alígero", req: 3, desc: "E 3+: Sempre que realizar teste com Reação, substitui as [B] por [A]." },
          { cost: "AAAAA", name: "Hábil", req: 5, desc: "E 5+: +1 [A] em testes de Reação (acumula com Rápido)." },
          { cost: "AAAAAA", name: "Celeridade", req: 7, desc: "E 7+: Substitui todos os d6 por d10 (ou 6 por 1) na pilha de Reação." }
        ]
      },
      {
        carta: "3 de Copas",
        nome: "Assimilação Sensorial",
        mutações: [
          { cost: "A", name: "Perceptivo", desc: "Recebe +1 ponto em Percepção (pode ultrapassar o limite máximo)." },
          { cost: "AA", name: "Alerta", desc: "Sempre que realizar teste com Percepção, pode usar 1 e para adicionar [A]." },
          { cost: "AAA", name: "Detalhista", desc: "Sempre que realizar teste com Percepção, anula as [C] do resultado." },
          { cost: "AAAA", name: "Meticuloso", req: 3, desc: "E 3+: Sempre que realizar teste com Percepção, substitui as [B] por [A]." },
          { cost: "AAAAA", name: "Arguto", req: 5, desc: "E 5+: +1 [A] em testes de Percepção (acumula com Alerta)." },
          { cost: "AAAAAA", name: "Intuitivo", req: 7, desc: "E 7+: Substitui todos os d6 por d10 (ou 6 por 1) na pilha de Percepção." }
        ]
      }
    ]
  },
  adaptativas: {
    suit: "Ouros",
    suitSymbol: "♦",
    nome: "Assimilações Adaptativas",
    descricao: "Vantagens adaptativas físicas com algumas consequências estéticas ou fisiológicas secundárias.",
    cartas: [
      {
        carta: "Ás de Ouros",
        nome: "Pele de Couro",
        mutações: [
          { cost: "B", name: "Couro Calejado", desc: "Sua pele fica espessa. Reduz em 1 o dano de ataques físicos comuns." },
          { cost: "BB", name: "Brilho Químico", desc: "Pode fazer sua pele brilhar com luz bioluminescente, iluminando 5 metros." },
          { cost: "BBB", name: "Carapaça Flexível", desc: "Adiciona +2 pontos de Saúde máxima na barra Saudável." },
          { cost: "BBBB", name: "Resistência Térmica", req: 3, desc: "E 3+: Ignora penalidades climáticas causadas por frio extremo ou calor." }
        ]
      },
      {
        carta: "2 de Ouros",
        nome: "Membros Ampliados",
        mutações: [
          { cost: "B", name: "Alcance Longo", desc: "Seus braços se esticam levemente. Pode atacar ou interagir fisicamente a até 3m de distância." },
          { cost: "BB", name: "Escalada Ágil", desc: "Ganha [B] automática em todos os testes de Atletismo voltados a escalar." },
          { cost: "BBB", name: "Mãos Preênseis", desc: "Pode segurar objetos pesados com uma única mão sem penalidade." }
        ]
      }
    ]
  },
  inoportunas: {
    suit: "Espadas",
    suitSymbol: "♠",
    nome: "Assimilações Inoportunas",
    descricao: "Mutações inconvenientes que geram deformações visíveis, peso na mente ou perda de controle.",
    cartas: [
      {
        carta: "Ás de Espadas",
        nome: "Nodos Purulentos",
        mutações: [
          { cost: "C", name: "Odor Desagradável", desc: "Causa [P] em testes sociais devido ao odor purulento exalado pelos poros." },
          { cost: "CC", name: "Instabilidade Epidérmica", desc: "Qualquer impacto forte pode estourar bolhas, causando 1 ponto de dano s." },
          { cost: "CCC", name: "Contágio Latente", desc: "Qualquer aliado que realizar tratamento médico em você ganha uma [C] temporária." }
        ]
      },
      {
        carta: "2 de Espadas",
        nome: "Rigidez Articular",
        mutações: [
          { cost: "C", name: "Movimento Duro", desc: "Reduz em 1 ponto a sua Reação em testes que exijam reflexos rápidos." },
          { cost: "CC", name: "Lentidão Corporal", desc: "Gastar [B] para mover-se em Conflito custa o dobro de pontos." }
        ]
      }
    ]
  },
  singulares: {
    suit: "Paus",
    suitSymbol: "♣",
    nome: "Assimilações Singulares",
    descricao: "Mutações adaptadas a ambientes específicos onde o Infectado se desenvolveu.",
    cartas: [
      {
        carta: "Ás de Paus",
        nome: "Assimilação Vegetativa",
        mutações: [
          { cost: "I", name: "Fotossíntese", desc: "Recupera 1 d de Determinação ao repousar sob luz solar direta, sem precisar de água/comida naquele dia." },
          { cost: "II", name: "Mimetismo Florestal", desc: "Ganha um [A] em testes de Furtividade quando em matas ou florestas." },
          { cost: "III", name: "Espinhos Protetores", desc: "Inimigos que atacam você desarmados sofrem 1 ponto de dano s." }
        ]
      }
    ]
  }
};
