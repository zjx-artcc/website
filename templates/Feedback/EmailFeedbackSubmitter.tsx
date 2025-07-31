import {User} from "next-auth";
import {Feedback} from "@prisma/client";
import {renderReactToMjml} from "@/actions/mjml";
import SingleRecipientEmailWrapper from "@/templates/Wrapper/SingleRecipientEmailWrapper";

export const emailFeedbackSubmitter = (pilot: User, feedback: Feedback) => {
    return renderReactToMjml(
        <SingleRecipientEmailWrapper recipient={pilot} headerText="Update on Feedback Submitted to vZJX">
            <p>A member of our staff has left a comment on the feedback you submitted regarding a staffing within our division.
                View the information about your comment and our staff's comment below: </p>
            <br/>
            <ul>
                <li>Your Name: {feedback.pilot.fullName}</li>
                <li>Your CID: {feedback.pilot.cid}</li>
                <li>Your Callsign: {feedback.pilotCallsign}</li>
                <li>Controller Position Staffed: {feedback.controllerPosition}</li>
                <li>Date/Time You Submitted Feedback (UTC): {new Date(feedback.submittedAt).toUTCString()}</li>
                <li>Rating You Gave: {feedback.rating}</li>
            </ul>
            <br/>

            <p>
                <b> Below are the comments that you left about your experience:</b> 
                <br />
                <br/>
                {feedback.staffComments} 
            </p> <br/>
            
            <p>
                <b>Below are the comments one of our staff members left regarding your feedback:</b>
                <br />
                <br />
                {feedback.staffComments} 
            </p> <br/>
            <p>If you have any concerns regarding this feedback, please reach out to us at staff@zjxartcc.org.</p>
            <p>Kindly,</p>
            <p>The vZJX Staff</p>
            <p>staff@zjxartcc.org</p>
        </SingleRecipientEmailWrapper>
    )
}