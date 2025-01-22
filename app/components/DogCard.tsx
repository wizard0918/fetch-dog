import React from "react";
import { Card, CardMedia, CardContent, Typography, IconButton, Box } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { DogData } from "../types";

interface DogCardProps {
  favoritesList: string[];
  setFavoritesList: React.Dispatch<React.SetStateAction<string[]>>;
  dogData: DogData;
}

const DogCard: React.FC<DogCardProps> = ({ favoritesList, setFavoritesList, dogData }) => {
  const { id, age, breed, img, name, zip_code } = dogData;

  const handleFavoriteToggle = () => {
    setFavoritesList((prevFavorites) =>
      prevFavorites.includes(id)
        ? prevFavorites.filter((favorite) => favorite !== id)
        : [...prevFavorites, id]
    );
  };

  return (
    <Card
      sx={{
        height: 360,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "200px", 
        }}
      >
        <CardMedia
          component="img"
          height="200"
          image={img}
          alt={`${name}, a ${breed}`}
          loading="lazy"  // Add lazy loading here
          sx={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
          }}
        />
        <IconButton
          onClick={handleFavoriteToggle}
          aria-label={`Favorite ${name}`}
          sx={{
            position: "absolute",
            top: "8px",
            right: "8px",
            color: "#6504b5",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 1)", 
            },
          }}
        >
          {favoritesList.includes(id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </Box>
      <CardContent>
        <Typography variant="h6" component="h2" sx={{ marginBottom: "10px" }}>
          {name}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Breed: {breed}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Age: {age} years
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <em>Zip Code: {zip_code}</em>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DogCard;
