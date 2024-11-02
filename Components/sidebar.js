import { html, LitElement, css } from 'lit-element'

class SidebarComponent extends LitElement {
	static get properties() {
		return {
			isOpen: { type: Boolean, reflect: true },
		}
	}

	static get styles() {
		return css`
			.sidebar {
				height: 100%;
				width: 0;
				position: fixed;
				z-index: 1;
				top: 0;
				left: 0;
				background-color: #111;
				overflow-x: hidden;
				transition: 0.5s;
				padding-top: 60px;
			}

			.sidebar a {
				padding: 8px 8px 8px 32px;
				text-decoration: none;
				font-size: 25px;
				color: #818181;
				display: block;
				transition: 0.3s;
			}

			.sidebar a:hover {
				color: #f1f1f1;
			}

			.sidebar .closebtn {
				position: absolute;
				top: 0;
				right: 25px;
				font-size: 36px;
				margin-left: 50px;
			}

			.openbtn {
				font-size: 20px;
				cursor: pointer;
				background-color: #111;
				color: white;
				padding: 10px 15px;
				border: none;
			}

			.openbtn:hover {
				background-color: #444;
			}

			#main {
				transition: margin-left 0.5s;
				padding: 16px;
			}

			@media screen and (max-height: 450px) {
				.sidebar {
					padding-top: 15px;
				}
				.sidebar a {
					font-size: 18px;
				}
			}
		`
	}

	constructor() {
		super()
		this.isOpen = false
	}

	openSidebar() {
		this.isOpen = true
		this.requestUpdate()
	}

	closeSidebar() {
		this.isOpen = false
		this.requestUpdate()
	}

	render() {
		return html`
			<div class="sidebar" ?open="${this.isOpen}">
				<a href="javascript:void(0)" class="closebtn" @click="${this.closeSidebar}">&times;</a>
				<a href="#">About</a>
				<a href="#">Services</a>
				<a href="#">Clients</a>
				<a href="#">Contact</a>
			</div>
			<div id="main">
				<button class="openbtn" @click="${this.openSidebar}">☰ Open Sidebar</button>
				<h2>Collapsed Sidebar</h2>
				<p>Click on the hamburger menu/bar icon to open the sidebar, and push this content to the right.</p>
			</div>
		`
	}
}

customElements.define('sidebar', SidebarComponent)
