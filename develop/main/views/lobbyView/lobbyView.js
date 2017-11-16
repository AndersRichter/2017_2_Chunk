'use strict';
import View from '../view/view';
import lobbyFields from './__lobbyFields/lobbyView__lobbyFields';
import LobbyGameData from './__lobbyFields/__gameDataField/lobbyView__lobbyFields__gameDataField';
import WebSocket from '../../modules/webSocket';
import eventBus from '../../modules/eventBus';


/**
 * Класс секции меню
 * @module LoginView
 */
export default class LobbyView extends View {
	constructor() {
		super(lobbyFields);
		this.fields = lobbyFields;
		this.bus = eventBus;
		this.el.classList.add('lobbyView');
		this.gameList = {};
		this.fields.createGame.on('click', () => {
			this.bus.emit('openCreateGameBanner');
		});
		this.bus.on('openCreateGameBanner', () => {
			this.el.classList.add('lobbyView_filter-smooth');
		});
		this.bus.on('closeCreateGameBanner', () => {
			this.el.classList.remove('lobbyView_filter-smooth');
		});
		this.bus.on('socketCode106', (data) => {
			this.addGameNode(data.game);
		});
		this.bus.on('socketCode110', (socketReceiveData) => {
			debugger;
			this.removeGameNode(socketReceiveData.gameID);
		});
		this.bus.on('socketCode111', (data) => {
			debugger;
			data.games.forEach((gameData) => {
				this.addGameNode(gameData);
			});
		});
		this.bus.on('socketClose', () => {
			delete this.webSocket;
			for (const gameID in this.gameList) {
				this.removeGameNode(gameID);
			}
		});
		this.hide();
		// this.bus.on('closeCreateGameBanner', () => {
		// 	this.el.classList.remove('lobbyView_filter-smooth');
		// })
	};


	show() {
		super.show();
		this.el.classList.remove('lobbyView_filter-smooth');
		if (!this.webSocket)
			this.webSocket = new WebSocket();
	}



	addGameNode(data) {
		const lobbyGameData = new LobbyGameData(data);
		this.gameList[data.gameID] = lobbyGameData;
		this.elements.gameList.append(lobbyGameData);
	}


	removeGameNode(gameID) {
		const lobbyGameData = this.gameList[gameID];
		delete this.gameList[gameID];
		this.elements.gameList.remove(lobbyGameData);
	}


	updateGameNode(data) {
		const lobbyGameData = this.gameList[data.gameID];
		lobbyGameData.updateGameData(data);
	}
}
