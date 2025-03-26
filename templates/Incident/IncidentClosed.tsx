import {renderReactToMjml} from "@/actions/mjml";
import SingleRecipientEmailWrapper from "@/templates/Wrapper/SingleRecipientEmailWrapper";
import {User} from "next-auth";

export const incidentClosed = (reporter: User, reportee: User) => {
    return renderReactToMjml(
        <SingleRecipientEmailWrapper recipient={reporter} headerText="Incident Report Closed">
            <p>Your incident report against <strong>{reportee.firstName} {reportee.lastName}</strong> has been closed.
            </p>
            <br/>
            <p>If you believe this is an error, contact the vZJX staff immediately.</p>
            <br/>
            <p>Thank you for your time,</p>
            <p>The vZJX Staff</p>
            <p>staff@zjxartcc.org</p>
        </SingleRecipientEmailWrapper>
    )
}