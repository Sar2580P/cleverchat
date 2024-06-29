"use client";
import { useContext } from "react";
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import classes from "@/components/AddLinks/AddLinks.module.css";
import AppContext from "@/contexts/AppContext";

export default function AddLinks() {
  const appCtx = useContext(AppContext);

  const handleAddInput = () => {
    appCtx.onLinks(appCtx.link);
  };

  const handleDeleteInput = (link: string) => {
    appCtx.onDelete(link);
  };

  return (
    <div className={classes.container}>
      <div className={classes.inputSection}>
        <input
          autoFocus
          type="text"
          value={appCtx.link}
          onChange={(e) => appCtx.onLink(e.target.value)}
          placeholder="Add a valid link"
          className={classes.input}
        />
        <button onClick={handleAddInput} className={classes.button}>
          <IoMdAdd className={classes.icon} />
          Add
        </button>
      </div>
      <ul className={classes.list}>
        {appCtx.links.map((item, index) => (
          <li key={index} className={classes.listItem}>
            <a href={item} target="_blank">
              {item}
            </a>
            <button
              onClick={() => handleDeleteInput(item)}
              className={classes.deleteButton}
            >
              <MdDelete className={classes.icon} />
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
