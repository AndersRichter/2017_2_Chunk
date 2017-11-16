'use strict';
import Block from '../../../../../blocks/block/block.js';
import ViewButton from '../../../../view/__view-button/view__view-button';


/**
 * Поля данных игры
 * @module gameDataFields
 */
export default class GameDataFields {
	constructor(data) {
		this.fields = {
			gameID: Block.Create('div', {}, ['lobbyView__lobbyFields__gameDataField__fields__gameId',
				'lobbyView__lobbyFields__gameDataField__fields'], `GameId: ${data.gameID}`),
			numberOfPlayers: Block.Create('div', {}, ['lobbyView__lobbyFields__gameDataField__fields__playersNumber',
				'lobbyView__lobbyFields__gameDataField__fields'], `Players: ${data.gamers.length}`),
			botsNumber: Block.Create('div', {}, ['lobbyView__lobbyFields__gameDataField__fields__botsNumber',
				'lobbyView__lobbyFields__gameDataField__fields'], `Bots: ${data.bots.length}`),
			totalPLayersNumber: Block.Create('div', {}, ['lobbyView__lobbyFields__gameDataField__fields__totalPLayersNumber',
				'lobbyView__lobbyFields__gameDataField__fields'], `Total players: ${data.numberOfPlayers}`),
			watchers: Block.Create('div', {}, ['lobbyView__lobbyFields__gameDataField__fields__voyeursNumber',
				'lobbyView__lobbyFields__gameDataField__fields'], `Watchers: ${data.watchers}`),
			fieldSize: Block.Create('div', {}, ['lobbyView__lobbyFields__gameDataField__fields__fieldSize',
				'lobbyView__lobbyFields__gameDataField__fields'], `Field size: ${data.field.maxX} x ${data.field.maxY}`),
			// voyeurButton: ViewButton.Create({href: '/game'}, ['auth'], 'Play');
			playButton: Block.Create('div', {}, ['lobbyView__lobbyFields__gameDataField__fields__playButton',
				'lobbyView__lobbyFields__gameDataField__fields', 'view__view-button'], 'Play'),
		}
	}
}
