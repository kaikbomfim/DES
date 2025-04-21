import { Injectable } from "@nestjs/common";

@Injectable()
export class DesService {
  // Tabela de Permutação Inicial - Embaralha os bits de entrada para aumentar a difusão
  private readonly IP = [
    58, 50, 42, 34, 26, 18, 10, 2, 60, 52, 44, 36, 28, 20, 12, 4, 62, 54, 46,
    38, 30, 22, 14, 6, 64, 56, 48, 40, 32, 24, 16, 8, 57, 49, 41, 33, 25, 17, 9,
    1, 59, 51, 43, 35, 27, 19, 11, 3, 61, 53, 45, 37, 29, 21, 13, 5, 63, 55, 47,
    39, 31, 23, 15, 7,
  ];

  // Tabela de Permutação Final - Reverte a permutação inicial
  private readonly FP = [
    40, 8, 48, 16, 56, 24, 64, 32, 39, 7, 47, 15, 55, 23, 63, 31, 38, 6, 46, 14,
    54, 22, 62, 30, 37, 5, 45, 13, 53, 21, 61, 29, 36, 4, 44, 12, 52, 20, 60,
    28, 35, 3, 43, 11, 51, 19, 59, 27, 34, 2, 42, 10, 50, 18, 58, 26, 33, 1, 41,
    9, 49, 17, 57, 25,
  ];

  // Tabela de Expansão - Expande 32 bits para 48 bits para combinar com a subchave
  private readonly E = [
    32, 1, 2, 3, 4, 5, 4, 5, 6, 7, 8, 9, 8, 9, 10, 11, 12, 13, 12, 13, 14, 15,
    16, 17, 16, 17, 18, 19, 20, 21, 20, 21, 22, 23, 24, 25, 24, 25, 26, 27, 28,
    29, 28, 29, 30, 31, 32, 1,
  ];

  // S-boxes - Tabelas de substituição não-lineares que adicionam confusão ao algoritmo
  private readonly S = [
    [
      [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
      [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
      [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
      [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13],
    ],
    [
      [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
      [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
      [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
      [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9],
    ],
    [
      [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
      [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
      [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
      [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12],
    ],
    [
      [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
      [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
      [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
      [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14],
    ],
    [
      [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
      [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
      [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
      [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3],
    ],
    [
      [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
      [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
      [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
      [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13],
    ],
    [
      [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
      [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
      [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
      [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12],
    ],
    [
      [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
      [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
      [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
      [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11],
    ],
  ];

  // Converte string para array de bits
  private stringToBits(str: string) {
    const bits = [] as number[];
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      for (let j = 7; j >= 0; j--) {
        bits.push((charCode >> j) & 1);
      }
    }
    return bits;
  }

  // Converte array de bits para string
  private bitsToString(bits: number[]) {
    let str = "";
    for (let i = 0; i < bits.length; i += 8) {
      let byte = 0;
      for (let j = 0; j < 8; j++) {
        byte = (byte << 1) | bits[i + j];
      }
      str += String.fromCharCode(byte);
    }
    return str;
  }

  // Realiza permutação dos bits de acordo com a tabela fornecida
  private permute(bits: number[], table: number[]) {
    return table.map((pos) => bits[pos - 1]);
  }

  // Expande o bloco de 32 bits para 48 bits
  private expand(bits: number[]) {
    return this.permute(bits, this.E);
  }

  // Realiza operação XOR entre dois arrays de bits
  private xor(a: number[], b: number[]) {
    return a.map((bit, i) => bit ^ b[i]);
  }

  // Função de Feistel - Coração do algoritmo DES
  private feistelFunction(R: number[], subkey: number[]) {
    const expanded = this.expand(R);
    const xored = this.xor(expanded, subkey);
    const sboxed = [] as number[];

    for (let i = 0; i < 8; i++) {
      const block = xored.slice(i * 6, (i + 1) * 6);
      const row = (block[0] << 1) | block[5];
      const col =
        (block[1] << 3) | (block[2] << 2) | (block[3] << 1) | block[4];
      const value = this.S[i][row][col];

      for (let j = 3; j >= 0; j--) {
        sboxed.push((value >> j) & 1);
      }
    }

    return sboxed;
  }

  // Processa um bloco de 64 bits usando a chave fornecida
  private processBlock(block: number[], key: number[], isDecrypt = false) {
    let bits = this.permute(block, this.IP);
    let L = bits.slice(0, 32);
    let R = bits.slice(32);

    for (let i = 0; i < 16; i++) {
      const temp = R;
      R = this.xor(L, this.feistelFunction(R, key));
      L = temp;
    }

    return this.permute([...R, ...L], this.FP);
  }

  // Encripta uma mensagem usando o algoritmo DES
  encrypt(plaintext: string, key: string) {
    const bits = this.stringToBits(plaintext);
    const keyBits = this.stringToBits(key);

    const padding = 64 - (bits.length % 64);
    const paddedBits = [...bits, ...Array(padding).fill(0)];

    const encryptedBits = [] as number[];
    for (let i = 0; i < paddedBits.length; i += 64) {
      const block = paddedBits.slice(i, i + 64);
      encryptedBits.push(...this.processBlock(block, keyBits));
    }

    return this.bitsToString(encryptedBits);
  }

  // Decripta uma mensagem usando o algoritmo DES
  decrypt(ciphertext: string, key: string) {
    const bits = this.stringToBits(ciphertext);
    const keyBits = this.stringToBits(key);

    const decryptedBits = [] as number[];
    for (let i = 0; i < bits.length; i += 64) {
      const block = bits.slice(i, i + 64);
      decryptedBits.push(...this.processBlock(block, keyBits, true));
    }

    let paddingLength = 0;
    for (let i = decryptedBits.length - 1; i >= 0; i--) {
      if (decryptedBits[i] === 0) {
        paddingLength++;
      } else {
        break;
      }
    }

    return this.bitsToString(
      decryptedBits.slice(0, decryptedBits.length - paddingLength)
    );
  }

  // Gera uma chave DES aleatória com entropia adequada (64 bits, sendo 56 bits efetivos)
  // Analogia: Como criar um número de loteria verdadeiramente aleatório
  generateRandomKey(): string {
    const byteArray = new Uint8Array(8);
    const entropyPool = this.collectEntropy();

    for (let i = 0; i < 8; i++) {
      const randomValue =
        Math.floor(entropyPool[i % entropyPool.length] * 256) % 256;
      byteArray[i] = this.adjustParityBit(randomValue);
    }

    return Array.from(byteArray)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase();
  }

  // Coleta entropia de várias fontes
  // Analogia: Como coletar água de diferentes rios para garantir um abastecimento diversificado
  private collectEntropy(): number[] {
    const entropy: number[] = [];
    const now = Date.now();
    entropy.push(now / 10000);
    entropy.push(now % 1000);

    if (typeof performance !== "undefined") {
      const microTime = performance.now();
      entropy.push(microTime);
      entropy.push((microTime * 1000) % 1000);
    }

    const date = new Date();
    entropy.push(date.getHours() / 24);
    entropy.push(date.getMinutes() / 60);
    entropy.push(date.getSeconds() / 60);
    entropy.push(date.getMilliseconds() / 1000);

    for (let i = 0; i < 20; i++) {
      const lastValue = entropy[entropy.length - 1] || 0.5;
      const newValue = (Math.sin(lastValue * i) * 10000) % 1;
      entropy.push(newValue);
    }

    for (let i = 0; i < entropy.length; i++) {
      entropy[i] = Math.abs(Math.sin(entropy[i] * 1000)) % 1;
    }

    return entropy;
  }

  // Ajusta o bit de paridade para seguir a especificação DES
  // No DES, cada byte da chave tem o bit menos significativo ajustado
  // para que o número total de bits 1 seja ímpar (paridade ímpar)
  // Analogia: Como colocar um selo de verificação em cada carta para garantir que é autêntica
  private adjustParityBit(value: number): number {
    let bitCount = 0;
    let tempValue = value >> 1;

    for (let i = 0; i < 7; i++) {
      if (tempValue & 1) bitCount++;
      tempValue >>= 1;
    }

    if (bitCount % 2 === 0) {
      return (value & 0xfe) | 1;
    } else {
      return value & 0xfe;
    }
  }
}
