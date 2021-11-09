const InteractionBase = require('../../Structures/CommandBase');
module.exports = class PingInteraction extends InteractionBase {
	constructor(...args) {
		super(...args, {
			name: 'start',
			description: 'Play some games with your friend and see who will win!',
			options: [
				{
					type: 6,
					name: 'friend',
					description: 'With which friend you\'d like to play?',
					required: true,
				},
				{
					type: 3,
					name: 'minigame',
					description: 'Which minigame would you like to play?',
					required: true,
					choices: [
						{
							name: 'Trick or treat',
							value: 'trickortreat',
						},
						{
							name: 'Catch the hand',
							value: 'catchme',
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

		// if(interaction.member.id === interaction.data.options[0].value) return interaction.createMessage('Sorry! You can\'t play with yourself!');

		// Fetching users.
		this.client.getRESTUser(interaction.data.options[0].value);
		this.client.getRESTUser(interaction.member.id);
		const client = this.client;

		await this.client.utils.createConfirmation(this.client, interaction, this.client.users.get(interaction.data.options[0].value), interaction.member, async function() {

			client.games.candies[interaction.member.id] = 0;
			client.games.candies[interaction.data.options[0].value] = 0;
			client.games.player1.id = interaction.member.id;
			client.games.player2.id = interaction.data.options[0].value;
			client.games.player1.color = 'red';
			client.games.player2.color = 'yellow';

			switch(interaction.data.options[1].value) {
			case 'catchme': {
				await client.games.catchme.start(interaction, client);
				break;
			}
			case 'trickortreat': {
				await client.games.trickortreat.start(client, interaction);
				break;
			}
			}
		});
	}
};