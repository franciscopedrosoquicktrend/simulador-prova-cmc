"use strict";

const EXAM_DURATION_SECONDS = 18 * 60;

const tasks = {
  m32: {
    title: "Microfone no Main L/R",
    description:
      "Ligue o microfone dinâmico ao canal 1 e obtenha voz limpa nas duas colunas activas, sem ruído, clip ou realimentação.",
    spoken:
      "Na mesa MIDAS M trinta e dois, ligue o microfone dinâmico ao canal um, encaminhe-o para o Main L R e obtenha som limpo nas duas colunas, sem ruído nem realimentação.",
    recordedAudio: "audio/m32-examiner.m4a",
    steps: [
      { id: "safe", label: "Confirmar colunas desligadas, mutes activos, faders e ganho baixos" },
      { id: "cables", label: "Ligar microfone, Main L e Main R com as colunas desligadas" },
      { id: "console", label: "Ligar a mesa e confirmar phantom desligado" },
      { id: "route", label: "Atribuir o canal 1 ao Main L/R e confirmar o routing" },
      { id: "gain", label: "Usar PFL, testar a voz e ajustar o ganho sem clip" },
      { id: "output", label: "Colocar faders, ligar colunas por último e retirar os mutes" },
      { id: "validate", label: "Confirmar som limpo nas duas colunas" },
    ],
  },
  etc: {
    title: "Programar e reproduzir Cue 1",
    description:
      "Ligue quatro projectores convencionais, coloque os canais 1 a 4 a 70%, grave a Cue 1, faça blackout de cena e reproduza a cue com GO.",
    spoken:
      "Na mesa ETC Element, ligue quatro projectores convencionais. Coloque os canais um a quatro a setenta por cento, grave a Cue um, retire a luz de cena e reproduza a Cue um através do botão Go.",
    recordedAudio: "audio/etc-examiner.m4a",
    steps: [
      { id: "safe", label: "Confirmar Blackout activo e Grandmaster a 0%" },
      { id: "connect", label: "Ligar DMX, alimentar os projectores e ligar a console" },
      { id: "ready", label: "Entrar em Live, colocar Grandmaster a 100% e retirar Blackout" },
      { id: "levels", label: "Executar: 1 THRU 4 AT 70 ENTER" },
      { id: "record", label: "Executar: RECORD CUE 1 ENTER" },
      { id: "out", label: "Executar: GO TO CUE OUT ENTER" },
      { id: "play", label: "Premir GO e confirmar Cue 1 a 70%" },
      { id: "validate", label: "Validar a programação e o resultado visual" },
    ],
  },
};

const helpData = {
  m32: [
    ["Gain", "Ajusta a intensidade do sinal à entrada. Não é o volume final."],
    ["Fader do canal", "Controla quanto do canal entra na mistura principal."],
    ["Main LR", "É a saída principal estéreo: esquerda e direita."],
    ["Mute", "Corta o sinal. Deve estar activo durante a preparação."],
    ["+48 V", "Alimentação phantom. Neste exercício fica desligada porque o microfone é dinâmico."],
    ["PFL / Solo", "Permite medir o canal antes de o enviar para as colunas."],
    ["Routing", "Define que entradas e misturas chegam às saídas físicas."],
    ["Ponto 0 dB", "Posição de referência normal dos faders, sem aumento nem redução."],
  ],
  etc: [
    ["DMX", "Cabo de controlo que leva as ordens da mesa aos projectores."],
    ["Grandmaster", "Limite geral de intensidade. Para operação normal fica a 100%."],
    ["Blackout", "Corta toda a saída de luz imediatamente."],
    ["Live", "Modo em que as alterações são enviadas para o palco."],
    ["@ / At", "Define a intensidade dos canais seleccionados."],
    ["Thru", "Selecciona uma sequência: por exemplo, canais 1 a 4."],
    ["Record Cue", "Grava o estado actual de luz numa memória numerada."],
    ["GO", "Executa a próxima cue da lista de reprodução."],
  ],
};

const completeSetupItems = [
  { id: "inventory", label: "Contar e inspeccionar microfones, cabos, colunas e projectores" },
  { id: "micTypes", label: "Identificar: canais 1–2 dinâmicos; canal 3 condensador" },
  { id: "channelPlan", label: "Planear: CH1 voz, CH2 apresentação, CH3 condensador; Main L/R" },
  { id: "phantomPlan", label: "Manter +48 V desligado nos dinâmicos; activar apenas no CH3" },
  { id: "dmxChain", label: "Planear DMX OUT → projector 1 → 2 → 3 → 4" },
  { id: "dmxAddress", label: "Confirmar endereços DMX 1, 2, 3 e 4 sem duplicações" },
  { id: "cableSafety", label: "Separar sinal/alimentação e proteger cabos nas zonas de passagem" },
  { id: "finalCheck", label: "Teste final: três microfones, L/R, quatro projectores, Blackout e GO" },
];

const state = {
  scenario: "essential",
  mode: "guided",
  running: false,
  paused: false,
  elapsed: 0,
  currentStation: "m32",
  completed: { m32: false, etc: false },
  mistakes: [],
  actions: [],
  hintsUsed: 0,
  resets: 0,
  timerId: null,
  examinerAudio: null,
  m32: {},
  etc: {},
  completeSetup: {},
};

const elements = {};

function cacheElements() {
  const ids = [
    "timer",
    "progressValue",
    "liveScore",
    "pauseButton",
    "welcomeScreen",
    "simulatorScreen",
    "resultsScreen",
    "startButton",
    "voiceDemoButton",
    "completeSetupPanel",
    "completeSetupChecklist",
    "taskBrief",
    "speakBriefButton",
    "guidedSteps",
    "eventLog",
    "stationType",
    "stationTitle",
    "m32Station",
    "etcStation",
    "m32TabStatus",
    "etcTabStatus",
    "helpButton",
    "resetStationButton",
    "contextHint",
    "validateButton",
    "pauseDialog",
    "resumeButton",
    "helpDialog",
    "closeHelpButton",
    "helpTitle",
    "helpContent",
    "resultTitle",
    "resultSummary",
    "finalScore",
    "resultVerdict",
    "criteriaResults",
    "strengthsList",
    "improvementsList",
    "retryButton",
    "homeButton",
    "micSocket",
    "micSocketState",
    "mainLSocket",
    "mainRSocket",
    "leftCableState",
    "rightCableState",
    "m32Power",
    "m32PowerState",
    "gainControl",
    "gainValue",
    "phantomButton",
    "polarityButton",
    "inputMeter",
    "testMicButton",
    "soloButton",
    "channelLR",
    "channelMute",
    "mainMute",
    "channelFader",
    "channelFaderValue",
    "mainFader",
    "mainFaderValue",
    "m32Screen",
    "m32ScreenContent",
    "screenClock",
    "leftSpeakerPower",
    "rightSpeakerPower",
    "leftSpeakerLed",
    "rightSpeakerLed",
    "soundWave",
    "audioResult",
    "audioDetail",
    "dmxSocket",
    "dmxSocketState",
    "fixturePower",
    "fixturePowerState",
    "etcPower",
    "etcPowerState",
    "dmxIndicator",
    "stageStatusText",
    "etcModeLabel",
    "grandmaster",
    "grandmasterValue",
    "blackoutButton",
    "liveButton",
    "blindButton",
    "commandLine",
    "cueList",
    "goButton",
    "playbackMaster",
    "lightBeams",
  ];

  ids.forEach((id) => {
    elements[id] = document.getElementById(id);
  });
}

function resetM32() {
  state.m32 = {
    completedSteps: {},
    micConnected: false,
    leftConnected: false,
    rightConnected: false,
    consoleOn: false,
    gain: 5,
    phantom: false,
    polarity: false,
    solo: false,
    lrAssigned: false,
    channelMuted: true,
    mainMuted: true,
    channelFader: -90,
    mainFader: -90,
    leftSpeakerOn: false,
    rightSpeakerOn: false,
    micTested: false,
    meterPeak: -60,
    routingViewed: false,
    cleanSignalSeen: false,
    page: "home",
  };
}

function resetEtc() {
  state.etc = {
    completedSteps: {},
    dmxConnected: false,
    fixturesOn: false,
    consoleOn: false,
    grandmaster: 0,
    blackout: true,
    mode: "offline",
    levels: [0, 0, 0, 0],
    cues: {},
    currentCue: null,
    commandTokens: [],
    goToOutDone: false,
    cuePlayed: false,
    playbackMaster: 100,
  };
}

function initialize() {
  cacheElements();
  resetM32();
  resetEtc();
  bindEvents();
  updateAll();
}

function bindEvents() {
  document.querySelectorAll(".scenario-card").forEach((button) => {
    button.addEventListener("click", () => selectScenario(button.dataset.scenario));
  });

  document.querySelectorAll(".mode-card").forEach((button) => {
    button.addEventListener("click", () => selectMode(button.dataset.mode));
  });

  document.querySelectorAll(".equipment-tab").forEach((button) => {
    button.addEventListener("click", () => switchStation(button.dataset.station));
  });

  document.querySelectorAll(".screen-tab").forEach((button) => {
    button.addEventListener("click", () => {
      if (!ensureM32Powered()) return;
      state.m32.page = button.dataset.page;
      if (state.m32.page === "routing") {
        state.m32.routingViewed = true;
        logEvent("Routing das saídas consultado.", "good");
        recordAction("m32-routing");
      }
      document.querySelectorAll(".screen-tab").forEach((tab) => {
        tab.classList.toggle("active", tab === button);
      });
      updateM32();
    });
  });

  elements.startButton.addEventListener("click", startSimulation);
  elements.voiceDemoButton.addEventListener("click", playVoiceDemo);
  elements.pauseButton.addEventListener("click", pauseSimulation);
  elements.resumeButton.addEventListener("click", resumeSimulation);
  elements.speakBriefButton.addEventListener("click", speakBrief);
  elements.helpButton.addEventListener("click", showHelp);
  elements.closeHelpButton.addEventListener("click", () => elements.helpDialog.close());
  elements.resetStationButton.addEventListener("click", resetCurrentStation);
  elements.validateButton.addEventListener("click", validateCurrentTask);
  elements.retryButton.addEventListener("click", startSimulation);
  elements.homeButton.addEventListener("click", returnHome);

  elements.micSocket.addEventListener("click", toggleMicConnection);
  elements.mainLSocket.addEventListener("click", () => toggleOutputConnection("left"));
  elements.mainRSocket.addEventListener("click", () => toggleOutputConnection("right"));
  elements.m32Power.addEventListener("click", toggleM32Power);
  elements.gainControl.addEventListener("input", handleGain);
  elements.phantomButton.addEventListener("click", togglePhantom);
  elements.polarityButton.addEventListener("click", togglePolarity);
  elements.testMicButton.addEventListener("click", testMicrophone);
  elements.soloButton.addEventListener("click", toggleSolo);
  elements.channelLR.addEventListener("click", toggleLrAssignment);
  elements.channelMute.addEventListener("click", () => toggleMute("channel"));
  elements.mainMute.addEventListener("click", () => toggleMute("main"));
  elements.channelFader.addEventListener("input", () => handleFader("channel"));
  elements.mainFader.addEventListener("input", () => handleFader("main"));
  elements.leftSpeakerPower.addEventListener("click", () => toggleSpeaker("left"));
  elements.rightSpeakerPower.addEventListener("click", () => toggleSpeaker("right"));

  elements.dmxSocket.addEventListener("click", toggleDmx);
  elements.fixturePower.addEventListener("click", toggleFixturePower);
  elements.etcPower.addEventListener("click", toggleEtcPower);
  elements.grandmaster.addEventListener("input", handleGrandmaster);
  elements.blackoutButton.addEventListener("click", toggleBlackout);
  elements.liveButton.addEventListener("click", () => setEtcMode("live"));
  elements.blindButton.addEventListener("click", () => setEtcMode("blind"));
  elements.playbackMaster.addEventListener("input", () => {
    state.etc.playbackMaster = Number(elements.playbackMaster.value);
    updateEtc();
  });
  elements.goButton.addEventListener("click", playNextCue);

  document.querySelectorAll("[data-key]").forEach((button) => {
    button.addEventListener("click", () => handleEtcKey(button.dataset.key));
  });

  document.addEventListener("keydown", handleKeyboard);
}

function selectMode(mode) {
  state.mode = mode;
  document.querySelectorAll(".mode-card").forEach((button) => {
    button.classList.toggle("selected", button.dataset.mode === mode);
  });
}

function selectScenario(scenario) {
  state.scenario = scenario;
  document.querySelectorAll(".scenario-card").forEach((button) => {
    button.classList.toggle("selected", button.dataset.scenario === scenario);
  });
}

function playVoiceDemo() {
  if (state.examinerAudio) state.examinerAudio.pause();
  state.examinerAudio = new Audio("audio/siri-voice-demo.m4a");
  state.examinerAudio.play().catch(() => {
    elements.voiceDemoButton.textContent = "Não foi possível reproduzir a amostra";
  });
}

function startSimulation() {
  clearInterval(state.timerId);
  resetM32();
  resetEtc();
  state.running = true;
  state.paused = false;
  state.elapsed = 0;
  state.currentStation = "m32";
  state.completed = { m32: false, etc: false };
  state.mistakes = [];
  state.actions = [];
  state.hintsUsed = 0;
  state.resets = 0;
  state.completeSetup = {};

  elements.welcomeScreen.classList.add("hidden");
  elements.resultsScreen.classList.add("hidden");
  elements.simulatorScreen.classList.remove("hidden");
  elements.pauseButton.disabled = state.mode === "practice";
  elements.liveScore.textContent = state.mode === "exam" ? "—" : "20.0";
  elements.eventLog.innerHTML = "";

  switchStation("m32");
  logEvent("A prova começou. O examinador observa a sequência de trabalho.", "good");

  if (state.mode !== "practice") {
    state.timerId = setInterval(tickTimer, 1000);
  }

  updateAll();
}

function returnHome() {
  clearInterval(state.timerId);
  state.running = false;
  elements.resultsScreen.classList.add("hidden");
  elements.simulatorScreen.classList.add("hidden");
  elements.welcomeScreen.classList.remove("hidden");
  elements.pauseButton.disabled = true;
  elements.timer.textContent = "18:00";
  elements.progressValue.textContent = "0%";
  elements.liveScore.textContent = "—";
}

function tickTimer() {
  if (!state.running || state.paused) return;
  state.elapsed += 1;
  updateHeader();
}

function pauseSimulation() {
  if (!state.running || state.mode === "practice") return;
  state.paused = true;
  elements.pauseDialog.showModal();
}

function resumeSimulation() {
  state.paused = false;
  elements.pauseDialog.close();
}

function switchStation(station) {
  state.currentStation = station;
  document.querySelectorAll(".equipment-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.station === station);
  });
  elements.m32Station.classList.toggle("active", station === "m32");
  elements.etcStation.classList.toggle("active", station === "etc");
  elements.stationType.textContent = station === "m32" ? "MESA DE SOM DIGITAL" : "MESA DE ILUMINAÇÃO";
  elements.stationTitle.textContent = station === "m32" ? "MIDAS M32" : "ETC ELEMENT";
  updateBrief();
  updateGuidedSteps();
  updateContextHint();
  renderCompleteSetupChecklist();
}

function updateAll() {
  updateHeader();
  updateM32();
  updateEtc();
  updateBrief();
  updateGuidedSteps();
  updateContextHint();
  updateTabStatus();
  renderCompleteSetupChecklist();
}

function renderCompleteSetupChecklist() {
  const isCompleteScenario = state.scenario === "complete";
  elements.completeSetupPanel.classList.toggle("hidden", !isCompleteScenario);
  if (!isCompleteScenario) return;

  const visibleItems =
    state.currentStation === "m32"
      ? completeSetupItems.slice(0, 4)
      : completeSetupItems.slice(4);

  elements.completeSetupChecklist.innerHTML = visibleItems
    .map(
      (item) => `
        <button class="setup-check ${state.completeSetup[item.id] ? "done" : ""}" type="button" data-setup-id="${item.id}">
          <span>${state.completeSetup[item.id] ? "✓" : ""}</span>
          ${item.label}
        </button>`,
    )
    .join("");

  elements.completeSetupChecklist.querySelectorAll(".setup-check").forEach((button) => {
    button.addEventListener("click", () => completeSetupItem(button.dataset.setupId));
  });
}

function completeSetupItem(id) {
  const item = completeSetupItems.find((entry) => entry.id === id);
  if (!item) return;

  state.completeSetup[id] = !state.completeSetup[id];
  logEvent(
    `${item.label}: ${state.completeSetup[id] ? "confirmado" : "por confirmar"}.`,
    state.completeSetup[id] ? "good" : "warning",
  );
  recordAction(`setup-${id}`);
  renderCompleteSetupChecklist();
}

function isCompleteSetupReadyFor(station) {
  if (state.scenario !== "complete") return true;
  const required =
    station === "m32"
      ? ["inventory", "micTypes", "channelPlan", "phantomPlan"]
      : ["dmxChain", "dmxAddress", "cableSafety", "finalCheck"];
  return required.every((id) => state.completeSetup[id]);
}

function updateHeader() {
  const remaining = Math.max(0, EXAM_DURATION_SECONDS - state.elapsed);
  const shownSeconds = state.mode === "practice" ? 0 : remaining;
  elements.timer.textContent = state.mode === "practice" ? "LIVRE" : formatTime(shownSeconds);
  elements.screenClock.textContent = formatTime(state.elapsed);
  elements.timer.classList.toggle("warning", remaining <= 300 && remaining > 60);
  elements.timer.classList.toggle("danger", remaining <= 60 && state.mode !== "practice");

  const progress = calculateProgress();
  elements.progressValue.textContent = `${progress}%`;

  if (state.mode !== "exam" && state.running) {
    elements.liveScore.textContent = calculateScores().total.toFixed(1);
  }
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function calculateProgress() {
  let points = 0;
  const total = 15;
  const m = state.m32;
  const e = state.etc;

  if (m.micConnected) points += 1;
  if (m.leftConnected && m.rightConnected) points += 1;
  if (m.consoleOn) points += 1;
  if (m.lrAssigned && m.routingViewed) points += 1;
  if (m.micTested && m.gain >= 32 && m.gain <= 40) points += 1;
  if (isM32OutputReady()) points += 1;
  if (state.completed.m32) points += 1;

  if (e.dmxConnected && e.fixturesOn && e.consoleOn) points += 1;
  if (e.mode === "live" && e.grandmaster === 100 && !e.blackout) points += 1;
  if (e.levels.every((level) => level === 70)) points += 1;
  if (e.cues[1]) points += 1;
  if (e.goToOutDone) points += 1;
  if (e.cuePlayed) points += 1;
  if (state.completed.etc) points += 1;

  if (state.completed.m32 && state.completed.etc) points += 1;
  return Math.round((points / total) * 100);
}

function updateBrief() {
  const task = tasks[state.currentStation];
  elements.taskBrief.innerHTML = `<h3>${task.title}</h3><p>${task.description}</p>`;
}

function speakBrief() {
  const task = tasks[state.currentStation];
  playRecordedExaminerAudio(task).then((played) => {
    if (!played) speakBriefWithSystemVoice(task);
  });
}

async function playRecordedExaminerAudio(task) {
  if (!task.recordedAudio) return false;

  try {
    const response = await fetch(task.recordedAudio, { method: "HEAD" });
    if (!response.ok) return false;

    if (state.examinerAudio) state.examinerAudio.pause();
    state.examinerAudio = new Audio(task.recordedAudio);
    await state.examinerAudio.play();
    return true;
  } catch {
    return false;
  }
}

function speakBriefWithSystemVoice(task) {
  if (!("speechSynthesis" in window)) {
    logEvent("A leitura de voz não está disponível neste navegador.", "warning");
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(task.spoken);
  utterance.lang = "pt-PT";
  utterance.rate = 0.9;
  utterance.pitch = 1;

  const preferredVoice = selectPortugueseExaminerVoice(window.speechSynthesis.getVoices());
  if (!preferredVoice) {
    logEvent(
      "O Safari não disponibilizou a voz masculina Siri/Voz 2 à aplicação. A voz Joana não será utilizada.",
      "warning",
    );
    return;
  }

  utterance.voice = preferredVoice;
  utterance.lang = preferredVoice.lang;
  window.speechSynthesis.speak(utterance);
}

function selectPortugueseExaminerVoice(voices) {
  const portugueseVoices = voices.filter(
    (voice) => /^pt[-_]PT$/i.test(voice.lang) && !/joana|female|feminina/i.test(voice.name),
  );
  if (portugueseVoices.length === 0) return null;

  const priorities = [
    /siri.*(?:voz|voice)?\s*2/i,
    /(?:voz|voice)\s*2.*siri/i,
    /siri.*(?:male|masculina|masculino)/i,
    /(?:male|masculina|masculino).*siri/i,
    /voz\s*2|voice\s*2/i,
    /joaquim/i,
    /duarte/i,
    /male|masculina|masculino/i,
  ];

  for (const pattern of priorities) {
    const match = portugueseVoices.find((voice) => pattern.test(voice.name));
    if (match) return match;
  }

  return null;
}

function updateGuidedSteps() {
  if (state.mode === "exam") {
    elements.guidedSteps.innerHTML = "";
    return;
  }

  const station = state.currentStation;
  const status = station === "m32" ? getM32StepStatus() : getEtcStepStatus();
  elements.guidedSteps.innerHTML = tasks[station].steps
    .map((step, index) => {
      const stepState = status[step.id] ? "done" : index === status.nextIndex ? "current" : "";
      return `<div class="guided-step ${stepState}"><span>${status[step.id] ? "✓" : index + 1}</span><div>${step.label}</div></div>`;
    })
    .join("");
}

function getM32StepStatus() {
  const m = state.m32;
  const current = {
    safe:
      !m.leftSpeakerOn &&
      !m.rightSpeakerOn &&
      m.channelMuted &&
      m.mainMuted &&
      m.channelFader <= -60 &&
      m.mainFader <= -60 &&
      m.gain <= 10 &&
      !m.phantom,
    cables: m.micConnected && m.leftConnected && m.rightConnected,
    console: m.consoleOn && !m.phantom,
    route: m.lrAssigned && m.routingViewed,
    gain: m.micTested && m.gain >= 32 && m.gain <= 40,
    output: isM32OutputReady(),
    validate: state.completed.m32,
  };
  rememberCompletedSteps(m, current);
  const status = { ...current, ...m.completedSteps };
  status.nextIndex = tasks.m32.steps.findIndex((step) => !status[step.id]);
  return status;
}

function getEtcStepStatus() {
  const e = state.etc;
  const current = {
    safe: e.blackout && e.grandmaster === 0,
    connect: e.dmxConnected && e.fixturesOn && e.consoleOn,
    ready: e.mode === "live" && e.grandmaster === 100 && !e.blackout,
    levels: e.levels.every((level) => level === 70),
    record: Boolean(e.cues[1]),
    out: e.goToOutDone,
    play: e.cuePlayed && e.levels.every((level) => level === 70),
    validate: state.completed.etc,
  };
  rememberCompletedSteps(e, current);
  const status = { ...current, ...e.completedSteps };
  status.nextIndex = tasks.etc.steps.findIndex((step) => !status[step.id]);
  return status;
}

function rememberCompletedSteps(stationState, currentStatus) {
  Object.entries(currentStatus).forEach(([step, completed]) => {
    if (completed) stationState.completedSteps[step] = true;
  });
}

function updateContextHint() {
  if (state.mode === "exam") {
    elements.contextHint.innerHTML =
      '<span class="hint-icon">!</span><p>Modo oficial: o examinador não fornece indicações durante a execução.</p>';
    return;
  }

  const status = state.currentStation === "m32" ? getM32StepStatus() : getEtcStepStatus();
  const stationTasks = tasks[state.currentStation].steps;
  const next = stationTasks.find((step) => !status[step.id]);
  const text = next ? `Próximo passo seguro: ${next.label}.` : "A tarefa parece concluída. Valida o resultado.";
  elements.contextHint.innerHTML = `<span class="hint-icon">i</span><p>${text}</p>`;
}

function updateTabStatus() {
  setTabStatus(elements.m32TabStatus, state.completed.m32, state.currentStation === "m32");
  setTabStatus(elements.etcTabStatus, state.completed.etc, state.currentStation === "etc");
}

function setTabStatus(element, completed, active) {
  element.className = "tab-status";
  if (completed) {
    element.textContent = "CONCLUÍDO";
    element.classList.add("done");
  } else if (active) {
    element.textContent = "EM CURSO";
  } else {
    element.textContent = "POR INICIAR";
    element.classList.add("waiting");
  }
}

function logEvent(message, type = "neutral") {
  const entry = document.createElement("p");
  entry.className = `log-entry ${type}`;
  entry.innerHTML = `<strong>${formatTime(state.elapsed)}</strong>${message}`;
  elements.eventLog.prepend(entry);
}

function recordAction(action) {
  state.actions.push({ action, time: state.elapsed });
  updateHeader();
  updateGuidedSteps();
  updateContextHint();
}

function addMistake(code, message, severity = 1) {
  if (state.mode === "practice") {
    logEvent(message, "warning");
    return;
  }
  state.mistakes.push({ code, message, severity, station: state.currentStation });
  logEvent(message, severity >= 2 ? "error" : "warning");
  updateHeader();
}

function ensureM32Powered() {
  if (state.m32.consoleOn) return true;
  logEvent("A mesa está desligada; este comando ainda não responde.", "warning");
  return false;
}

function toggleMicConnection() {
  if (state.m32.consoleOn || state.m32.leftSpeakerOn || state.m32.rightSpeakerOn) {
    addMistake("m32-live-patch", "Ligação do microfone feita com equipamento alimentado. Era mais seguro ligar antes.", 1);
  }
  state.m32.micConnected = !state.m32.micConnected;
  logEvent(state.m32.micConnected ? "Microfone ligado à entrada local 1." : "Microfone desligado.", state.m32.micConnected ? "good" : "warning");
  recordAction("m32-mic");
  updateM32();
}

function toggleOutputConnection(side) {
  const key = side === "left" ? "leftConnected" : "rightConnected";
  const speakerKey = side === "left" ? "leftSpeakerOn" : "rightSpeakerOn";
  if (state.m32[speakerKey]) {
    addMistake("m32-hot-output", `Cabo da coluna ${side === "left" ? "esquerda" : "direita"} alterado com a coluna ligada.`, 2);
  }
  state.m32[key] = !state.m32[key];
  logEvent(
    state.m32[key]
      ? `Main ${side === "left" ? "L" : "R"} ligado à coluna ${side === "left" ? "esquerda" : "direita"}.`
      : `Cabo da coluna ${side === "left" ? "esquerda" : "direita"} desligado.`,
    state.m32[key] ? "good" : "warning",
  );
  recordAction(`m32-${side}-cable`);
  updateM32();
}

function toggleM32Power() {
  if (state.m32.consoleOn) {
    if (state.m32.leftSpeakerOn || state.m32.rightSpeakerOn) {
      addMistake("m32-power-off-order", "A mesa foi desligada antes das colunas. Deve desligar primeiro as colunas.", 2);
    }
    state.m32.consoleOn = false;
    logEvent("MIDAS M32 desligada.", "warning");
  } else {
    if (state.m32.leftSpeakerOn || state.m32.rightSpeakerOn) {
      addMistake("m32-power-on-order", "A mesa foi ligada com colunas já alimentadas.", 2);
    }
    if (!state.m32.channelMuted || !state.m32.mainMuted || state.m32.channelFader > -60 || state.m32.mainFader > -60) {
      addMistake("m32-unsafe-start", "A mesa foi ligada sem garantir mutes e faders em baixo.", 2);
    }
    state.m32.consoleOn = true;
    logEvent("MIDAS M32 ligada com as colunas desligadas.", "good");
  }
  recordAction("m32-power");
  updateM32();
}

function handleGain() {
  if (!ensureM32Powered()) {
    elements.gainControl.value = state.m32.gain;
    return;
  }
  state.m32.gain = Number(elements.gainControl.value);
  if (state.m32.gain > 48 && (state.m32.leftSpeakerOn || state.m32.rightSpeakerOn)) {
    addMistake("m32-high-gain-live", "Ganho excessivo com colunas ligadas: risco de realimentação.", 2);
  }
  recordAction("m32-gain");
  updateM32();
}

function togglePhantom() {
  if (!ensureM32Powered()) return;
  state.m32.phantom = !state.m32.phantom;
  if (state.m32.phantom) {
    addMistake("m32-phantom", "Activou +48 V num microfone dinâmico sem necessidade.", 2);
  } else {
    logEvent("Phantom +48 V confirmado como desligado.", "good");
  }
  recordAction("m32-phantom");
  updateM32();
}

function togglePolarity() {
  if (!ensureM32Powered()) return;
  state.m32.polarity = !state.m32.polarity;
  if (state.m32.polarity) {
    addMistake("m32-polarity", "Inverteu a polaridade sem necessidade para esta tarefa.", 1);
  }
  recordAction("m32-polarity");
  updateM32();
}

function toggleSolo() {
  if (!ensureM32Powered()) return;
  state.m32.solo = !state.m32.solo;
  logEvent(state.m32.solo ? "PFL/Solo activado no canal 1." : "PFL/Solo desactivado.", state.m32.solo ? "good" : "neutral");
  recordAction("m32-solo");
  updateM32();
}

function toggleLrAssignment() {
  if (!ensureM32Powered()) return;
  state.m32.lrAssigned = !state.m32.lrAssigned;
  logEvent(state.m32.lrAssigned ? "Canal 1 atribuído ao Main L/R." : "Canal 1 retirado do Main L/R.", state.m32.lrAssigned ? "good" : "warning");
  recordAction("m32-lr-assign");
  updateM32();
}

function toggleMute(target) {
  if (!ensureM32Powered()) return;
  const key = target === "channel" ? "channelMuted" : "mainMuted";
  const label = target === "channel" ? "canal 1" : "Main L/R";
  const willUnmute = state.m32[key];

  if (willUnmute && (!state.m32.lrAssigned || state.m32.gain < 20 || state.m32.channelFader <= -60 || state.m32.mainFader <= -60)) {
    addMistake(`m32-early-unmute-${target}`, `${label} retirado de mute antes de o caminho de sinal estar preparado.`, 1);
  }
  if (willUnmute && (!state.m32.leftSpeakerOn || !state.m32.rightSpeakerOn)) {
    logEvent(`${label} retirado de mute; ainda falta confirmar ambas as colunas.`, "warning");
  }

  state.m32[key] = !state.m32[key];
  logEvent(`${label} ${state.m32[key] ? "em mute" : "aberto"}.`, state.m32[key] ? "neutral" : "good");
  recordAction(`m32-${target}-mute`);
  updateM32();
}

function handleFader(target) {
  if (!ensureM32Powered()) {
    elements[`${target}Fader`].value = state.m32[`${target}Fader`];
    return;
  }
  const key = `${target}Fader`;
  state.m32[key] = Number(elements[key].value);
  if (state.m32[key] > 3) {
    addMistake(`m32-high-fader-${target}`, `Fader ${target === "channel" ? "do canal" : "Main"} acima de +3 dB sem necessidade.`, 1);
  }
  recordAction(`m32-${target}-fader`);
  updateM32();
}

function testMicrophone() {
  if (!ensureM32Powered()) return;
  if (!state.m32.micConnected) {
    logEvent("Não existe microfone ligado à entrada 1.", "error");
    return;
  }
  state.m32.micTested = true;
  state.m32.meterPeak = Math.min(3, -52 + state.m32.gain);

  if (!state.m32.solo) {
    addMistake("m32-no-pfl", "Testou a voz sem usar PFL/Solo para ajustar o ganho de entrada.", 1);
  }
  if (state.m32.gain < 32) {
    logEvent("Sinal demasiado baixo. Aumente gradualmente o ganho.", "warning");
  } else if (state.m32.gain > 42) {
    addMistake("m32-clip", "O medidor aproxima-se de CLIP. Reduza o ganho.", 2);
  } else {
    logEvent("Pico de voz dentro da zona segura, sem clip.", "good");
  }
  recordAction("m32-test");
  updateM32();
}

function toggleSpeaker(side) {
  const key = side === "left" ? "leftSpeakerOn" : "rightSpeakerOn";
  const connectedKey = side === "left" ? "leftConnected" : "rightConnected";
  const turningOn = !state.m32[key];

  if (turningOn) {
    if (!state.m32[connectedKey]) {
      addMistake("m32-speaker-no-cable", `Coluna ${side === "left" ? "esquerda" : "direita"} ligada sem cabo de sinal.`, 1);
    }
    if (!state.m32.consoleOn) {
      addMistake("m32-speaker-before-console", "Ligou uma coluna antes da mesa. As colunas devem ser ligadas por último.", 2);
    }
    if (!state.m32.channelMuted || !state.m32.mainMuted) {
      addMistake("m32-speaker-unmuted", "Ligou uma coluna com o canal ou Main sem mute.", 2);
    }
    state.m32[key] = true;
    logEvent(`Coluna ${side === "left" ? "esquerda" : "direita"} ligada.`, "good");
  } else {
    state.m32[key] = false;
    logEvent(`Coluna ${side === "left" ? "esquerda" : "direita"} desligada.`, "neutral");
  }
  recordAction(`m32-${side}-speaker`);
  updateM32();
}

function isM32OutputReady() {
  const m = state.m32;
  return (
    m.consoleOn &&
    m.micConnected &&
    m.leftConnected &&
    m.rightConnected &&
    m.leftSpeakerOn &&
    m.rightSpeakerOn &&
    m.lrAssigned &&
    !m.phantom &&
    !m.channelMuted &&
    !m.mainMuted &&
    m.channelFader >= -5 &&
    m.channelFader <= 3 &&
    m.mainFader >= -5 &&
    m.mainFader <= 3 &&
    m.gain >= 32 &&
    m.gain <= 40
  );
}

function getAudioState() {
  const m = state.m32;
  const fullPath =
    m.consoleOn &&
    m.micConnected &&
    m.leftConnected &&
    m.rightConnected &&
    m.leftSpeakerOn &&
    m.rightSpeakerOn &&
    m.lrAssigned &&
    !m.channelMuted &&
    !m.mainMuted &&
    m.channelFader > -60 &&
    m.mainFader > -60;

  if (!fullPath) return { type: "none", title: "SEM SINAL", detail: "O caminho de áudio ainda está incompleto." };
  if (m.gain > 45 || m.channelFader > 3 || m.mainFader > 3) {
    return { type: "feedback", title: "RISCO DE FEEDBACK", detail: "Reduza o ganho ou os faders imediatamente." };
  }
  if (m.gain < 20 || m.channelFader < -15 || m.mainFader < -15) {
    return { type: "weak", title: "SINAL FRACO", detail: "O som chega às colunas, mas o nível é insuficiente." };
  }
  m.cleanSignalSeen = true;
  return { type: "clean", title: "SOM LIMPO · L + R", detail: "Voz estável nas duas colunas, sem clip." };
}

function updateM32() {
  const m = state.m32;
  elements.micSocket.classList.toggle("connected", m.micConnected);
  elements.micSocketState.textContent = m.micConnected ? "MIC LIGADO" : "LIVRE";
  elements.mainLSocket.classList.toggle("connected", m.leftConnected);
  elements.mainRSocket.classList.toggle("connected", m.rightConnected);
  elements.leftCableState.textContent = m.leftConnected ? "Main L ligado" : "XLR desligado";
  elements.rightCableState.textContent = m.rightConnected ? "Main R ligado" : "XLR desligado";
  setPowerButton(elements.m32Power, m.consoleOn, elements.m32PowerState);

  elements.gainControl.value = m.gain;
  elements.gainControl.style.setProperty("--knob", `${(m.gain / 60) * 75}%`);
  elements.gainValue.textContent = `+${m.gain} dB`;
  elements.phantomButton.classList.toggle("active", m.phantom);
  elements.phantomButton.querySelector("small").textContent = m.phantom ? "ON" : "OFF";
  elements.polarityButton.classList.toggle("active", m.polarity);
  elements.soloButton.classList.toggle("active", m.solo);
  elements.channelLR.classList.toggle("active", m.lrAssigned);
  elements.channelMute.classList.toggle("active", m.channelMuted);
  elements.mainMute.classList.toggle("active", m.mainMuted);
  elements.channelFader.value = m.channelFader;
  elements.mainFader.value = m.mainFader;
  elements.channelFaderValue.textContent = formatDb(m.channelFader);
  elements.mainFaderValue.textContent = formatDb(m.mainFader);
  elements.m32Screen.classList.toggle("off", !m.consoleOn);

  const meterPercent = m.micTested && m.consoleOn ? Math.max(2, Math.min(100, ((m.meterPeak + 60) / 63) * 100)) : 0;
  elements.inputMeter.style.width = `${meterPercent}%`;

  setSpeakerUi("left", m.leftSpeakerOn);
  setSpeakerUi("right", m.rightSpeakerOn);

  const audio = getAudioState();
  elements.soundWave.className = "sound-wave";
  if (audio.type === "clean" || audio.type === "weak") elements.soundWave.classList.add("active");
  if (audio.type === "feedback") elements.soundWave.classList.add("active", "feedback");
  elements.audioResult.textContent = audio.title;
  elements.audioResult.style.color =
    audio.type === "clean" ? "var(--green)" : audio.type === "feedback" ? "var(--red)" : audio.type === "weak" ? "var(--amber)" : "";
  elements.audioDetail.textContent = audio.detail;

  renderM32Screen();
}

function setPowerButton(button, isOn, label) {
  button.classList.toggle("on", isOn);
  button.setAttribute("aria-pressed", String(isOn));
  label.textContent = isOn ? "ON" : "OFF";
}

function setSpeakerUi(side, isOn) {
  const button = side === "left" ? elements.leftSpeakerPower : elements.rightSpeakerPower;
  const led = side === "left" ? elements.leftSpeakerLed : elements.rightSpeakerLed;
  button.classList.toggle("on", isOn);
  button.textContent = isOn ? "POWER ON" : "POWER OFF";
  led.classList.toggle("on", isOn);
}

function formatDb(value) {
  if (value <= -90) return "−∞";
  return `${value > 0 ? "+" : ""}${value} dB`;
}

function renderM32Screen() {
  const m = state.m32;
  if (!m.consoleOn) {
    elements.m32ScreenContent.innerHTML = '<div style="display:grid;place-items:center;height:240px;font-size:10px">CONSOLE OFFLINE</div>';
    return;
  }

  if (m.page === "routing") {
    elements.m32ScreenContent.innerHTML = `
      <div class="routing-list">
        <div class="routing-row"><span>LOCAL IN 01</span><span>→</span><strong>CHANNEL 01</strong></div>
        <div class="routing-row"><span>XLR OUT 15</span><span>←</span><strong>MAIN L</strong></div>
        <div class="routing-row"><span>XLR OUT 16</span><span>←</span><strong>MAIN R</strong></div>
        <div class="routing-row"><span>CH 01 ASSIGN</span><span>→</span><strong>${m.lrAssigned ? "MAIN LR" : "NOT ASSIGNED"}</strong></div>
      </div>`;
    return;
  }

  if (m.page === "meters") {
    const width = m.micTested ? Math.max(4, Math.min(100, ((m.meterPeak + 60) / 63) * 100)) : 0;
    elements.m32ScreenContent.innerHTML = `
      <div class="screen-card" style="height:210px">
        <span>INPUT METERS · CH 01</span>
        <div style="height:24px;margin-top:70px;background:#14251d;border:1px solid #7cab94">
          <i style="display:block;width:${width}%;height:100%;background:linear-gradient(90deg,#4de19b,#edcf53,#ef5964)"></i>
        </div>
        <strong style="font-size:11px">${m.micTested ? `${m.meterPeak} dBFS PEAK` : "WAITING FOR SIGNAL"}</strong>
      </div>`;
    return;
  }

  elements.m32ScreenContent.innerHTML = `
    <div class="screen-home-grid">
      <div class="screen-card"><span>PREAMP GAIN</span><strong>+${m.gain} dB</strong></div>
      <div class="screen-card"><span>PHANTOM</span><strong>${m.phantom ? "+48 V ON" : "OFF"}</strong></div>
      <div class="screen-card"><span>MAIN ASSIGN</span><strong>${m.lrAssigned ? "L + R" : "NONE"}</strong></div>
      <div class="screen-card"><span>INPUT PEAK</span><strong>${m.micTested ? `${m.meterPeak} dB` : "—"}</strong></div>
    </div>`;
}

function toggleDmx() {
  if (state.etc.fixturesOn) {
    addMistake("etc-hot-dmx", "Alterou a ligação DMX com os projectores alimentados.", 1);
  }
  state.etc.dmxConnected = !state.etc.dmxConnected;
  logEvent(state.etc.dmxConnected ? "DMX OUT 1 ligado aos projectores." : "Cabo DMX desligado.", state.etc.dmxConnected ? "good" : "warning");
  recordAction("etc-dmx");
  updateEtc();
}

function toggleFixturePower() {
  const turningOn = !state.etc.fixturesOn;
  if (turningOn && !state.etc.dmxConnected) {
    addMistake("etc-fixture-no-dmx", "Projectores alimentados antes de ligar o cabo DMX.", 1);
  }
  if (turningOn && !state.etc.blackout && state.etc.grandmaster > 0) {
    addMistake("etc-live-start", "Projectores alimentados sem Blackout e com Grandmaster aberto.", 2);
  }
  state.etc.fixturesOn = turningOn;
  logEvent(`Projectores ${turningOn ? "alimentados" : "desligados"}.`, turningOn ? "good" : "neutral");
  recordAction("etc-fixture-power");
  updateEtc();
}

function toggleEtcPower() {
  if (state.etc.consoleOn) {
    if (state.etc.fixturesOn) {
      addMistake("etc-power-off-order", "Console desligada antes dos projectores.", 1);
    }
    state.etc.consoleOn = false;
    state.etc.mode = "offline";
    logEvent("ETC Element desligada.", "warning");
  } else {
    if (!state.etc.blackout || state.etc.grandmaster !== 0) {
      addMistake("etc-unsafe-power", "Console ligada sem Blackout activo e Grandmaster a 0%.", 2);
    }
    state.etc.consoleOn = true;
    state.etc.mode = "live";
    logEvent("ETC Element ligada em modo Live.", "good");
  }
  recordAction("etc-power");
  updateEtc();
}

function handleGrandmaster() {
  if (!state.etc.consoleOn) {
    elements.grandmaster.value = state.etc.grandmaster;
    logEvent("A console está desligada.", "warning");
    return;
  }
  state.etc.grandmaster = Number(elements.grandmaster.value);
  if (state.etc.grandmaster > 0 && !state.etc.blackout && !state.etc.dmxConnected) {
    addMistake("etc-master-no-dmx", "Grandmaster aberto sem ligação DMX confirmada.", 1);
  }
  recordAction("etc-grandmaster");
  updateEtc();
}

function toggleBlackout() {
  if (!state.etc.consoleOn) {
    logEvent("A console está desligada.", "warning");
    return;
  }
  const removingBlackout = state.etc.blackout;
  if (removingBlackout && (!state.etc.dmxConnected || !state.etc.fixturesOn || state.etc.grandmaster < 100)) {
    addMistake("etc-early-blackout", "Blackout retirado antes de DMX, projectores e Grandmaster estarem preparados.", 1);
  }
  state.etc.blackout = !state.etc.blackout;
  logEvent(`Blackout ${state.etc.blackout ? "activo" : "retirado"}.`, state.etc.blackout ? "neutral" : "good");
  recordAction("etc-blackout");
  updateEtc();
}

function setEtcMode(mode) {
  if (!state.etc.consoleOn) {
    logEvent("A console está desligada.", "warning");
    return;
  }
  state.etc.mode = mode;
  logEvent(`Modo ${mode === "live" ? "Live" : "Blind"} seleccionado.`, mode === "live" ? "good" : "neutral");
  recordAction(`etc-${mode}`);
  updateEtc();
}

function handleEtcKey(key) {
  if (!state.etc.consoleOn) {
    logEvent("A ETC Element está desligada.", "warning");
    return;
  }

  if (key === "Clear") {
    state.etc.commandTokens = [];
    logEvent("Linha de comando limpa.", "neutral");
  } else if (key === "Enter") {
    executeEtcCommand();
  } else {
    state.etc.commandTokens.push(key);
  }
  recordAction(`etc-key-${key}`);
  updateEtc();
}

function executeEtcCommand() {
  const tokens = state.etc.commandTokens;
  const command = normalizeCommandTokens(tokens).join(" ");
  let executed = false;

  const rangeMatch = command.match(/^(\d+) Thru (\d+) At (\d+)$/);
  const singleMatch = command.match(/^(\d+) At (\d+)$/);
  const recordMatch = command.match(/^Record Cue (\d+)$/);
  const goOutMatch = command.match(/^GoToCue Out$/);

  if (rangeMatch) {
    const start = Number(rangeMatch[1]);
    const end = Number(rangeMatch[2]);
    const level = Math.min(100, Number(rangeMatch[3]));
    if (state.etc.mode !== "live") {
      addMistake("etc-levels-blind", "Níveis definidos fora do modo Live.", 1);
    }
    for (let channel = start; channel <= end; channel += 1) {
      if (channel >= 1 && channel <= 4) state.etc.levels[channel - 1] = level;
    }
    logEvent(`Canais ${start} a ${end} colocados a ${level}%.`, level === 70 && start === 1 && end === 4 ? "good" : "warning");
    executed = true;
  } else if (singleMatch) {
    const channel = Number(singleMatch[1]);
    const level = Math.min(100, Number(singleMatch[2]));
    if (channel >= 1 && channel <= 4) {
      state.etc.levels[channel - 1] = level;
      logEvent(`Canal ${channel} colocado a ${level}%.`, "neutral");
      executed = true;
    }
  } else if (recordMatch) {
    const cueNumber = Number(recordMatch[1]);
    state.etc.cues[cueNumber] = [...state.etc.levels];
    state.etc.currentCue = cueNumber;
    logEvent(`Cue ${cueNumber} gravada com os níveis actuais.`, cueNumber === 1 && state.etc.levels.every((level) => level === 70) ? "good" : "warning");
    if (cueNumber !== 1 || !state.etc.levels.every((level) => level === 70)) {
      addMistake("etc-wrong-cue", "A cue foi gravada com número ou níveis diferentes do pedido.", 1);
    }
    executed = true;
  } else if (goOutMatch) {
    state.etc.levels = [0, 0, 0, 0];
    state.etc.currentCue = "Out";
    state.etc.goToOutDone = true;
    logEvent("Palco colocado em Cue Out antes da reprodução.", "good");
    executed = true;
  } else if (/^\d+ Thru \d+ At Full$/.test(command)) {
    const parts = command.match(/^(\d+) Thru (\d+) At Full$/);
    for (let channel = Number(parts[1]); channel <= Number(parts[2]); channel += 1) {
      if (channel >= 1 && channel <= 4) state.etc.levels[channel - 1] = 100;
    }
    logEvent("Canais colocados a Full (100%).", "warning");
    executed = true;
  }

  if (!executed && command) {
    addMistake("etc-invalid-command", `Comando não reconhecido: ${formatCommand(tokens)} ENTER.`, 1);
  }
  state.etc.commandTokens = [];
}

function playNextCue() {
  if (!state.etc.consoleOn) {
    logEvent("A ETC Element está desligada.", "warning");
    return;
  }
  if (!state.etc.cues[1]) {
    addMistake("etc-go-no-cue", "Premiu GO sem ter a Cue 1 gravada.", 1);
    return;
  }
  if (!state.etc.goToOutDone) {
    addMistake("etc-go-without-out", "Premiu GO sem retirar primeiro a luz actual através de Go To Cue Out.", 1);
  }
  state.etc.levels = [...state.etc.cues[1]];
  state.etc.currentCue = 1;
  state.etc.cuePlayed = true;
  logEvent("GO: Cue 1 reproduzida no palco.", "good");
  recordAction("etc-go");
  updateEtc();
}

function handleKeyboard(event) {
  if (!state.running || state.currentStation !== "etc" || elements.helpDialog.open || elements.pauseDialog.open) return;
  if (/^[0-9]$/.test(event.key)) {
    handleEtcKey(event.key);
  } else if (event.key === "Enter") {
    handleEtcKey("Enter");
  } else if (event.key === "Escape" || event.key === "Backspace") {
    handleEtcKey("Clear");
  }
}

function normalizeCommandTokens(tokens) {
  return tokens.reduce((normalized, token) => {
    const previous = normalized[normalized.length - 1];
    if (/^\d$/.test(token) && /^\d+$/.test(previous || "")) {
      normalized[normalized.length - 1] = `${previous}${token}`;
    } else {
      normalized.push(token);
    }
    return normalized;
  }, []);
}

function updateEtc() {
  const e = state.etc;
  elements.dmxSocket.classList.toggle("connected", e.dmxConnected);
  elements.dmxSocketState.textContent = e.dmxConnected ? "LIGADO" : "DESLIGADO";
  setPowerButton(elements.fixturePower, e.fixturesOn, elements.fixturePowerState);
  setPowerButton(elements.etcPower, e.consoleOn, elements.etcPowerState);
  elements.dmxIndicator.classList.toggle("active", e.dmxConnected && e.fixturesOn && e.consoleOn);
  elements.stageStatusText.textContent =
    e.dmxConnected && e.fixturesOn && e.consoleOn ? "DMX ONLINE" : e.dmxConnected ? "DMX SEM SAÍDA" : "SEM DMX";

  elements.grandmaster.value = e.grandmaster;
  elements.grandmasterValue.textContent = `${e.grandmaster}%`;
  elements.blackoutButton.classList.toggle("active", e.blackout);
  elements.blackoutButton.querySelector("small").textContent = e.blackout ? "ACTIVE" : "OFF";
  elements.liveButton.classList.toggle("active", e.mode === "live");
  elements.blindButton.classList.toggle("active", e.mode === "blind");
  elements.etcModeLabel.textContent = e.consoleOn ? e.mode.toUpperCase() : "CONSOLE OFFLINE";
  document.querySelector(".etc-display").classList.toggle("off", !e.consoleOn);

  e.levels.forEach((level, index) => {
    document.getElementById(`channel${index + 1}Level`).textContent = level;
    const cell = document.querySelector(`[data-fixture="${index + 1}"]`);
    cell.classList.toggle("active", level > 0);
  });

  const stageLevels = calculateVisibleLightLevels();
  elements.lightBeams.querySelectorAll("i").forEach((beam, index) => {
    beam.style.opacity = stageLevels[index] / 100;
  });

  elements.commandLine.textContent = `Comando: ${formatCommand(e.commandTokens)}`;
  renderCueList();
}

function calculateVisibleLightLevels() {
  const e = state.etc;
  if (!e.consoleOn || !e.fixturesOn || !e.dmxConnected || e.blackout || e.mode !== "live") {
    return [0, 0, 0, 0];
  }
  const masterScale = (e.grandmaster / 100) * (e.playbackMaster / 100);
  return e.levels.map((level) => level * masterScale);
}

function formatCommand(tokens) {
  return normalizeCommandTokens(tokens)
    .map((token) => {
      if (token === "At") return "@";
      if (token === "GoToCue") return "GO TO CUE";
      return token.toUpperCase();
    })
    .join(" ");
}

function renderCueList() {
  const cues = Object.keys(state.etc.cues);
  if (cues.length === 0) {
    elements.cueList.innerHTML = "<p><span>—</span><strong>Sem cues gravadas</strong><small>—</small></p>";
    return;
  }
  elements.cueList.innerHTML = cues
    .map((number) => {
      const levels = state.etc.cues[number];
      const current = Number(number) === state.etc.currentCue ? "current" : "";
      return `<p class="${current}"><span>${number}</span><strong>Cue ${number}</strong><small>CH 1–4: ${levels.join("/")}%</small></p>`;
    })
    .join("");
}

function validateCurrentTask() {
  if (state.currentStation === "m32") {
    validateM32();
  } else {
    validateEtc();
  }
}

function validateM32() {
  const audio = getAudioState();
  const valid =
    isM32OutputReady() &&
    state.m32.micTested &&
    state.m32.routingViewed &&
    audio.type === "clean" &&
    isCompleteSetupReadyFor("m32");
  if (!valid) {
    addMistake("m32-failed-validation", "Validação pedida antes de a tarefa de som estar correctamente concluída.", 1);
    if (state.mode !== "exam") {
      const missing = getMissingM32Items();
      logEvent(`Falta: ${missing.join("; ")}.`, "warning");
    }
    return;
  }

  state.completed.m32 = true;
  logEvent("Tarefa MIDAS M32 validada: som limpo nas duas colunas.", "good");
  updateAll();
  window.setTimeout(() => switchStation("etc"), 500);
}

function getMissingM32Items() {
  const m = state.m32;
  const missing = [];
  if (!m.micConnected) missing.push("ligar o microfone");
  if (!m.leftConnected || !m.rightConnected) missing.push("ligar Main L e R");
  if (!m.consoleOn) missing.push("ligar a mesa");
  if (m.phantom) missing.push("desligar +48 V");
  if (!m.lrAssigned) missing.push("atribuir o canal ao Main L/R");
  if (!m.routingViewed) missing.push("confirmar o routing");
  if (!m.micTested) missing.push("testar a voz");
  if (m.gain < 32 || m.gain > 40) missing.push("ajustar o ganho");
  if (m.channelFader < -5 || m.channelFader > 3 || m.mainFader < -5 || m.mainFader > 3) missing.push("colocar os faders perto de 0 dB");
  if (m.channelMuted || m.mainMuted) missing.push("retirar os mutes");
  if (!m.leftSpeakerOn || !m.rightSpeakerOn) missing.push("ligar as duas colunas");
  if (!isCompleteSetupReadyFor("m32")) missing.push("confirmar o plano dos três microfones e do phantom");
  return missing;
}

function validateEtc() {
  const e = state.etc;
  const valid =
    e.consoleOn &&
    e.fixturesOn &&
    e.dmxConnected &&
    e.mode === "live" &&
    e.grandmaster === 100 &&
    !e.blackout &&
    e.cuePlayed &&
    e.currentCue === 1 &&
    e.levels.every((level) => level === 70) &&
    e.cues[1]?.every((level) => level === 70) &&
    isCompleteSetupReadyFor("etc");

  if (!valid) {
    addMistake("etc-failed-validation", "Validação pedida antes de a tarefa de iluminação estar correctamente concluída.", 1);
    if (state.mode !== "exam") {
      const missing = getMissingEtcItems();
      logEvent(`Falta: ${missing.join("; ")}.`, "warning");
    }
    return;
  }

  state.completed.etc = true;
  logEvent("Tarefa ETC Element validada: Cue 1 reproduzida correctamente.", "good");
  updateAll();
  finishSimulation();
}

function getMissingEtcItems() {
  const e = state.etc;
  const missing = [];
  if (!e.dmxConnected) missing.push("ligar DMX");
  if (!e.fixturesOn) missing.push("alimentar os projectores");
  if (!e.consoleOn) missing.push("ligar a console");
  if (e.mode !== "live") missing.push("seleccionar Live");
  if (e.grandmaster !== 100) missing.push("Grandmaster a 100%");
  if (e.blackout) missing.push("retirar Blackout");
  if (!e.cues[1]) missing.push("gravar a Cue 1");
  if (!e.goToOutDone) missing.push("executar Go To Cue Out");
  if (!e.cuePlayed) missing.push("premir GO");
  if (!e.levels.every((level) => level === 70)) missing.push("confirmar canais 1 a 4 a 70%");
  if (!isCompleteSetupReadyFor("etc")) missing.push("confirmar cadeia, endereços DMX e inspecção final");
  return missing;
}

function resetCurrentStation() {
  state.resets += 1;
  if (state.currentStation === "m32") {
    resetM32();
    state.completed.m32 = false;
    logEvent("Posto MIDAS M32 reiniciado.", "warning");
  } else {
    resetEtc();
    state.completed.etc = false;
    logEvent("Posto ETC Element reiniciado.", "warning");
  }
  if (state.mode !== "practice") {
    addMistake("station-reset", "Foi necessário reiniciar o posto.", 1);
  }
  updateAll();
}

function showHelp() {
  state.hintsUsed += 1;
  const station = state.currentStation;
  elements.helpTitle.textContent = station === "m32" ? "Comandos da MIDAS M32" : "Comandos da ETC Element";
  elements.helpContent.innerHTML = helpData[station]
    .map(([title, description]) => `<article class="help-item"><strong>${title}</strong><p>${description}</p></article>`)
    .join("");
  elements.helpDialog.showModal();

  if (state.mode === "exam") {
    addMistake("help-in-exam", "Consultou a identificação de comandos durante a simulação oficial.", 1);
  }
}

function finishSimulation() {
  clearInterval(state.timerId);
  state.running = false;
  elements.pauseButton.disabled = true;

  const scores = calculateScores();
  saveBestScore(scores.total);
  renderResults(scores);

  window.setTimeout(() => {
    elements.simulatorScreen.classList.add("hidden");
    elements.resultsScreen.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 450);
}

function calculateScores() {
  const severeMistakes = state.mistakes.filter((mistake) => mistake.severity >= 2).length;
  const minorMistakes = state.mistakes.filter((mistake) => mistake.severity === 1).length;
  const failedValidations = state.mistakes.filter((mistake) => mistake.code.includes("failed-validation")).length;
  const invalidCommands = state.mistakes.filter((mistake) => mistake.code === "etc-invalid-command").length;

  let comprehension = 5;
  comprehension -= failedValidations * 0.35;
  comprehension -= invalidCommands * 0.2;
  comprehension -= state.resets * 0.4;
  if (!state.completed.m32) comprehension -= 2.5;
  if (!state.completed.etc) comprehension -= 2.5;

  let quality = 5;
  quality -= severeMistakes * 0.45;
  quality -= minorMistakes * 0.15;
  if (!state.m32.cleanSignalSeen) quality -= 1.5;
  if (!state.etc.cuePlayed) quality -= 1.5;

  let knowledge = 5;
  knowledge -= severeMistakes * 0.55;
  knowledge -= minorMistakes * 0.2;
  if (state.mode === "exam") knowledge -= state.hintsUsed * 0.25;

  let speed = 5;
  if (state.elapsed >= 18 * 60) speed = 4;
  if (state.elapsed >= 20 * 60) speed = 3;
  if (state.elapsed >= 23 * 60) speed = 2;
  if (state.elapsed >= 26 * 60) speed = 1;
  if (state.elapsed >= 30 * 60) speed = 0;
  if (state.mode === "practice") speed = 5;

  const rounded = {
    comprehension: clampScore(comprehension),
    quality: clampScore(quality),
    speed: clampScore(speed),
    knowledge: clampScore(knowledge),
  };
  rounded.total = rounded.comprehension + rounded.quality + rounded.speed + rounded.knowledge;
  return rounded;
}

function clampScore(score) {
  return Math.round(Math.max(0, Math.min(5, score)) * 10) / 10;
}

function renderResults(scores) {
  const passed = scores.total >= 9.5;
  const excellent = scores.total >= 17;
  const timeText = state.mode === "practice" ? "modo de prática livre" : `${formatTime(state.elapsed)} de execução`;

  elements.resultTitle.textContent = excellent ? "Desempenho de nível máximo" : passed ? "Prova concluída" : "É necessário repetir";
  elements.resultSummary.textContent = `Resultado estimado com ${timeText}. A nota é calculada pelos quatro critérios oficiais, com 5 valores em cada critério.`;
  elements.finalScore.textContent = scores.total.toFixed(1);
  elements.resultVerdict.textContent = excellent ? "MUITO BOM" : passed ? "APROVADO" : "A REVER";
  elements.resultVerdict.style.color = excellent ? "var(--green)" : passed ? "var(--amber)" : "var(--red)";

  const criteria = [
    ["Compreensão da tarefa", scores.comprehension],
    ["Qualidade", scores.quality],
    ["Celeridade", scores.speed],
    ["Conhecimentos", scores.knowledge],
  ];
  elements.criteriaResults.innerHTML = criteria
    .map(
      ([label, score]) => `
        <div class="criterion-result">
          <strong>${label}</strong>
          <div class="score-bar"><i style="width:${(score / 5) * 100}%"></i></div>
          <b>${score.toFixed(1)}/5</b>
        </div>`,
    )
    .join("");

  const strengths = [];
  const improvements = [];
  if (state.completed.m32) strengths.push("Conseguiu obter voz limpa nas duas colunas através do Main L/R.");
  if (state.completed.etc) strengths.push("Programou, gravou e reproduziu correctamente a Cue 1.");
  if (scores.speed === 5) strengths.push("Concluiu dentro do limite de 18 minutos para celeridade máxima.");
  if (!state.mistakes.some((mistake) => mistake.severity >= 2)) strengths.push("Não realizou nenhuma acção com risco técnico elevado.");

  const mistakeMessages = [...new Set(state.mistakes.map((mistake) => mistake.message))];
  improvements.push(...mistakeMessages.slice(0, 5));
  if (improvements.length === 0) improvements.push("Repetir em modo oficial para consolidar a sequência sem pistas.");
  if (scores.speed < 5) improvements.push("Repetir a sequência até concluir correctamente em menos de 18 minutos.");

  elements.strengthsList.innerHTML = strengths.map((item) => `<li>${item}</li>`).join("");
  elements.improvementsList.innerHTML = improvements.map((item) => `<li>${item}</li>`).join("");
}

function saveBestScore(score) {
  const current = Number(localStorage.getItem("cmc-simulator-best") || 0);
  if (score > current) localStorage.setItem("cmc-simulator-best", score.toFixed(1));
}

initialize();
