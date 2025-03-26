import {EventPosition, Event} from "@prisma/client";
import {User} from "next-auth";
import {renderReactToMjml} from "@/actions/mjml";
import SingleRecipientEmailWrapper from "@/templates/Wrapper/SingleRecipientEmailWrapper";
import {formatZuluDate} from "@/lib/date";

export const eventPositionRemoved = (controller: User, eventPosition: EventPosition, event: Event) => {
    return renderReactToMjml(
        <SingleRecipientEmailWrapper recipient={controller} headerText="Event Position Notification">
            <p>You are no longer required to control <strong>{eventPosition.finalPosition}</strong> for the following
                event: <strong>{event.name}</strong></p>
            <p>Event Start Time: <strong>{formatZuluDate(event.start)}</strong></p>
            <br/>
            <p>If you believe this is an error, email the vZJX events department.</p>
            <br/>
            <p>For more information, check <a href="https://zjxartcc.org/profile/overview">your profile</a> or
                the <a
                    href={`https://zjxartcc.org/events/${event.id}`}>event page</a>.</p>
            <br/>
            <p>Regards,</p>
            <p>The vZJX Events Team</p>
            <p>ec@zjxartcc.org</p>
        </SingleRecipientEmailWrapper>
    )
}