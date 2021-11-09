const InteractionBase = require('../../Structures/CommandBase');
module.exports = class PingInteraction extends InteractionBase {
	constructor(...args) {
		super(...args, {
			name: 'inspect',
			description: 'Get information about whatever you want to know about me!',
			options: [
				{
					type: 3,
					name: 'about',
					description: 'Information about what?',
					required: true,
					choices: [
						{
							name: 'My developer',
							value: 'dev',
						},
						{
							name: 'Emojis drawer',
							value: 'drawer',
						},
						{
							name: 'Minigames',
							value: 'minigames',
						},
					],
				},
			],
		});
	}
	/**
   * @param {Interaction} interaction
   * @param {Client} client
   */
	async run(interaction) {
		async function buffer(url) {
			const axios = require('axios');
			const response = await axios.get(url, { responseType: 'arraybuffer' });
			return Buffer.from(response.data, 'utf-8');
		}
		if(interaction.data.options[0].value === 'dev') {
			interaction.createMessage('', { name: 'file.png', file: await buffer('https://cdn.discordapp.com/attachments/881857817647149086/907643094357405706/Untitled_52.png') });
		}
		else if(interaction.data.options[0].value === 'drawer') {
			interaction.createMessage('', { name: 'file.png', file: await buffer('https://cdn.discordapp.com/attachments/881857817647149086/907644487419965540/Untitled_53.png') });
		}
		else if(interaction.data.options[0].value === 'minigames') {
			interaction.createMessage('', { name: 'file.png', file: await buffer('https://cdn.discordapp.com/attachments/881857817647149086/907646215380942969/Untitled_54.png') });
		}
	}
};