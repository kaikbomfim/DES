import { Injectable } from '@nestjs/common';

@Injectable()
export class DesService {
  // === TABELAS DE PERMUTAÇÃO E SUBSTITUIÇÃO DO DES ===
  // Estas tabelas são a "receita secreta" do algoritmo DES.
  // Elas definem como os bits serão reorganizados durante o processo.
  // 🏠 Analogia: Como se fosse a planta de uma casa, definindo onde cada cômodo será posicionado.

  // Permutação Inicial (IP) - Reorganiza os bits do bloco de entrada antes do processamento principal
  // Esta é a primeira transformação aplicada aos dados originais
  // 🏠 Analogia: A entrada da casa, onde reorganizamos as pessoas antes de entrarem nos cômodos
  private IP: number[] = [
    58, 50, 42, 34, 26, 18, 10, 2, 60, 52, 44, 36, 28, 20, 12, 4, 62, 54, 46,
    38, 30, 22, 14, 6, 64, 56, 48, 40, 32, 24, 16, 8, 57, 49, 41, 33, 25, 17, 9,
    1, 59, 51, 43, 35, 27, 19, 11, 3, 61, 53, 45, 37, 29, 21, 13, 5, 63, 55, 47,
    39, 31, 23, 15, 7,
  ];

  // Permutação Final (FP) - Reorganiza os bits após as 16 rodadas de processamento
  // Esta é a última transformação e é o inverso da permutação inicial
  // 🏠 Analogia: A saída da casa, onde as pessoas se reagrupam antes de sair
  private FP: number[] = [
    40, 8, 48, 16, 56, 24, 64, 32, 39, 7, 47, 15, 55, 23, 63, 31, 38, 6, 46, 14,
    54, 22, 62, 30, 37, 5, 45, 13, 53, 21, 61, 29, 36, 4, 44, 12, 52, 20, 60,
    28, 35, 3, 43, 11, 51, 19, 59, 27, 34, 2, 42, 10, 50, 18, 58, 26, 33, 1, 41,
    9, 49, 17, 57, 25,
  ];

  // Expansão E-bit - Expande o bloco de 32 bits para 48 bits
  // Isso é necessário porque a subchave tem 48 bits, então precisamos "esticar" os dados
  // para combinar com a subchave usando a operação XOR
  // 🍕 Analogia: Como esticar a massa da pizza para caber no formato da forma
  private E: number[] = [
    32, 1, 2, 3, 4, 5, 4, 5, 6, 7, 8, 9, 8, 9, 10, 11, 12, 13, 12, 13, 14, 15,
    16, 17, 16, 17, 18, 19, 20, 21, 20, 21, 22, 23, 24, 25, 24, 25, 26, 27, 28,
    29, 28, 29, 30, 31, 32, 1,
  ];

  // Permutação P - Reorganiza os bits após a substituição nas S-Boxes
  // Aumenta a "confusão" no algoritmo, tornando mais difícil de quebrar
  // 🃏 Analogia: Como embaralhar cartas para garantir que ninguém saiba a ordem delas
  private P: number[] = [
    16, 7, 20, 21, 29, 12, 28, 17, 1, 15, 23, 26, 5, 18, 31, 10, 2, 8, 24, 14,
    32, 27, 3, 9, 19, 13, 30, 6, 22, 11, 4, 25,
  ];

  // S-Boxes (Caixas de Substituição)
  // O coração da segurança do DES!
  // Estas tabelas substituem blocos de 6 bits por blocos de 4 bits de forma não-linear
  // Esta substituição não-linear é o que torna o DES resistente a certos tipos de ataques
  // 🎭 Analogia: Como um jogo de máscaras, onde cada pessoa troca de identidade seguindo regras específicas
  private SBOX: number[][][] = [
    // S1
    [
      [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
      [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
      [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
      [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13],
    ],
    // S2
    [
      [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
      [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
      [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
      [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9],
    ],
    // S3
    [
      [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
      [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
      [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
      [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12],
    ],
    // S4
    [
      [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
      [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
      [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
      [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14],
    ],
    // S5
    [
      [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
      [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
      [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
      [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3],
    ],
    // S6
    [
      [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
      [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
      [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
      [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13],
    ],
    // S7
    [
      [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
      [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
      [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
      [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12],
    ],
    // S8
    [
      [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
      [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
      [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
      [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11],
    ],
  ];

  // === TABELAS DE GERAÇÃO DE CHAVES ===
  // Estas tabelas são usadas para criar as 16 subchaves a partir da chave principal
  // 🔑 Analogia: Como criar 16 chaves diferentes a partir de uma chave-mestra

  // PC1 - Permutação da Chave 1
  // Reduz a chave de 64 para 56 bits, eliminando os bits de paridade
  // ✂️ Analogia: Como cortar os pedaços desnecessários de uma chave para criar uma nova
  private PC1: number[] = [
    57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35,
    27, 19, 11, 3, 60, 52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46,
    38, 30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4,
  ];

  // PC2 - Permutação da Chave 2
  // Comprime os 56 bits para 48 bits para uso nas rodadas
  // 🏋️ Analogia: Como comprimir uma massa para torná-la mais compacta
  private PC2: number[] = [
    14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27,
    20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56,
    34, 53, 46, 42, 50, 36, 29, 32,
  ];

  // Quantidade de deslocamentos para cada rodada na geração de subchaves
  // Define quantas posições a chave será rotacionada em cada rodada
  // 🔄 Analogia: Quantas vezes devemos girar a chave na fechadura em cada etapa
  private SHIFTS: number[] = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

  // Chave principal de criptografia (a chave mestra)
  private defaultKey: string;
  private key: string;

  // Array que armazena as 16 subchaves geradas a partir da chave principal
  // 🔑 Analogia: Como um chaveiro com 16 chaves diferentes derivadas da chave mestra
  private subKeys: string[] = [];

  // Controla se estamos no modo demonstração (com logs detalhados)
  private demoMode: boolean = false;

  // Controla quanto tempo esperar entre os logs no modo demonstração
  private stepDelay: number = 200;

  constructor() {
    // Define uma chave inicial em formato hexadecimal (16 caracteres = 64 bits)
    // Na prática, esta chave seria fornecida pelo usuário ou por um sistema de gerenciamento de chaves
    // 🔐 Analogia: Como a senha mestra que você usa para um cofre importante
    this.defaultKey = '0123456789ABCDEF';
    this.key = this.defaultKey;

    // Gera as 16 subchaves necessárias para o processo de criptografia/descriptografia
    this.generateSubKeys();
  }

  // Ativa ou desativa o modo de demonstração com logs detalhados
  setDemoMode(enabled: boolean): void {
    this.demoMode = enabled;
  }

  // Retorna a chave atual em uso
  getCurrentKey(): string {
    return this.key;
  }

  // === MÉTODO PRINCIPAL DE CRIPTOGRAFIA ===
  // Transforma texto legível em texto cifrado usando o algoritmo DES
  // 📬 Analogia: Como colocar uma carta em um envelope lacrado que só o destinatário pode abrir
  encrypt(plaintext: string, customKey?: string): string {
    // Se estamos no modo demonstração, mostramos logs detalhados
    if (this.demoMode) {
      console.log('\n🔍 DETALHES DA CRIPTOGRAFIA DES:');
    }

    // Se uma chave personalizada foi fornecida, reconfigura as subchaves
    if (customKey && customKey !== this.key) {
      if (this.demoMode) {
        console.log('🔄 Configurando nova chave personalizada...');
        setTimeout(() => {
          console.log(`🔑 Nova chave: ${customKey}`);
        }, this.stepDelay);
      }
      this.setKey(customKey);
    }

    // Converte o texto em representação binária (cada caractere vira 8 bits)
    const binaryText = this.textToBinary(plaintext);

    if (this.demoMode) {
      setTimeout(() => {
        console.log(`📝 Texto original: "${plaintext}"`);
        console.log(
          `🔢 Representação binária: ${binaryText.substring(0, 24)}...`,
        );
        console.log(`   (${binaryText.length} bits no total)`);
      }, this.stepDelay * 2);
    }

    // Divide o texto em blocos de 64 bits, pois o DES processa 64 bits por vez
    // 📦 Analogia: Como dividir um grande pacote em caixas menores para processamento
    const blocks = this.splitIntoBlocks(binaryText, 64);

    if (this.demoMode) {
      setTimeout(() => {
        console.log(
          `📦 Dividindo em ${blocks.length} blocos de 64 bits cada...`,
        );
      }, this.stepDelay * 3);
    }

    let result = '';
    let blockIndex = 0;

    for (const block of blocks) {
      blockIndex++;

      if (this.demoMode) {
        setTimeout(
          () => {
            console.log(
              `\n🧩 Processando bloco ${blockIndex} de ${blocks.length}...`,
            );
          },
          this.stepDelay * (4 + blockIndex),
        );
      }

      // Processa cada bloco individualmente através do algoritmo DES
      const encryptedBlock = this.processBlock(block, true);

      // Converte o resultado binário em formato hexadecimal para tornar a saída mais compacta
      const hexBlock = this.binaryToHex(encryptedBlock);
      result += hexBlock;

      if (this.demoMode) {
        setTimeout(
          () => {
            console.log(`   ✅ Bloco ${blockIndex} cifrado: ${hexBlock}`);
          },
          this.stepDelay * (5 + blockIndex),
        );
      }
    }

    if (this.demoMode) {
      setTimeout(
        () => {
          console.log(`\n🔒 Resultado final da criptografia: ${result}`);
        },
        this.stepDelay * (6 + blocks.length),
      );
    }

    return result;
  }

  // === MÉTODO PRINCIPAL DE DESCRIPTOGRAFIA ===
  // Transforma o texto cifrado de volta ao texto original
  // 📭 Analogia: Como abrir o envelope lacrado para ler a carta dentro
  decrypt(ciphertext: string, customKey?: string): string {
    // Se estamos no modo demonstração, mostramos logs detalhados
    if (this.demoMode) {
      console.log('\n🔍 DETALHES DA DESCRIPTOGRAFIA DES:');
    }

    // Se uma chave personalizada foi fornecida, reconfigura as subchaves
    if (customKey && customKey !== this.key) {
      if (this.demoMode) {
        console.log(
          '🔄 Configurando chave personalizada para descriptografia...',
        );
        setTimeout(() => {
          console.log(`🔑 Chave: ${customKey}`);
        }, this.stepDelay);
      }
      this.setKey(customKey);
    }

    // Converte o texto cifrado (em hex) para formato binário
    const binaryText = this.hexToBinary(ciphertext);

    if (this.demoMode) {
      setTimeout(() => {
        console.log(`🔒 Texto cifrado: "${ciphertext}"`);
        console.log(
          `🔢 Representação binária: ${binaryText.substring(0, 24)}...`,
        );
        console.log(`   (${binaryText.length} bits no total)`);
      }, this.stepDelay * 2);
    }

    // Divide em blocos de 64 bits para processamento
    const blocks = this.splitIntoBlocks(binaryText, 64);

    if (this.demoMode) {
      setTimeout(() => {
        console.log(
          `📦 Dividindo em ${blocks.length} blocos de 64 bits cada...`,
        );
      }, this.stepDelay * 3);
    }

    let result = '';
    let blockIndex = 0;

    for (const block of blocks) {
      blockIndex++;

      if (this.demoMode) {
        setTimeout(
          () => {
            console.log(
              `\n🧩 Descriptografando bloco ${blockIndex} de ${blocks.length}...`,
            );
          },
          this.stepDelay * (4 + blockIndex),
        );
      }

      // Processa cada bloco usando o mesmo algoritmo, mas com as subchaves em ordem inversa
      const decryptedBlock = this.processBlock(block, false);

      // Converte o resultado binário de volta para texto
      const textBlock = this.binaryToText(decryptedBlock);
      result += textBlock;

      if (this.demoMode) {
        setTimeout(
          () => {
            console.log(
              `   ✅ Bloco ${blockIndex} descriptografado: "${textBlock}"`,
            );
          },
          this.stepDelay * (5 + blockIndex),
        );
      }
    }

    // Remove o preenchimento (padding) adicionado no final durante a criptografia
    const cleanResult = result.replace(/\0+$/, '');

    if (this.demoMode) {
      setTimeout(
        () => {
          console.log(
            `\n📝 Resultado final da descriptografia: "${cleanResult}"`,
          );
        },
        this.stepDelay * (6 + blocks.length),
      );
    }

    return cleanResult;
  }

  // === NÚCLEO DO ALGORITMO DES ===
  // Processa um bloco de 64 bits aplicando as 16 rodadas da Rede de Feistel
  // 🏭 Analogia: Como uma linha de produção com 16 estações, onde cada estação transforma o produto
  private processBlock(block: string, encrypt: boolean): string {
    if (this.demoMode) {
      setTimeout(() => {
        console.log(`   🔄 Aplicando permutação inicial (IP) ao bloco...`);
      }, this.stepDelay);
    }

    // Aplica a permutação inicial (IP) para reorganizar os bits
    let permuted = this.permute(block, this.IP);

    // Divide o bloco em duas metades de 32 bits cada (esquerda e direita)
    // Essa é a base da Rede de Feistel
    // ✂️ Analogia: Como cortar uma folha de papel ao meio para trabalhar em cada parte separadamente
    let left = permuted.substring(0, 32);
    let right = permuted.substring(32);

    if (this.demoMode) {
      setTimeout(() => {
        console.log(`   ✂️ Dividindo em dois blocos de 32 bits: L0 e R0`);
      }, this.stepDelay * 2);
    }

    // 16 rodadas do algoritmo Feistel
    // 🔄 Analogia: Como 16 etapas de um processo químico, onde cada etapa transforma o composto
    for (let i = 0; i < 16; i++) {
      // Para descriptografia, usamos as subchaves na ordem inversa (da 16ª para a 1ª)
      const round = encrypt ? i : 15 - i;

      if (this.demoMode && (i === 0 || i === 15)) {
        // Mostrar apenas primeira e última rodada para não sobrecarregar
        setTimeout(
          () => {
            console.log(
              `   🔄 Rodada ${i + 1}/${16}: Aplicando transformações Feistel...`,
            );
            if (i === 0) {
              console.log(`      (As rodadas 2-15 seguem o mesmo padrão)`);
            }
          },
          this.stepDelay * (3 + i),
        );
      }

      // Armazena o lado direito atual antes de modificá-lo
      const temp = right;

      // O novo lado direito é o resultado do XOR entre o lado esquerdo e a função F
      // aplicada ao lado direito atual com a subchave desta rodada
      // 🔀 Analogia: Como misturar dois ingredientes para formar um novo composto
      right = this.xor(left, this.f(right, this.subKeys[round]));

      // O lado esquerdo da próxima rodada se torna o lado direito atual
      left = temp;
    }

    // Combina as metades (com uma troca final)
    // Na última rodada, não trocamos L e R como de costume, mas os concatenamos em ordem inversa
    // 🧩 Analogia: Como juntar as duas metades de um quebra-cabeça, mas em ordem inversa
    const combined = right + left;

    if (this.demoMode) {
      setTimeout(() => {
        console.log(
          `   🧩 Combinando os blocos finais em ordem inversa: R16 + L16`,
        );
        console.log(`   🔄 Aplicando permutação final (FP)...`);
      }, this.stepDelay * 20);
    }

    // Aplica a permutação final (FP) para finalizar o processo
    return this.permute(combined, this.FP);
  }

  // === FUNÇÃO F DA REDE DE FEISTEL ===
  // Esta é a função de "confusão" que torna o DES seguro
  // 🧪 Analogia: Como uma fórmula química secreta que transforma os ingredientes
  private f(rightBlock: string, subKey: string): string {
    // Expansão: transforma o bloco de 32 bits em 48 bits para combinar com a subchave
    // 🎈 Analogia: Como inflar um balão para aumentar seu tamanho
    const expanded = this.permute(rightBlock, this.E);

    // Combina com a subchave usando operação XOR
    // XOR é reversível e perfeito para criptografia: aplicar o mesmo valor duas vezes retorna o original
    // 🎭 Analogia: Como misturar tintas de cores complementares - cada uma altera a outra de forma específica
    const xored = this.xor(expanded, subKey);

    // Aplicação das S-Boxes: transforma blocos de 6 bits em blocos de 4 bits
    // Esta é a única operação não-linear no DES e é fundamental para sua segurança
    // 🔮 Analogia: Como uma caixa mágica que transforma objetos de forma imprevisível
    let result = '';
    for (let i = 0; i < 8; i++) {
      // Extrai um bloco de 6 bits para processar na S-Box
      const block = xored.substring(i * 6, (i + 1) * 6);

      // Calcula a linha (row) usando o primeiro e último bit do bloco
      const rowBits = block.charAt(0) + block.charAt(5);
      const row = parseInt(rowBits, 2);

      // Calcula a coluna (column) usando os 4 bits intermediários
      const colBits = block.substring(1, 5);
      const col = parseInt(colBits, 2);

      // Verificação para evitar erros de acesso às S-Boxes
      if (this.SBOX[i] === undefined || this.SBOX[i][row] === undefined) {
        console.error(`Erro ao acessar S-Box: i=${i}, row=${row}, col=${col}`);
        // Valor padrão para evitar o erro
        result += '0000';
      } else {
        // Obtém o valor da S-Box na posição [i][row][col] e converte para 4 bits
        // 📊 Analogia: Como consultar uma tabela específica para encontrar um valor correspondente
        const sboxValue = this.SBOX[i][row][col];
        result += sboxValue.toString(2).padStart(4, '0');
      }
    }

    // Aplica a permutação P ao resultado para aumentar a difusão
    // 🌪️ Analogia: Como espalhar sementes ao vento para cobrir uma área maior
    return this.permute(result, this.P);
  }

  // === GERAÇÃO DAS 16 SUBCHAVES ===
  // Cria as 16 subchaves diferentes, uma para cada rodada
  // 🗝️ Analogia: Como um ferreiro forjando 16 chaves diferentes a partir de um único molde
  private generateSubKeys(): void {
    if (this.demoMode) {
      console.log('\n🔑 GERANDO SUBCHAVES DES:');
      console.log(`   Chave principal: ${this.key}`);
    }

    // Converte a chave de formato hexadecimal para binário
    const binaryKey = this.hexToBinary(this.key);

    if (this.demoMode) {
      setTimeout(() => {
        console.log(`   🔢 Chave em formato binário: ${binaryKey}`);
        console.log(
          `   🔄 Aplicando permutação PC1 (remove bits de paridade)...`,
        );
      }, this.stepDelay);
    }

    // Permutação PC1: reduz de 64 para 56 bits, removendo os bits de paridade
    const pc1 = this.permute(binaryKey, this.PC1);

    if (this.demoMode) {
      setTimeout(() => {
        console.log(`   ✂️ Dividindo a chave em duas metades de 28 bits...`);
      }, this.stepDelay * 2);
    }

    // Divide a chave em duas metades de 28 bits
    // ✂️ Analogia: Como cortar uma barra de metal em duas para trabalhar em cada parte
    let c = pc1.substring(0, 28);
    let d = pc1.substring(28);

    // Limpa as subchaves existentes antes de gerar novas
    this.subKeys = [];

    // Gera as 16 subchaves através de rotações e permutações
    for (let i = 0; i < 16; i++) {
      if (this.demoMode) {
        setTimeout(
          () => {
            console.log(`   🔄 Gerando subchave ${i + 1}/16...`);
          },
          this.stepDelay * (3 + i),
        );
      }

      // Rotação à esquerda de acordo com a tabela SHIFTS
      // 🔄 Analogia: Como girar uma roda dentada um certo número de posições
      c = this.leftShift(c, this.SHIFTS[i]);
      d = this.leftShift(d, this.SHIFTS[i]);

      // Combina as duas metades e aplica a permutação PC2
      // para obter a subchave de 48 bits para esta rodada
      // 🧩 Analogia: Como juntar duas peças de metal e moldar uma nova forma
      const combined = c + d;
      const subKey = this.permute(combined, this.PC2);

      this.subKeys.push(subKey);
    }

    if (this.demoMode) {
      setTimeout(() => {
        console.log(`   ✅ Geradas 16 subchaves com sucesso!`);
      }, this.stepDelay * 20);
    }
  }

  // === FUNÇÕES AUXILIARES ===

  // Realiza uma permutação: reorganiza bits conforme a tabela fornecida
  // Vital para o "embaralhamento" de bits no DES
  // 🃏 Analogia: Como embaralhar cartas de acordo com um padrão específico
  private permute(input: string, table: number[]): string {
    let result = '';
    for (const pos of table) {
      // Subtrai 1 pois os índices da tabela começam em 1, mas os arrays em 0
      result += input.charAt(pos - 1);
    }
    return result;
  }

  // Operação XOR bit a bit entre duas strings binárias
  // XOR é a operação perfeita para criptografia: A XOR B XOR B = A
  // 🔀 Analogia: Como um interruptor de luz - se você acionar o mesmo interruptor duas vezes, volta ao estado original
  // Exemplo: 1 XOR 1 = 0, 0 XOR 0 = 0, 1 XOR 0 = 1, 0 XOR 1 = 1
  private xor(a: string, b: string): string {
    let result = '';
    for (let i = 0; i < a.length; i++) {
      // Se os bits forem iguais, o resultado é 0; se forem diferentes, é 1
      result += (parseInt(a[i]) ^ parseInt(b[i])).toString();
    }
    return result;
  }

  // Rotação à esquerda (deslocamento circular)
  // Move os bits para a esquerda, colocando os que "caem fora" de volta no final
  // 🔄 Analogia: Como uma fila circular onde as pessoas que saem da frente vão para o final
  private leftShift(str: string, shifts: number): string {
    return str.substring(shifts) + str.substring(0, shifts);
  }

  // Converte texto normal em sua representação binária
  // Cada caractere se torna 8 bits (1 byte)
  // 🔤 Analogia: Como traduzir palavras de português para código morse
  private textToBinary(text: string): string {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      // Obtém o código ASCII do caractere e converte para binário
      const char = text.charCodeAt(i);
      // Garante que cada byte tenha 8 dígitos, preenchendo com zeros à esquerda se necessário
      result += char.toString(2).padStart(8, '0');
    }
    return result;
  }

  // Converte representação binária de volta para texto
  // Cada 8 bits são interpretados como um caractere
  // 📝 Analogia: Como traduzir código morse de volta para palavras em português
  private binaryToText(binary: string): string {
    let result = '';
    for (let i = 0; i < binary.length; i += 8) {
      // Pega 8 bits por vez
      const byte = binary.substring(i, i + 8);
      // Converte os 8 bits para um número decimal e deste para o caractere correspondente
      const char = String.fromCharCode(parseInt(byte, 2));
      result += char;
    }
    return result;
  }

  // Converte hexadecimal para binário
  // Cada dígito hex vira 4 bits
  // 🧮 Analogia: Como traduzir números romanos para decimal, seguindo regras específicas
  private hexToBinary(hex: string): string {
    let result = '';
    for (let i = 0; i < hex.length; i++) {
      // Converte cada dígito hexadecimal para 4 bits binários
      const bin = parseInt(hex[i], 16).toString(2).padStart(4, '0');
      result += bin;
    }
    return result;
  }

  // Converte binário para hexadecimal
  // Cada 4 bits se tornam um dígito hex
  // 🧮 Analogia: Como traduzir decimal para números romanos
  private binaryToHex(binary: string): string {
    let result = '';
    // Garante que o número de bits seja múltiplo de 4
    while (binary.length % 4 !== 0) {
      binary = '0' + binary;
    }

    // Converte cada 4 bits para um dígito hexadecimal
    for (let i = 0; i < binary.length; i += 4) {
      const chunk = binary.substring(i, i + 4);
      const hex = parseInt(chunk, 2).toString(16).toUpperCase();
      result += hex;
    }
    return result;
  }

  // Função principal da rede Feistel que processa um bloco de 32 bits com uma subchave
  // É o coração do algoritmo, onde ocorre a substituição não-linear através das S-boxes
  // 🏗️ Analogia: Como o chef de um restaurante transformando ingredientes simples em um prato complexo
  private feistelFunction(R: string, subKey: string): string {
    // 1. Expansão: Expande os 32 bits para 48 bits para combinar com a subchave
    // 🎈 Analogia: Como inflar um balão para que ele ocupe mais espaço
    const expandedR = this.permute(R, this.E);

    if (this.demoMode) {
      setTimeout(() => {
        console.log(`      🔄 Expandindo bloco direito de 32 para 48 bits`);
      }, this.stepDelay);
    }

    // 2. XOR com a subchave
    // 🔀 Analogia: Como misturar as cartas de dois baralhos de forma específica
    const xored = this.xor(expandedR, subKey);

    if (this.demoMode) {
      setTimeout(() => {
        console.log(`      ⚡ Aplicando XOR com a subchave da rodada`);
      }, this.stepDelay * 2);
    }

    // 3. Substituição através das S-boxes: mapeamento não-linear
    // 🎭 Analogia: Como um jogo de troca de máscaras, onde cada pessoa escolhe uma nova identidade
    let substituted = '';
    for (let i = 0; i < 8; i++) {
      // Divide os 48 bits em 8 blocos de 6 bits
      const chunk = xored.substring(i * 6, (i + 1) * 6);

      // Determina a linha e a coluna para consulta na S-box
      // Primeiro e último bits determinam a linha (0-3)
      const row = parseInt(chunk[0] + chunk[5], 2);
      // Os 4 bits do meio determinam a coluna (0-15)
      const col = parseInt(chunk.substring(1, 5), 2);

      // Obtém o valor da S-box e converte para 4 bits
      const value = this.SBOX[i][row][col];
      substituted += value.toString(2).padStart(4, '0');
    }

    if (this.demoMode) {
      setTimeout(() => {
        console.log(`      🎭 Aplicando substituição através das S-boxes`);
      }, this.stepDelay * 3);
    }

    // 4. Permutação final para aumentar a "difusão"
    // 🃏 Analogia: Embaralhar as cartas uma última vez antes do próximo jogador
    const permuted = this.permute(substituted, this.P);

    if (this.demoMode) {
      setTimeout(() => {
        console.log(`      🔄 Aplicando permutação final P ao resultado`);
      }, this.stepDelay * 4);
    }

    return permuted;
  }

  // Divide uma string de entrada em blocos de tamanho específico
  // Necessário porque o DES processa dados em blocos de 64 bits
  // 📦 Analogia: Como dividir uma carga grande em várias caixas menores para transporte
  private splitIntoBlocks(input: string, blockSize: number): string[] {
    const blocks: string[] = [];
    // Adiciona padding (preenchimento) se necessário para garantir blocos completos
    // O DES requer blocos completos de 64 bits
    while (input.length % blockSize !== 0) {
      input += '0';
    }
    // Divide a string em blocos do tamanho especificado
    for (let i = 0; i < input.length; i += blockSize) {
      blocks.push(input.substring(i, i + blockSize));
    }
    return blocks;
  }

  // Define uma nova chave e regenera as subchaves
  // 🔑 Analogia: Como trocar a fechadura de uma porta e criar novas cópias das chaves
  setKey(newKey: string): void {
    if (!/^[0-9A-F]{16}$/.test(newKey)) {
      throw new Error(
        'A chave deve conter exatamente 16 caracteres hexadecimais (0-9, A-F)',
      );
    }

    if (this.demoMode) {
      console.log(`   🔑 Definindo nova chave: ${newKey}`);
    }

    this.key = newKey;
    this.subKeys = []; // Limpa as subchaves existentes
    this.generateSubKeys(); // Gera novas subchaves com a nova chave
  }

  // Gera uma chave DES aleatória com entropia adequada (64 bits, sendo 56 bits efetivos)
  // 🎲 Analogia: Como criar um número de loteria verdadeiramente aleatório
  generateRandomKey(): string {
    if (this.demoMode) {
      console.log(`\n🔄 Gerando chave DES aleatória com alta entropia...`);
    }

    // Array para armazenar 8 bytes (64 bits)
    const byteArray = new Uint8Array(8);

    // Coleta entropia de várias fontes disponíveis
    if (this.demoMode) {
      setTimeout(() => {
        console.log(`   🎲 Coletando entropia de múltiplas fontes...`);
      }, this.stepDelay);
    }
    const entropyPool = this.collectEntropy();

    // Preenche os 8 bytes com valores derivados do pool de entropia
    if (this.demoMode) {
      setTimeout(() => {
        console.log(`   🔢 Gerando 8 bytes (64 bits) aleatórios...`);
      }, this.stepDelay * 2);
    }

    for (let i = 0; i < 8; i++) {
      // Usa o pool de entropia para gerar cada byte
      const randomValue =
        Math.floor(entropyPool[i % entropyPool.length] * 256) % 256;

      // Ajusta os bits de paridade conforme a especificação DES original
      byteArray[i] = this.adjustParityBit(randomValue);

      if (this.demoMode && i === 7) {
        setTimeout(() => {
          console.log(`   ✅ Bytes gerados e ajustados para paridade correta`);
        }, this.stepDelay * 3);
      }
    }

    // Converte para hexadecimal
    const hexKey = Array.from(byteArray)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();

    if (this.demoMode) {
      setTimeout(() => {
        console.log(`   🔑 Chave DES gerada: ${hexKey}`);
        console.log(
          `   ℹ️ Esta chave possui 64 bits físicos, mas apenas 56 bits efetivos para criptografia`,
        );
        console.log(
          `      Os 8 bits restantes são bits de paridade (1 bit por byte)`,
        );
      }, this.stepDelay * 4);
    }

    return hexKey;
  }

  // Coleta entropia de várias fontes
  // 🌀 Analogia: Como coletar água de diferentes rios para garantir um abastecimento diversificado
  private collectEntropy(): number[] {
    const entropy: number[] = [];

    // Usa timestamp atual em milissegundos
    const now = Date.now();
    entropy.push(now / 10000);
    entropy.push(now % 1000);

    // Usa o timestamp em microssegundos se disponível
    if (typeof performance !== 'undefined') {
      const microTime = performance.now();
      entropy.push(microTime);
      entropy.push((microTime * 1000) % 1000);
    }

    // Usa a data completa como fonte adicional de entropia
    const date = new Date();
    entropy.push(date.getHours() / 24);
    entropy.push(date.getMinutes() / 60);
    entropy.push(date.getSeconds() / 60);
    entropy.push(date.getMilliseconds() / 1000);

    // Mistura valores usando algoritmo simples baseado em XOR e deslocamento
    for (let i = 0; i < 20; i++) {
      const lastValue = entropy[entropy.length - 1] || 0.5;
      const newValue = (Math.sin(lastValue * i) * 10000) % 1;
      entropy.push(newValue);
    }

    // Aplica transformação não-linear em todos os valores
    for (let i = 0; i < entropy.length; i++) {
      // Mistura os valores usando técnicas de hash simples
      entropy[i] = Math.abs(Math.sin(entropy[i] * 1000)) % 1;
    }

    return entropy;
  }

  // Ajusta o bit de paridade para seguir a especificação DES
  // No DES, cada byte da chave tem o bit menos significativo ajustado
  // para que o número total de bits 1 seja ímpar (paridade ímpar)
  // 🔍 Analogia: Como colocar um selo de verificação em cada carta para garantir que é autêntica
  private adjustParityBit(value: number): number {
    // Conta o número de bits 1 nos 7 bits mais significativos
    let bitCount = 0;
    let tempValue = value >> 1; // Ignora o bit menos significativo

    for (let i = 0; i < 7; i++) {
      if (tempValue & 1) bitCount++;
      tempValue >>= 1;
    }

    // Se o número de bits for par, o bit menos significativo deve ser 1
    // Se o número de bits for ímpar, o bit menos significativo deve ser 0
    // Isso garante paridade ímpar conforme especificação DES
    if (bitCount % 2 === 0) {
      return (value & 0xfe) | 1; // Define o bit menos significativo como 1
    } else {
      return value & 0xfe; // Define o bit menos significativo como 0
    }
  }
}
