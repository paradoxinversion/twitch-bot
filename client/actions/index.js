import axios from "axios";

export const getAnnouncements = async () => {
  try {
    const res = await axios.get("http://localhost:3001/announcements");
    return res.data;
  } catch (e) {
    throw e;
  }
};
export const createAnnouncement = async (text, interval) => {
  try {
    const res = await axios.post(`http://localhost:3001/announcements/`, {
      text,
      interval,
    });
    return res.data;
  } catch (e) {
    throw e;
  }
};
export const deleteAnnouncement = async (announcementId) => {
  try {
    const res = await axios.delete(
      `http://localhost:3001/announcements/?announcementId=${announcementId}`
    );
    return res.data;
  } catch (e) {
    throw e;
  }
};
