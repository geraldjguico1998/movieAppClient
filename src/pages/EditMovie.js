
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [director, setDirector] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/getMovie/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setTitle(data.title);
        setDirector(data.director);
        setYear(data.year);
        setDescription(data.description);
        setGenre(data.genre);
      })
      .catch((error) => console.error("Error fetching movie details:", error));
  }, [id]);

  const handleUpdateMovie = (e) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/updateMovie/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ title, director, year, description, genre }),
    })
      .then((response) => {
        if (response.ok) {
          alert("Movie updated successfully!");
          navigate("/");
        } else {
          alert("Failed to update movie.");
        }
      })
      .catch((error) => console.error("Error updating movie:", error));
  };

  const handleDeleteMovie = () => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/deleteMovie/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            alert("Movie deleted successfully!");
            navigate("/");
          } else {
            alert("Failed to delete movie.");
          }
        })
        .catch((error) => console.error("Error deleting movie:", error));
    }
  };

  return (
    <div>
      <h1>Edit or Delete Movie</h1>
      <form onSubmit={handleUpdateMovie}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Director"
          value={director}
          onChange={(e) => setDirector(e.target.value)}
        />
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <input
          type="text"
          placeholder="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />
        <button type="submit">Update Movie</button>
      </form>
      <button onClick={handleDeleteMovie} style={{ marginTop: "1rem", color: "red" }}>
        Delete Movie
      </button>
    </div>
  );
};

export default EditMovie;
