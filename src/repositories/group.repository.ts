import { INewGroupRequest, INewGroupResponse } from "../dtos";
import AppDataSource from "../configs/data-source";
import { Group, GroupMember, User } from "../models";
const groupRepository = AppDataSource.manager.getRepository(Group);
const groupMemberRepository = AppDataSource.manager.getRepository(GroupMember);
const userRepository = AppDataSource.manager.getRepository(User);
export const createGroup = async (
  payload: INewGroupRequest,
  reqUser: User
): Promise<INewGroupResponse> => {
  console.log("payload", payload);
  const newgroup = new Group();
  const NewGroup = await groupRepository.save({
    ...newgroup,
    ...payload,
    created_by: reqUser.id,
    updated_by: reqUser.id,
  });
  if (!NewGroup) throw new Error("Group not created");
  const newGroupMember = new GroupMember();
  newGroupMember.group = NewGroup;
  newGroupMember.admin = reqUser;
  newGroupMember.created_by = reqUser.id;
  newGroupMember.updated_by = reqUser.id;
  await groupMemberRepository.save(newGroupMember);
  return NewGroup;
};

export const getAllGroups = async () => {
  const groups = await groupRepository.find();
  return groups;
};

export const getGroupById = async (id: string) => {
  const group = await groupRepository.findOne({ where: { id: id } });
  return group;
};

export const updateGroup = async (id: string, payload: INewGroupRequest) => {
  const group = await groupRepository.findOne({ where: { id: id } });
  if (!group) {
    return null;
  }
  const updatedGroup = await groupRepository.save({
    ...group,
    ...payload,
  });
  return updatedGroup;
};

export const deleteGroup = async (id: string) => {
  const group = await groupRepository.findOne({ where: { id: id } });
  if (!group) {
    return null;
  }
  const deletedGroup = await groupRepository.delete(id);
  return deletedGroup;
};

export const addMemberToGroup = async (
  groupId: string,
  userId: string,
  reqUser: User
) => {
  const group = await groupRepository.findOne({ where: { id: groupId } });
  if (!group) {
    throw new Error("Group not found");
  }
  const newUser = await userRepository.findOne({ where: { id: userId } });
  if (!newUser) throw new Error("User not found");
  const newGroupMember = new GroupMember();
  newGroupMember.group = group;
  newGroupMember.admin = reqUser;
  newGroupMember.user = newUser;
  await groupMemberRepository.save(newGroupMember);
  return newGroupMember;
};

export const removeMemberFromGroup = async (
  groupId: string,
  userId: string
) => {
  const group = await groupRepository.findOne({ where: { id: groupId } });
  if (!group) {
    throw new Error("Group not found");
  }
  const user = await userRepository.findOne({ where: { id: userId } });
  if (!user) throw new Error("User not found");
  const groupMember = await groupMemberRepository.findOne({
    where: { group: group, user: user },
  });
  if (!groupMember) throw new Error("User not found in group");
  const deletedGroupMember = await groupMemberRepository.delete(groupMember.id);
  return deletedGroupMember;
};

export const getGroupMembers = async (groupId: string) => {
  const group = await groupRepository.findOne({ where: { id: groupId } });
  if (!group) {
    throw new Error("Group not found");
  }
  const groupMembers = await groupMemberRepository.find({
    where: { group: group },
  });
  return groupMembers;
};

export const updateRoleInGroup = async (
  groupId: string,
  userId: string,
  isadmin: boolean
) => {
  const group = await groupRepository.findOne({ where: { id: groupId } });
  if (!group) {
    throw new Error("Group not found");
  }
  const user = await userRepository.findOne({ where: { id: userId } });
  if (!user) throw new Error("User not found");
  const groupMember = await groupMemberRepository.findOne({
    where: { group: group, user: user },
  });
  if (!groupMember) throw new Error("User not found in group");
  if (isadmin) groupMember.admin = user;
  else groupMember.user = user;
  const updatedGroupMember = await groupMemberRepository.save(groupMember);
  return updatedGroupMember;
};
