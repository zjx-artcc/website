'use server';
import {User} from "next-auth";
import {FROM_EMAIL, mailTransport} from "@/lib/email";
import {Feedback} from "@prisma/client";
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

export const sendFeedbackSubmitter = async (pilot: User, feedback: Feedback) => {

    const {html} = await emailFeedbackSubmitter(pilot, feedback);

    await mailTransport.sendMail({
        from: FROM_EMAIL,
        to: pilot.email,
        subject: "Update On Feedback Submitted to vZJX",
        html,
    });
}