import { Icon } from "@iconify-icon/react";
import { Typography } from "@mui/material";
import { User } from "next-auth";
import Link from "next/link";

export default function LinkDiscordButton({user}: Props) {

    if (user) {
        if (user.discordId == null) {
            return (
                <Link className="rounded-sm bg-[#7289da] w-max flex flex-row p-2 items-center justify-center" href="/api/cauth/discord?init=true">
                    <Icon icon="mdi:discord" className="text-3xl text-white pr-2"/>
                    <Typography variant='body2'>Link Discord Account</Typography>
                </Link>   
            )
        } else {
            return (
                <Link className="rounded-sm bg-[#7289da] w-fit flex p-2 items-center justify-center" href="/api/cauth/discord?unlink=true">
                    <Icon icon="mdi:discord" className="text-3xl text-white pr-2"/>
                    <Typography variant='body2'>Unlink Discord Account</Typography>
                </Link>
            )
        }
    }
}

interface Props {
    user?: User
}