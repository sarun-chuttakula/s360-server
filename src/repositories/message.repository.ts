import { INewGroupRequest, INewGroupResponse } from "../dtos";
import AppDataSource from "../configs/data-source";
import { Group, GroupMember, User, Message } from "../models";
import { ISendMessageRequest, ISendMessageResponse } from "../dtos/message.dto";
const groupRepository = AppDataSource.manager.getRepository(Group);
const groupMemberRepository = AppDataSource.manager.getRepository(GroupMember);
const userRepository = AppDataSource.manager.getRepository(User);
const messageRepository = AppDataSource.manager.getRepository(Message);
export const sendMessage = async (
  payload: ISendMessageRequest,
  reqUser: User
): Promise<ISendMessageResponse> => {
  const group = await groupRepository.findOne({ where: { id: payload.group } });
  if (!group) throw new Error("Group not found");
  const newMessage = new Message();
  return await messageRepository.save({
    ...newMessage,
    ...payload,
    group: group,
    created_by: reqUser.id,
    updated_by: reqUser.id,
  });
};

export const getMessages = async (payload: ISendMessageRequest) => {
  const group = await groupRepository.findOne({ where: { id: payload.group } });
  if (!group) throw new Error("Group not found");
  const messages = await messageRepository.find({
    where: {
      sender: payload.sender,
      receiver: payload.receiver,
      group: group,
    },
  });
  return messages;
};

export const deleteMessage = async (id: string) => {
  const message = await messageRepository.findOne({ where: { id: id } });
  if (!message) {
    return null;
  }
  const deletedMessage = await messageRepository.delete(id);
  return deletedMessage;
};

export const getMessagesByGroup = async (groupId: string, page: string) => {
  const additionalParams: any = {};
  if (page) {
    let pageSize = 200;
    const offset = pageSize * parseInt(page) - pageSize;
    additionalParams["take"] = pageSize;
    additionalParams["skip"] = offset;
  }
  const group = await groupRepository.findOne({ where: { id: groupId } });
  if (!group) throw new Error("Group not found");
  const messages = await messageRepository.find({
    ...additionalParams,
    where: {
      group: group,
    },
    order: {
      created_at: "DESC",
    },
  });
  const reversedMessages = messages.reverse();
  return reversedMessages;
};

export const getMessagesBySender = async (sender: string) => {
  const messages = await messageRepository.find({
    where: {
      sender: sender,
    },
  });
  return messages;
};

export const getMessagesByReceiver = async (receiver: string) => {
  const messages = await messageRepository.find({
    where: {
      receiver: receiver,
    },
  });
  return messages;
};
