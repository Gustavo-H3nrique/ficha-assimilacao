import { el, state, saveCurrentCharacter } from "./state.js";
import { getCurrentHealthLevel } from "./health.js";
import { appendRollToChat, renderResultsPanel, updateResultsSummary } from "./chat.js";
import { logger } from "./logger.js";

// ==========================================
// MAPEAMENTO DE DADOS (PÁG 43)
// ==========================================
export const DICE_MAP = {
  d6: {
    1: [],
    2: [],
    3: ["C"],
    4: ["C"],
    5: ["B", "C"],
    6: ["A"]
  },
  d10: {
    1: [],
    2: [],
    3: ["C"],
    4: ["C"],
    5: ["B", "C"],
    6: ["A"],
    7: ["A", "A"],
    8: ["A", "B"],
    9: ["A", "B", "C"],
    10: ["A", "A", "C"]
  },
  d12: {
    1: [],
    2: [],
    3: ["C"],
    4: ["C"],
    5: ["B", "C"],
    6: ["A"],
    7: ["A", "A"],
    8: ["A", "B"],
    9: ["A", "B", "C"],
    10: ["A", "A", "C"],
    11: ["A", "B", "B", "C"],
    12: ["C", "C"]
  }
};

// ==========================================
// SELEÇÃO DE ROLAGEM E CONVERSÃO DE DADOS
// ==========================================
export function selectRollAptitude(type, name, value) {
  if (!state.currentCharacter) return;
  
  logger.info(`Rolador: Selecionando aptidão para teste - Tipo: "${type}", Nome: "${name}", Valor: ${value}`);
  
  if (type === "instinto") {
    if (state.selectedRoll.instinto === name) {
      state.selectedRoll.instinto = "";
      state.selectedRoll.d6 = 0;
    } else {
      state.selectedRoll.instinto = name;
      state.selectedRoll.d6 = value;
    }
  } else if (type === "skill") {
    if (state.selectedRoll.skill === name) {
      state.selectedRoll.skill = "";
      state.selectedRoll.d10 = 0;
    } else {
      state.selectedRoll.skill = name;
      state.selectedRoll.d10 = value;
    }
  }
  
  // Se Agir por Instinto estiver ativo, atualiza
  if (state.selectedRoll.agirPorInstinto) {
    state.selectedRoll.d12 = state.selectedRoll.d6;
    state.selectedRoll.d6 = 0;
  }
  
  // Atualiza visualizadores
  document.dispatchEvent(new CustomEvent('aptitudes-refresh'));
  updateDiceDrawerUI();
}

export function updateDiceDrawerUI() {
  el.diceQtyD6.textContent = state.selectedRoll.d6;
  el.diceQtyD10.textContent = state.selectedRoll.d10;
  el.diceQtyD12.textContent = state.selectedRoll.d12;
  
  if (el.rollSelectInstinto) el.rollSelectInstinto.value = state.selectedRoll.instinto;
  if (el.rollSelectSkill) el.rollSelectSkill.value = state.selectedRoll.skill;
  
  if (state.selectedRoll.instinto || state.selectedRoll.skill) {
    const instText = state.selectedRoll.instinto ? `${state.selectedRoll.instinto} (${state.currentCharacter.instintos[state.selectedRoll.instinto]})` : "Nenhum Instinto";
    const skillText = state.selectedRoll.skill ? `${state.selectedRoll.skill} (${state.currentCharacter.conhecimentos[state.selectedRoll.skill] || state.currentCharacter.praticas[state.selectedRoll.skill] || 0})` : "Nenhuma Aptidão";
    el.currentRollLabel.textContent = `Teste: ${instText} + ${skillText}`;
  } else {
    el.currentRollLabel.textContent = "Nenhuma aptidão selecionada na ficha";
  }
  
  // Alerta de Saúde
  let warningEl = el.diceDrawer.querySelector("#drawer-health-warning");
  if (state.currentCharacter) {
    const healthLvl = getCurrentHealthLevel(state.currentCharacter);
    if (healthLvl <= 4) {
      if (!warningEl) {
        warningEl = document.createElement("div");
        warningEl.id = "drawer-health-warning";
        const h3 = el.diceDrawer.querySelector("h3");
        if (h3) {
          h3.parentNode.insertBefore(warningEl, h3.nextSibling);
        }
      }
      warningEl.className = `drawer-health-alert level-${healthLvl}`;
      
      let lvlName = "";
      if (healthLvl === 4) lvlName = "Laceração";
      else if (healthLvl === 3) lvlName = "Ferimentos";
      else if (healthLvl === 2) lvlName = "Debilitação";
      else if (healthLvl === 1) lvlName = "Incapacitação";
      
      if (healthLvl === 4 || healthLvl === 3) {
        warningEl.innerHTML = `⚠️ <strong>${lvlName}:</strong> -1 Sucesso [A] em todos os testes.`;
      } else if (healthLvl === 2) {
        warningEl.innerHTML = `⚠️ <strong>Debilitação:</strong> -2 Sucessos [A]. Incapaz de agir sem gastar 1 Determinação.`;
      } else if (healthLvl === 1) {
        warningEl.innerHTML = `⚠️ <strong>Incapacitação:</strong> Quase morte. Conversa exige 1 Determinação/rodada. Ação exige +2 B.`;
      }
    } else {
      if (warningEl) warningEl.remove();
    }
  } else {
    if (warningEl) warningEl.remove();
  }
  
  updateKeepCountDisplay();
  
  // Abre a gaveta se estiver fechada para dar feedback
  if (el.diceDrawer.classList.contains("closed")) {
    el.diceDrawer.classList.remove("closed");
    el.btnToggleDrawer.querySelector(".trigger-arrow").textContent = "▶";
  }
}

export function resetDiceDrawerSelections() {
  state.selectedRoll = { instinto: "", skill: "", d6: 0, d10: 0, d12: 0 };
  el.diceQtyD6.textContent = 0;
  el.diceQtyD10.textContent = 0;
  el.diceQtyD12.textContent = 0;
  el.currentRollLabel.textContent = "Nenhuma aptidão selecionada na ficha";
  el.modEmpenho.checked = false;
  el.modOrigemOcupacao.checked = false;
  el.modOrigemEvento.checked = false;

  if (el.rollSelectInstinto) el.rollSelectInstinto.value = "";
  if (el.rollSelectSkill) el.rollSelectSkill.value = "";
  
  // Remove active-roll class from prior messages
  document.querySelectorAll(".chat-message.active-roll").forEach(msg => {
    msg.classList.remove("active-roll");
  });
}

// Calcula quantos dados podem ser mantidos (Roll and Keep)
export function updateKeepCountDisplay() {
  let maxKeep = 1; // Base
  if (el.modEmpenho.checked) maxKeep++;
  if (el.modOrigemOcupacao.checked) maxKeep++;
  if (el.modOrigemEvento.checked) maxKeep++;
  
  // Obter o maxKeepCount da gaveta ou da mensagem ativa
  const maxKeepCountDrawer = document.getElementById("max-keep-count");
  if (maxKeepCountDrawer) {
    maxKeepCountDrawer.textContent = maxKeep;
  }
  
  // Atualiza narrador se houver resultados ativos
  if (state.activeRollResults.length > 0) {
    updateResultsSummary();
  }
}


// ==========================================
// ROLAGEM DE DADOS
// ==========================================
export function execute3DPhysicsRoll() {
  const box = state.diceBox || window.diceBox;
  if (!box) {
    alert("O motor 3D ainda está carregando...");
    return;
  }
  
  const d6Count = parseInt(el.diceQtyD6.textContent) || 0;
  const d10Count = parseInt(el.diceQtyD10.textContent) || 0;
  const d12Count = parseInt(el.diceQtyD12.textContent) || 0;
  
  if (d6Count === 0 && d10Count === 0 && d12Count === 0) {
    alert("Monte uma pilha de dados antes de rolar!");
    return;
  }
  
  if (el.modEmpenho.checked) {
    if (state.currentCharacter && state.currentCharacter.detPoints >= 1) {
      state.currentCharacter.detPoints -= 1;
      logger.info("Rolador: Gastou 1 Ponto de Determinação pelo uso de Empenho.");
      saveCurrentCharacter();
      document.dispatchEvent(new CustomEvent('cabo-guerra-refresh'));
    } else {
      alert("Determinação insuficiente para usar Empenho!");
      return;
    }
  }
  
  // Monta pool para o DiceBox
  const pool = [];
  if (d6Count > 0) pool.push(`${d6Count}d6`);
  if (d10Count > 0) pool.push(`${d10Count}d10`);
  if (d12Count > 0) pool.push(`${d12Count}d12`);
  
  const notationString = pool.join("+");
  logger.info(`Rolador: Iniciando rolagem 3D física com fórmula: "${notationString}"`);
  
  // Exibe o overlay da mesa de rolagem no canto superior direito
  el.diceOverlay.classList.remove("hidden");
  
  // Ajusta o Three.js para o tamanho do overlay visível
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
  }, 50);
  
  // Define e rola no canvas local
  box.setDice(notationString);
  box.start_throw(
    null,
    (notation) => {
      logger.info("Rolador: Rolagem 3D concluída. Resultados brutos:", notation.result);
      
      if (!notation.result || notation.result.length === 0 || notation.result[0] < 0) {
        logger.error("Rolador: Erro na simulação do Dice Box (dados fora da mesa).");
        alert("Ops! Os dados saíram da mesa de rolagem. Tente novamente.");
        el.diceOverlay.classList.add("hidden");
        return;
      }
      
      // Converte os dados brutos e salva no estado
      state.activeRollResults = notation.result.map((val, idx) => {
        const type = notation.set[idx]; // 'd6', 'd10', 'd12'
        const symbols = DICE_MAP[type][val] || [];
        const sides = parseInt(type.substring(1));
        return {
          id: idx,
          sides: sides,
          value: val,
          symbols: symbols
        };
      });
      
      // Reseta dados mantidos
      state.keptDiceIndexes = [];
      
      // Se for rolagem básica, mantemos o primeiro automaticamente
      if (state.activeRollResults.length > 0) {
        state.keptDiceIndexes.push(0);
      }
      
      // Adiciona mensagem ao chat
      appendRollToChat(notationString);
      renderResultsPanel();
      updateResultsSummary();
      
      // Fecha a mesa de rolagem automaticamente após 2.5 segundos
      setTimeout(() => {
        el.diceOverlay.classList.add("hidden");
      }, 2500);
      
      // Abre a gaveta se estiver fechada para dar feedback
      if (el.diceDrawer.classList.contains("closed")) {
        el.diceDrawer.classList.remove("closed");
        el.btnToggleDrawer.querySelector(".trigger-arrow").textContent = "▶";
      }
    }
  );
}

export function executeCustomRoll() {
  const box = state.diceBox || window.diceBox;
  if (!box) {
    alert("O motor 3D ainda está carregando...");
    return;
  }
  
  const formula = el.diceCustomFormula.value.trim().toLowerCase();
  if (!formula) {
    alert("Digite uma fórmula de dados para rolar (Ex: 1d20+2d8)!");
    return;
  }
  
  logger.info(`Rolador: Iniciando rolagem customizada com fórmula: "${formula}"`);
  
  // Exibe o overlay da mesa de rolagem no canto superior direito
  el.diceOverlay.classList.remove("hidden");
  
  // Ajusta o Three.js para o tamanho do overlay visível
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
  }, 50);
  
  box.setDice(formula);
  box.start_throw(
    null,
    (notation) => {
      logger.info("Rolador: Rolagem customizada concluída. Resultados:", notation.result);
      
      if (!notation.result || notation.result.length === 0 || notation.result[0] < 0) {
        logger.error("Rolador: Erro na simulação do Dice Box customizado.");
        alert("Ops! Os dados saíram da mesa de rolagem. Tente novamente.");
        el.diceOverlay.classList.add("hidden");
        return;
      }
      
      // Converte os dados brutos e salva no estado
      state.activeRollResults = notation.result.map((val, idx) => {
        const type = notation.set[idx]; // 'd6', 'd10', 'd12', 'd20', etc.
        const symbols = DICE_MAP[type] ? (DICE_MAP[type][val] || []) : [];
        const sides = parseInt(type.substring(1));
        return {
          id: idx,
          sides: sides,
          value: val,
          symbols: symbols
        };
      });
      
      // Reseta dados mantidos
      state.keptDiceIndexes = [];
      
      // Se for rolagem básica, mantemos o primeiro automaticamente
      if (state.activeRollResults.length > 0) {
        state.keptDiceIndexes.push(0);
      }
      
      // Adiciona mensagem ao chat
      appendRollToChat(formula);
      renderResultsPanel();
      updateResultsSummary();
      
      // Fecha a mesa de rolagem automaticamente após 2.5 segundos
      setTimeout(() => {
        el.diceOverlay.classList.add("hidden");
      }, 2500);
      
      // Abre a gaveta se estiver fechada para dar feedback
      if (el.diceDrawer.classList.contains("closed")) {
        el.diceDrawer.classList.remove("closed");
        el.btnToggleDrawer.querySelector(".trigger-arrow").textContent = "▶";
      }
    }
  );
}

// Configura botões mais/menos nos seletores numéricos
export function setupNumberInputControls() {
  document.querySelectorAll(".number-input").forEach(container => {
    const input = container.querySelector("input");
    const minus = container.querySelector(".num-minus");
    const plus = container.querySelector(".num-plus");
    
    // Evita duplicar escutas se o container for do wizard
    if (container.closest("#wizard-screen")) return;

    if (minus && plus && input) {
      minus.addEventListener("click", () => {
        let val = parseInt(input.value) || 0;
        if (val > parseInt(input.min || 0)) {
          input.value = val - 1;
          input.dispatchEvent(new Event("change"));
          triggerSelectedRollUpdate();
        }
      });
      
      plus.addEventListener("click", () => {
        let val = parseInt(input.value) || 0;
        if (val < parseInt(input.max || 10)) {
          input.value = val + 1;
          input.dispatchEvent(new Event("change"));
          triggerSelectedRollUpdate();
        }
      });

      input.addEventListener("change", () => {
        triggerSelectedRollUpdate();
      });
    }
  });

  setupDiceTagSelectionControls();
}

export function setupDiceTagSelectionControls() {
  const d6Tag = document.querySelector(".dice-select-control .tag-d6");
  const d10Tag = document.querySelector(".dice-select-control .tag-d10");
  const d12Tag = document.querySelector(".dice-select-control .tag-d12");
  
  if (d6Tag) {
    d6Tag.addEventListener("click", () => {
      let val = parseInt(el.diceQtyD6.textContent) || 0;
      if (val < 10) {
        el.diceQtyD6.textContent = val + 1;
        triggerSelectedRollUpdate();
        updateDiceDrawerUI();
      }
    });
    d6Tag.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      let val = parseInt(el.diceQtyD6.textContent) || 0;
      if (val > 0) {
        el.diceQtyD6.textContent = val - 1;
        triggerSelectedRollUpdate();
        updateDiceDrawerUI();
      }
    });
  }

  if (d10Tag) {
    d10Tag.addEventListener("click", () => {
      let val = parseInt(el.diceQtyD10.textContent) || 0;
      if (val < 10) {
        el.diceQtyD10.textContent = val + 1;
        triggerSelectedRollUpdate();
        updateDiceDrawerUI();
      }
    });
    d10Tag.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      let val = parseInt(el.diceQtyD10.textContent) || 0;
      if (val > 0) {
        el.diceQtyD10.textContent = val - 1;
        triggerSelectedRollUpdate();
        updateDiceDrawerUI();
      }
    });
  }

  if (d12Tag) {
    d12Tag.addEventListener("click", () => {
      let val = parseInt(el.diceQtyD12.textContent) || 0;
      if (val < 10) {
        el.diceQtyD12.textContent = val + 1;
        triggerSelectedRollUpdate();
        updateDiceDrawerUI();
      }
    });
    d12Tag.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      let val = parseInt(el.diceQtyD12.textContent) || 0;
      if (val > 0) {
        el.diceQtyD12.textContent = val - 1;
        triggerSelectedRollUpdate();
        updateDiceDrawerUI();
      }
    });
  }
}

function triggerSelectedRollUpdate() {
  state.selectedRoll.d6 = parseInt(el.diceQtyD6.textContent) || 0;
  state.selectedRoll.d10 = parseInt(el.diceQtyD10.textContent) || 0;
  state.selectedRoll.d12 = parseInt(el.diceQtyD12.textContent) || 0;
}
