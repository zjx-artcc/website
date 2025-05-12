import {User} from "next-auth";
import {renderReactToMjml} from "@/actions/mjml";
import SingleRecipientEmailWrapper from "@/templates/Wrapper/SingleRecipientEmailWrapper";

export const rosterStatusChange = (controller: User, reason?: string) => {
    return renderReactToMjml(
        <SingleRecipientEmailWrapper recipient={controller} headerText="Roster Status Change">
            <p>Your roster status has been update to <strong>{controller.controllerStatus}</strong></p>
            {reason && <p>Reason: {reason}</p>}
            <p>If you believe this is an error, contact the vZJX ARTCC staff immediately.</p>
            <br/>
            <p>Regards,</p>
            <p>The vZJX ARTCC Staff</p>
            <p>staff@zjxartcc.org</p>
        </SingleRecipientEmailWrapper>
    )
}