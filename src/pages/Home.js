
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const [hasMore, setHasMore] = useState(false); // To check if more movies are available
  const navigate = useNavigate();

  const fetchMovies = async (page = 1) => {
    try {
      console.log(`Fetching movies from page ${page}...`);
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/getMovies?page=${page}`);
      if (response.ok) {
        const data = await response.json();
        console.log("API Response:", data);
        setMovies(data.movies || []);
        setHasMore(data.hasNextPage || false); // Assuming API provides hasNextPage
      } else {
        console.error("Failed to fetch movies");
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  useEffect(() => {
    fetchMovies(currentPage); // Fetch movies for the current page
  }, [currentPage]);

  const viewMovieDetails = (id) => {
    navigate(`/movies/${id}`);
  };

  const handleNextPage = () => {
    if (hasMore) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Movie List</h1>
      <Row>
        {movies.length > 0 ? (
          movies.map((movie) => (
            <Col key={movie._id} sm={12} md={6} lg={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{movie.title}</Card.Title>
                  <Card.Text>
                    <strong>Genre:</strong> {movie.genre}
                    <br />
                    <strong>Year:</strong> {movie.year}
                  </Card.Text>
                  <Button
                    variant="primary"
                    onClick={() => viewMovieDetails(movie._id)}
                  >
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No movies available. Try adding some!</p>
        )}
      </Row>
      <div className="d-flex justify-content-between mt-4">
        <Button
          variant="secondary"
          disabled={currentPage === 1}
          onClick={handlePreviousPage}
        >
          Previous
        </Button>
        <Button variant="primary" disabled={!hasMore} onClick={handleNextPage}>
          Next
        </Button>
      </div>
    </Container>
  );
};

export default Home;
