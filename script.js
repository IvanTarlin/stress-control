document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("is-open", !expanded);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.matchMedia("(max-width: 859px)").matches) {
          nav.classList.remove("is-open");
          navToggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  document.querySelectorAll(".flip-card").forEach((card) => {
    card.addEventListener("click", () => {
      const pressed = card.getAttribute("aria-pressed") === "true";
      card.setAttribute("aria-pressed", String(!pressed));
    });
  });

  const revealElements = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealElements.forEach((element) => revealObserver.observe(element));

  const quizQuestions = [
    {
      text: "Как часто за последние две недели вы чувствовали напряжение в плечах и шее?",
      options: [
        { label: "Почти каждый день", score: 3 },
        { label: "Несколько раз в неделю", score: 2 },
        { label: "Редко", score: 1 },
        { label: "Не чувствовал(а)", score: 0 }
      ]
    },
    {
      text: "Насколько трудно вам было засыпать или просыпаться отдохнувшим(ей)?",
      options: [
        { label: "Почти всегда трудно", score: 3 },
        { label: "Часто", score: 2 },
        { label: "Иногда", score: 1 },
        { label: "Проблем нет", score: 0 }
      ]
    },
    {
      text: "Как часто вы ловили себя на мысли, что не справитесь с делами?",
      options: [
        { label: "Постоянно", score: 3 },
        { label: "Часто", score: 2 },
        { label: "Иногда", score: 1 },
        { label: "Почти никогда", score: 0 }
      ]
    },
    {
      text: "Бывало ли, что из-за напряжения вы откладывали важные задачи?",
      options: [
        { label: "Да, регулярно", score: 3 },
        { label: "Несколько раз", score: 2 },
        { label: "Редко", score: 1 },
        { label: "Нет", score: 0 }
      ]
    },
    {
      text: "Как часто вы раздражались из-за мелочей?",
      options: [
        { label: "Почти каждый день", score: 3 },
        { label: "Пару раз в неделю", score: 2 },
        { label: "Редко", score: 1 },
        { label: "Не раздражался(ась)", score: 0 }
      ]
    },
    {
      text: "Чувствовали ли вы, что у вас нет времени на отдых?",
      options: [
        { label: "Да, постоянно", score: 3 },
        { label: "Часто", score: 2 },
        { label: "Иногда", score: 1 },
        { label: "Нет, отдых есть", score: 0 }
      ]
    }
  ];

  const quizStage = document.querySelector("[data-quiz-stage]");
  const quizProgress = document.querySelector("[data-quiz-progress]");
  const quizProgressText = document.querySelector("[data-quiz-progress-text]");

  let quizIndex = 0;
  let quizScore = 0;

  function updateQuizProgress() {
    if (!quizProgress || !quizProgressText) return;
    const value = Math.min(quizIndex, quizQuestions.length);
    quizProgress.style.width = `${(value / quizQuestions.length) * 100}%`;
    quizProgressText.textContent =
      quizIndex >= quizQuestions.length
        ? "Готово"
        : `Вопрос ${quizIndex + 1} из ${quizQuestions.length}`;
  }

  function renderQuizQuestion() {
    if (!quizStage) return;
    quizStage.replaceChildren();
    updateQuizProgress();

    if (quizIndex >= quizQuestions.length) {
      renderQuizResult();
      return;
    }

    const question = quizQuestions[quizIndex];
    const title = document.createElement("h3");
    title.textContent = question.text;

    const optionsWrap = document.createElement("div");
    optionsWrap.className = "quiz-options";

    question.options.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "quiz-option";
      button.textContent = option.label;
      button.addEventListener("click", () => {
        if (button.disabled) return;
        optionsWrap.querySelectorAll(".quiz-option").forEach((item) => {
          item.disabled = true;
        });
        button.classList.add("is-selected");
        quizScore += option.score;
        window.setTimeout(() => {
          quizIndex += 1;
          renderQuizQuestion();
        }, 240);
      });
      optionsWrap.append(button);
    });

    quizStage.append(title, optionsWrap);
  }

  function renderQuizResult() {
    if (!quizStage) return;
    quizStage.replaceChildren();
    updateQuizProgress();

    let level;
    let description;
    let tips;

    if (quizScore <= 6) {
      level = "Низкий уровень напряжения";
      description = "Похоже, вы неплохо справляетесь с нагрузкой. Продолжайте замечать свои потребности и беречь восстановление.";
      tips = [
        "Сохраняйте привычный режим сна и движения.",
        "Оставляйте в неделе хотя бы один час без задач.",
        "Поддерживайте контакты с людьми, с которыми спокойно."
      ];
    } else if (quizScore <= 12) {
      level = "Средний уровень напряжения";
      description = "Напряжение уже заметно. Стоит добавить регулярные паузы и посмотреть, какие задачи можно упростить.";
      tips = [
        "Практикуйте дыхание 4–4–6 один-два раза в день.",
        "Разделите крупные задачи на шаги по 25 минут.",
        "Проверьте, не урезали ли вы сон ради дел."
      ];
    } else {
      level = "Высокий уровень напряжения";
      description = "Суммарный балл высокий. Это повод внимательнее отнестись к себе и, при возможности, обсудить состояние со специалистом.";
      tips = [
        "Сделайте короткую дыхательную паузу прямо сейчас.",
        "Найдите человека, которому можно рассказать о нагрузке.",
        "Обратитесь к школьному или вузовскому психологу."
      ];
    }

    const scoreLabel = document.createElement("p");
    scoreLabel.className = "quiz-result-score";
    scoreLabel.textContent = `Сумма баллов: ${quizScore} из 18`;

    const title = document.createElement("h3");
    title.className = "quiz-result-title";
    title.textContent = level;

    const text = document.createElement("p");
    text.className = "quiz-result-text";
    text.textContent = description;

    const list = document.createElement("ul");
    list.className = "quiz-result-tips";
    tips.forEach((tip) => {
      const item = document.createElement("li");
      item.textContent = tip;
      list.append(item);
    });

    const restartButton = document.createElement("button");
    restartButton.type = "button";
    restartButton.className = "button button-primary";
    restartButton.textContent = "Пройти заново";
    restartButton.addEventListener("click", () => {
      quizIndex = 0;
      quizScore = 0;
      renderQuizQuestion();
    });

    quizStage.append(scoreLabel, title, text, list, restartButton);
  }

  renderQuizQuestion();

  const breathVisual = document.querySelector("[data-breath-visual]");
  const breathPhase = document.querySelector("[data-breath-phase]");
  const breathCountdown = document.querySelector("[data-breath-countdown]");
  const breathCycles = document.querySelector("[data-breath-cycles]");
  const breathToggle = document.querySelector("[data-breath-toggle]");
  const breathReset = document.querySelector("[data-breath-reset]");

  const breathPhases = [
    { name: "Вдох", key: "inhale", duration: 4 },
    { name: "Задержка", key: "hold", duration: 4 },
    { name: "Выдох", key: "exhale", duration: 6 }
  ];

  let breathTimer = null;
  let breathRunning = false;
  let breathPhaseIndex = 0;
  let breathRemaining = 0;
  let breathCycleCount = 0;

  function updateBreathDisplay() {
    if (!breathVisual || !breathPhase || !breathCountdown) return;
    const phase = breathPhases[breathPhaseIndex];
    breathVisual.dataset.phase = phase.key;
    breathPhase.textContent = phase.name;
    breathCountdown.textContent = String(Math.ceil(breathRemaining));
  }

  function advanceBreathPhase() {
    if (breathPhaseIndex < breathPhases.length - 1) {
      breathPhaseIndex += 1;
      breathRemaining = breathPhases[breathPhaseIndex].duration;
      updateBreathDisplay();
      return;
    }

    breathCycleCount += 1;
    if (breathCycles) breathCycles.textContent = String(breathCycleCount);
    breathPhaseIndex = 0;
    breathRemaining = breathPhases[0].duration;
    updateBreathDisplay();
  }

  function tickBreath() {
    breathRemaining -= 0.1;
    if (breathRemaining <= 0) {
      advanceBreathPhase();
      return;
    }
    if (breathCountdown) breathCountdown.textContent = String(Math.ceil(breathRemaining));
  }

  function startBreathTimer() {
    breathRunning = true;
    if (breathToggle) breathToggle.textContent = "Пауза";
    if (breathTimer) window.clearInterval(breathTimer);
    breathTimer = window.setInterval(tickBreath, 100);
  }

  function pauseBreathTimer() {
    breathRunning = false;
    if (breathToggle) breathToggle.textContent = "Продолжить";
    if (breathTimer) {
      window.clearInterval(breathTimer);
      breathTimer = null;
    }
  }

  function resetBreathing() {
    if (breathTimer) {
      window.clearInterval(breathTimer);
      breathTimer = null;
    }
    breathRunning = false;
    breathPhaseIndex = 0;
    breathRemaining = 0;
    breathCycleCount = 0;
    if (breathCycles) breathCycles.textContent = "0";
    if (breathToggle) breathToggle.textContent = "Начать практику";
    if (breathVisual) breathVisual.dataset.phase = "idle";
    if (breathPhase) breathPhase.textContent = "Готовы?";
    if (breathCountdown) breathCountdown.textContent = "—";
  }

  if (breathToggle) {
    breathToggle.addEventListener("click", () => {
      if (breathRunning) {
        pauseBreathTimer();
        return;
      }

      if (breathRemaining === 0) {
        breathPhaseIndex = 0;
        breathRemaining = breathPhases[0].duration;
      }

      updateBreathDisplay();
      startBreathTimer();
    });
  }

  if (breathReset) {
    breathReset.addEventListener("click", resetBreathing);
  }

  const scenarioData = [
    {
      title: "Вечер пятницы",
      text: "Вы вернулись после насыщенной недели. Завтра важная контрольная, а сил почти нет.",
      options: [
        {
          label: "Сесть за конспекты до полуночи",
          points: 2,
          feedback: "Вы выполнили часть задач, но сон сократился. Утром будет сложнее сосредоточиться."
        },
        {
          label: "Полчаса прогулки, затем 45 минут конспектов и сон",
          points: 0,
          feedback: "Движение снизило напряжение, а ограниченное время помогло сфокусироваться."
        },
        {
          label: "Отложить всё и весь вечер смотреть сериал",
          points: 3,
          feedback: "Отдых нужен, но без плана тревога о завтрашнем дне только вырастет."
        }
      ]
    },
    {
      title: "Утро перед контрольной",
      text: "Вы проснулись с ощущением тревоги. До выхода осталось сорок минут.",
      options: [
        {
          label: "Проверить соцсети, чтобы отвлечься",
          points: 2,
          feedback: "Отвлечение сработало ненадолго: время ушло, а напряжение осталось."
        },
        {
          label: "Сделать дыхание 4–4–6 и повторить ключевые тезисы",
          points: 0,
          feedback: "Дыхание снизило физиологическое возбуждение, и вы смогли сосредоточиться на главном."
        },
        {
          label: "Выпить третью чашку кофе и выбежать без завтрака",
          points: 3,
          feedback: "Кофеин добавил тревожности, а голод усилил ощущение спешки."
        }
      ]
    },
    {
      title: "После контрольной",
      text: "Работа сдана, но вы всё ещё прокручиваете в голове возможные ошибки.",
      options: [
        {
          label: "Прокручивать каждый ответ ещё два часа",
          points: 2,
          feedback: "Разбор ошибок полезен, но двухчасовое самобичевание только истощает."
        },
        {
          label: "Записать один вывод на будущее и переключиться",
          points: 0,
          feedback: "Вы сделали вывод без самокритики и дали себе завершить эпизод."
        },
        {
          label: "Решить, что всё провалено, и отменить планы",
          points: 3,
          feedback: "Катастрофизация усилила стресс и лишила вас возможности отдохнуть."
        }
      ]
    }
  ];

  const scenarioCard = document.querySelector("[data-scenario]");
  const scenarioStep = document.querySelector("[data-scenario-step]");
  const scenarioTitle = document.querySelector("[data-scenario-title]");
  const scenarioText = document.querySelector("[data-scenario-text]");
  const scenarioOptions = document.querySelector("[data-scenario-options]");
  const scenarioFeedback = document.querySelector("[data-scenario-feedback]");
  const scenarioNext = document.querySelector("[data-scenario-next]");

  let scenarioIndex = 0;
  let scenarioPoints = 0;

  function renderScenarioStep() {
    if (!scenarioCard) return;
    const step = scenarioData[scenarioIndex];

    if (!step) {
      renderScenarioResult();
      return;
    }

    if (scenarioStep) {
      scenarioStep.textContent = `Шаг ${scenarioIndex + 1} из ${scenarioData.length}`;
    }
    if (scenarioTitle) scenarioTitle.textContent = step.title;
    if (scenarioText) scenarioText.textContent = step.text;

    if (scenarioOptions) {
      scenarioOptions.replaceChildren();
      step.options.forEach((option) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "option-button";
        button.textContent = option.label;
        button.addEventListener("click", () => {
          if (button.disabled) return;
          scenarioOptions.querySelectorAll(".option-button").forEach((item) => {
            item.disabled = true;
          });
          scenarioPoints += option.points;
          if (scenarioFeedback) {
            scenarioFeedback.hidden = false;
            scenarioFeedback.textContent = option.feedback;
          }
          if (scenarioNext) scenarioNext.hidden = false;
        });
        scenarioOptions.append(button);
      });
    }

    if (scenarioFeedback) {
      scenarioFeedback.hidden = true;
      scenarioFeedback.textContent = "";
    }
    if (scenarioNext) scenarioNext.hidden = true;
  }

  function renderScenarioResult() {
    if (!scenarioCard) return;
    if (scenarioStep) scenarioStep.textContent = "Завершение";
    if (scenarioTitle) scenarioTitle.textContent = "Ваш итог";

    let message;
    if (scenarioPoints <= 1) {
      message = "Вы сделали выбор в пользу восстановления и конкретных шагов. Такой подход снижает напряжение и сохраняет силы.";
    } else if (scenarioPoints <= 4) {
      message = "Вы чередовали отдых и дело, но иногда напряжение брало верх. Попробуйте заранее планировать короткие паузы.";
    } else {
      message = "Сценарий показал, как легко уйти в тревогу или откладывание. Это не приговор: навыки саморегуляции тренируются.";
    }

    if (scenarioText) {
      scenarioText.textContent = `Сумма баллов: ${scenarioPoints}. ${message}`;
    }
    if (scenarioOptions) scenarioOptions.replaceChildren();
    if (scenarioFeedback) {
      scenarioFeedback.hidden = true;
      scenarioFeedback.textContent = "";
    }
    if (scenarioNext) {
      scenarioNext.hidden = false;
      scenarioNext.textContent = "Начать заново";
      scenarioNext.onclick = () => {
        scenarioIndex = 0;
        scenarioPoints = 0;
        scenarioNext.onclick = null;
        renderScenarioStep();
      };
    }
  }

  if (scenarioNext) {
    scenarioNext.addEventListener("click", () => {
      if (scenarioIndex < scenarioData.length) {
        scenarioIndex += 1;
        renderScenarioStep();
      }
    });
  }

  renderScenarioStep();

  const checklist = document.querySelector("[data-checklist]");
  const checklistProgress = document.querySelector("[data-checklist-progress]");
  const checklistText = document.querySelector("[data-checklist-text]");

  function updateChecklistProgress() {
    if (!checklist) return;
    const inputs = checklist.querySelectorAll(".checklist-input");
    const checked = checklist.querySelectorAll(".checklist-input:checked").length;
    const total = inputs.length;

    if (checklistProgress) {
      checklistProgress.style.width = `${(checked / total) * 100}%`;
    }
    if (checklistText) {
      checklistText.textContent = `Отмечено ${checked} из ${total}`;
    }
  }

  if (checklist) {
    checklist.addEventListener("change", (event) => {
      if (event.target.classList.contains("checklist-input")) {
        updateChecklistProgress();
      }
    });
    updateChecklistProgress();
  }

  const feedbackForm = document.querySelector("[data-feedback-form]");
  const feedbackStatus = document.querySelector("[data-feedback-status]");

  function setFieldError(name, message) {
    const element = document.querySelector(`[data-error-for="${name}"]`);
    if (element) element.textContent = message;
  }

  function clearFieldErrors() {
    document.querySelectorAll("[data-error-for]").forEach((element) => {
      element.textContent = "";
    });
    if (feedbackStatus) feedbackStatus.textContent = "";
  }

  function sanitizeText(value) {
    return value.replace(/[<>]/g, "").trim();
  }

  if (feedbackForm) {
    feedbackForm.addEventListener("submit", (event) => {
      event.preventDefault();
      clearFieldErrors();

      const nameInput = feedbackForm.elements.name;
      const emailInput = feedbackForm.elements.email;
      const messageInput = feedbackForm.elements.message;
      const consentInput = feedbackForm.elements.consent;

      const nameValue = sanitizeText(nameInput.value);
      const emailValue = sanitizeText(emailInput.value);
      const messageValue = sanitizeText(messageInput.value);
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      let isValid = true;

      if (nameValue.length < 2) {
        setFieldError("name", "Укажите имя не короче 2 символов");
        isValid = false;
      }

      if (!emailPattern.test(emailValue)) {
        setFieldError("email", "Введите корректный адрес почты");
        isValid = false;
      }

      if (messageValue.length < 10) {
        setFieldError("message", "Сообщение должно содержать не менее 10 символов");
        isValid = false;
      }

      if (!consentInput.checked) {
        setFieldError("consent", "Нужно согласие на обработку данных");
        isValid = false;
      }

      if (!isValid) return;

      if (feedbackStatus) {
        feedbackStatus.textContent = `Спасибо, ${nameValue}. Сообщение проверено и не отправлено на сервер.`;
      }
      feedbackForm.reset();
    });
  }

  const privacyDialog = document.getElementById("privacy-dialog");

  document.querySelectorAll("[data-dialog-open]").forEach((button) => {
    button.addEventListener("click", () => {
      if (privacyDialog && typeof privacyDialog.showModal === "function") {
        privacyDialog.showModal();
      }
    });
  });

  document.querySelectorAll("[data-dialog-close]").forEach((button) => {
    button.addEventListener("click", () => {
      if (privacyDialog) privacyDialog.close();
    });
  });

  const yearElement = document.querySelector("[data-current-year]");
  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }
});