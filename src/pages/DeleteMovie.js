
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Table, Button } from "react-bootstrap";

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  const fetchMovies = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/getMovies`);
      if (response.ok) {
        const data = await response.json();
        setMovies(data.movies || []);
      } else {
        console.error("Error fetching movies");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteMovie = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/deleteMovie/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        alert("Movie deleted successfully!");
        fetchMovies(); // Refresh the movie list
      } else {
        console.error("Failed to delete movie");
      }
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <Container className="mt-4">
      <h1>Movie List</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Year</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={movie._id}>
              <td>{movie.title}</td>
              <td>{movie.year}</td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => deleteMovie(movie._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default MovieList;
