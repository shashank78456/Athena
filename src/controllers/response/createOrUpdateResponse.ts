import { Response, Request } from "express";
import ResponseModel from "@models/response/responseModel";
import { JwtPayload, IResponse } from "types";
import sendFailureResponse from "@utils/failureResponse";
import sendInvalidInputResponse from "@utils/invalidInputResponse";
import QuestionModel from "@models/question/questionModel";


interface createOrUpdateResponseRequest extends Request {
  body: {
    user: JwtPayload;
    selectedOptionId?: IResponse['selectedOptionId']
    subjectiveAnswer?: IResponse['subjectiveAnswer']
    status: IResponse['status']
  }
  params: {
    quizId: string
    questionId: string
  }
}

const createOrUpdateResponse = async (req: createOrUpdateResponseRequest, res: Response) => {
  if (!req.body || !(req.body.selectedOptionId || req.body.subjectiveAnswer) || !req.body.status) {
    return sendInvalidInputResponse(res)
  }
  const { user, selectedOptionId, subjectiveAnswer, status } = req.body;
  try {
    const question = await QuestionModel.findById(req.params.questionId);
    if (!question) {
      return sendInvalidInputResponse(res);
    }

    // no need to check the question type etc as the data is being sent by the frontend and we will have cors enabled for the frontend only
    const response = await ResponseModel.findOne({ userId: user.userId, quizId: req.params.quizId, questionId: req.params.questionId });
    if (!response) {
      const newResponse = new ResponseModel({
        userId: user.userId,
        quizId: req.params.quizId,
        questionId: req.params.questionId,
        subjectiveAnswer,
        selectedOptionId,
        status
      });
      await newResponse.save();
      res.status(201).json({ message: "Response created" });

    }
    else {
      await ResponseModel.findByIdAndUpdate(response._id, { selectedOptionId, subjectiveAnswer, status });
      return res.status(200).json({ message: "Response updated" });
    }
  }
  catch (error: unknown) {
    sendFailureResponse({
      res,
      error,
      messageToSend: "Failed to create response",
    });
  }
}



export default createOrUpdateResponse;

