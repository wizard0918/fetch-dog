import React from "react";
import { Box, Skeleton, Card, CardContent } from "@mui/material";

const DogCardSkeleton: React.FC = () => {
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
        <Skeleton variant="rectangular" width="100%" height="100%" />
      </Box>
      <CardContent>
        <Skeleton variant="text" width="60%" height={24} sx={{ marginBottom: "10px" }} />
        <Skeleton variant="text" width="80%" height={20} sx={{ marginBottom: "8px" }} />
        <Skeleton variant="text" width="50%" height={20} sx={{ marginBottom: "8px" }} />
        <Skeleton variant="text" width="40%" height={20} />
      </CardContent>
    </Card>
  );
};

export default DogCardSkeleton;
