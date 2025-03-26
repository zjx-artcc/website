import {User} from "next-auth";
import {renderReactToMjml} from "@/actions/mjml";
import SingleRecipientEmailWrapper from "@/templates/Wrapper/SingleRecipientEmailWrapper";

export const assignmentFulfilledStudent = async (student: User, primaryTrainer: User, otherTrainers: User[]) => {
    return renderReactToMjml(
        <SingleRecipientEmailWrapper recipient={student} headerText="Training Assignment Fulfilled">
            <p>Your trainers have been assigned:</p>
            <br/>
            <p><strong>{primaryTrainer.firstName} {primaryTrainer.lastName}</strong> (PRIMARY)</p>
            <br/>
            {otherTrainers.map(trainer => (
                <p key={trainer.id}><strong>{trainer.firstName} {trainer.lastName}</strong></p>
            ))}
            <br/>
            <p>Please check <a href="https://zjxartcc.org/profile/overview">your profile</a> for more details.</p>
            <br/>
            <p>Regards,</p>
            <p>The vZJX Training Team</p>
            <p>training@zjxartcc.org</p>
        </SingleRecipientEmailWrapper>
    )
}