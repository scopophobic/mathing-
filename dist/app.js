(() => {
  "use strict";

  const STORE_KEY = "mathing.study.v1";

  const sessionPlans = {
    15: { read: 4, predict: 2, practice: 7, reflect: 2, problems: 1 },
    30: { read: 6, predict: 3, practice: 17, reflect: 4, problems: 2 },
    45: { read: 9, predict: 4, practice: 25, reflect: 7, problems: 3 },
    60: { read: 12, predict: 5, practice: 34, reflect: 9, problems: 3 }
  };

  const problems = [
    {
      id: "tea-coffee",
      title: "Choose the smaller world",
      difficulty: "Direct application",
      text: "A group has 20 people. Twelve drink tea and five drink both tea and coffee. If a person is chosen from the tea drinkers, what is the probability that they also drink coffee?",
      answers: [5 / 12],
      hint: "The condition is ‘chosen from the tea drinkers.’ How many people remain in the possible world?",
      solution: "There are 12 possible people after the condition is known. Five of those 12 also drink coffee, so P(coffee | tea) = 5/12."
    },
    {
      id: "die-even",
      title: "List what remains",
      difficulty: "Build the sample space",
      text: "A fair six-sided die is rolled. You are told the result is greater than 3. What is the probability that the result is even?",
      answers: [2 / 3],
      hint: "Write only the outcomes greater than 3. Then count which of those are even.",
      solution: "Knowing the result is greater than 3 leaves {4, 5, 6}. Two of these three outcomes—4 and 6—are even. The probability is 2/3."
    },
    {
      id: "cards-transfer",
      title: "Transfer the idea",
      difficulty: "Explain and calculate",
      text: "Ten cards include six blue cards. Three of the blue cards have stars. If a drawn card is known to be blue, what is the probability that it has a star?",
      answers: [1 / 2, 0.5],
      hint: "Red cards are no longer possible. Count stars only among the six blue cards.",
      solution: "The condition leaves six blue cards. Three have stars, so P(star | blue) = 3/6 = 1/2."
    }
  ];

  const topicPaths = [
    {
      title: "Foundations",
      description: "The language beneath later ideas.",
      topics: [
        ["Expressions and equations", "learning"],
        ["Functions and notation", "learning"],
        ["Graphs and slope", "not-started"],
        ["Sets and mathematical language", "not-started"]
      ]
    },
    {
      title: "Probability",
      description: "Reason clearly about uncertainty.",
      topics: [
        ["Sample spaces and events", "learning"],
        ["Conditional probability", "learning"],
        ["Random variables", "not-started"],
        ["Expectation and variance", "not-started"]
      ]
    },
    {
      title: "Linear algebra",
      description: "Understand systems, spaces, and transformations.",
      topics: [
        ["Vectors and combinations", "not-started"],
        ["Matrices and systems", "not-started"],
        ["Independence and rank", "not-started"],
        ["Eigenvalues and eigenvectors", "not-started"]
      ]
    },
    {
      title: "Calculus",
      description: "Study change, approximation, and optimization.",
      topics: [
        ["Limits and continuity", "not-started"],
        ["Derivative as change", "not-started"],
        ["Taylor approximation", "not-started"],
        ["Maxima and minima", "not-started"]
      ]
    }
  ];

  function freshState() {
    return {
      minutes: 30,
      activeStep: "read",
      completedSteps: [],
      attempts: [],
      memory: [],
      sessions: [],
      scratchpad: "",
      reflection: "",
      clarity: ""
    };
  }

  function loadState() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORE_KEY));
      return stored && typeof stored === "object"
        ? { ...freshState(), ...stored }
        : freshState();
    } catch {
      return freshState();
    }
  }

  let state = loadState();
  let currentProblem = 0;
  let toastTimer;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function saveState(message = "Saved on this device") {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
    const saveStateElement = $("#save-state");
    if (saveStateElement) {
      saveStateElement.lastChild.textContent = ` ${message}`;
    }
  }

  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }

  function localDateKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function buildSessionPlan(minutes) {
    const plan = sessionPlans[minutes] || sessionPlans[30];
    return { ...plan, total: plan.read + plan.predict + plan.practice + plan.reflect };
  }

  console.assert(
    Object.entries(sessionPlans).every(([minutes, plan]) => buildSessionPlan(Number(minutes)).total === Number(minutes)),
    "Every session plan must fit its selected time."
  );

  function updateSessionPlan(minutes) {
    const plan = buildSessionPlan(minutes);
    state.minutes = minutes;

    $$("[data-minutes]").forEach((button) => {
      button.classList.toggle("is-selected", Number(button.dataset.minutes) === minutes);
    });

    const labels = { read: "Read", predict: "Predict", practice: "Practice", reflect: "Reflect" };
    $("#session-allocation").replaceChildren(
      ...Object.keys(labels).map((key) => {
        const segment = document.createElement("span");
        segment.className = "allocation-segment";
        segment.style.flex = String(plan[key]);
        segment.textContent = `${labels[key]} ${plan[key]}`;
        return segment;
      })
    );

    Object.keys(labels).forEach((key) => {
      $(`#${key}-time`).textContent = `${plan[key]} min`;
    });
    $("#problem-total").textContent = String(plan.problems);
    saveState();
  }

  function showView(viewName) {
    $$("[data-view]").forEach((view) => {
      const active = view.dataset.view === viewName;
      view.hidden = !active;
      view.classList.toggle("is-active", active);
    });
    $$("[data-view-button]").forEach((button) => {
      const active = button.dataset.viewButton === viewName;
      button.classList.toggle("is-active", active);
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
    $("#main").focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showStep(stepName, shouldScroll = true) {
    state.activeStep = stepName;
    $$("[data-step-panel]").forEach((panel) => {
      const active = panel.dataset.stepPanel === stepName;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
    $$("[data-step]").forEach((button) => {
      const active = button.dataset.step === stepName;
      button.classList.toggle("is-active", active);
      button.classList.toggle("is-done", state.completedSteps.includes(button.dataset.step));
      if (active) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });

    const messages = {
      read: "Read slowly enough to notice when the possible world changes.",
      predict: "Commit to an idea before seeing whether it is right.",
      practice: "An incorrect answer is useful when you can name the turn that caused it.",
      reflect: "Write the explanation you would want to find here next week."
    };
    $("#margin-message").textContent = messages[stepName];
    saveState();
    if (shouldScroll && window.innerWidth < 760) $(".paper").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function markStepDone(stepName) {
    if (!state.completedSteps.includes(stepName)) state.completedSteps.push(stepName);
  }

  function setFeedback(element, message, correct) {
    element.textContent = message;
    element.className = `feedback is-visible ${correct ? "is-correct" : "is-wrong"}`;
  }

  function parseMathAnswer(raw) {
    const value = raw.trim().replace(/\s+/g, "");
    if (!value) return NaN;
    if (value.includes("/")) {
      const [top, bottom, ...rest] = value.split("/").map(Number);
      if (rest.length || !Number.isFinite(top) || !Number.isFinite(bottom) || bottom === 0) return NaN;
      return top / bottom;
    }
    return Number(value);
  }

  function sameNumber(actual, accepted) {
    return Number.isFinite(actual) && Math.abs(actual - accepted) < 0.0001;
  }

  function addMemory(item) {
    const duplicate = state.memory.some((entry) => entry.key === item.key && !entry.resolved);
    if (!duplicate) {
      state.memory.unshift({
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        created: localDateKey(),
        resolved: false,
        ...item
      });
      saveState();
      renderMemory();
    }
  }

  function renderProblem() {
    const plan = buildSessionPlan(state.minutes);
    if (currentProblem >= plan.problems) currentProblem = plan.problems - 1;
    const problem = problems[currentProblem];
    $("#problem-number").textContent = String(currentProblem + 1);
    $("#problem-total").textContent = String(plan.problems);
    $("#problem-title").textContent = problem.title;
    $("#problem-difficulty").textContent = problem.difficulty;
    $("#problem-text").textContent = problem.text;
    $("#answer-input").value = "";
    $$("input[name='confidence']").forEach((input) => { input.checked = false; });
    $("#hint-area").hidden = true;
    $("#hint-area").textContent = "";
    $("#solution-area").hidden = true;
    $("#solution-area").textContent = "";
    $("#answer-feedback").className = "feedback";
    $("#answer-feedback").textContent = "";
    $("#check-answer").hidden = false;
    $("#next-problem").hidden = true;
    $("#next-problem").textContent = currentProblem + 1 >= plan.problems ? "Reflect on the session" : "Next problem";
  }

  function checkAnswer() {
    const raw = $("#answer-input").value;
    const confidence = $("input[name='confidence']:checked")?.value;
    const feedback = $("#answer-feedback");
    const parsed = parseMathAnswer(raw);
    if (!raw.trim() || !Number.isFinite(parsed)) {
      setFeedback(feedback, "Enter a number, decimal, or fraction such as 5/12.", false);
      return;
    }
    if (!confidence) {
      setFeedback(feedback, "Choose how sure you are before checking. Confidence is part of the learning record.", false);
      return;
    }

    const problem = problems[currentProblem];
    const correct = problem.answers.some((answer) => sameNumber(parsed, answer));
    state.attempts.push({
      problemId: problem.id,
      answer: raw.trim(),
      correct,
      confidence,
      date: new Date().toISOString()
    });

    if (correct) {
      const calibration = confidence === "low"
        ? " Correct. Your answer was stronger than your confidence—keep the reasoning, not the doubt."
        : " Correct. You chose the conditional world and counted inside it.";
      setFeedback(feedback, calibration, true);
    } else {
      const calibration = confidence === "high"
        ? "This was confidently incorrect, so the underlying model deserves attention. Compare the denominator with the condition."
        : "Not yet. Identify the condition first, then list only the outcomes that remain possible.";
      setFeedback(feedback, calibration, false);
      addMemory({
        key: `mistake-${problem.id}`,
        type: "mistake",
        title: problem.title,
        note: `Answered “${raw.trim()}”. Revisit how the condition changes the denominator.`,
        topic: "Conditional probability"
      });
    }

    $("#solution-area").textContent = problem.solution;
    $("#solution-area").hidden = false;
    $("#check-answer").hidden = true;
    $("#next-problem").hidden = false;
    saveState();
  }

  function renderTopics() {
    const container = $("#topic-paths");
    container.replaceChildren(...topicPaths.map((path) => {
      const article = document.createElement("article");
      article.className = "topic-path";
      const learningCount = path.topics.filter(([, status]) => status !== "not-started").length;
      article.innerHTML = `
        <div class="topic-path-head">
          <div><h2>${path.title}</h2><p>${path.description}</p></div>
          <span class="path-progress">${learningCount} of ${path.topics.length} opened</span>
        </div>
        <div class="topic-list"></div>
      `;
      const list = $(".topic-list", article);
      path.topics.forEach(([title, status]) => {
        const row = document.createElement("div");
        row.className = `topic-row is-${status}`;
        const dot = document.createElement("i");
        dot.setAttribute("aria-hidden", "true");
        const label = document.createElement("span");
        label.textContent = title;
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = title === "Conditional probability" ? "Continue" : "Preview";
        button.addEventListener("click", () => {
          if (title === "Conditional probability") {
            showView("today");
            showStep("read");
          } else {
            showToast(`${title} is mapped. This prototype opens one complete learning loop.`);
          }
        });
        row.append(dot, label, button);
        list.append(row);
      });
      return article;
    }));
  }

  function renderMemory() {
    const activeMemory = state.memory.filter((item) => !item.resolved);
    $("#mistake-count").textContent = String(activeMemory.length);
    const list = $("#memory-list");
    list.replaceChildren();

    if (!activeMemory.length) {
      const empty = document.createElement("div");
      empty.className = "empty-memory";
      empty.innerHTML = "<strong>Your repair queue is empty.</strong><br>Wrong answers and saved doubts will appear here.";
      list.append(empty);
      $("#memory-pattern").textContent = "No pattern yet";
      $("#memory-pattern-copy").textContent = "Complete practice or save a doubt. Mathing will group related friction here.";
      return;
    }

    activeMemory.forEach((item) => {
      const row = document.createElement("article");
      row.className = "memory-item";
      row.dataset.type = item.type;
      const mark = document.createElement("i");
      mark.setAttribute("aria-hidden", "true");
      const copy = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = item.title;
      const note = document.createElement("p");
      note.textContent = item.note;
      copy.append(title, note);
      const resolve = document.createElement("button");
      resolve.type = "button";
      resolve.textContent = "Mark repaired";
      resolve.addEventListener("click", () => {
        item.resolved = true;
        saveState();
        renderMemory();
        showToast("Marked as repaired. The history remains in your local record.");
      });
      row.append(mark, copy, resolve);
      list.append(row);
    });

    const conditionalItems = activeMemory.filter((item) => item.topic === "Conditional probability");
    if (conditionalItems.length >= 2) {
      $("#memory-pattern").textContent = "Conditional worlds need attention";
      $("#memory-pattern-copy").textContent = "More than one note points to choosing the correct denominator. A short sample-space repair should come next.";
    } else {
      $("#memory-pattern").textContent = "One useful return point";
      $("#memory-pattern-copy").textContent = "Your next session can begin here before adding a new idea.";
    }
  }

  function weekdayDates() {
    const dates = [];
    const cursor = new Date();
    while (dates.length < 5) {
      if (cursor.getDay() !== 0 && cursor.getDay() !== 6) dates.unshift(new Date(cursor));
      cursor.setDate(cursor.getDate() - 1);
    }
    return dates;
  }

  function renderWeek() {
    const dates = weekdayDates();
    const dayLetters = ["S", "M", "T", "W", "T", "F", "S"];
    $("#week-dots").replaceChildren(...dates.map((date) => {
      const key = localDateKey(date);
      const done = state.sessions.some((session) => session.date === key);
      const wrapper = document.createElement("span");
      wrapper.className = `week-dot${done ? " is-done" : ""}`;
      wrapper.innerHTML = `<i></i>${dayLetters[date.getDay()]}`;
      wrapper.setAttribute("aria-label", `${date.toLocaleDateString(undefined, { weekday: "long" })}: ${done ? "studied" : "no session"}`);
      return wrapper;
    }));
    const weeklyKeys = new Set(dates.map(localDateKey));
    const minutes = state.sessions
      .filter((session) => weeklyKeys.has(session.date))
      .reduce((total, session) => total + session.minutes, 0);
    $("#week-minutes").textContent = `${minutes} min`;
  }

  function initEvents() {
    $$("[data-view-button]").forEach((button) => {
      button.addEventListener("click", () => showView(button.dataset.viewButton));
    });
    $$("[data-minutes]").forEach((button) => {
      button.addEventListener("click", () => {
        updateSessionPlan(Number(button.dataset.minutes));
        renderProblem();
      });
    });
    $$("[data-step]").forEach((button) => {
      button.addEventListener("click", () => showStep(button.dataset.step));
    });
    $$("[data-next-step]").forEach((button) => {
      button.addEventListener("click", () => {
        markStepDone(state.activeStep);
        showStep(button.dataset.nextStep);
      });
    });
    $$("[data-previous-step]").forEach((button) => {
      button.addEventListener("click", () => showStep(button.dataset.previousStep));
    });

    $("#begin-session").addEventListener("click", () => {
      showStep("read", false);
      $("#study-layout").scrollIntoView({ behavior: "smooth", block: "start" });
    });

    $("#check-prediction").addEventListener("click", () => {
      if ($("#check-prediction").dataset.ready === "true") {
        showStep("practice");
        return;
      }
      const choice = $("input[name='prediction']:checked")?.value;
      const feedback = $("#prediction-feedback");
      if (!choice) {
        setFeedback(feedback, "Choose a denominator before checking. The prediction matters more than speed.", false);
        return;
      }
      if (choice === "12") {
        setFeedback(feedback, "Exactly. Being chosen from tea drinkers makes the 12 tea drinkers the new possible world. The probability is 5/12.", true);
        markStepDone("predict");
        const button = $("#check-prediction");
        button.textContent = "Continue to practice";
        button.dataset.ready = "true";
      } else {
        setFeedback(feedback, "The condition says the person comes from the tea drinkers. Remove everyone outside that group before counting.", false);
        addMemory({
          key: "prediction-denominator",
          type: "mistake",
          title: "Choose the conditional denominator",
          note: "The condition defines the possible world before the favorable outcomes are counted.",
          topic: "Conditional probability"
        });
      }
      saveState();
    });

    $("#show-hint").addEventListener("click", () => {
      $("#hint-area").textContent = problems[currentProblem].hint;
      $("#hint-area").hidden = false;
    });
    $("#show-solution").addEventListener("click", () => {
      $("#solution-area").textContent = problems[currentProblem].solution;
      $("#solution-area").hidden = false;
      addMemory({
        key: `hint-${problems[currentProblem].id}`,
        type: "review",
        title: `Retry: ${problems[currentProblem].title}`,
        note: "The worked solution was revealed. Try a fresh version independently next time.",
        topic: "Conditional probability"
      });
    });
    $("#check-answer").addEventListener("click", checkAnswer);
    $("#answer-input").addEventListener("keydown", (event) => {
      if (event.key === "Enter") checkAnswer();
    });
    $("#next-problem").addEventListener("click", () => {
      const plan = buildSessionPlan(state.minutes);
      if (currentProblem + 1 < plan.problems) {
        currentProblem += 1;
        renderProblem();
        $(".paper").scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        markStepDone("practice");
        showStep("reflect");
      }
    });

    $("#scratchpad").addEventListener("input", (event) => {
      state.scratchpad = event.target.value;
      saveState("Saving…");
    });
    $("#reflection-input").addEventListener("input", (event) => {
      state.reflection = event.target.value;
      saveState("Saving…");
    });
    $$("input[name='clarity']").forEach((input) => {
      input.addEventListener("change", () => {
        state.clarity = input.value;
        saveState();
      });
    });

    $("#save-doubt").addEventListener("click", () => {
      const note = $("#scratchpad").value.trim();
      if (!note) {
        showToast("Write the doubt in the scratchpad first.");
        $("#scratchpad").focus();
        return;
      }
      addMemory({
        key: `doubt-${note.toLowerCase()}`,
        type: "doubt",
        title: "Open doubt",
        note,
        topic: "Conditional probability"
      });
      showToast("Doubt saved to Memory.");
    });

    $("#mark-unclear").addEventListener("click", () => {
      addMemory({
        key: "unclear-conditional-definition",
        type: "doubt",
        title: "Conditional probability note felt unclear",
        note: "Revisit the smaller-world explanation with a different visual example.",
        topic: "Conditional probability"
      });
      showToast("Marked unclear. This will return as a different explanation.");
    });

    $("#need-example").addEventListener("click", (event) => {
      if ($("#extra-example")) {
        $("#extra-example").scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      const example = document.createElement("div");
      example.id = "extra-example";
      example.className = "definition-block";
      example.innerHTML = "<span class='definition-label'>Another example</span><p>If you know a die roll is even, the possible world becomes {2, 4, 6}. The chance it is greater than 3 is therefore 2/3.</p>";
      event.currentTarget.closest(".paper-actions").before(example);
      example.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    $("#complete-session").addEventListener("click", () => {
      const reflection = $("#reflection-input").value.trim();
      const clarity = $("input[name='clarity']:checked")?.value;
      if (reflection.length < 12) {
        showToast("Write one complete thought for your future self.");
        $("#reflection-input").focus();
        return;
      }
      if (!clarity) {
        showToast("Choose how clear the idea feels now.");
        return;
      }

      const today = localDateKey();
      const existing = state.sessions.find((session) => session.date === today && session.topic === "Conditional probability");
      if (!existing) state.sessions.push({ date: today, minutes: state.minutes, topic: "Conditional probability", clarity });
      markStepDone("reflect");
      addMemory({
        key: `review-conditional-${today}`,
        type: "review",
        title: "Tomorrow: explain conditional probability",
        note: "Without looking at the formula, explain how new information changes the possible world.",
        topic: "Conditional probability"
      });
      $("#completion-card").hidden = false;
      saveState();
      renderWeek();
      showStep("reflect");
      showToast("Session complete. Your next return point is saved.");
    });

    $("#clear-memory").addEventListener("click", () => {
      state.memory = state.memory.filter((item) => !item.resolved);
      saveState();
      renderMemory();
      showToast("Resolved items cleared from this device.");
    });
  }

  function init() {
    $("#today-date").textContent = new Intl.DateTimeFormat(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric"
    }).format(new Date());
    $("#scratchpad").value = state.scratchpad;
    $("#reflection-input").value = state.reflection;
    if (state.clarity) {
      const clarity = $(`input[name='clarity'][value='${state.clarity}']`);
      if (clarity) clarity.checked = true;
    }
    initEvents();
    updateSessionPlan(Number(state.minutes) || 30);
    renderProblem();
    renderTopics();
    renderMemory();
    renderWeek();
    showStep(state.activeStep || "read", false);
  }

  init();
})();
