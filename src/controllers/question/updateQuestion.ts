import sendInvalidInputResponse from "@utils/invalidInputResponse";
import { Request, Response } from "express";
import QuestionModel from "@models/question/questionModel";
import { IQuestion, JwtPayload } from "types";
import { Types } from "mongoose";
import sendFailureResponse from "@utils/failureResponse";

interface updateQuestionRequest extends Request {
    body: {
        question: IQuestion
        user: JwtPayload
        questionId: Types.ObjectId
    },
    params: {
        quizId: string
    }
}

const updateQuestion = async (req: updateQuestionRequest, res: Response) => {
    if (!req.body) {
        return sendInvalidInputResponse(res);
    }

    // get data from request body
    const { question, questionId } = req.body

    try {
        // find question and update
        const updatedQuestion = await QuestionModel.findOneAndUpdate(
            { _id: questionId },
            question,
            { new: true }
        )

        // send response
        if (!updatedQuestion) {
            return res.status(400).json({
                message: "Question not found"
            })
        } else {
            return res.status(200).json({
                message: "Question updated",
            })
        }
    } catch (error: unknown) {
        sendFailureResponse({
            res,
            error,
            messageToSend: "Failed to update question",
        })
    }
}

export default updateQuestion