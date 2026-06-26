// ==UserScript==
// @name         Empire → Surebet Scanner
// @namespace    surebet-scanner
// @version      1.2
// @description  Envia eventos do Empire para o scanner local
// @match        https://csgoempire.com/*
// @grant        GM_xmlhttpRequest
// @connect      127.0.0.1
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const FEED     = 'http://127.0.0.1:4001/empire-feed';
  const API      = '/api/v2/match-betting/flattened?page=1&per_page=100';
  const INTERVAL = 10000;

  // Indicador visual na pagina do Empire
  function criarIndicador() {
    var el = document.createElement('div');
    el.id = 'sb-status';
    el.style.cssText = 'position:fixed;bottom:16px;right:16px;z-index:99999;'+
      'background:#161b22;border:1px solid #30363d;border-radius:8px;'+
      'padding:8px 14px;font-family:monospace;font-size:12px;color:#7d8590;'+
      'box-shadow:0 4px 12px rgba(0,0,0,.4);cursor:default;user-select:none';
    el.textContent = 'SUREBET: iniciando...';
    document.body.appendChild(el);
    return el;
  }

  var badge = null;
  function setBadge(texto, cor) {
    if (!badge) {
      if (!document.body) return;
      badge = criarIndicador();
    }
    badge.textContent = 'SUREBET: ' + texto;
    badge.style.color = cor || '#7d8590';
    badge.style.borderColor = cor || '#30363d';
  }

  // Envia para o scanner via GM_xmlhttpRequest (unica chamada que precisa de GM)
  function enviar(items) {
    if (!items || !items.length) return;
    GM_xmlhttpRequest({
      method:  'POST',
      url:     FEED,
      headers: { 'Content-Type': 'application/json' },
      data:    JSON.stringify(items),
      onload: function(r) {
        if (r.status === 200) {
          setBadge(items.length + ' eventos enviados', '#3fb950');
        } else {
          setBadge('erro no scanner (' + r.status + ')', '#f85149');
        }
      },
      onerror: function() {
        setBadge('scanner offline — rode node index.js', '#f85149');
      },
    });
  }

  // Busca usando o fetch da propria pagina (mesma origem = cookies incluidos)
  function buscarEmpire() {
    setBadge('buscando...', '#58a6ff');
    fetch(API, { credentials: 'include' })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        var items = Array.isArray(data) ? data : (data.data || []);
        if (items.length) {
          enviar(items);
        } else {
          setBadge('0 eventos (faca login no Empire)', '#d29922');
        }
      })
      .catch(function(e) {
        setBadge('erro ao buscar Empire', '#f85149');
        console.error('[Surebet]', e);
      });
  }

  // Hook fetch — intercepta chamadas que o site ja faz
  var origFetch = window.fetch;
  window.fetch = function() {
    var args = arguments;
    var url  = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url || '');
    var prom = origFetch.apply(this, args);
    if (url.includes('/api/v2/match-betting/flattened')) {
      prom.then(function(res) {
        res.clone().json().then(function(data) {
          var items = Array.isArray(data) ? data : (data.data || []);
          if (items.length) enviar(items);
        }).catch(function(){});
      });
    }
    return prom;
  };

  // Inicia quando DOM estiver pronto
  function init() {
    buscarEmpire();
    setInterval(buscarEmpire, INTERVAL);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
