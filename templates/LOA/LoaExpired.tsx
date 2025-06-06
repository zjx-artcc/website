import {renderReactToMjml} from "@/actions/mjml";
import SingleRecipientEmailWrapper from "@/templates/Wrapper/SingleRecipientEmailWrapper";
import {User} from "next-auth";

export const loaExpired = (controller: User) => {
    return renderReactToMjml(
        <SingleRecipientEmailWrapper recipient={controller} headerText="L.O.A. Expired">
            <p>Hello {controller.firstName} {controller.lastName},</p>
            <p>Your L.O.A. has expired.</p>
            <p>You are now <strong>required</strong> to control at least minimum hours outlined in ZJX, VATUSA, and
                VATSIM policies.</p>
            <p>Feel free to submit a new L.O.A. request at any time on your <a
                href={`https://zjxartcc.org/profile/overview`}>profile page</a>.</p>
            <br/>
            <p>Regards,</p>
            <p>The vZJX Staff</p>
            <p>staff@zjxartcc.org</p>
        </SingleRecipientEmailWrapper>
    );
}