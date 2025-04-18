import { Feedback } from "@prisma/client";
import { User } from "next-auth";
import { EmbedBuilder, WebhookClient } from 'discord.js'

const hook = new WebhookClient({url: process.env.DISCORD_WEBHOOK_URL || ''})

export const sendDiscordEmbed = async(user: User, feedback: Feedback) => {
    if (!hook || !process.env.DISCORD_WEBHOOK_URL) {
        return
    }
    
    const embed = new EmbedBuilder()
    .setTitle('Feedback!')
    .setColor('#3E8BCB')
    .addFields(
        {name: 'Controller', value: user.fullName},
        {name: 'Position', value: feedback.controllerPosition},
        {name: 'Service Rating', value: (feedback.rating || 0) + '/5 stars'},
        {name: 'Comments', value: feedback.comments || ''},
    )

    if (feedback.rating == 5) {
        embed.setImage('https://i.pinimg.com/originals/51/98/aa/5198aac8f04c105379617199e0b9665b.gif')
    } else if (feedback.rating <= 2) {
        embed.setImage('https://y.yarn.co/c6ff4ee8-d160-4535-af30-3d90441cd72f_text.gif')
    }

    hook.send({
        content: 'New feedback has been published!',
        username: 'Feedbackinator',
        embeds: [embed]
    })
}