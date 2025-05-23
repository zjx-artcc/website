import {User} from "next-auth";
import {renderReactToMjml} from "@/actions/mjml";
import SingleRecipientEmailWrapper from "@/templates/Wrapper/SingleRecipientEmailWrapper";

export const assignmentUpdatedStudent = async (student: User) => {
    return renderReactToMjml(
        <SingleRecipientEmailWrapper recipient={student} headerText="Training Assignment Updated">
            <p>Your training assignment has been updated.</p>
            <br/>
            <p>Please check <a href="https://zjxartcc.org/profile/overview">your profile</a> for more details.</p>
            <br/>
            <p>Regards,</p>
            <p>The vZJX Training Team</p>
            <p>training@zjxartcc.org</p>
        </SingleRecipientEmailWrapper>
    )
}   