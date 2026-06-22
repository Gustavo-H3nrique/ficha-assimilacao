import { el, state, saveCurrentCharacter, loadCharacter } from "./state.js";
import { renderMutationsSheet, renderCaboGuerraSheet } from "./sheet.js";
import { CARACTERISTICAS, ASSIMILACOES } from "../data.js";
import { ICONS } from "../icons.js";
import { getDieSymbolsHtml, getDieFaceImgSrc } from "./chat.js";
import { DICE_MAP } from "./roller.js";
import { logger } from "./logger.js";

// ==========================================
// MODAL: SELETOR DE CARACTERÍSTICAS
// ==========================================
export function openTraitsModal() {
  const char = state.currentCharacter;
  if (!char) return;
  
  logger.info("Modal: Abrindo modal de características.");
  
  el.modalContainer.classList.remove("hidden");
  el.modalBody.innerHTML = `
    <h3 class="modal-title">Adquirir Característica</h3>
    <p style="font-size:13px; color:var(--text-secondary); margin-bottom:16px;">
      Você possui <strong><span id="modal-xp-value">${char.xp}</span> pontos de XP</strong> disponíveis.
    </p>
    <div class="traits-modal-grid">
      <!-- JS insere os itens -->
    </div>
  `;
  
  const grid = el.modalBody.querySelector(".traits-modal-grid");
  
  CARACTERISTICAS.forEach(trait => {
    // Esconder característica de criação se já iniciou
    if (trait.id === "estagio_avancado") return;
    
    const isOwned = char.caracteristicas.includes(trait.id);
    const meetsReqs = checkCharacterTraitPrerequisites(char, trait.requisitos);
    
    const row = document.createElement("div");
    row.className = `trait-modal-row ${isOwned ? 'owned' : ''}`;
    if (!meetsReqs && !isOwned) row.style.opacity = "0.5";
    
    row.innerHTML = `
      <div class="info">
        <div class="title-row">
          <span class="title">${trait.nome}</span>
          <span class="cost-badge">${trait.custo} XP</span>
          ${isOwned ? '<span style="color:#00ff66; font-size:10px; font-weight:bold;">Adquirido</span>' : ''}
        </div>
        <div class="req">Requisito: ${trait.requisitoText}</div>
        <div class="desc">${trait.descricao}</div>
      </div>
      <div class="action">
        <button class="btn ${isOwned ? 'btn-danger' : 'btn-primary'} btn-sm modal-buy-trait-btn" 
          data-id="${trait.id}" ${(!meetsReqs && !isOwned) ? 'disabled' : ''}>
          ${isOwned ? 'Remover' : 'Adquirir'}
        </button>
      </div>
    `;
    
    row.querySelector(".modal-buy-trait-btn").addEventListener("click", () => {
      if (isOwned) {
        logger.info(`Modal: Removendo característica "${trait.nome}" (Custo devolvido: ${trait.custo} XP).`);
        char.caracteristicas = char.caracteristicas.filter(id => id !== trait.id);
        char.xp += trait.custo;
        saveCurrentCharacter();
        loadCharacter(char.id);
        openTraitsModal(); // Recarrega
      } else {
        if (char.xp >= trait.custo) {
          logger.info(`Modal: Adquirindo característica "${trait.nome}" (Custo: ${trait.custo} XP).`);
          char.caracteristicas.push(trait.id);
          char.xp -= trait.custo;
          saveCurrentCharacter();
          loadCharacter(char.id);
          openTraitsModal();
        } else {
          logger.warn("Modal: Falha ao adquirir característica: XP insuficiente.");
          alert("Pontos de XP insuficientes!");
        }
      }
    });
    
    grid.appendChild(row);
  });
}


export function checkCharacterTraitPrerequisites(char, reqs) {
  if (!reqs) return true;
  for (const [key, value] of Object.entries(reqs)) {
    if (key === "criacao") return false; // Bloqueia característica exclusiva de criação na ficha
    if (key === "or") {
      const options = reqs.or;
      const targetVal = reqs.val || 1;
      let ok = false;
      options.forEach(opt => {
        const val = char.conhecimentos[opt] !== undefined ? char.conhecimentos[opt] : (char.praticas[opt] || 0);
        if (val >= targetVal) ok = true;
      });
      if (!ok) return false;
      continue;
    }
    if (key === "val") continue;
    
    if (char.instintos[key] !== undefined) {
      if (char.instintos[key] < value) return false;
    } else {
      const val = char.conhecimentos[key] !== undefined ? char.conhecimentos[key] : (char.praticas[key] || 0);
      if (val < value) return false;
    }
  }
  return true;
}

// ==========================================
// MODAL: TESTE DE ASSIMILAÇÃO & CARTAS (MUTAÇÕES)
// ==========================================
export function openAssimilationTestModal() {
  const char = state.currentCharacter;
  if (!char) return;
  
  logger.info("Modal: Abrindo modal de Teste de Assimilação.");
  
  el.modalContainer.classList.remove("hidden");
  el.modalBody.innerHTML = `
    <h3 class="modal-title">Realizar Teste de Assimilação</h3>
    <div class="assimilation-test-modal">
      <p class="pool-display">Pilha de Dados: <strong>1d10 + ${char.assNivel}d12</strong></p>
      <p style="font-size:13px; color:var(--text-secondary); text-align:center;">
        O teste é realizado ao aumentar seu nível de Assimilação. Os símbolos Sucesso, Presão e Adaptação sorteados determinam suas opções de mutações no repouso.
      </p>
      
      <button class="btn btn-primary" id="btn-modal-roll-ass">ROLAR TESTE DE ASSIMILAÇÃO</button>
      
      <div class="test-results-box hidden" id="ass-test-results">
        <h4>Resultados do Teste</h4>
        <div class="test-results-dice" id="ass-test-dice-container"></div>
        
        <div class="test-results-summary">
          <div class="test-summary-row" data-type="A">
            <div class="label-box"><span class="symbol-color"></span> <span>Copas (Evolutivas)</span></div>
            <span class="count" id="ass-count-a">0</span>
          </div>
          <div class="test-summary-row" data-type="B">
            <div class="label-box"><span class="symbol-color"></span> <span>Ouros (Adaptativas)</span></div>
            <span class="count" id="ass-count-b">0</span>
          </div>
          <div class="test-summary-row" data-type="C">
            <div class="label-box"><span class="symbol-color"></span> <span>Espadas (Inoportunas)</span></div>
            <span class="count" id="ass-count-c">0</span>
          </div>
        </div>

        <div class="c-alert-message hidden" id="death-alert">
          <strong>ATENÇÃO:</strong> O total de C acumuladas atingiu ou excedeu 10! A personagem perdeu toda a consciência humana e agora se tornou uma criatura sob controle definitivo do Assimilador (NPC).
        </div>

        <div class="modal-actions hidden" id="ass-modal-mutation-action">
          <button class="btn btn-success" id="btn-draw-mutations">Escolher Mutações</button>
        </div>
      </div>
    </div>
  `;
  
  const btnRoll = document.getElementById("btn-modal-roll-ass");
  const resultsBox = document.getElementById("ass-test-results");
  
  btnRoll.addEventListener("click", () => {
    btnRoll.disabled = true;
    
    // Executa a rolagem utilizando o motor 3D local
    const pool = ["1d10"];
    for (let i = 0; i < char.assNivel; i++) pool.push("1d12");
    const notationString = pool.join("+");
    
    logger.info(`Modal: Iniciando rolagem do Teste de Assimilação com pool "${notationString}".`);
    
    const box = state.diceBox || window.diceBox;

    if (!box) {
      alert("O motor 3D ainda está carregando...");
      btnRoll.disabled = false;
      return;
    }
    
    el.diceOverlay.classList.remove("hidden");
    setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 50);

    box.setDice(notationString);
    box.start_throw(
      null,
      (notation) => {
        btnRoll.disabled = false;
        resultsBox.classList.remove("hidden");
        
        setTimeout(() => {
          el.diceOverlay.classList.add("hidden");
        }, 3000);
        
        if (!notation.result || notation.result.length === 0 || notation.result[0] < 0) {
          console.error("Erro na simulação do Dice Box: os dados caíram da mesa.");
          alert("Ops! Os dados saíram da mesa de rolagem. Tente novamente.");
          return;
        }

        const convertedResults = notation.result.map((val, idx) => {
          const type = notation.set[idx]; // 'd10' or 'd12'
          const symbols = DICE_MAP[type][val] || [];
          const sides = parseInt(type.substring(1));
          return { value: val, sides: sides, symbols: symbols };
        });
        
        // Renderiza os dados no modal
        const container = document.getElementById("ass-test-dice-container");
        container.innerHTML = "";
        convertedResults.forEach(die => {
          const d = document.createElement("div");
          d.className = `result-die-card`;
          const imgSrc = getDieFaceImgSrc(die.sides, die.value);
          let contentHtml = "";
          if (imgSrc) {
            contentHtml = `<img src="${imgSrc}" class="die-face-img" alt="d${die.sides} face ${die.value}">`;
          } else {
            contentHtml = `
              <span class="die-type-tag d-${die.sides}">d${die.sides}</span>
              <span class="die-val-label">${die.value}</span>
              <div class="die-symbol-svg">${getDieSymbolsHtml(die.symbols)}</div>
            `;
          }
          d.innerHTML = contentHtml;
          container.appendChild(d);
        });
        
        // Conta símbolos
        let a = 0;
        let b = 0;
        let c = 0;
        convertedResults.forEach(die => {
          die.symbols.forEach(sym => {
            if (sym === "A") a++;
            if (sym === "B") b++;
            if (sym === "C") c++;
          });
        });
        
        document.getElementById("ass-count-a").textContent = a;
        document.getElementById("ass-count-b").textContent = b;
        document.getElementById("ass-count-c").textContent = c;
        
        logger.info(`Modal: Teste de Assimilação concluído - Copas [A]: ${a}, Ouros [B]: ${b}, Espadas [C]: ${c}.`);
        
        // Calcula Morte por Assimilação Completa (Pág 124)
        const prevC = char.mutações.filter(m => m.suit === "inoportunas").length;
        const totalC = prevC + c;
        
        if (totalC >= 10) {
          logger.error(`Modal: A personagem "${char.name}" atingiu ou excedeu 10 pressões no total (${totalC}/10). Tornou-se um NPC do Assimilador.`);
          document.getElementById("death-alert").classList.remove("hidden");
          char.assimiladoDefinitivo = true;
          saveCurrentCharacter();
        } else {
          document.getElementById("ass-modal-mutation-action").classList.remove("hidden");
          const oldBtn = document.getElementById("btn-draw-mutations");
          const newBtn = oldBtn.cloneNode(true);
          oldBtn.parentNode.replaceChild(newBtn, oldBtn);
          newBtn.addEventListener("click", () => {
            openMutationSelectionScreen(a, b, c);
          });
        }
      }
    );
  });
}


// Abre a tela de escolha das cartas de mutação com base nos pontos ABC do teste
export function openMutationSelectionScreen(ptsA, ptsB, ptsC) {
  const char = state.currentCharacter;
  if (!char) return;
  
  logger.info(`Modal: Abrindo seletor de Mutações (Naipe A: ${ptsA}, B: ${ptsB}, C: ${ptsC}).`);
  
  el.modalBody.innerHTML = `
    <h3 class="modal-title">Adquirir Mutações de Assimilação</h3>
    <div style="display:flex; justify-content:space-between; margin-bottom:16px; font-family:var(--font-heading); font-size:14px;">
      <span style="color:#00ff66;">Pontos de Copas [A]: <strong id="pts-a">${ptsA}</strong></span>
      <span style="color:#eab308;">Pontos de Ouros [B]: <strong id="pts-b">${ptsB}</strong></span>
      <span style="color:#ef4444;">Pontos de Espadas [C]: <strong id="pts-c">${ptsC}</strong></span>
    </div>
    
    <div class="mutation-draws-container" style="display:flex; flex-direction:column; gap:20px;">
      <!-- Copas (A) -->
      ${ptsA > 0 ? `
        <div>
          <h4 style="color:#00ff66; border-bottom:1px solid rgba(0,255,102,0.15); padding-bottom:4px; margin-bottom:10px;">Cartas de Copas (Evolutivas)</h4>
          <div class="mutations-select-grid" id="mut-grid-a"></div>
        </div>
      ` : ''}
      
      <!-- Ouros (B) -->
      ${ptsB > 0 ? `
        <div>
          <h4 style="color:#eab308; border-bottom:1px solid rgba(234,179,8,0.15); padding-bottom:4px; margin-bottom:10px;">Cartas de Ouros (Adaptativas)</h4>
          <div class="mutations-select-grid" id="mut-grid-b"></div>
        </div>
      ` : ''}
      
      <!-- Espadas (C) -->
      ${ptsC > 0 ? `
        <div>
          <h4 style="color:#ef4444; border-bottom:1px solid rgba(239,68,68,0.15); padding-bottom:4px; margin-bottom:10px;">Cartas de Espadas (Inoportunas)</h4>
          <div class="mutations-select-grid" id="mut-grid-c"></div>
        </div>
      ` : ''}
    </div>
    
    <div class="modal-actions">
      <button class="btn btn-success" id="btn-close-mutation-selection">Finalizar Repouso</button>
    </div>
  `;

  // Preenche Mutações de Copas (Evolutivas)
  if (ptsA > 0) {
    const grid = document.getElementById("mut-grid-a");
    ASSIMILACOES.evolutivas.cartas.forEach(card => {
      card.mutações.forEach(mut => {
        const isOwned = char.mutações.some(m => m.name === mut.name);
        const costLength = mut.cost.length; // Quantidade de A
        
        if (isOwned) return;
        
        const row = document.createElement("div");
        row.className = "trait-modal-row";
        row.style.borderColor = "rgba(0, 255, 102, 0.1)";
        row.innerHTML = `
          <div class="info">
            <div class="title-row">
              <span class="title" style="color:#00ff66;">${mut.name}</span>
              <span class="cost-badge" style="background:#00ff66; color:#000;">${mut.cost}</span>
            </div>
            <div class="req">Carta: ${card.carta} - ${card.nome}</div>
            <div class="desc">${mut.desc}</div>
          </div>
          <button class="btn btn-primary btn-sm btn-buy-mut" ${ptsA < costLength ? 'disabled' : ''}>Adquirir</button>
        `;
        
        row.querySelector(".btn-buy-mut").addEventListener("click", () => {
          logger.info(`Modal: Mutação evolutiva "${mut.name}" adquirida por ${costLength} copas.`);
          ptsA -= costLength;
          char.mutações.push({
            suit: "evolutivas",
            name: mut.name,
            cost: mut.cost,
            desc: mut.desc
          });
          saveCurrentCharacter();
          renderMutationsSheet();
          openMutationSelectionScreen(ptsA, ptsB, ptsC); // Recarrega
        });
        grid.appendChild(row);
      });
    });
  }


  // Preenche Mutações de Ouros (Adaptativas)
  if (ptsB > 0) {
    const grid = document.getElementById("mut-grid-b");
    ASSIMILACOES.adaptativas.cartas.forEach(card => {
      card.mutações.forEach(mut => {
        const isOwned = char.mutações.some(m => m.name === mut.name);
        const costLength = mut.cost.length;
        if (isOwned) return;
        
        const row = document.createElement("div");
        row.className = "trait-modal-row";
        row.style.borderColor = "rgba(234,179,8,0.1)";
        row.innerHTML = `
          <div class="info">
            <div class="title-row">
              <span class="title" style="color:#eab308;">${mut.name}</span>
              <span class="cost-badge" style="background:#eab308; color:#000;">${mut.cost}</span>
            </div>
            <div class="req">Carta: ${card.carta} - ${card.nome}</div>
            <div class="desc">${mut.desc}</div>
          </div>
          <button class="btn btn-primary btn-sm btn-buy-mut" ${ptsB < costLength ? 'disabled' : ''}>Adquirir</button>
        `;
        
        row.querySelector(".btn-buy-mut").addEventListener("click", () => {
          logger.info(`Modal: Mutação adaptativa "${mut.name}" adquirida por ${costLength} ouros.`);
          ptsB -= costLength;
          char.mutações.push({
            suit: "adaptativas",
            name: mut.name,
            cost: mut.cost,
            desc: mut.desc
          });
          saveCurrentCharacter();
          renderMutationsSheet();
          openMutationSelectionScreen(ptsA, ptsB, ptsC);
        });
        grid.appendChild(row);
      });
    });
  }


  // Preenche Mutações de Espadas (Inoportunas)
  if (ptsC > 0) {
    const grid = document.getElementById("mut-grid-c");
    ASSIMILACOES.inoportunas.cartas.forEach(card => {
      card.mutações.forEach(mut => {
        const isOwned = char.mutações.some(m => m.name === mut.name);
        const costLength = mut.cost.length;
        if (isOwned) return;
        
        const row = document.createElement("div");
        row.className = "trait-modal-row";
        row.style.borderColor = "rgba(239,68,68,0.1)";
        row.innerHTML = `
          <div class="info">
            <div class="title-row">
              <span class="title" style="color:#ef4444;">${mut.name}</span>
              <span class="cost-badge" style="background:#ef4444; color:#fff;">${mut.cost}</span>
            </div>
            <div class="req">Carta: ${card.carta} - ${card.nome}</div>
            <div class="desc">${mut.desc}</div>
          </div>
          <button class="btn btn-primary btn-sm btn-buy-mut" ${ptsC < costLength ? 'disabled' : ''}>Adquirir</button>
        `;
        
        row.querySelector(".btn-buy-mut").addEventListener("click", () => {
          logger.info(`Modal: Mutação inoportuna "${mut.name}" adquirida por ${costLength} espadas.`);
          ptsC -= costLength;
          char.mutações.push({
            suit: "inoportunas",
            name: mut.name,
            cost: mut.cost,
            desc: mut.desc
          });
          saveCurrentCharacter();
          renderMutationsSheet();
          openMutationSelectionScreen(ptsA, ptsB, ptsC);
        });
        grid.appendChild(row);
      });
    });
  }


  document.getElementById("btn-close-mutation-selection").addEventListener("click", () => {
    logger.info("Modal: Finalizando seleção de mutações. Atualizando pontos de Assimilação.");
    char.assPoints = char.assNivel; 
    saveCurrentCharacter();
    renderCaboGuerraSheet();
    el.modalContainer.classList.add("hidden");
  });
}

// ==========================================
// MODAL: AGIR POR INSTINTO (ROLAGEM ASSIMILADA)
// ==========================================
export function openAgirPorInstinoModal() {
  const char = state.currentCharacter;
  if (!char) return;

  logger.info("Modal: Abrindo modal de Agir por Instinto.");

  const INSTINTOS = ["Influência", "Percepção", "Potência", "Reação", "Resolução", "Sagacidade"];
  const optionsHtml = INSTINTOS.map(i =>
    `<option value="${i}">${i} (${char.instintos[i] || 0})</option>`
  ).join("");

  const podeAssimilacao = char.assPoints >= 1;
  const podeDeterminacao = char.detPoints >= 2;
  const podeAtuar = podeAssimilacao || podeDeterminacao;

  const custoHtml = podeAssimilacao
    ? `<div class="custo-badge custo-ass">Custo: 1 Ponto de Assimilação (disponível: ${char.assPoints})</div>`
    : podeDeterminacao
    ? `<div class="custo-badge custo-det">Custo: 2 Pontos de Determinação — Assimilação zerada (disponível: ${char.detPoints})</div>`
    : `<div class="custo-badge custo-sem">⛔ Sem recursos! Precisa de 1 Assimilação ou 2 Determinação.</div>`;

  el.modalContainer.classList.remove("hidden");
  el.modalBody.innerHTML = `
    <h3 class="modal-title instinto-modal-title">⚡ Agir por Instinto</h3>
    <p class="instinto-modal-desc">Invoque a força do parasita. Os d6 tornam-se d12 e você mantém 1 dado a mais.</p>
    ${custoHtml}
    <div class="instinto-selectors">
      <div class="instinto-selector-group">
        <label>1º Instinto</label>
        <select id="inst-select-1" class="instinto-select">${optionsHtml}</select>
        <span class="instinto-dice-count" id="inst-count-1">d12 × 0</span>
      </div>
      <div class="instinto-divider">+</div>
      <div class="instinto-selector-group">
        <label>2º Instinto <em>(substitui Conhecimento/Prática)</em></label>
        <select id="inst-select-2" class="instinto-select">${optionsHtml}</select>
        <span class="instinto-dice-count" id="inst-count-2">d12 × 0</span>
      </div>
    </div>
    <div class="instinto-pool-preview">
      Pilha: <strong id="instinto-pool-label">—</strong> &nbsp;·&nbsp; Manter: <strong>2</strong>
    </div>
    <div class="instinto-restricao">
      ⚠️ <strong>Restrição:</strong> Sem ajuda de aliados. Adaptações não cancelam Pressões em Ações Simples.
    </div>
    <button class="btn btn-instinto btn-block" id="btn-modal-agir-instinto" ${podeAtuar ? "" : "disabled"}>
      ⚡ REALIZAR ROLAGEM ASSIMILADA
    </button>
    <div class="instinto-results hidden" id="instinto-results">
      <h4 style="margin-bottom:8px; color:var(--color-green-glow);">Resultado</h4>
      <div class="results-dice-grid" id="instinto-dice-container"></div>
      <div class="roll-summary-inline" id="instinto-summary" style="margin-top:8px;"></div>
    </div>
  `;

  const preInstinto = state.selectedRoll.instinto;
  if (preInstinto) document.getElementById("inst-select-1").value = preInstinto;

  function updatePoolPreview() {
    const val1 = char.instintos[document.getElementById("inst-select-1").value] || 0;
    const val2 = char.instintos[document.getElementById("inst-select-2").value] || 0;
    document.getElementById("inst-count-1").textContent = `d12 × ${val1}`;
    document.getElementById("inst-count-2").textContent = `d12 × ${val2}`;
    document.getElementById("instinto-pool-label").textContent = `${val1 + val2}d12`;
  }
  document.getElementById("inst-select-1").addEventListener("change", updatePoolPreview);
  document.getElementById("inst-select-2").addEventListener("change", updatePoolPreview);
  updatePoolPreview();

  document.getElementById("btn-modal-agir-instinto").addEventListener("click", () => {
    if (!podeAtuar) return;
    const inst1 = document.getElementById("inst-select-1").value;
    const inst2 = document.getElementById("inst-select-2").value;
    const val1 = char.instintos[inst1] || 0;
    const val2 = char.instintos[inst2] || 0;
    const totalD12 = val1 + val2;
    if (totalD12 === 0) { alert("Selecione instintos com valor maior que 0!"); return; }

    if (podeAssimilacao) { char.assPoints -= 1; }
    else { char.detPoints -= 2; }
    saveCurrentCharacter();
    document.dispatchEvent(new CustomEvent('cabo-guerra-refresh'));

    const notationString = `${totalD12}d12`;
    const box = state.diceBox || window.diceBox;
    if (!box) { alert("Motor 3D carregando..."); return; }

    const btnRoll = document.getElementById("btn-modal-agir-instinto");
    btnRoll.disabled = true;
    btnRoll.textContent = "Rolando...";
    el.diceOverlay.classList.remove("hidden");
    setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 50);

    box.setDice(notationString);
    box.start_throw(null, (notation) => {
      setTimeout(() => { el.diceOverlay.classList.add("hidden"); }, 3000);
      if (!notation.result || notation.result.length === 0 || notation.result[0] < 0) {
        alert("Os dados saíram da mesa! Tente novamente.");
        btnRoll.disabled = false;
        btnRoll.textContent = "⚡ REALIZAR ROLAGEM ASSIMILADA";
        return;
      }
      const results = notation.result.map(val => ({
        value: val, sides: 12, symbols: DICE_MAP["d12"][val] || []
      }));
      const keptIndexes = [...results.map((d, i) => ({ ...d, i }))]
        .sort((a, b) => b.value - a.value).slice(0, 2).map(d => d.i);

      const container = document.getElementById("instinto-dice-container");
      container.innerHTML = "";
      results.forEach((die, idx) => {
        const card = document.createElement("div");
        card.className = `result-die-card ${keptIndexes.includes(idx) ? "kept" : ""}`;
        const imgSrc = getDieFaceImgSrc(12, die.value);
        card.innerHTML = imgSrc
          ? `<img src="${imgSrc}" class="die-face-img" alt="d12">`
          : `<span class="die-type-tag d-12">d12</span><span class="die-val-label">${die.value}</span><div class="die-symbol-svg">${getDieSymbolsHtml(die.symbols)}</div>`;
        container.appendChild(card);
      });

      let suc = 0, adp = 0, pre = 0;
      keptIndexes.forEach(idx => {
        results[idx].symbols.forEach(s => {
          if (s === "A") suc++;
          if (s === "B") adp++;
          if (s === "C") pre++;
        });
      });
      document.getElementById("instinto-summary").innerHTML = `
        <span>Sucesso: <strong>${suc}</strong></span>
        <span>Adaptação: <strong>${adp}</strong></span>
        <span>Pressão: <strong>${pre}</strong></span>`;
      document.getElementById("instinto-results").classList.remove("hidden");

      const rollEntry = {
        timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        formula: `⚡ Instinto: ${inst1} + ${inst2} (${notationString})`,
        results, keptDiceIndexes: keptIndexes, maxKeep: 2
      };
      if (!char.rollHistory) char.rollHistory = [];
      char.rollHistory.push(rollEntry);
      if (char.rollHistory.length > 20) char.rollHistory.shift();
      saveCurrentCharacter();
      document.dispatchEvent(new CustomEvent('render-chat-history'));
      btnRoll.textContent = "✦ Rolagem concluída";
      logger.info(`Agir por Instinto: Suc ${suc}, Adp ${adp}, Pre ${pre}`);
    });
  });
}
