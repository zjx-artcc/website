'use server';
import {User} from "next-auth";
import {FROM_EMAIL, mailTransport} from "@/lib/email";
import {Feedback, Prisma} from "@prisma/client";
import {newFeedback} from "@/templates/Feedback/NewFeedback";
import {emailFeedbackSubmitter}  from "@/templates/Feedback/EmailFeedbackSubmitter";

export const sendNewFeedbackEmail = async (controller: User, feedback: Feedback) => {

    const {html} = await newFeedback(controller, feedback);

    await mailTransport.sendMail({
        from: FROM_EMAIL,
        to: controller.email,
        subject: "New Feedback Released",
        html,
    });
}

type ReleasedFeedback = Feedback & {
    controller: Prisma.UserGetPayload<{}>;
    pilot: Prisma.UserGetPayload<{}>;
};

export const sendEmailToFeedbackSubmitter = async (pilot: User, feedback: ReleasedFeedback) => {

    const {html} = await emailFeedbackSubmitter(pilot, feedback);

    await mailTransport.sendMail({
        from: FROM_EMAIL,
        to: pilot.email,
        subject: "Update On Feedback Submitted to vZJX",
        html,
    });
}