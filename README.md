# Firefox ESR + Tampermonkey no Lubuntu i686 (32-bit)

Para quem tem um PC antigo com Linux 32-bit e não consegue instalar Chrome ou Brave — eles abandonaram o suporte a i686.

O Firefox ESR é a única opção moderna que ainda funciona em sistemas 32-bit e suporta extensões como o Tampermonkey.

---

## Verificar sua arquitetura

```bash
uname -m
```

- `i686` ou `i386` → este guia é para você
- `x86_64` → você pode instalar Chrome ou Brave normalmente

---

## Instalação rápida (1 comando)

```bash
curl -fsSL https://raw.githubusercontent.com/xseusilvax/firefox-i686/main/instalar.sh | bash
```

O script vai:
1. Instalar o Firefox ESR via `apt`
2. Abrir o Firefox na página do Tampermonkey
3. Você clica em **Adicionar ao Firefox** — pronto

---

## Instalação manual

### 1. Firefox ESR

```bash
sudo apt update
sudo apt install -y firefox-esr
```

### 2. Tampermonkey

Abra o Firefox e acesse:

```
https://addons.mozilla.org/pt-BR/firefox/addon/tampermonkey/
```

Clique em **Adicionar ao Firefox**.

---

## Por que não Chrome ou Brave?

| Navegador | Suporte i686 |
|-----------|-------------|
| Google Chrome | Abandonado em 2016 |
| Brave | Abandonado em 2023 |
| Firefox ESR | Ainda suportado ✓ |
| Chromium (apt) | Depende da versão do distro |

---

## Após instalar o Tampermonkey

1. Clique no ícone do Tampermonkey → **Criar novo script**
2. Apague o conteúdo padrão
3. Cole o seu userscript e salve com **Ctrl+S**

---

## Problemas comuns

**Firefox não abre após instalação:**
```bash
sudo apt install --fix-broken
```

**Erro de permissão no script:**
```bash
chmod +x instalar.sh && ./instalar.sh
```
