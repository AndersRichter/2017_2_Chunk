"use strict";

import ScoreboardTemplate from "../templates/scoreBoard";
import CommonView from "./commonView";


export default class ScoreboardView extends CommonView {
	constructor(EventBus, UserService) {
		super();

		this.bus = EventBus;
		// this.userService = UserService;

		this.bus.on("openScoreboard", () => {
			const users = [
				{name: "Igor", score: "1904"},
				{name: "Nina", score: "2015"},
				{name: "Lesha", score: "2001"}];
			this.update(users);
			this.show();
		})
	}

	update(users = []) {
		console.log('Scoreboard.update', users[0]);
		this.clear();
		const scoreboardTemplate = new ScoreboardTemplate();
		this.el.innerHTML = scoreboardTemplate.template({users});
	}
}