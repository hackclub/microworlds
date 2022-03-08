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
	
const DEFAULT_FILE = "";

export function init(state) {

	const search = window.location.search;
	const params = new URLSearchParams(search);
	const vert = params.get("vert");
	const id = params.get("id");
	let file = params.get("file") ?? DEFAULT_FILE;

	if (vert) document.documentElement.style.setProperty("--vertical-bar", `${vert}%`);

	dispatch("RENDER");
	state.codemirror = document.querySelector("#code-editor");

	if (state.template !== "") initSandbox(state.template);

	events(state);

	if (id) {

		(async () => {
			const stateString = await loadFromS3(id);

			dispatch("SET_SAVE_STATE", { stateString });
		})();
		
	} else if (file !== "") { // if file then load from url

		if (!file.startsWith("http")) file = `https://micros.hackclub.dev/${file}/${file}.json`;

    fetch(file,  { mode: 'cors' })
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
			<button style="padding: 0px 10px;" @click=${() => dispatch("SET_SAVE_STATE", { stateString: saved })}>load it</button>.
		`});

		// helpful during dev
		// dispatch("SET_SAVE_STATE", { stateString: saved });
	}

}












	