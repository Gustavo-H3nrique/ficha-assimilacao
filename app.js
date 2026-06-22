import { el, state, loadCharactersFromStorage, saveCurrentCharacter, loadCharacter, deleteActiveCharacter, exportActiveCharacter, importCharacterFile } from "./js/state.js";
import { startWizard, wizardPrevStep, wizardNextStep, wizardFinish } from "./js/wizard.js";
import { updateDiceDrawerUI, execute3DPhysicsRoll, executeCustomRoll, setupNumberInputControls, updateKeepCountDisplay } from "./js/roller.js";
import { openTraitsModal, openAssimilationTestModal, openAgirPorInstinoModal } from "./js/modals.js";
import { renderAptitudesSheet, adjustCaboGuerraLevels, executeAssimilacaoAvanco, renderCaboGuerraSheet } from "./js/sheet.js";
import { ICONS } from "./icons.js";
import { logger } from "./js/logger.js";

// ==========================================
// INICIALIZAÇÃO DA APLICAÇÃO
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  logger.info("Aplicação carregada. Inicializando components...");
  renderIcons();
  loadCharactersFromStorage();
  initDiceBox();
  setupEventListeners();
  
  // Se houver personagens, carrega o primeiro, senão abre o wizard
  if (state.characters.length > 0) {
    loadCharacter(state.characters[0].id);
  } else {
    startWizard();
  }
});

// Renderização dos ícones SVG inline baseados em data-icon
function renderIcons() {
  document.querySelectorAll("[data-icon]").forEach(node => {
    const iconName = node.getAttribute("data-icon");
    if (ICONS[iconName]) {
      node.innerHTML = ICONS[iconName];
    }
  });
}

// Inicializa a biblioteca DiceBox local
function initDiceBox() {
  logger.info("Inicializando o motor DiceBox 3D...");
  const container = document.getElementById("dice-box-3d");
  const diceEngine = (typeof DICE !== "undefined") ? DICE : null;
  if (diceEngine && diceEngine.dice_box && container) {
    try {
      state.diceBox = new diceEngine.dice_box(container);
      window.diceBox = state.diceBox;
      logger.info("3D Dice Box local inicializado com sucesso.");
    } catch (e) {
      logger.error("Erro ao instanciar DICE.dice_box:", e);
    }
  } else {
    logger.error("DICE.dice_box ou container #dice-box-3d não encontrado no DOM.");
  }
}

// ==========================================
// EVENT LISTENERS
// ==========================================
function setupEventListeners() {
  logger.info("Configurando ouvintes de eventos da interface...");
  // Header controls
  el.charSelector.addEventListener("change", (e) => {
    if (e.target.value) loadCharacter(e.target.value);
  });
  el.btnNewChar.addEventListener("click", startWizard);
  el.btnDeleteChar.addEventListener("click", deleteActiveCharacter);
  
  // Export/Import JSON
  el.btnExportJson.addEventListener("click", exportActiveCharacter);
  el.btnImportJson.addEventListener("click", () => el.fileImport.click());
  el.fileImport.addEventListener("change", importCharacterFile);
  
  // Wizard Navigation
  el.btnWizPrev.addEventListener("click", wizardPrevStep);
  el.btnWizNext.addEventListener("click", wizardNextStep);
  el.btnWizFinish.addEventListener("click", wizardFinish);
  
  // Ficha Auto-save inputs
  const autoSaveInputs = [el.charName, el.charOcupacao, el.charEvento, el.charPropP1, el.charPropP2, el.charPropCol, el.charNotes];
  autoSaveInputs.forEach(input => {
    input.addEventListener("input", () => {
      if (state.currentCharacter) {
        state.currentCharacter.name = el.charName.value || "Sem Nome";
        state.currentCharacter.ocupacao = el.charOcupacao.value;
        state.currentCharacter.evento = el.charEvento.value;
        state.currentCharacter.propP1 = el.charPropP1.value;
        state.currentCharacter.propP2 = el.charPropP2.value;
        state.currentCharacter.propCol = el.charPropCol.value;
        state.currentCharacter.notes = el.charNotes.value;
        saveCurrentCharacter();
        
        // Atualiza a opção no select
        const option = el.charSelector.querySelector(`option[value="${state.currentCharacter.id}"]`);
        if (option) option.textContent = state.currentCharacter.name;
      }
    });
  });

  // Modal Generic Close
  el.modalContainer.addEventListener("click", (e) => {
    if (e.target === el.modalContainer || e.target.classList.contains("modal-close")) {
      el.modalContainer.classList.add("hidden");
    }
  });

  // Add Trait from Sheet
  el.btnAddTraitSheet.addEventListener("click", openTraitsModal);
  el.btnAssimilationTest.addEventListener("click", openAssimilationTestModal);

  // Cabo de Guerra Adjustments
  if (el.btnDecDet) el.btnDecDet.addEventListener("click", () => adjustCaboGuerraLevels(-1));
  if (el.btnIncDet) el.btnIncDet.addEventListener("click", () => adjustCaboGuerraLevels(1));
  if (el.btnDecAss) el.btnDecAss.addEventListener("click", () => adjustCaboGuerraLevels(1));
  if (el.btnIncAss) el.btnIncAss.addEventListener("click", () => adjustCaboGuerraLevels(-1));
  if (el.btnAvancoAssimilacao) el.btnAvancoAssimilacao.addEventListener("click", executeAssimilacaoAvanco);

  // Dice Drawer Trigger
  el.btnToggleDrawer.addEventListener("click", () => {
    el.diceDrawer.classList.toggle("closed");
    el.btnToggleDrawer.querySelector(".trigger-arrow").textContent = el.diceDrawer.classList.contains("closed") ? "◀" : "▶";
  });

  // Header Open Roller Trigger
  el.btnOpenRoller.addEventListener("click", () => {
    el.diceDrawer.classList.toggle("closed");
    el.btnToggleDrawer.querySelector(".trigger-arrow").textContent = el.diceDrawer.classList.contains("closed") ? "◀" : "▶";
  });

  // Seletores rápidos na gaveta
  el.rollSelectInstinto.addEventListener("change", (e) => {
    const value = e.target.value;
    if (!state.currentCharacter) return;
    
    if (value) {
      const val = state.currentCharacter.instintos[value] || 0;
      state.selectedRoll.instinto = value;
      if (state.selectedRoll.agirPorInstinto) {
        state.selectedRoll.d12 = val;
        state.selectedRoll.d6 = 0;
      } else {
        state.selectedRoll.d6 = val;
        state.selectedRoll.d12 = 0;
      }
    } else {
      state.selectedRoll.instinto = "";
      state.selectedRoll.d6 = 0;
      state.selectedRoll.d12 = 0;
    }
    renderAptitudesSheet();
    updateDiceDrawerUI();
  });
  
  el.rollSelectSkill.addEventListener("change", (e) => {
    const value = e.target.value;
    if (!state.currentCharacter) return;
    
    if (value) {
      const val = state.currentCharacter.conhecimentos[value] !== undefined 
        ? state.currentCharacter.conhecimentos[value] 
        : (state.currentCharacter.praticas[value] || 0);
      state.selectedRoll.skill = value;
      state.selectedRoll.d10 = val;
    } else {
      state.selectedRoll.skill = "";
      state.selectedRoll.d10 = 0;
    }
    renderAptitudesSheet();
    updateDiceDrawerUI();
  });

  // Roll Quantities manual adjustment
  setupNumberInputControls();

  // Modificadores de Rolagem
  el.modEmpenho.addEventListener("change", updateKeepCountDisplay);
  el.modOrigemOcupacao.addEventListener("change", updateKeepCountDisplay);
  el.modOrigemEvento.addEventListener("change", updateKeepCountDisplay);
  
  el.btnAgirInstinto.addEventListener("click", openAgirPorInstinoModal);
  el.btnRollAction.addEventListener("click", execute3DPhysicsRoll);
  
  // Custom Roll listeners
  el.btnRollCustom.addEventListener("click", executeCustomRoll);
  el.diceCustomFormula.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      executeCustomRoll();
    }
  });

  // Navegação de Abas da Ficha
  const tabButtons = document.querySelectorAll(".sheet-tab-btn");
  const tabPanels = document.querySelectorAll(".sheet-tab-panel");
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-tab");
      
      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      tabPanels.forEach(panel => {
        if (panel.id === targetTab) {
          panel.classList.add("active");
        } else {
          panel.classList.remove("active");
        }
      });
    });
  });

  // Clique na moldura do retrato para abrir selecionador de arquivo
  if (el.portraitFrame && el.portraitInput) {
    el.portraitFrame.addEventListener("click", () => {
      el.portraitInput.click();
    });

    el.portraitInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.size > 1.5 * 1024 * 1024) {
        alert("A imagem selecionada é muito grande! Por favor, escolha uma imagem menor que 1.5MB.");
        return;
      }

      logger.info(`Iniciando upload e otimização de imagem de retrato: ${file.name} (${Math.round(file.size / 1024)} KB)`);
      const reader = new FileReader();
      reader.onload = function(evt) {
        const tempImg = new Image();
        tempImg.onload = function() {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 300;
          const MAX_HEIGHT = 300;
          let width = tempImg.width;
          let height = tempImg.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(tempImg, 0, 0, width, height);

          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.8);
          logger.info(`Retrato comprimido com sucesso. Novo tamanho Base64 aproximado: ${Math.round(compressedDataUrl.length / 1024)} KB`);

          if (state.currentCharacter) {
            state.currentCharacter.portrait = compressedDataUrl;
            if (el.portraitImg) {
              el.portraitImg.src = compressedDataUrl;
            }
            saveCurrentCharacter();
          }
        };
        tempImg.onerror = function() {
          logger.error("Erro ao carregar a imagem temporária para redimensionamento.");
          alert("Erro ao processar a imagem. Certifique-se de que é um formato válido.");
        };
        tempImg.src = evt.target.result;
      };
      reader.onerror = function(err) {
        logger.error("Erro ao ler o arquivo selecionado:", err);
      };
      reader.readAsDataURL(file);
    });
  }

  // Roteamento de eventos customizados para modularidade
  document.addEventListener("start-wizard", startWizard);
  document.addEventListener("load-new-character", (e) => {
    loadCharacter(e.detail);
  });
  document.addEventListener("cabo-guerra-refresh", () => {
    renderCaboGuerraSheet();
  });
  document.addEventListener("aptitudes-refresh", () => {
    renderAptitudesSheet();
  });
  document.addEventListener("render-chat-history", () => {
    import("./js/chat.js").then(({ renderChatHistory }) => renderChatHistory());
  });
}
