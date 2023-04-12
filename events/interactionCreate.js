const { InteractionType } = require("discord.js")

module.exports = async (client, inter) => {

	if (inter.isChatInputCommand()) {
		if (inter.type === InteractionType.ApplicationCommand) {

			try {

				let command = require(`../commands/modération/${inter.commandName}`)
				command.run(client, inter, command.options)
			} catch {

				try {

					let command = require(`../commands/communauté/${inter.commandName}`)
					command.run(client, inter, command.options)

				} catch {

					try {

						let command = require(`../commands/music/${inter.commandName}`)
						command.run(client, inter, command.options)
					} catch {

						let command = require(`../commands/info/${inter.commandName}`)
						command.run(client, inter, command.options)
					}
				}
			}
		}

	} else if (inter.isAutocomplete()) {

		try {

			let command = require(`../commands/modération/${inter.commandName}`)
			command.run(client, inter, command.options)
			if (!command) {
				console.error(`No command matching ${inter.commandName} was found.`);
				return;
			}
			try {
				await command.autocomplete(inter);
			} catch (error) {
				console.error(error);
			}
		} catch {

			try {

				let command = require(`../commands/communauté/${inter.commandName}`)
				command.run(client, inter, command.options)
				if (!command) {
					console.error(`No command matching ${inter.commandName} was found.`);
					return;
				}
				try {
					await command.autocomplete(inter);
				} catch (error) {
					console.error(error);
				}
			} catch {

				let command = require(`../commands/music/${inter.commandName}`)
				command.run(client, inter, command.options)
				if (!command) {
					console.error(`No command matching ${inter.commandName} was found.`);
					return;
				}
				try {
					await command.autocomplete(inter);
				} catch (error) {
					console.error(error);
				}
			}
		}
	}
}