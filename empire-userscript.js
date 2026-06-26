// ==UserScript==
// @name         Empire → Surebet Scanner
// @namespace    surebet-scanner
// @version      1.1
// @description  Envia eventos do Empire para o scanner local
// @match        https://csgoempire.com/*
// @grant        GM_xmlhttpRequest
// @connect      127.0.0.1
// @connect      csgoempire.com
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const FEED     = 'http://127.0.0.1:4001/empire-feed';
  const API      = 'https://csgoempire.com/api/v2/match-betting/flattened?page=1&per_page=100';
  const TARGET   = '/api/v2/match-betting/flattened';
  const INTERVAL = 10000; // busca ativa a cada 10s

  function send(items) {
    if (!items || !items.length) return;
    GM_xmlhttpRequest({
      method:  'POST',
      url:     FEED,
      headers: { 'Content-Type': 'application/json' },
      data:    JSON.stringify(items),
      onload:  r => { if (r.status === 200) console.log('[Surebet] ' + items.length + ' eventos enviados'); },
      onerror: () => console.warn('[Surebet] Scanner offline — rode: node index.js'),
    });
  }

  // Busca ativa: chama a API do Empire com os cookies da sessao do browser
  function fetchAtivo() {
    GM_xmlhttpRequest({
      method:  'GET',
      url:     API,
      headers: { Accept: 'application/json' },
      onload:  function(r) {
        try {
          const data  = JSON.parse(r.responseText);
          const items = Array.isArray(data) ? data : (data.data || []);
          if (items.length) {
            console.log('[Surebet] busca ativa: ' + items.length + ' eventos');
            send(items);
          }
        } catch(e) {}
      },
      onerror: () => {},
    });
  }

  // Hook fetch (intercepta chamadas que o proprio site faz)
  const origFetch = window.fetch;
  window.fetch = async function (...args) {
    const res = await origFetch.apply(this, args);
    const url = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url || '');
    if (url.includes(TARGET)) {
      res.clone().json()
        .then(data => send(Array.isArray(data) ? data : (data.data || [])))
        .catch(function() {});
    }
    return res;
  };

  // Hook XHR
  const origOpen = XMLHttpRequest.prototype.open;
  const origSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url) {
    this._sbUrl = url;
    return origOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function () {
    if (this._sbUrl && this._sbUrl.includes(TARGET)) {
      this.addEventListener('load', function () {
        try {
          const data = JSON.parse(this.responseText);
          send(Array.isArray(data) ? data : (data.data || []));
        } catch(e) {}
      });
    }
    return origSend.apply(this, arguments);
  };

  // Inicia busca ativa imediatamente e repete a cada 60s
  setTimeout(fetchAtivo, 3000);
  setInterval(fetchAtivo, INTERVAL);

  console.log('[Surebet] Empire feed ativo — busca a cada 10s + interceptacao');
})();
