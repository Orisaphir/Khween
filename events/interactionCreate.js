const { InteractionType, PermissionFlagsBits, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js")
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const Admins = require('../modules/Admin')
const Infos = require('../modules/Infos');
const { put } = require('../utils/utils');
const Ori = `<@421416465430741003>`

async function getdate() {
	let date = new Date();
	let jour = date.getDate();
	if (jour < 10) {
		jour = "0" + jour;
	}
	let mois = date.getMonth() + 1;
	if (mois < 10) {
		mois = "0" + mois;
	}
	let annee = date.getFullYear();
	let heure = date.getHours();
	if (heure < 10) {
		heure = "0" + heure;
	}
	let minute = date.getMinutes();
	if (minute < 10) {
		minute = "0" + minute;
	}
	let dateheure = jour + "-" + mois + "-" + annee + "-" + heure + "h" + minute;
	return dateheure;
}

module.exports = async (client, inter) => {

	const serveurID = inter.guild.id;

	if (inter.isButton()) {
		const dateheure = await getdate();
		const adminInfos = await Admins.findOne({ where: { Module: "ticket", IDServeur: serveurID } });
		const ticketchannelInfos = await Infos.findOne({ where: { Infos: "ticketchannel", IDServeur: serveurID } });
		const ticketchannel = ticketchannelInfos.DiscordID;
		const archiveticketInfos = await Infos.findOne({ where: { Infos: "archiveticket", IDServeur: serveurID } });
		const archiveticket = archiveticketInfos.DiscordID;
		const openticketInfos = await Infos.findOne({ where: { Infos: "openticket", IDServeur: serveurID } });
		const openticket = openticketInfos.DiscordID;
		const verifyroleInfos = await Infos.findOne({ where: { Infos: "verifyrole", IDServeur: serveurID } });
		const verifyrole = verifyroleInfos.DiscordID;
		const verifysetupInfos = await Admins.findOne({ where: { Module: "verify", IDServeur: serveurID } });
		if (inter.customId === "close") {

			if (archiveticketInfos.Valeur === false) return inter.reply({ content: "Le module est désactivé, veuillez configurer le Channel où seront archivés les Tickets avec la commande /config", ephemeral: true });
			try {
				const CheckOpenTicketChannel = await inter.guild.channels.cache.get(openticket);
				if (!CheckOpenTicketChannel) {
					await inter.channel.send("⚠️Le salon du support Ticket n'existe plus ou est introuvable. Merci de le reconfigurer avec la commande /config !⚠️");
				}
				const CheckArchiveChannel = await inter.guild.channels.cache.get(archiveticket);
				if (!CheckArchiveChannel) {
					await Infos.update({ DiscordID: null, Valeur: false }, { where: { Infos: "archiveticket", IDServeur: serveurID } });
					return inter.reply({ content: "Le salon des Tickets archivés n'existe plus ou est introuvable. Merci de le reconfigurer avec la commande /config !", ephemeral: true });
				}
			} catch (err) {
				put(`\n\nErreur lors de la vérification des salons Ticket.\n\nErreur:\n\n${err}`);
				return inter.reply({ content: `Une erreur est survenue à la fermeture du Ticket. Merci de contacter ${Ori} au plus vite.`, ephemeral: true });
			}

			const channel = inter.channel;
			const parentChannel = inter.guild.channels.cache.get(archiveticket);
			let TicketUser = ''
			try {
				let Username = channel.name.split("-")[2];
				let FetchUser = await inter.guild.members.fetch({ query: Username, limit: 1 });
				TicketUser = await FetchUser.first();
			} catch (err) {
				put(`\n\nErreur lors de la récupération du nom de l'utilisateur qui a créé le ticket.\n\nErreur:\n\n${err}`);
				return inter.reply({ content: `Une erreur est survenue à la fermeture du Ticket. Merci de contacter ${Ori} au plus vite.`, ephemeral: true });
			}
			try {
				if (parentChannel && parentChannel.type === 4) {
					let ticketName = channel.name;
					const children = parentChannel.children.cache.map(channel => channel);
					const archiveChannels = children.filter(channel => channel.type === 0 && channel.name.startsWith("🚩-ticket-") || channel.name.startsWith("🐞-ticket-") || channel.name.startsWith("🛎️-ticket-") || channel.name.startsWith("🎫-ticket-")).sort((a, b) => a.name.localeCompare(b.name));
					const index = archiveChannels.findIndex(channel => channel.name.localeCompare(ticketName) > 0);
					const newPosition = index !== -1 ? archiveChannels[index].position : archiveChannels.length;
					await channel.setParent(archiveticket);
					await channel.setPosition(newPosition);
				}
			} catch (err) {
				put(`\n\nErreur lors du tri et de l'archivage du Ticket.\n\nErreur:\n\n${err}`);
				return inter.reply({ content: `Une erreur est survenue à la fermeture du Ticket. Merci de contacter ${Ori} au plus vite.`, ephemeral: true });
			}
			try {
				await channel.permissionOverwrites.set([
					{
						id: TicketUser.user.id,
						deny: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.AddReactions],
						allow: [PermissionFlagsBits.ViewChannel]
					},
					{
						id: inter.guild.roles.everyone,
						deny: [PermissionFlagsBits.ViewChannel]
					}
				])
			} catch (err) {
				put(`Erreur lors de la modification des permissions du Ticket.\n\n Erreur: ${err}`);
				channel.send({ content: `Une erreur est survenue à la fermeture du Ticket. Une vérification dans la console est nécessaire. Merci de contacter ${Ori} au plus vite.`, ephemeral: true });
			}
			await inter.message.edit({ components: [] });
			const embed = new EmbedBuilder()
				.setTitle("Ticket fermé par " + inter.user.globalName)
				.setColor("#ff0000");
			const row = new ActionRowBuilder().setComponents(
				new ButtonBuilder().setCustomId("reopen").setLabel("Réouvrir le ticket").setStyle(ButtonStyle.Success).setEmoji('🔓'),
			);
			await channel.send({ 
				embeds: ([embed]),
				components: [
					row
				]
			});
		}
		if (inter.customId === "reopen") {
			if (ticketchannelInfos.Valeur === false) return inter.reply({ content: "Le module est désactivé, veuillez configurer la Catégorie où seront envoyés les Tickets avec la commande /config", ephemeral: true });
			try {
				const CheckOpenTicketChannel = await inter.guild.channels.cache.get(openticket);
				if (!CheckOpenTicketChannel) {
					await inter.channel.send("⚠️Le salon du support Ticket n'existe plus ou est introuvable. Merci de le reconfigurer avec la commande /config !⚠️");
				}
				const CheckTicketCategory = await inter.guild.channels.cache.get(ticketchannel);
				if (!CheckTicketCategory) {
					await Infos.update({ DiscordID: null, Valeur: false }, { where: { Infos: "ticketchannel", IDServeur: serveurID } });
					return inter.reply({ content: "La catégorie des Tickets n'existe plus ou est introuvable. Merci de la reconfigurer avec la commande /config !", ephemeral: true });
				}
			} catch (err) {
				put(`\n\nErreur lors de la vérification des salons Ticket.\n\nErreur:\n\n${err}`);
				return inter.channel.send({ content: `Une erreur est survenue à la réouverture du Ticket. Merci de contacter ${Ori} au plus vite.`, ephemeral: true });
			}
			const channel = inter.channel;
			const parentChannel = inter.guild.channels.cache.get(ticketchannel);
			let TicketUser = ''
			try {
				let Username = channel.name.split("-")[2];
				let FetchUser = await inter.guild.members.fetch({ query: Username, limit: 1 });
				TicketUser = await FetchUser.first();
			} catch (err) {
				put(`\n\nErreur lors de la récupération du nom de l'utilisateur à qui appartient le ticket.\n\nErreur:\n\n${err}`);
				return inter.reply({ content: `Une erreur est survenue à la réouverture du Ticket. Merci de contacter ${Ori} au plus vite.`, ephemeral: true });
			}
			try {
				if (parentChannel && parentChannel.type === 4) {
					await channel.setParent(ticketchannel);
				}
			} catch (err) {
				put(`\n\nErreur lors de la réouverture du Ticket.\n\nErreur:\n\n${err}`);
				return inter.reply({ content: `Une erreur est survenue à la réouverture du Ticket. Merci de contacter ${Ori} au plus vite.`, ephemeral: true });
			}
			try {
				await channel.permissionOverwrites.set([
					{
						id: TicketUser.user.id,
						allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel],
					},
					{
						id: inter.guild.roles.everyone,
						deny: [PermissionFlagsBits.ViewChannel]
					}
				])
			} catch (err) {
				put(`Erreur lors de la modification des permissions du Ticket.\n\n Erreur: ${err}`);
				channel.send({ content: `Une erreur est survenue à la réouverture du Ticket. Une vérification dans la console est nécessaire. Merci de contacter ${Ori} au plus vite.`, ephemeral: true });
			}

			const embed = new EmbedBuilder()
				.setTitle("Ticket réouvert par " + inter.user.globalName)
				.setColor("#ff0000");
			const row = new ActionRowBuilder().setComponents(
				new ButtonBuilder().setCustomId("close").setLabel("Fermer le ticket").setStyle(ButtonStyle.Success).setEmoji('🔒'),
			);
			await inter.message.edit({ 
				embeds: ([embed]),
				components: [
					row
				] 
			});
			inter.reply({ content: "Le ticket a bien été réouvert", ephemeral: true });
		}
		if (inter.customId === "member") {

			if (ticketchannelInfos.Valeur === false) return inter.reply({ content: "Le module est désactivé, veuillez configurer la Catégorie où seront envoyés les Tickets avec la commande /config", ephemeral: true });
			if (adminInfos.Valeur === false) return inter.reply({ content: "Le module est désactivé, veuillez l'activer avec la commande /setup", ephemeral: true });
			try {
				const CheckTicketCategory = await inter.guild.channels.cache.get(ticketchannel);
				if (!CheckTicketCategory) {
					await Infos.update({ DiscordID: null, Valeur: false }, { where: { Infos: "ticketchannel", IDServeur: serveurID } });
					return inter.reply({ content: "La catégorie des Tickets n'existe plus ou est introuvable. Merci de la reconfigurer avec la commande /config !", ephemeral: true });
				}
			} catch (err) {
				console.log(err);
				return inter.reply({ content: `Une erreur est survenue à la création du Ticket pour Signaler un membre. Merci de contacter ${Ori} au plus vite.`, ephemeral: true });
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
				.setTitle("Ticket de " + inter.user.globalName)
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
					await Infos.update({ DiscordID: null, Valeur: false }, { where: { Infos: "ticketchannel", IDServeur: serveurID } });
					return inter.reply({ content: "La catégorie des Tickets n'existe plus ou est introuvable. Merci de la reconfigurer avec la commande /config !", ephemeral: true });
				}
			} catch (err) {
				console.log(err);
				return inter.reply({ content: `Une erreur est survenue à la création du Ticket pour Signaler un bug. Merci de contacter ${Ori} au plus vite.`, ephemeral: true });
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
				.setTitle("Ticket de " + inter.user.globalName)
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
					await Infos.update({ DiscordID: null, Valeur: false }, { where: { Infos: "ticketchannel", IDServeur: serveurID } });
					return inter.reply({ content: "La catégorie des Tickets n'existe plus ou est introuvable. Merci de la reconfigurer avec la commande /config !", ephemeral: true });
				}
			} catch (err) {
				console.log(err);
				return inter.reply({ content: `Une erreur est survenue à la création du Ticket pour Problème serveur. Merci de contacter ${Ori} au plus vite.`, ephemeral: true });
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
				.setTitle("Ticket de " + inter.user.globalName)
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
					await Infos.update({ DiscordID: null, Valeur: false }, { where: { Infos: "ticketchannel", IDServeur: serveurID } });
					return inter.reply({ content: "La catégorie des Tickets n'existe plus ou est introuvable. Merci de la reconfigurer avec la commande /config !", ephemeral: true });
				}
			} catch (err) {
				console.log(err);
				return inter.reply({ content: `Une erreur est survenue à la création du Ticket pour Besoin de support (autre). Merci de contacter ${Ori} au plus vite.`, ephemeral: true });
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
				.setTitle("Ticket de " + inter.user.globalName)
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
					.setTitle("Ticket de " + inter.user.globalName)
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
					.setTitle("Ticket de " + inter.user.globalName)
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