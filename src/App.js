import "./styles.css";
import React, { useState, useEffect } from "react";
import List from "./components/List";
import Alert from "./components/Alert";
import uuid from "react-uuid";

const getListFromLocalStorage = () => {
  let list = localStorage.getItem("list");
  if (list) return (list = JSON.parse(list));
  else return [];
};

export default function App() {
  const [name, setName] = useState("");
  const [list, setList] = useState(getListFromLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({ show: false, msg: "", type: "" });

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) showAlert(true, "danger", "Please enter value");
    else if (name && isEditing) {
      setList(
        list.map((item) => {
          if (item.id === editID) {
            return { ...item, title: name };
          }
          return item;
        })
      );
      setName("");
      setEditID(null);
      setIsEditing(false);
      setAlert(true, "success", "Value changed");
    } else {
      setAlert(true, "success", "Item added to the list");
      const newItem = { id: uuid(), title: name };
      setList([...list, newItem]);
      setName("");
    }
  };

  const showAlert = (show = false, title = "", msg = "") => {
    setAlert(show, title, msg);
  };

  const removeItem = (id) => {
    setAlert(true, "danger", "Item removed");
    setList(list.filter((item) => item.id !== id));
  };

  const editItem = (id) => {
    const editItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditID(id);
    setName(editItem.title);
  };

  const clearList = () => {
    setAlert(true, "danger", "List cleared");
    setList([]);
  };

  return (
    <section className="App">
      <form onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
        <h3 style={{ marginBottom: "1.5rem", textAlign: "center" }}>
          Todo list
        </h3>
        <div className="mb-3 form">
          <input
            type="text"
            className="form-control"
            placeholder="e.g Apple"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <button type="submit" className="btn btn-success">
            {isEditing ? "Edit" : "Add"}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <div className="text-center">
            <button className="btn btn-warning" onClick={clearList}>
              Clear Items
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
