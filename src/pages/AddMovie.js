import React, { useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AddMovie = () => {
  const [title, setTitle] = useState("");
  const [director, setDirector] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const navigate = useNavigate();

  const handleAddMovie = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    // Check if the token is available
    if (!token) {
      alert("You must be logged in as an admin to add a movie.");
      return;
    }

    try {
      console.log("Sending request to add movie...");
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/addMovie`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, director, year, description, genre }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Movie added successfully:", data);
        alert("Movie added successfully!");
        navigate("/"); // Redirect to the home page to refresh the movie list
      } else {
        const errorData = await response.json();
        console.error("Failed to add movie:", errorData);
        alert(`Error adding movie: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error adding movie:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Card style={{ width: "40rem" }}>
        <Card.Body>
          <h2 className="text-center mb-4">Add a New Movie</h2>
          <Form onSubmit={handleAddMovie}>
            <Form.Group className="mb-3" controlId="titleInput">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="directorInput">
              <Form.Label>Director</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter director's name"
                value={director}
                onChange={(e) => setDirector(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="yearInput">
              <Form.Label>Year</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter release year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="descriptionInput">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter movie description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="genreInput">
              <Form.Label>Genre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Add Movie
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddMovie;
