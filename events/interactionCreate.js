const { InteractionType, PermissionFlagsBits, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js")
const { ticketchannel } = require("../config.json")
const { archiveticket } = require("../config.json")
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = async (client, inter) => {

	if (inter.isButton()) {
		const date = new Date();
		const jour = date.getDate();
		const mois = date.getMonth() + 1;
		const annee = date.getFullYear();
		const heure = date.getHours();
		const minute = date.getMinutes();
		const dateheure = jour + "/" + mois + "/" + annee + " " + heure + ":" + minute;
		if (inter.customId === "close") {
			const channel = inter.channel;
			await channel.setParent(archiveticket);
			await channel.permissionOverwrites.edit(inter.user.id, { PermissionFlagsBits: 0 });
			await inter.message.edit({ components: [] });
			const embed = new EmbedBuilder()
				.setTitle("Ticket de " + inter.user.username)
				.setColor("#ff0000")
				.setFooter({ text: "Ticket fermé" });
			await inter.reply({ embeds: [embed] });
		}
		if (inter.customId === "member") {

			const channel = await inter.channel.guild.channels.create({
				name: "🚩-ticket-" + inter.user.username + ("-") + dateheure + "-🚩",
				type: ChannelType.GuildText,
				parent: ticketchannel,
				permissionOverwrites: [
					{
						id: inter.user.id,
						allow: [PermissionFlagsBits.ViewChannel]
					},
					{
						id: inter.guild.roles.everyone,
						deny: [PermissionFlagsBits.ViewChannel]
					}
				]
			});
			
			const embed = new EmbedBuilder()
				.setTitle("Ticket de " + inter.user.username)
				.setDescription("Signaler un membre")
				.setColor("#ff0000")
				.setFooter({ text: "Ticket ouvert" });

			const row = new ActionRowBuilder().setComponents(
				new ButtonBuilder().setCustomId("close").setLabel("Fermer le ticket").setStyle(ButtonStyle.Danger).setEmoji('🔒'),
			);

			await channel.send({
				embeds: ([embed]),
				components: [
					row
				]
			});

			await inter.reply({ content: "Le ticket a bien été envoyé", ephemeral: true });
		}
		if (inter.customId === "bug") {

			const channel = await inter.channel.guild.channels.create({
				name: "🐞-ticket-" + inter.user.username + ("-") + dateheure + "-🐞",
				type: ChannelType.GuildText,
				parent: ticketchannel,
				permissionOverwrites: [
					{
						id: inter.user.id,
						allow: [PermissionFlagsBits.ViewChannel]
					},
					{
						id: inter.guild.roles.everyone,
						deny: [PermissionFlagsBits.ViewChannel]
					}
				]
			});

			const embed = new EmbedBuilder()
				.setTitle("Ticket de " + inter.user.username)
				.setDescription("Signaler un bug")
				.setColor("#ff0000")
				.setFooter({ text: "Ticket ouvert" });

			const row = new ActionRowBuilder().setComponents(
				new ButtonBuilder().setCustomId("close").setLabel("Fermer le ticket").setStyle(ButtonStyle.Danger).setEmoji('🔒'),
			);

			await channel.send({
				embeds: ([embed]),
				components: [
					row
				]
			});

			await inter.reply({ content: "Le ticket a bien été envoyé", ephemeral: true });
		}
		if (inter.customId === "server") {

			const channel = await inter.channel.guild.channels.create({
				name: "🛎️-ticket-" + inter.user.username + ("-") + dateheure + "-🛎️",
				type: ChannelType.GuildText,
				parent: ticketchannel,
				permissionOverwrites: [
					{
						id: inter.user.id,
						allow: [PermissionFlagsBits.ViewChannel]
					},
					{
						id: inter.guild.roles.everyone,
						deny: [PermissionFlagsBits.ViewChannel]
					}
				]
			});

			const embed = new EmbedBuilder()
				.setTitle("Ticket de " + inter.user.username)
				.setDescription("Problème serveur")
				.setColor("#ff0000")
				.setFooter({ text: "Ticket ouvert" });

			const row = new ActionRowBuilder().setComponents(
				new ButtonBuilder().setCustomId("close").setLabel("Fermer le ticket").setStyle(ButtonStyle.Danger).setEmoji('🔒'),
			);

			await channel.send({
				embeds: ([embed]),
				components: [
					row
				]
			});

			await inter.reply({ content: "Le ticket a bien été envoyé", ephemeral: true });
		}
		if (inter.customId === "other") {

			const channel = await inter.channel.guild.channels.create({
				name: "🎫-ticket-" + inter.user.username + ("-") + dateheure + "-🎫",
				type: ChannelType.GuildText,
				parent: ticketchannel,
				permissionOverwrites: [
					{
						id: inter.user.id,
						allow: [PermissionFlagsBits.ViewChannel]
					},
					{
						id: inter.guild.roles.everyone,
						deny: [PermissionFlagsBits.ViewChannel]
					}
				]
			});

			const embed = new EmbedBuilder()
				.setTitle("Ticket de " + inter.user.username)
				.setDescription("Besoin de support (autre)")
				.setColor("#ff0000")
				.setFooter({ text: "Ticket ouvert" });

			const row = new ActionRowBuilder().setComponents(
				new ButtonBuilder().setCustomId("close").setLabel("Fermer le ticket").setStyle(ButtonStyle.Danger).setEmoji('🔒'),
			);

			await channel.send({
				embeds: ([embed]),
				components: [
					row
				]
			});

			await inter.reply({ content: "Le ticket a bien été envoyé", ephemeral: true });
		}
	}

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