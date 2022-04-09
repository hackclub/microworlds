import { events } from "./events.js";
import { dispatch } from "./dispatch.js";
import { html } from "../libs/uhtml.js";
import { micros } from "../micros/micros.js";

function removeParam(key) {
  const url = new URL(window.location);
  url.searchParams.delete(key);
  window.history.pushState({}, null, url);
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

	events(state);

	if (id) { // TODO: fix this

		(async () => {
			const stateString = await loadFromS3(id);

			dispatch("SET_SAVE_STATE", { stateObj: JSON.parse(stateString) });
		})();
		
	} else if (file !== "") {

		dispatch("SET_SAVE_STATE", { stateObj: { micro: file } });

	} else { // load menu
		state.micros = micros;
		dispatch("RENDER");
	}

	const saved = window.localStorage.getItem("live-editor-templates");
	
	if (saved) { // give option to load saved in notification
		dispatch("NOTIFICATION", { message: html`
			You have a file cached would you like to 
			<button style="padding: 0px 10px;" @click=${() => dispatch("SET_SAVE_STATE", { stateObj: JSON.parse(saved) })}>load it</button>.
		`});

		// helpful during dev
		// dispatch("SET_SAVE_STATE", { stateString: saved });
	}

}












	