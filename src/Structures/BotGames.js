module.exports = {
	candies: {},
	player1: {},
	player2: {},
	trickortreat: {
		start: async function(client, interaction) {
			const house = '<:1:906189466677428224>';
			const road = '<:1:906893685910831184>';
			const player1 = '<:1:906892940163571733>';
			const player2 = '<:1:906893568436752444>';

			// Unique IDs variables.
			const IDblank_1 = String(Math.random());
			const IDblank_2 = String(Math.random());
			const IDblank_3 = String(Math.random());
			const IDmove_up = String(Math.random());
			const IDmove_down = String(Math.random());
			const IDinteract = String(Math.random());


			const positions = [
				'_ _                ' + house + road + road + house,
				'_ _                ' + house + road + road + house,
				'_ _                ' + house + road + road + house,
				'_ _                ' + house + road + road + house,
				'_ _                ' + house + road + road + house,
				'_ _                ' + house + road + road + house,
				['_ _                ', house, player1, player2, house],
			];

			const componentsArray = [
				{
					type: 1,
					components: [
						{
							type: 2,
							style: 2,
							custom_id: IDblank_1,
							disabled: true,
							label: '\u200b',
						},
						{
							type: 2,
							style: 1,
							custom_id: IDmove_up,
							emoji: { name: '⬆️' },
							label: '\u200b',
						},
						{
							type: 2,
							style: 2,
							custom_id: IDinteract,
							emoji: { id: '907632135899340801' },
							label: 'Trick or treat',
						},
					],
				},
				{
					type: 1,
					components: [
						{
							type: 2,
							style: 2,
							custom_id: IDblank_2,
							disabled: true,
							label: '\u200b',
						},
						{
							type: 2,
							style: 1,
							custom_id: IDmove_down,
							emoji: { name: '⬇️' },
							label: '\u200b',
						},
						{
							type: 2,
							style: 2,
							custom_id: IDblank_3,
							disabled: true,
							label: '\u200b',
						},
					],
				},
			];
			const msg = await interaction.createFollowup({
				content: positions.join('\n').replace(/,/g, ''),
				components: componentsArray,
			});

			const replies = {
				false: [
					'NO GET THE F- OUT',
					'sorry too poor to celebrate halloween this year',
					'no you\'re not spooky',
					'i hate kids',
				],
				true: [
					'sure! take some candies',
					'boo! spooky, take some candies',
					'cool costume, take some candies',
				] };
			let rateLimiter = 0;
			function update() {

				interaction.editMessage(msg.id, {
					content: positions.join('\n').replace(/,/g, ''),
					components: componentsArray,
				});
			}

			const game = await client.utils.createInteractionCollector({
				client: client,
				interaction: interaction,
				filter: function(ea) { return ea.member.id === interaction.member.id || ea.member.id === interaction.data.options[0].value; },
			});
			const msg2 = await interaction.createFollowup({
				content: 'This message will be edited with the houses\' replies for each of you.',
			});

			game.on('collect', async (int) => {
				await int.acknowledge();
				const thearraytofind = positions.filter(x => Array.isArray(x));
				const i = positions.filter(x => Array.isArray(x)).map(x => positions.indexOf(x))[0];

				// If they reach the max, they get teleported to start.
				if(client.games.trickortreat.nowAt === 6) {
					client.games.trickortreat.nowAt = 0;
					positions.reverse();
				}
				// Move up control.
				else if(int.data.custom_id === IDmove_up) {
					rateLimiter = 0;
					const databefore = positions[i - 1];
					positions[i - 1] = thearraytofind;
					positions[i] = databefore;
					client.games.trickortreat.nowAt++;
				}
				// Move down control.
				else if(int.data.custom_id === IDmove_down) {
					rateLimiter = 0;
					if(client.games.trickortreat.nowAt === 0) return;
					const databefore = positions[i - 1];
					positions[i + 1] = thearraytofind;
					positions[i] = databefore;
					client.games.trickortreat.nowAt--;
				}
				// Interact control.
				else if(int.data.custom_id === IDinteract) {
					rateLimiter++;
					if(rateLimiter >= 2) {
						return interaction.editMessage(msg2.id, {
							content: 'Move to the next house i don\'t have any candies!',
						});
					}
					// Random chance for refuses.
					const bool = [true, false][Math.floor(Math.random() * 2)];
					if(bool === true) {
						interaction.editMessage(msg2.id, {
							content: replies[bool][Math.floor(Math.random() * replies[bool].length)] + ` [**${client.games.candies[int.member.id]}**<:1:907632135899340801>]`,
							flags: 64,
						}).catch();
						client.games.candies[int.member.id]++;
						if(client.games.candies[int.member.id] === 10) {

							// Sending winning message.
							interaction.createMessage(`Boo! **${int.member.username}** won this minigame!\n\n` +
							`**${client.users.get(client.games.player1.id).username}**: ${client.games.candies[client.games.player1.id]}<:1:907632135899340801>\n` +
							`**${client.users.get(client.games.player2.id).username}**: ${client.games.candies[client.games.player2.id]}<:1:907632135899340801>\n\nThanks for playing! You can try other minigames aswell!`);
							return game.stopListening('end');
						}
					}
					else if(bool === false) {
						interaction.editMessage(msg2.id, {
							content: replies[bool][Math.floor(Math.random() * replies[bool].length)] + ` [**${client.games.candies[int.member.id]}**<:1:907632135899340801>]`,
							flags: 64,
						}).catch();
					}
				}
				update();
			});
		},
		current: null,
		nowAt: null,
		ended: null,
	},
	catchme: {
		start: async function(interaction, client) {
			let i = 0;
			let ii = 0;

			const oEmoji = '907626399924371507';
			const xEmoji = '907625960583606282';

			let gameEnded = false;
			let componentsArray = [];

			// Setting up the buttons fields.
			async function createFields() {
				componentsArray = [];
				client.games.catchme.where.forEach((field) => {
					componentsArray[i] = { type: 1, components: [] };
					field.forEach((line) => {
						const customid = line === 'X' ? 'X' : String(Math.random());
						const emoji = line === 'X' ? xEmoji : oEmoji;
						componentsArray[i].components[ii] = {
							type: 2,
							style: 1,
							custom_id: customid,
							emoji: { id: emoji },
							label: '\u200b',
						};
						ii++;
					});
					i++;
				});
			}
			await createFields();
			cleanEmptyObjects();

			// Filter empty objects.
			function cleanEmptyObjects() {
				componentsArray = componentsArray.filter((e) => typeof e !== undefined);
				componentsArray[0].components = componentsArray[0].components.filter((e) => typeof e !== undefined);
				componentsArray[1].components = componentsArray[1].components.filter((e) => typeof e !== undefined);
				componentsArray[2].components = componentsArray[2].components.filter((e) => typeof e !== undefined);
				componentsArray[3].components = componentsArray[3].components.filter((e) => typeof e !== undefined);
			}
			const msg = await interaction.createFollowup({
				content: '\u200b',
				components: componentsArray,
			});
			const gameData = { player1: 0, player2: 0, left: 5 };

			const interval = setInterval(async () => {
				if(gameEnded === true) client.emit('yourmom');

				// Generating where to put the X on a 4x4 table.
				const randomField = Math.floor(Math.random() * 4);
				const randomLine = Math.floor(Math.random() * 4);

				this.where = [
					['o', 'o', 'o', 'o'],
					['o', 'o', 'o', 'o'],
					['o', 'o', 'o', 'o'],
					['o', 'o', 'o', 'o'],
				];
				this.where[randomField][randomLine] = 'X';
				await createFields();
				cleanEmptyObjects();

				interaction.editMessage(msg.id, {
					content: '\u200b',
					components: componentsArray,
				});
			}, 2000);

			client.once('yourmom', () => {
				clearInterval(interval);
			});

			const collector = await client.utils.createInteractionCollector({
				client: client,
				interaction: interaction,
				filter: function(ea) { return ea.member.id === client.games.player1.id || ea.member.id === client.games.player2.id; },
			});
			const message = await interaction.createMessage('Here will be displayed who caught the candies!');
			collector.on('collect', async int => {
				await int.acknowledge();

				if(int.data.custom_id === 'X') {
					int.member.id === client.games.player1.id ? gameData.player1++ : gameData.player2++;
					gameData.left--;
					if(gameData.left === 0) {
						interaction.editMessage(message.id, 'GG! All the zombie hands has been caught.\n\n' +
						'**' + client.users.get(client.games.player1.id).username + '**: ' + gameData.player1 + '<:1:907632135899340801>\n' +
						'**' + client.users.get(client.games.player2.id).username + '**: ' + gameData.player2 + '<:1:907632135899340801>\n\nMinigame is over!');
						collector.stopListening('end');
						return gameEnded = true;
					}
					interaction.editMessage(message.id, 'One zombie hand has been caught by ' + int.member.username + '! `' + gameData.left + '` more remaining!');
				}
			});
		},
		where: [
			['o', 'o', 'o', 'o'],
			['o', 'X', 'o', 'o'],
			['o', 'o', 'o', 'o'],
			['o', 'o', 'o', 'o'],
		],
	},
};
