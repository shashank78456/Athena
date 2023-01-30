import { Schema } from 'mongoose'
import { IQuiz, ModelNames } from '@types'

const quizSchema = new Schema<IQuiz>({
  admin: {
    type: Schema.Types.ObjectId,
    ref: ModelNames.User,
    required: true,
  },
  managers: [
    {
      type: Schema.Types.ObjectId,
      ref: ModelNames.User,
    },
  ],
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: ModelNames.User,
    },
  ],
  isPublished: {
    type: Boolean,
    required: true,
    default: false,
  },
  isAcceptingAnswers: {
    type: Boolean,
    required: true,
    default: false,
  },
  resultsPublished: {
    type: Boolean,
    required: true,
    default: false,
  },
  quizMetadata: {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    instructions: {
      type: String,
      required: true,
    },
    startDateTimestamp: {
      type: Number,
      required: true,
    },
    endDateTimestamp: {
      type: Number,
      required: true,
    },
    accessCode: {
      type: String,
    },
    bannerImage: {
      type: String,
      required: false,
    },
  },
  registrationMetadata: {
    customFields: [
      {
        name: {
          type: String,
          required: true,
        },
        label: {
          type: String,
          required: true,
        },
        isRequired: {
          type: Boolean,
          required: true,
        },
      },
    ],
  },
  sections: [
    {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
      questions: [{ type: Schema.Types.ObjectId, ref: ModelNames.Question }],
    },
  ],
})

export default quizSchema
