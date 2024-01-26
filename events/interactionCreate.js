const { InteractionType, PermissionFlagsBits, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js")
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const Admins = require('../modules/Admin')
const Infos = require('../modules/Infos');

module.exports = async (client, inter) => {

	if (inter.isButton()) {
		const date = new Date();
		const jour = date.getDate();
		const mois = date.getMonth() + 1;
		const annee = date.getFullYear();
		const heure = date.getHours();
		const minute = date.getMinutes();
		const dateheure = jour + "/" + mois + "/" + annee + " " + heure + ":" + minute;
		const adminInfos = await Admins.findOne({ where: { Module: "ticket" } });
		const ticketchannelInfos = await Infos.findOne({ where: { Infos: "ticketchannel" } });
		const ticketchannel = ticketchannelInfos.DiscordID;
		const archiveticketInfos = await Infos.findOne({ where: { Infos: "archiveticket" } });
		const archiveticket = archiveticketInfos.DiscordID;
		const openticketInfos = await Infos.findOne({ where: { Infos: "openticket" } });
		const openticket = openticketInfos.DiscordID;
		const verifyroleInfos = await Infos.findOne({ where: { Infos: "verifyrole" } });
		const verifyrole = verifyroleInfos.DiscordID;
		const verifysetupInfos = await Admins.findOne({ where: { Module: "verify" } });
		if (inter.customId === "close") {

			if (archiveticketInfos.Valeur === false) return inter.reply({ content: "Le module est désactivé, veuillez configurer le Channel où seront archivés les Tickets avec la commande /config", ephemeral: true });
			try {
				const CheckOpenTicketChannel = await inter.guild.channels.cache.get(openticket);
				if (!CheckOpenTicketChannel) {
					await inter.channel.send("⚠️Le salon du support Ticket n'existe plus ou est introuvable. Merci de le reconfigurer avec la commande /config !⚠️");
				}
				const CheckArchiveChannel = await inter.guild.channels.cache.get(archiveticket);
				if (!CheckArchiveChannel) {
					await Infos.update({ DiscordID: null, Valeur: false }, { where: { Infos: "archiveticket" } });
					return inter.reply({ content: "Le salon des Tickets archivés n'existe plus ou est introuvable. Merci de le reconfigurer avec la commande /config !", ephemeral: true });
				}
			} catch (err) {
				console.log(err);
				return inter.reply({ content: "Une erreur est survenue à la fermeture du Ticket. Merci de contacter @Orisaphir au plus vite.", ephemeral: true });
			}

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

			if (ticketchannelInfos.Valeur === false) return inter.reply({ content: "Le module est désactivé, veuillez configurer la Catégorie où seront envoyés les Tickets avec la commande /config", ephemeral: true });
			if (adminInfos.Valeur === false) return inter.reply({ content: "Le module est désactivé, veuillez l'activer avec la commande /setup", ephemeral: true });
			try {
				const CheckTicketCategory = await inter.guild.channels.cache.get(ticketchannel);
				if (!CheckTicketCategory) {
					await Infos.update({ DiscordID: null, Valeur: false }, { where: { Infos: "ticketchannel" } });
					return inter.reply({ content: "La catégorie des Tickets n'existe plus ou est introuvable. Merci de la reconfigurer avec la commande /config !", ephemeral: true });
				}
			} catch (err) {
				console.log(err);
				return inter.reply({ content: "Une erreur est survenue à la création du Ticket pour Signaler un membre. Merci de contacter @Orisaphir au plus vite.", ephemeral: true });
			}

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

			if (ticketchannelInfos.Valeur === false) return inter.reply({ content: "Le module est désactivé, veuillez configurer la Catégorie où seront envoyés les Tickets avec la commande /config", ephemeral: true });
			if (adminInfos.Valeur === false) return inter.reply({ content: "Le module est désactivé, veuillez l'activer avec la commande /setup", ephemeral: true });
			try {
				const CheckTicketCategory = await inter.guild.channels.cache.get(ticketchannel);
				if (!CheckTicketCategory) {
					await Infos.update({ DiscordID: null, Valeur: false }, { where: { Infos: "ticketchannel" } });
					return inter.reply({ content: "La catégorie des Tickets n'existe plus ou est introuvable. Merci de la reconfigurer avec la commande /config !", ephemeral: true });
				}
			} catch (err) {
				console.log(err);
				return inter.reply({ content: "Une erreur est survenue à la création du Ticket pour Signaler un bug. Merci de contacter @Orisaphir au plus vite.", ephemeral: true });
			}

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

			if (ticketchannelInfos.Valeur === false) return inter.reply({ content: "Le module est désactivé, veuillez configurer la Catégorie où seront envoyés les Tickets avec la commande /config", ephemeral: true });
			if (adminInfos.Valeur === false) return inter.reply({ content: "Le module est désactivé, veuillez l'activer avec la commande /setup", ephemeral: true });
			try {
				const CheckTicketCategory = await inter.guild.channels.cache.get(ticketchannel);
				if (!CheckTicketCategory) {
					await Infos.update({ DiscordID: null, Valeur: false }, { where: { Infos: "ticketchannel" } });
					return inter.reply({ content: "La catégorie des Tickets n'existe plus ou est introuvable. Merci de la reconfigurer avec la commande /config !", ephemeral: true });
				}
			} catch (err) {
				console.log(err);
				return inter.reply({ content: "Une erreur est survenue à la création du Ticket pour Problème serveur. Merci de contacter @Orisaphir au plus vite.", ephemeral: true });
			}

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

			if (ticketchannelInfos.Valeur === false) return inter.reply({ content: "Le module est désactivé, veuillez configurer la Catégorie où seront envoyés les Tickets avec la commande /config", ephemeral: true });
			if (adminInfos.Valeur === false) return inter.reply({ content: "Le module est désactivé, veuillez l'activer avec la commande /setup", ephemeral: true });
			try {
				const CheckTicketCategory = await inter.guild.channels.cache.get(ticketchannel);
				if (!CheckTicketCategory) {
					await Infos.update({ DiscordID: null, Valeur: false }, { where: { Infos: "ticketchannel" } });
					return inter.reply({ content: "La catégorie des Tickets n'existe plus ou est introuvable. Merci de la reconfigurer avec la commande /config !", ephemeral: true });
				}
			} catch (err) {
				console.log(err);
				return inter.reply({ content: "Une erreur est survenue à la création du Ticket pour Besoin de support (autre). Merci de contacter @Orisaphir au plus vite.", ephemeral: true });
			}

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
		if (inter.customId === "verify") {

			if (verifyroleInfos.Valeur === false){
				await inter.reply({ content: "Le module est désactivé, impossible de trouver le Rôle à donner. Veuillez patienter, un ticket va être créé pour vous.", ephemeral: true });
				const channel = await inter.channel.guild.channels.create({
					name: "🎫-ticket-" + inter.user.username + ("-") + dateheure + "-🎫",
					type: ChannelType.GuildText,
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
					.setDescription("Problème de vérication (Rôle introuvable)")
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
				return;
			}
			if (verifysetupInfos.Valeur === false){
				await inter.reply({ content: "Le module est désactivé. Veuillez patienter, un ticket va être créé pour vous.", ephemeral: true });
				const channel = await inter.channel.guild.channels.create({
					name: "🎫-ticket-" + inter.user.username + ("-") + dateheure + "-🎫",
					type: ChannelType.GuildText,
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
					.setDescription("Problème de vérication (Module désactivé)")
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
				return;
			}
			if (verifyroleInfos.Valeur === true && verifysetupInfos.Valeur === true){
				await inter.member.roles.add(verifyrole);
				await inter.reply({ content: "Vous avez été vérifié avec succès !", ephemeral: true });
				return;
			}
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

						try {

							let command = require(`../commands/info/${inter.commandName}`)
							command.run(client, inter, command.options)
						} catch {
							let command = require(`../commands/admin/${inter.commandName}`)
							command.run(client, inter, command.options)
						}
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