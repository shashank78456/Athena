import { Request, Response } from "express";
import sendFailureResponse from "@utils/failureResponse";
import QuizModel from "@models/quiz/quizModel";
import { JwtPayload } from "types";

interface getDashBoardRequest extends Request {
  body: {
    user: JwtPayload
  }
}

const getDashBoard = async (req: getDashBoardRequest, res: Response) => {
  const user = req.body.user;
  try {
    const createdQuizzes = await QuizModel.find({ $or: [{ admin: user.userId }, { managers: user.userId }] });
    const quizzes = await QuizModel.find({})
    let attemptedQuizzes = 0;
    const quizDetails = quizzes.map((quiz) => {
      if (quiz?.isPublished) {
        const userStatus = quiz?.participants?.find((participant) => participant.user === user.userId);
        if (userStatus?.submitted) {
          attemptedQuizzes += 1
        }
        return {
          _id: quiz._id,
          name: quiz?.quizMetadata?.name,
          description: quiz?.quizMetadata?.description,
          instructions: quiz?.quizMetadata?.instructions,
          startDateTimestamp: quiz?.quizMetadata?.startDateTimestamp,
          endDateTimestamp: quiz?.quizMetadata?.endDateTimestamp,
          bannerImage: quiz?.quizMetadata?.bannerImage,
          isAcceptingAnswers: quiz?.isAcceptingAnswers,
          registrationMetadata: quiz?.registrationMetadata,
          registered: userStatus ? true : false,
          submitted: userStatus?.submitted,
        }
      }
    })
    return res.status(200).send({
      message: 'Dashboard detailes fetched',
      createdQuizzes: createdQuizzes,
      quizzes: quizDetails,
      attemptedQuizzes: attemptedQuizzes,
      hostedQuizzes: createdQuizzes.length,
    })
  }
  catch (error: unknown) {
    sendFailureResponse({
      res,
      error,
      messageToSend: 'Failed to fetch dashboard data'
    });
  }
}

export default getDashBoard