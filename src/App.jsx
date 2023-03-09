import { useEffect, useRef, useState } from "react";
import ToDoItem from "./ToDoItem";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [toDos, setToDos] = useState([]);
  const feladat = useRef("");

  const feladatokListazasa = () => {
    fetch("http://localhost:8000/api/todo")
      .then((respone) => respone.json())
      //.then(data => data.map(feladat => feladat.title))
      .then((feladatok) => setToDos(feladatok));
  };
  const feladatHozzadasa = () => {
    if (feladat.current.value.length === 0) {
      alert("Feladat megadása kötelező");
      return;
    }
    // TODO: ellenőrzés frissítése
    if (toDos.includes(feladat.current.value)) {
      alert("Duplikált feladat");
      return;
    }
    fetch("http://localhost:8000/api/todo", {
      method: "POST",
      body: JSON.stringify({ title: feladat.current.value }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then(async (respone) => {
      if (respone.status === 201) {
        feladat.current.value = "";
        feladatokListazasa();
      } else {
        const data = await respone.json();
        alert(data.message);
      }
    });
  };

  useEffect(() => {
    feladatokListazasa();
  }, []);

  const toDoList = [];
  toDos.forEach((toDo) => {
    toDoList.push(
      <ToDoItem
        key={toDo.id}
        feladat={toDo}
        onUpdate={() => feladatokListazasa()}
      />
    );
  });
  
  console.log("Kirajzol");
  return (
    <main className="container">
      <h1>Teendők</h1>
      <section>
        <h2>Feladat hozzáadása</h2>
        <div className="mb-3">
          <label className="form-label" htmlFor="feladat_input">
            Feladat:
          </label>
          <input
            className="form-control"
            type="text"
            name="feladat"
            id="feladat_input"
            placeholder="Feladat"
            ref={feladat}
          />
        </div>
        <button className="btn btn-danger" onClick={() => feladatHozzadasa()}>
          Hozzáad
        </button>
      </section>

      <section>
        <h2>Teendők</h2>
        <ul>{toDoList}</ul>
      </section>
    </main>
  );
}

export default App;
