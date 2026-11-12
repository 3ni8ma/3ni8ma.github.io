(() => {
  const output = document.getElementById("output");
  const form = document.getElementById("terminal-form");
  const input = document.getElementById("command");
  const root = document.documentElement;

  if (!output || !form || !input) return;

  const prompt = "aarush@3ni8ma:~$";
  const storageKey = "aarush-theme";

  const pages = {
    home: "index.html",
    index: "index.html",
    projects: "projects.html",
    terminal: "terminal.html"
  };

  const commands = [
    "help",
    "about",
    "work",
    "projects",
    "contact",
    "photo",
    "open",
    "cd",
    "theme",
    "confetti",
    "clear",
    "ls",
    "whoami",
    "date",
    "echo",
    "exit"
  ];

  function print(text, className) {
    const line = document.createElement("div");
    line.className = "line" + (className ? " " + className : "");
    line.textContent = text || "\u00a0";
    output.appendChild(line);
    return line;
  }

  function printLines(lines, className) {
    for (const text of lines) print(text, className);
  }

  function printLink(prefix, label, href, suffix) {
    const line = document.createElement("div");
    line.className = "line";

    if (prefix) line.append(document.createTextNode(prefix));

    const link = document.createElement("a");
    link.href = href;
    link.textContent = label;
    if (href.startsWith("http")) {
      link.target = "_blank";
      link.rel = "noopener";
    }
    line.append(link);

    if (suffix) line.append(document.createTextNode(suffix));

    output.appendChild(line);
    return line;
  }

  function echo(raw) {
    const line = document.createElement("div");
    line.className = "line";

    const promptSpan = document.createElement("span");
    promptSpan.className = "accent";
    promptSpan.textContent = prompt;

    line.append(promptSpan, document.createTextNode(" " + raw));
    output.appendChild(line);
  }

  function scrollToBottom() {
    output.scrollTop = output.scrollHeight;
  }

  function setTheme(mode) {
    try {
      if (mode === "system") localStorage.removeItem(storageKey);
      else localStorage.setItem(storageKey, mode);
    } catch (error) {
      /* Storage can be unavailable; the theme still changes for this page. */
    }

    if (mode === "system") delete root.dataset.theme;
    else root.dataset.theme = mode;
  }

  function run(raw) {
    echo(raw);

    const trimmed = raw.trim();
    if (!trimmed) {
      scrollToBottom();
      return;
    }

    const parts = trimmed.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      case "help":
        printLines([
          "Pages",
          "  home      index.html",
          "  projects  projects.html",
          "  terminal  terminal.html",
          "",
          "Commands",
          "  help              show this list",
          "  about             who I am",
          "  work              selected projects",
          "  contact           email and links",
          "  photo             the photo on the home page",
          "  open <page>       go to a page",
          "  theme <mode>      dark, light, or system",
          "  confetti          make a mess",
          "  clear             clear the screen",
          "  exit              back to the site"
        ]);
        break;

      case "about":
        printLines([
          "Aarush Karak",
          "Grade 10 student at John Fraser Secondary School.",
          "Founder of TheCoderBros.",
          "",
          "Interests: spatial computing, AI, and developer tools.",
          "Based in Mississauga, Ontario."
        ]);
        break;

      case "work":
      case "projects":
        print("Selected projects");
        printLink("  HELIOS           ", "helios-psi-three.vercel.app", "https://helios-psi-three.vercel.app");
        printLink("  astro-tasks      ", "pypi.org/project/astro-tasks", "https://pypi.org/project/astro-tasks/");
        printLink("  Finance Hub      ", "github.com/3ni8ma/Finance-Hub", "https://github.com/3ni8ma/Finance-Hub");
        printLink("  Knowledge-Globe  ", "knowledge-globe.vercel.app", "https://knowledge-globe.vercel.app");
        print("");
        printLink("  All projects     ", "projects.html", "projects.html");
        break;

      case "contact":
        printLink("  email      ", "worldshaans@gmail.com", "mailto:worldshaans@gmail.com");
        printLink("  github     ", "github.com/3ni8ma", "https://github.com/3ni8ma");
        printLink("  linkedin   ", "linkedin.com/in/aarush-karak-260257321", "https://www.linkedin.com/in/aarush-karak-260257321");
        printLink("  dev.to     ", "dev.to/3ni8ma", "https://dev.to/3ni8ma");
        break;

      case "photo":
        print("Opening me.jpg...");
        window.open("me.jpg", "_blank", "noopener");
        break;

      case "open":
      case "cd": {
        const target = (args[0] || "").toLowerCase().replace(/\.html$/, "");

        if (!target) {
          print("usage: open <home|projects|terminal>");
          break;
        }

        if (target === "terminal") {
          print("You are already here.");
          break;
        }

        if (pages[target]) {
          print("Opening " + pages[target] + "...");
          window.location.href = pages[target];
        } else {
          print('No such page: ' + args[0] + ". Try home, projects, or terminal.", "dim");
        }
        break;
      }

      case "theme": {
        const mode = (args[0] || "").toLowerCase();

        if (!mode) {
          print("Current theme: " + (root.dataset.theme || "system"));
          break;
        }

        if (!["dark", "light", "system"].includes(mode)) {
          print("usage: theme <dark|light|system>");
          break;
        }

        setTheme(mode);
        print("Theme set to " + mode + ".");
        break;
      }

      case "confetti":
        if (window.burstConfetti) window.burstConfetti();
        print("Confetti. You asked for it.");
        break;

      case "clear":
        output.replaceChildren();
        break;

      case "ls":
        printLines([
          "index.html",
          "projects.html",
          "terminal.html",
          "me.jpg",
          "styles.css",
          "script.js",
          "terminal.js"
        ]);
        break;

      case "whoami":
        print("aarush");
        break;

      case "date":
        print(new Date().toString());
        break;

      case "echo":
        print(args.join(" "));
        break;

      case "exit":
        print("Closing terminal...");
        window.location.href = "index.html";
        break;

      case "sudo":
        print("aarush is not in the sudoers file. This incident has been reported.", "dim");
        break;

      default:
        print('command not found: ' + parts[0] + '. Type "help".', "dim");
    }

    scrollToBottom();
  }

  const history = [];
  let historyIndex = 0;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const value = input.value;
    if (value.trim()) {
      history.push(value.trim());
      historyIndex = history.length;
    }

    run(value);
    input.value = "";
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (historyIndex > 0) {
        historyIndex -= 1;
        input.value = history[historyIndex];
      }
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex < history.length - 1) {
        historyIndex += 1;
        input.value = history[historyIndex];
      } else {
        historyIndex = history.length;
        input.value = "";
      }
    } else if (event.key === "Tab") {
      event.preventDefault();

      const value = input.value.trim().toLowerCase();
      if (!value) return;

      const matches = commands.filter((command) => command.startsWith(value));

      if (matches.length === 1) {
        input.value = matches[0] + " ";
      } else if (matches.length > 1) {
        print(matches.join("  "), "dim");
        scrollToBottom();
      }
    }
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest("a")) return;
    if (!event.target.closest(".terminal")) return;
    if (window.getSelection().toString()) return;
    input.focus();
  });

  if (window.matchMedia("(pointer: fine)").matches) input.focus();
})();
