import { events } from "./events.js";
import { dispatch } from "./dispatch.js";
import { html } from "./uhtml.js";
import { getURLPath } from "./getURLPath.js";

function removeParam(key) {
  const url = new URL(window.location);
  url.searchParams.delete(key);
  window.history.pushState({}, null, url);
}

export function initSandbox(templateAddress) {
	const sandbox = document.querySelector(".iframe-sandbox");

	const string = `
		<style>
			body {
				margin: 0px;
			}
		</style>
		<script defer type="module">
			import evalUserCode from "${templateAddress}";

			window.onmessage = function(e) {
        const { data } = e;
        const { program } = data;

        try {
        	evalUserCode(program);
        } catch (err) {
        	e.source.postMessage(err, e.origin);
        }
      };
		</script>
		<body></body>
	`

	const blob = new Blob([string], { type: 'text/html' });
	sandbox.src = URL.createObjectURL(blob);
}

async function loadFromS3(id) {

  const url = `https://project-bucket-hackclub.s3.eu-west-1.amazonaws.com/${id}.json`;
  const saved = await fetch(url, { mode: "cors" }).then((r) => r.json());

  return JSON.stringify(saved);
}

const DEFAULT_FILE = getURLPath("/templates/turtle-template.json");

export function init(state) {

	const search = window.location.search;
	const params = new URLSearchParams(search);
	const vert = params.get("vert");
	const id = params.get("id");
	const file = params.get("file") ?? DEFAULT_FILE;

	// const template = params.get("template");
	// const documentation = params.get("documentation");
	// const code = params.get("code");

	if (vert) document.documentElement.style.setProperty("--vertical-bar", `${vert}%`);

	// if (template) {
	// 	state.template = template;
	// 	// removeParam("template");
	// }

	// if (documentation) {
	// 	state.documentation = documentation;
	// 	dispatch("SET_DOCUMENTATION", { address: documentation });
	// 	// removeParam("documentation");
	// }

	// if (code) { // fetch code file?
	// 	const string = state.codemirror.view.state.doc.toString();
	// 	state.codemirror.view.dispatch({
	// 		changes: { from: 0, to: string.length, insert: program }
	// 	});
	// }

	dispatch("RENDER");
	state.codemirror = document.querySelector("#code-editor");

	if (state.template !== "") initSandbox(state.template);

	events(state);

	if (id) {

		(async () => {
			const stateString = await loadFromS3(id);

			dispatch("SET_SAVE_STATE", { stateString });
		})();
		
	} else { // if file then load from url

    fetch(file,  {mode: 'cors'})
			.then( file => file
			.text()
			.then( txt => {
			    dispatch("SET_SAVE_STATE", { stateString: txt });

			    // should I auto-run, can be nice but also good to give user chance to see code
			}));

		
	}

	const saved = window.localStorage.getItem("live-editor-templates");
	
	if (saved) { // give option to load saved in notification
		dispatch("NOTIFICATION", { message: html`
			You have a file cached would you like to 
			<button @click=${() => dispatch("SET_SAVE_STATE", { stateString: saved })}>load it</button>.
		`});

		// helpful during dev
		// dispatch("SET_SAVE_STATE", { stateString: saved });
	}

}












	