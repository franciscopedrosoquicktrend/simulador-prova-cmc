# Simulador da Prova Prática — OE202511/0148

Aplicação de treino interactivo para a prova prática de 24 de Junho de 2026.

## Equipamento simulado

- MIDAS M32
- ETC Element

## Como abrir

No macOS, faça duplo clique em:

```text
ABRIR_SIMULADOR.command
```

Se o sistema bloquear a primeira abertura, clique no ficheiro com o botão direito e escolha **Abrir**.

Em alternativa, na pasta do projecto, execute:

```bash
python3 -m http.server 8080
```

Depois abra:

```text
http://localhost:8080
```

## Modos

- **Treino guiado:** mostra a sequência segura e corrige imediatamente.
- **Simulação oficial:** não mostra pistas e apresenta a avaliação no final.
- **Prática livre:** permite explorar os comandos sem perder pontos.

## Avaliação

O relatório final atribui até 5 valores a cada critério:

1. Compreensão da tarefa
2. Qualidade
3. Celeridade
4. Conhecimentos

A celeridade recebe 5 valores quando a prova é concluída correctamente em menos de 18 minutos.

## Nota

Este simulador é uma ferramenta independente de estudo. Não é um produto oficial da MIDAS, ETC ou Câmara Municipal de Cascais e não substitui a prática em equipamento real.
