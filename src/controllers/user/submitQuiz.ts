import { Response, Request } from 'express'
import QuizModel from '@models/quiz/quizModel'
import { Error, Types } from 'mongoose'
import { IQuiz, JwtPayload } from 'types'
import sendFailureResponse from '@utils/failureResponse'
import sendInvalidInputResponse from '@utils/invalidInputResponse'

interface submitQuizRequest extends Request {
    body:{
        user: JwtPayload,
    },
    params:{
        quizId: string,
    }
}

const submitQuiz = async (req: submitQuizRequest, res: Response) => {
    const { user } = req.body;
    const { quizId } = req.params;

    if (!user) {
        return sendInvalidInputResponse(res);
    }

    try {

        const quiz = await QuizModel.findById(quizId);
        
        if (!quiz || !quiz.isPublished) {
            return sendInvalidInputResponse(res)
        }

        // set isGivingQuiz to true for the user
        quiz.participants?.forEach((participant) => {
            if (participant.user === user.userId) {
                participant.isGivingQuiz = false;
                participant.time.left = 0;
                participant.submitted = true;
            }
        })

        await quiz.save();

        return res.status(200).json({
            success: true,
            message: 'Quiz submitted successfully'
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}
