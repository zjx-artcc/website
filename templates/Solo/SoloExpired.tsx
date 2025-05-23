import {renderReactToMjml} from "@/actions/mjml";
import SingleRecipientEmailWrapper from "@/templates/Wrapper/SingleRecipientEmailWrapper";
import {SoloCertification} from "@prisma/client";
import {User} from "next-auth";

export const soloExpired = (controller: User, solo: SoloCertification) => {
    return renderReactToMjml(
        <SingleRecipientEmailWrapper recipient={controller} headerText="Solo Certification Expired">
            <p>Your solo certification for <strong>{solo.position}</strong> has expired.</p>
            <p>DO NOT control this position until you get re-certified or gain another solo certification</p>
            <br/>
            <p>If you believe that this is an error, contact the vZJX Training Department.</p>
            <br/>
            <p>Regards,</p>
            <p>The vZJX Training Team</p>
            <p>training@zjxartcc.org</p>
        </SingleRecipientEmailWrapper>
    );
}   