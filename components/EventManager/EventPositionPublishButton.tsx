'use client';
import { publishEventPosition, unpublishEventPosition } from "@/actions/eventPosition";
import { Publish, Unpublished } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Tooltip } from "@mui/material";
import { Event, EventPosition } from "@prisma/client";
import { toast } from "react-toastify";

export default function EventPositionPublishButton({ event, position, }: { event: Event, position: EventPosition, }) {
    
    const handleClick = async () => {
        
        if (position.published) {
            await unpublishEventPosition(event, position);
            toast.success('Position unpublished successfully!');
            return;
        }

        await publishEventPosition(event, position);
        toast.success('Position published successfully!');
    }

    return (
        <Tooltip title={`${position.published ? 'Un' : ''}publish Position`}>
            <IconButton onClick={handleClick}>
                { position.published ? <Unpublished /> : <Publish /> }
            </IconButton>
        </Tooltip>
    );
}
    