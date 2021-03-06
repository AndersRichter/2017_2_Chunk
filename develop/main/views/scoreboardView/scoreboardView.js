'use strict';

import ScoreboardTemplate from '../../templates/scoreBoard';
import View from '../view/view';


/**
 * Класс секции таблицы лидеров
 * @module ScoreboardView
 */
export default class ScoreboardView extends View {
	/**
	 * @param EventBus
	 * @param UserService
	 * @constructor
	 */
	constructor(EventBus, UserService) {
		super({});

		this.bus = EventBus;

		this.bus.on('openScoreboard', () => {
			const users = [
				{name: 'Igor', score: '1904'},
				{name: 'Sasha', score: '2010'}];
			this.update(users);
			this.show();
		});

		this.hide();
	}


	/**
	 * Обновляет таблицу лидеров
	 * @param users
	 */
	update(users = []) {
		console.log('Scoreboard.update', users[0]);
		this.clear();
		const scoreboardTemplate = new ScoreboardTemplate();
		this.el.innerHTML = scoreboardTemplate.template({users});
	}
}
