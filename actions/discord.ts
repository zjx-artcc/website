import { Feedback } from "@prisma/client";
import { User } from "next-auth";

export const sendDiscordEmbed = async(user: User, feedback: Feedback) => {
    if (!process.env.DISCORD_WEBHOOK_URL) {
        return
    }
    
    const embed: Embed = {
        title: 'Feedback!',
        fields: [
            {name: 'Controller', value: user.fullName, inline: false},
            {name: 'Position', value: feedback.controllerPosition, inline: false},
            {name: 'Service Rating', value: (feedback.rating || 0) + '/5 stars', inline: false},
            {name: 'Comments', value: feedback.comments || '', inline: false}
        ],
        color: 4492235
    }

    if (feedback.rating == 5) {
        embed.image = {url: 'https://i.pinimg.com/originals/51/98/aa/5198aac8f04c105379617199e0b9665b.gif'}
    } else if (feedback.rating <= 2) {
        embed.image = {url: 'https://y.yarn.co/c6ff4ee8-d160-4535-af30-3d90441cd72f_text.gif'}
    }

    const message = {
        content: 'New feedback has been published!',
        embeds: [embed],
        username: 'Feedbackinator'
    }

    fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(message)
    }).then((response) => {
        console.log(response)
    }).catch((err) => {
        console.error(err)
    })
}

type Message = {
    content?: string
    nonce?: string
    tts?: boolean
    embeds?: Embed[]
}

type Embed = {
    title?:	string
    type?:	string
    description?:	string
    url?:	string
    timestamp?:	string
    color?:	number
    footer?:	EmbedFooter
    image?:	EmbedImage
    thumbnail?:	string
    author?:	EmbedAuthor
    fields?:	EmbedField[]
}

type EmbedAuthor = {
    name?: string
    url?: string
    icon_url?: string
    proxy_icon_url?: string
}

type EmbedField = {
    name: string
    value: string
    inline: boolean
}

type EmbedImage = {
    url: string
}

type EmbedFooter = {
    text: string
    icon_url?: string
    proxy_icon_url?: string
}