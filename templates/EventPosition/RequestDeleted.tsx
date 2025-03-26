import {Event} from "@prisma/client";
import {User} from "next-auth";
import {renderReactToMjml} from "@/actions/mjml";
import SingleRecipientEmailWrapper from "@/templates/Wrapper/SingleRecipientEmailWrapper";

export const positionRequestDeleted = (controller: User, event: Event) => {
    return renderReactToMjml(
        <SingleRecipientEmailWrapper recipient={controller} headerText="Event Position Notification">
            <p>You request to control for <strong>{event.name}</strong> was deleted.</p>
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