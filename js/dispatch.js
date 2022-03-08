import { html, render, svg } from "./uhtml.js";
import { view } from "./view.js";
import { init, initSandbox } from "./init.js";
import { saveToS3 } from "./saveToS3.js";
import marked from "./marked.js";

function copy(str) {
	const inp = document.createElement('input');
	document.body.appendChild(inp);
	inp.value = str;
	inp.select();
	document.execCommand('copy', false);
	inp.remove();
}

function showShared() {
	document.querySelector(".shared-modal").classList.toggle("hide");
  setTimeout(() => document.querySelector(".shared-modal").classList.toggle("hide"), 3000);
}


const STATE = {
	codemirror: undefined,
	template: "",
	documentation: "",
	language: "javascript", // TODO: implement this, js by default
	// examples: [],
	notifications: [],
	error: false,
	logs: [],
	name: "name-here",
	version: "0.0.1",
};


window.addEventListener("message", e => {
	console.error(e.data);

	const location = e.data.stack.match(/<anonymous>:(.+)\)/);
	let line = null;
	let col = null;

	if (location) {
		let lineCol = location[1].split(":").map(Number);
		line = lineCol[0] - 2;
		col = lineCol[1];
	}

	const msg = line && col 
		? `${e.data.message} on line ${line} in column ${col}`
		: e.data.message

	STATE.error = true;
	STATE.logs = [...STATE.logs, msg];
	dispatch("RENDER");

	const cmLines = document.querySelectorAll(".cm-line");

	for (let i = 0; i < cmLines.length; i++) {
		if (!line || i+1 !== line) continue;

		const cmLine = cmLines[i];

		cmLine.style.background = "#ecb2b2";
	}
});


const ACTIONS = {
	INIT(args, state) {
		init(state);
	},
	RUN(args, state) {
		STATE.error = false;
		STATE.logs = [];

		const cmLines = document.querySelectorAll(".cm-line");
		for (let i = 0; i < cmLines.length; i++) {
			const cmLine = cmLines[i];

			cmLine.style.background = "";
		}

		const program = state.codemirror.view.state.doc.toString();

		const sandbox = document.querySelector(".iframe-sandbox");
		sandbox.contentWindow.postMessage({ program }, '*');

		dispatch("RENDER");

	},
	SHARE: async function ({type}, state) {
		const string = state.codemirror.view.state.doc.toString();

		// TODO: share with aws link
		const link = await saveToS3(dispatch("GET_SAVE_STATE"));

		const scrapbookLink = `https://hack.af/share?link=${link}`

		copy(link);
		dispatch("NOTIFICATION", {
			message: html`
				A sharing link has been copied to your clipboard.
				<button style="padding: 0px 10px;" @click=${() => copy(link)}>Click here to recopy.</button> 
				<br/>
				<a target="_blank" href=${scrapbookLink}>Click here to share your project to scrapbook.</a>
			`,
			open: true
		})
	},
	GET_SAVE_STATE(args, state) {
		const string = state.codemirror.view.state.doc.toString();

		const stateString = JSON.stringify({
			name: state.name,
			version: state.version,
			program: string,
			documentation: state.documentation,
			template: state.template,
		})

		return stateString;
	},
	SET_SAVE_STATE({ stateString }, state) {
		const stateObj = JSON.parse(stateString);

		console.log("setting state to", stateObj);

		const { name, program, documentation, template, version, programAddress } = stateObj;

		state.name = name ?? state.name;
		// state.version = version ?? state.version; // shouldn't set version, should prompt to switch
		state.template = template; 

		initSandbox(state.template);

		if (programAddress) { // link supersedes program text
			fetch(programAddress)
				.then(res => res.text())
				.then(program => {
					const string = state.codemirror.view.state.doc.toString();
					state.codemirror.view.dispatch({
						changes: { from: 0, to: string.length, insert: program }
					});
				});
		} else {
			const string = state.codemirror.view.state.doc.toString();
			state.codemirror.view.dispatch({
				changes: { from: 0, to: string.length, insert: program }
			});
		}


		dispatch("SET_DOCUMENTATION", { address: documentation });
	},
	SET_DOCUMENTATION: async ({ address }, state) => {
		state.documentation = address;
		const res = await fetch(address);
		const text = await res.text();
		const convertedMd = marked(text);
		const doc = document.querySelector(".documentation");
  	doc.innerHTML = convertedMd;

  	dispatch("RENDER")
	},
	DOWNLOAD: function(args, state) {
		const string = state.codemirror.view.state.doc.toString();
		downloadText(`${state.name}.json`, dispatch("GET_SAVE_STATE"));
	},
	DOCS(args, state) {
		const docs = document.querySelector(".docs");
  	docs.classList.toggle("hide-docs");
	},
	NOTIFICATION({ message, timeout, open }, state) {
		state.notifications = [message, ...state.notifications];

    dispatch("RENDER");

    // open the docs bar for timeout time
    const docs = document.querySelector(".docs");

    if (open) docs.classList.remove("hide-docs");

    if (timeout) {
	    docs.classList.remove("hide-docs");
	    setTimeout(() => {
	    	docs.classList.add("hide-docs");
	    }, timeout)
    };

  },
	RENDER() {
		render(document.getElementById("root"), view(STATE));
	}
}

export function dispatch(action, args = {}) {

	const trigger = ACTIONS[action];
	if (trigger) return trigger(args, STATE);
	else console.log("Action not recongnized:", action);
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: "text/plain" });

  var link = document.createElement("a"); // Or maybe get it from the current document
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}`;
  link.click();
  URL.revokeObjectURL(link);
}
