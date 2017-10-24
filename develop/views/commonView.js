"use strict";
import Block from "../blocks/block/block.js";

import EventBus from "../modules/eventBus"

export default class CommonView extends Block {
	constructor(blocks) {
		const view = document.createElement("section");
		const attrs = {
				"display": "flex",
				"flex-direction": "column",
				"align-items": "center",
				"justify-content": "center",
			};


		super(view);

		this.elements = blocks;

		for (const attr in attrs) {
			this.el.style.setProperty(attr, attrs[attr]);
		}

		for (const block in this.elements) {
			this.append(this.elements[block]);
		}

	}

	show() {
		this.el.style.setProperty("display", "flex");
	}

	hide() {
		this.el.style.setProperty("display", "none");
	}
}

