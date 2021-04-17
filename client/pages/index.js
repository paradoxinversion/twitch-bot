import axios from "axios";
import { useEffect } from "react";
import Announcements from "../components/Announcements";

function index() {
  return (
    <div>
      <p>STARLA Client</p>
      <Announcements />
    </div>
  );
}

export default index;
