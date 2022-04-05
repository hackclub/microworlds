import { html } from "../libs/uhtml.js"
import "../libs/codemirror/codemirror-js.js";
import "../libs/codemirror/codemirror-plain.js";
import { dispatch } from "./dispatch.js";
import { getURLPath } from "./getURLPath.js";

const fileName = state => html`
	<input
		class="menu-option" 
		style="flex: 2; margin-right: 5px;"
		type="text" 
		.placeholder=${state.name} 
		@keyup=${e => { 
      		state.name = e.target.value === "" ? "name-here" : e.target.value 
    }}>
  </input>
`

const renderDocs = state => html`
	<style>
		.docs {
      position: absolute;
      box-sizing: border-box;
      height: 100%;
      width: 60%;
      right: 0px;
      top: 0px;
      background: white;
      z-index: 20;
      padding: 10px;
      overflow: scroll;
      transition: right 1s ease-in-out;
    }

    .hide-docs {
      right: -60%;
    }

    .close-docs {
      position: fixed;
      right: 10px;
      top: 10px;
      padding: 0px 10px;
    }

    .hide-docs .close-docs {
      display: none;
    }

    .docs pre {
      overflow: scroll;
    }

    .docs code {
      white-space: break-spaces;
    }

    .docs img {
      max-width: 300px;
      max-height: 300px;
    }
	</style>
	<div class="docs hide-docs">
		<button class="close-docs" @click=${() => dispatch("DOCS")}>close</button>
		<h3>Notifications:</h3>
		<div class="notification-container">
      ${Object.values(state.notifications).map(
        (x) => html` <div class="shared-modal">${x}</div> `
      )}
    </div>
    <h3>Documentation:</h3>
    <div class="documentation"></div>
	</div>
`

function renderMicros(state) {
  return state.micros.length > 0 ? html`
    <style>
      .micros-container {
        position: absolute;
        left: 50%;
        transform: translate(-50%, 0);
        top: 25%;
        z-index: 99;
        display: flex;
        flex-direction: column;
        align-items: center;
        background: #ffffff3d;
        padding: var(--spacing-3);
      }

      .micros-container .card {
        margin: 5px;
        color: var(--primary);
        padding: var(--spacing-3);
      }
    </style>
    <div class="micros-container card">
      <h1>Pick a MicroWorld!</h1>
      <div style="display: flex;">
        ${state.micros.map(micro => html`
            <a href=${getURLPath(`?file=${micro}`)} class="card">${micro}</a>
          `)}
      </div>
      <h4 style="margin: var(--spacing-3)">Or create your own <a href="https://github.com/hackclub/micros" target="_blank">here</a>.</h4>
    </div>
  ` : ""
}

export function view(state) {
	return html`
		<div class="left-pane">
			<codemirror-js id="code-editor"></codemirror-js>
			<div class=${["log", state.error ? "error" : "", state.logs.length === 0 ? "shrink" : ""].join(" ")}>
				${state.logs.map(x => html`<div>${JSON.stringify(x)}</div>`)}
			</div>
			<div class="menu">
				${fileName(state)}
				<button class="menu-option menu-button" @click=${() => dispatch("DOWNLOAD")}>
					download
					<span class="tooltip">dowload file</span>
				</button>
				<button class="menu-option menu-button" @click=${() => dispatch("SHARE")}>
					share
					<span class="tooltip">get a sharing link</span>
				</button>
				<button class="menu-option menu-button" @click=${() => dispatch("DOCS")}>
					docs
					<span class="tooltip">show documentation</span>
				</button>
				<button class="menu-option menu-button" @click=${() => dispatch("RUN")}>
					run
					<span class="tooltip">run program (shift+enter)</span>
				</button>
			</div>
		</div>
		<div class="right-pane">
			<iframe class="iframe-sandbox" sandbox></iframe>
		</div>
		<div id="vertical-bar"></div>
		${renderDocs(state)}
    ${renderMicros(state)}
	`
}

