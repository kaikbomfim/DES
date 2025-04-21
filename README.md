### 🔐 Algoritmo de Criptografia - DES

O **Data Encryption Standard (DES)** é um algoritmo de criptografia simétrica de **blocos**, desenvolvido em **1977** pelo **NIST (National Institute of Standards and Technology)**, baseado na estrutura chamada **Rede de Feistel** (_Feistel Network_), e funciona em três etapas principais:

#### 1️⃣ Divisão do Bloco

O bloco de entrada, representando o conteúdo a ser cifrado, é dividido em duas metades, chamadas de L (_left_) e R (_right_). Cada parte apresenta 32 bits, totalizando 64 bits. Esse bloco é **o dado a ser criptografado**.

> Apesar do algoritmo ser baseado em uma chave de 64 bits, apenas 56 bits são efetivamente usados na geração das subchaves. Os 8 bits restantes (um em cada grupo de 8 bits) são reservados para verificação de paridade — ou seja, são bits de controle que garantem que o número de bits `1` em cada byte seja ímpar.

#### 2️⃣ Aplicação das Rodadas

Feita a divisão do bloco, inicia-se o processamento das rodadas (_rounds_). Ao todo, são 16 rodadas, e em cada uma delas:

- O atual lado esquerdo da rodada vira o lado direito da próxima.
- O novo lado direito é obtido ao aplicar uma função `F` ao lado direito anterior, junto com uma subchave gerada a partir da chave principal.

Antes de ser combinado, o lado direito (R), que possui **32 bits**, passa por uma expansão para **48 bits**. Isso é feito através de uma permutação de expansão, onde certos bits de R são repetidos para criar o bloco expandido de 48 bits. Esse bloco expandido é então misturado com a **subchave** de 48 bits gerada a partir da chave principal.

O resultado dessa função `F` é então combinado através do operador `XOR` com o lado esquerdo anterior (L).

#### 3️⃣ Permutação Final

Após a execução das 16 rodadas, os lados L e R são combinados (invertendo a última troca) e passam por uma permutação final, que reordena os bits para formar o bloco cifrado, finalizando o processo de encriptação.

#### 🔁 Descriptografia

A descriptografia é feita com os mesmos passos descritos, aplicando as subchaves na ordem inversa (da 16ª para a 1ª rodada).

---

### 🖼️ Representação Visual do DES

<p align="center">
  <img src="https://www.tutorialspoint.com/cryptography/images/des_structure.jpg" alt="Representação Visual do DES">
</p>

---

### 🧠 Curiosidades

#### 🤔 Como funciona a Rede de Feistel?

É uma estrutura onde os dados são divididos em duas partes, e uma função é aplicada em uma das metades combinada com a chave, sendo o resultado misturado com a outra metade. Isso permite **criptografar e descriptografar** com o mesmo processo, mudando apenas a ordem das chaves.

#### 🤔 Por que o bloco tem 64 bits?

Porque foi considerado um tamanho equilibrado entre desempenho e segurança na época da criação do algoritmo (década de 70), sendo compatível com a arquitetura de computadores daquele período.

#### 🤔 Do que se trata a função `F`?

É uma função de confusão que envolve expansão de bits, mistura com a subchave via XOR, substituição por S-boxes (caixas de substituição) e uma permutação final. Ela é o coração da complexidade do DES.

#### 🤔 O que é `XOR`?

É uma operação lógica bit a bit onde o resultado é `1` se os bits forem diferentes, e `0` se forem iguais. Serve para combinar dados de forma reversível (se a mesma chave for usada na operação inversa), ideal para criptografia.

#### 🤔 O algoritmo DES ainda é usado?

Raramente. Ele é considerado inseguro devido ao tamanho da chave (56 bits). Foi substituído por variantes mais seguras como o **3DES** e, posteriormente, pelo **AES**.

---

### 📚 Fontes

- LUIZ, Luiz Vieira. _Como funciona o algoritmo DES_. Stack Overflow em Português. 2018. Disponível em: <https://pt.stackoverflow.com/questions/239247/>.
- SIGMA Computing. _Como funciona o algoritmo DES_. YouTube, 2020. Disponível em: <https://www.youtube.com/watch?v=xhiCHnQy8JM>.
- TUTORIALSPOINT. _Cryptography - Data Encryption Standard_. Tutorialspoint, [s.d.]. Disponível em: https://www.tutorialspoint.com/cryptography/cryptography_data_encryption_standard.htm. Acesso em: 21 abr. 2025.
- FÁBIO, Fabio Akita. _Data Encryption Standard (DES) – Algoritmo de Criptografia_. YouTube, 2020. Disponível em: <https://www.youtube.com/watch?v=A6mh3-HvY0k>.
