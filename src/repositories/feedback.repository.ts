import AppDataSource from "../configs/data-source";
import {
  IFeedbackUpdateRequest,
  INewFeedbackRequest,
  INewFeedbackResponse,
} from "../dtos/feedback.dto";
import { Feedback, Student } from "../models";
const feedbackRepository = AppDataSource.getRepository(Feedback);

export const createFeedback = async (
  payload: INewFeedbackRequest,
  reqUser: Student
): Promise<INewFeedbackResponse> => {
  const newFeedback = await feedbackRepository.save({
    ...new Feedback(),
    ...payload,
    created_by: reqUser.id,
    updated_by: reqUser.id,
  });
  if (!newFeedback) throw new Error("Feedback not created");
  return newFeedback;
};

export const getAllFeedbacks = async () => {
  const feedbacks = await feedbackRepository.find();
  return feedbacks;
};

export const getFeedbackById = async (id: string) => {
  const feedback = await feedbackRepository.findOne({ where: { id: id } });
  return feedback;
};

export const updateFeedback = async (
  id: string,
  payload: IFeedbackUpdateRequest,
  reqUser: Student
) => {
  const feedback = await feedbackRepository.findOne({ where: { id: id } });
  if (!feedback) {
    return null;
  }
  const updatedFeedback = await feedbackRepository.save({
    ...feedback,
    ...payload,
  });
  return updatedFeedback;
};

export const deleteFeedback = async (id: string, reqUser: Student) => {
  const feedback = await feedbackRepository.findOne({ where: { id: id } });
  if (!feedback) {
    return null;
  }
  const deletedFeedback = await feedbackRepository.delete(id);
  return deletedFeedback;
};
