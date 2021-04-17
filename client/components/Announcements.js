import React, { useEffect, useState } from "react";
import {
  deleteAnnouncement,
  getAnnouncements,
  createAnnouncement,
} from "../actions";
import { convertMilliseconds } from "../utils/utils";

export default function Announcements(props) {
  const [announcements, setAnnouncements] = useState([]);
  const [showAddAnnouncement, setShowAddAnnouncement] = useState(false);
  const [formInput, setFormInput] = useState({
    text: "",
    interval: 100000,
  });
  useEffect(() => {
    getAnnouncements().then((announcementData) => {
      console.log(announcementData.announcements);
      setAnnouncements(announcementData.announcements);
    });
  }, []);
  const handleFormInput = (e) => {
    setFormInput({
      ...formInput,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div id="bot-announcements">
      <p>Announcements</p>

      <table
        id="bot-announcements-table"
        className="table-auto border-collapse border"
      >
        <thead>
          <tr>
            <th>Text</th>
            <th>Interval</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {announcements.map((annoucement) => {
            const intervalTime = convertMilliseconds(annoucement.interval);
            return (
              <tr key={annoucement._id}>
                <td className="border p-2">{annoucement.text}</td>
                <td className="border p-2">
                  {`${intervalTime.h}hrs ${intervalTime.m}mins ${intervalTime.s}s`}
                </td>
                <td className="border p-2">
                  <button
                    className="border px-2"
                    onClick={async (e) => {
                      e.preventDefault();
                      await deleteAnnouncement(annoucement._id);
                      const newAnnouncements = await getAnnouncements();
                      setAnnouncements(newAnnouncements.announcements);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button
        onClick={() => {
          setShowAddAnnouncement(!showAddAnnouncement);
        }}
      >
        {showAddAnnouncement ? "Cancel" : "Add Announcement"}
      </button>
      {showAddAnnouncement && (
        <form className="flex flex-col w-64">
          <label htmlFor="add-announcement-text">Announcement Text</label>
          <input
            type="text"
            id="add-announcement-text"
            className="border"
            name="text"
            value={formInput["text"]}
            onChange={handleFormInput}
          />
          <label htmlFor="add-announcement-interval">
            Announcement interval
          </label>
          <input
            type="number"
            id="add-announcement-interval"
            className="border"
            name="interval"
            value={formInput["interval"]}
            onChange={handleFormInput}
          />
          <p>{`${convertMilliseconds(formInput["interval"]).h}h ${
            convertMilliseconds(formInput["interval"]).m
          }m ${convertMilliseconds(formInput["interval"]).s}s`}</p>
          <button
            className="border px-2"
            onClick={async (e) => {
              e.preventDefault();
              await createAnnouncement(formInput.text, formInput.interval);
              const newAnnouncements = await getAnnouncements();
              setAnnouncements(newAnnouncements.announcements);
            }}
          >
            Add
          </button>
        </form>
      )}
    </div>
  );
}
