// Load KeyboardEvent polyfill for old browsers
keyboardeventKeyPolyfill.polyfill();

var insectEnv = Insect.initialEnvironment;
var clearCommands = ["clear", "cls", "quit", "exit"];

function updateUrlQuery(query) {
    url = new URL(window.location);
    if (query == null) {
        url.searchParams.delete('q');
    } else {
        url.searchParams.set('q', query);
    }

    history.replaceState(null, null, url);
}

function interpret(line) {
    // Skip empty lines or line comments
    var lineTrimmed = line.trim();
    if (lineTrimmed === "" || lineTrimmed[0] === "#") {
        return;
    }

    // Run insect
    var res = Insect.repl(Insect.fmtJqueryTerminal)(insectEnv)(line);
    insectEnv = res.newEnv;

    // Handle shell commands
    if (clearCommands.indexOf(res.msgType) >= 0) {
        // Clear screen:
        this.clear();
        return;
    } else if (res.msgType == "quit") {
        // Treat as reset:
        this.clear();
        insectEnv = Insect.initialEnvironment;
        return;
    } else if (res.msgType == "copy") {
        // Copy result to clipboard:
        if (res.msg == "") {
            res.msg = "\nNo result to copy.\n";
        } else {
            navigator.clipboard.writeText(res.msg);
            res.msg = "\nCopied result '" + res.msg + "' to clipboard.\n";
        }
    }

    if (res.msgType === "error") {
        ga('send', 'event', 'user-input', 'error', line);
    } else {
        ga('send', 'event', 'user-input', 'success', line);
    }

    updateUrlQuery(line);

    return res.msg;
}

function emph(str) {
    return "[[;;;hl-emphasized]" + str + "]";
}

function colored(col, str) {
    return "[[;#" + col + ";]" + str + "]";
}

var visitedBefore = localStorage.getItem("visitedBefore") === "yes";
var greeting = "";
if (!visitedBefore) {
    greeting = colored("75715E", "Welcome to insect. Type '?' if this is your first visit.");
    localStorage.setItem("visitedBefore", "yes");
} else {
    greeting = colored("75715E", "Welcome to insect. Enter '?' for help.");
}

$(document).ready(function() {
    var term = $('#terminal').terminal(interpret, {
        greetings: greeting,
        name: "terminal",
        height: 550,
        prompt: "[[;;;prompt]&gt; ]",
        // clear: false, // do not include 'clear' command
        // exit: false, // do not include 'exit' command
        checkArity: false,
        historySize: 200,
        historyFilter(line) {
            return line.trim() !== "";
        },
        completion(inp, cb) {
            var identifiers = Insect.identifiers(insectEnv);

            var keywords =
                identifiers.concat(Insect.functions(insectEnv))
                .concat(Insect.supportedUnits)
                .concat(Insect.commands);

            cb(keywords.sort());
        },
        onClear() {
            updateUrlQuery(null);
        }
    });

    // evaluate expression in query string if supplied (via opensearch)
    if (location.search) {
        var queryParams = new URLSearchParams(location.search);
        if (queryParams.has("q")) {
            term.exec(queryParams.get("q").replace(/\+/g, " "));
        }
    }
});