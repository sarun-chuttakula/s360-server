import AppDataSource from "../configs/data-source";
import { INewNoticeboardRequest } from "../dtos";
import { Noticeboard, User } from "../models";

export const createNotice = async (
  payload: INewNoticeboardRequest,
  reqUser: User
) => {
  const noticeRepository = AppDataSource.getRepository(Noticeboard);
  const newNotice = await noticeRepository.save({
    ...new Noticeboard(),
    ...payload,
    created_by: reqUser.id,
    updated_by: reqUser.id,
  });
  if (!newNotice) throw new Error("Notice not created");
  return newNotice;
};

export const getAllNotices = async () => {
  const noticeRepository = AppDataSource.getRepository(Noticeboard);
  const notices = await noticeRepository.find({
    where: { is_active: true, is_deleted: false },
  });
  return notices;
};

export const getNoticeById = async (id: string) => {
  const noticeRepository = AppDataSource.getRepository(Noticeboard);
  const notice = await noticeRepository.findOne({ where: { id: id } });
  return notice;
};

export const updateNotice = async (
  id: string,
  payload: INewNoticeboardRequest,
  reqUser: User
) => {
  const noticeRepository = AppDataSource.getRepository(Noticeboard);
  const notice = await noticeRepository.findOne({ where: { id: id } });
  if (!notice) {
    return null;
  }
  const updatedNotice = await noticeRepository.save({
    ...notice,
    ...payload,
    updated_by: reqUser.id,
  });
  return updatedNotice;
};

export const deleteNotice = async (id: string, reqUser: User) => {
  const noticeRepository = AppDataSource.getRepository(Noticeboard);
  const notice = await noticeRepository.findOne({ where: { id: id } });
  if (!notice) {
    return null;
  }
  notice.is_deleted = true;
  notice.is_active = false;
  notice.updated_by = reqUser.id;
  // const deletedNotice = await noticeRepository.delete(id);
  return noticeRepository.save(notice);
};
