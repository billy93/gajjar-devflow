"use server";

import {connectToDatabase} from "@/lib/mongoose";
import Answer from "@/database/answer.model";
import {AnswerVoteParams, CreateAnswerParams, GetAnswersParams} from "@/lib/actions/shared.types";
import Question from "@/database/question.model";
import {revalidatePath} from "next/cache";

import { startSession } from 'mongoose';

export async function createAnswer(params: CreateAnswerParams) {
    const session = await startSession();
    session.startTransaction();

    try {
        await connectToDatabase();

        const { answer, question, path, author } = params;

        console.log('Creating answer with params:', { answer, question, author });

        const newAnswer = await Answer.create([{
            answer,
            author,
            question
        }], { session });

        console.log('New answer created:', newAnswer[0]);

        const updatedQuestion = await Question.findByIdAndUpdate(
            question,
            { $push: { answers: newAnswer[0]._id } },
            { new: true, session }
        );

        console.log('Updated question:', updatedQuestion);

        await session.commitTransaction();
        revalidatePath(path);

        // Convert the Mongoose document to a plain JavaScript object
        const plainAnswer = newAnswer[0].toObject();

        // Return only the necessary, serializable fields
        return {
            _id: plainAnswer._id.toString(),
            answer: plainAnswer.answer,
            author: plainAnswer.author.toString(),
            question: plainAnswer.question.toString(),
            createdAt: plainAnswer.createdAt.toISOString()
        };
    } catch (e) {
        await session.abortTransaction();
        console.error("Error in createAnswer:", e);
        throw e;
    } finally {
        session.endSession();
    }
}

export async function getAllAnswer(params: GetAnswersParams) {
    try {
        await connectToDatabase();

        const {questionId} = params

        const answers = await Answer.find({question: questionId})
            .populate("author", "_id clerkId name picture")
            .sort({createdAt: -1})

        return {answers}
    } catch (e) {
        console.log(e)
        throw e;
    }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
    try {
        connectToDatabase();
        const { answerId, userId, path, hasupVoted } = params;

        let updateQuery = {};

        if (hasupVoted) {
            updateQuery = { $pull: { upvotes: userId } };
        } else {
            updateQuery = {
                $pull: { downvotes: userId },
                $addToSet: { upvotes: userId }
            };
        }

        const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, { new: true });

        if (!answer) return null;

        revalidatePath(path);

        // Convert to plain object
        const plainAnswer = answer.toObject();

        return plainAnswer;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
    try {
        connectToDatabase();
        const { answerId, userId, path, hasdownVoted } = params;

        let updateQuery = {};

        if (hasdownVoted) {
            updateQuery = { $pull: { downvotes: userId } };
        } else {
            updateQuery = {
                $pull: { upvotes: userId },
                $addToSet: { downvotes:userId }
            };
        }

        const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, { new: true });

        if (!answer) return null;

        revalidatePath(path);

        // Convert to plain object
        const plainAnswer = answer.toObject();

        return plainAnswer;
    } catch (e) {
        console.error(e);
        throw e;
    }
}