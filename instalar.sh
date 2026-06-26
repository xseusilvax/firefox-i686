#!/usr/bin/env bash
set -euo pipefail

VERDE='\033[0;32m'
AMARELO='\033[1;33m'
VERMELHO='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${VERDE}=== Firefox ESR + Tampermonkey — Lubuntu i686 ===${NC}"
echo ""

# Verificar arquitetura
ARCH=$(uname -m)
if [ "$ARCH" != "i686" ] && [ "$ARCH" != "i386" ]; then
  echo -e "${AMARELO}Aviso: arquitetura detectada é $ARCH (este script foi feito para i686).${NC}"
fi

# Instalar Firefox ESR
if command -v firefox-esr &>/dev/null || command -v firefox &>/dev/null; then
  echo -e "${AMARELO}Firefox já está instalado. Pulando instalação.${NC}"
else
  echo "Instalando Firefox ESR..."
  sudo apt update -qq
  sudo apt install -y firefox-esr
  echo -e "${VERDE}Firefox ESR instalado com sucesso.${NC}"
fi

echo ""
echo "Abrindo Firefox na página do Tampermonkey..."
echo -e "${AMARELO}→ Clique em 'Adicionar ao Firefox' quando a página abrir.${NC}"
echo ""

# Abre Firefox na página do Tampermonkey
(firefox "https://addons.mozilla.org/pt-BR/firefox/addon/tampermonkey/" &>/dev/null &)

echo -e "${VERDE}Feito!${NC}"
echo ""
echo "Próximos passos após instalar o Tampermonkey:"
echo "  1. Clique no ícone do Tampermonkey → 'Criar novo script'"
echo "  2. Apague o conteúdo e cole o empire-userscript.js do repo 2026"
echo "  3. Salve (Ctrl+S)"
echo "  4. Acesse csgoempire.com — o feed começa automaticamente"
echo ""
