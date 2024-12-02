import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Form, Button, ListGroup } from "react-bootstrap";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Use navigate to redirect after deletion
  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [updatedFields, setUpdatedFields] = useState({});

  const fetchMovieDetails = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/getMovie/${id}`);
      if (response.ok) {
        const data = await response.json();
        setMovie(data);
        setComments(data.comments || []);
      } else {
        console.error("Error fetching movie details");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteMovie = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to delete a movie.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this movie?")) {
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/deleteMovie/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token for authentication
        },
      });

      if (response.ok) {
        alert("Movie deleted successfully!");
        navigate("/"); // Redirect to home page
      } else {
        const error = await response.json();
        console.error("Failed to delete movie:", error); // Log error for debugging
        alert(error.message || "Failed to delete movie. Please try again.");
      }
    } catch (error) {
      console.error("Unexpected error deleting movie:", error); // Log unexpected errors
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to add a comment.");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/addComment/${id}`, {
        method: "PATCH", // Ensure this matches backend expectations
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Pass the token for authentication
        },
        body: JSON.stringify({ comment: newComment }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Comment added response:", data); // Debugging log
        setNewComment("");
        setComments(data.updatedMovie.comments || []); // Update comments from response
        alert("Comment added successfully!");
      } else {
        const error = await response.json();
        console.error("Error adding comment:", error); // Log error for debugging
        alert(error.message || "Failed to add comment. Please try again.");
      }
    } catch (error) {
      console.error("Unexpected error adding comment:", error); // Log unexpected errors
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const handleUpdateMovie = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/updateMovie/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedFields),
      });
      if (response.ok) {
        alert("Movie updated successfully!");
        fetchMovieDetails(); // Refresh movie details
        setEditMode(false);
      } else {
        const error = await response.json();
        console.error("Failed to update movie:", error);
        alert(error.message || "Failed to update movie.");
      }
    } catch (error) {
      console.error("Error updating movie:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  if (!movie) return <Container>Loading...</Container>;

  return (
    <Container className="mt-4">
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>{movie.title}</Card.Title>
          <Card.Text>
            <strong>Director:</strong> {movie.director}
            <br />
            <strong>Year:</strong> {movie.year}
            <br />
            <strong>Description:</strong> {movie.description}
            <br />
            <strong>Genre:</strong> {movie.genre}
          </Card.Text>
          {editMode ? (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={movie.title}
                  onChange={(e) =>
                    setUpdatedFields({ ...updatedFields, title: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Director</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={movie.director}
                  onChange={(e) =>
                    setUpdatedFields({
                      ...updatedFields,
                      director: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Button onClick={handleUpdateMovie} variant="success">
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setEditMode(true)} variant="warning">
                Edit Movie
              </Button>
              <Button onClick={handleDeleteMovie} variant="danger" className="ms-2">
                Delete Movie
              </Button>
            </>
          )}
        </Card.Body>
      </Card>
      <h3>Comments</h3>
      <ListGroup className="mb-4">
        {comments.map((comment, index) => (
          <ListGroup.Item key={index}>{comment.comment}</ListGroup.Item>
        ))}
      </ListGroup>
      <Form onSubmit={handleCommentSubmit}>
        <Form.Group controlId="newComment" className="mb-3">
          <Form.Label>Add a Comment</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
          />
        </Form.Group>
        <Button type="submit" variant="primary">
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default MovieDetails;
