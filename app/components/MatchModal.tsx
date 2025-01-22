import React from 'react';
import { Modal, Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DogData } from '../types';

interface MatchModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  matchData: DogData;
  isMatchLoading: boolean;
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '95%',
  maxWidth: '500px',
  color: '#6504b5',
  backgroundColor: '#fff',
  border: '2px solid #6504b5',
  borderRadius: '20px',
};

const MatchModal: React.FC<MatchModalProps> = ({ isModalOpen, setIsModalOpen, matchData, isMatchLoading }) => {
  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal open={isModalOpen} onClose={handleClose} aria-labelledby="dog-match" aria-describedby="dog-description">
      <Card sx={{ ...modalStyle, padding: '2rem' }}>
        {isMatchLoading && (
          <Typography component="p" variant="h6" className="text-center">
            Loading...
          </Typography>
        )}
        {!isMatchLoading && matchData && (
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h5" component="h4" className="mb-4">
              <em>You have been matched with</em>
            </Typography>
            <Button
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: '8px',
                top: '8px',
              }}
              className="text-lg"
            >
              <CloseIcon sx={{ color: '#6504b5' }} />
            </Button>
            <CardMedia
              component="img"
              alt={`${matchData.name} the ${matchData.breed}`}
              height="250"
              sx={{ objectFit: 'contain', marginBlock: '1rem', borderRadius: '1rem' }}
              image={matchData.img}
            />
            <Typography gutterBottom variant="h4" fontWeight="bold" component="h4">
              {matchData.name}
            </Typography>
            <Typography variant="body1" className="text-lg">Breed: {matchData.breed}</Typography>
            <Typography variant="body2" className="text-sm">Age: {matchData.age}</Typography>
            <Typography variant="body2" className="text-sm">Zip Code: {matchData.zip_code}</Typography>
          </CardContent>
        )}
      </Card>
    </Modal>
  );
};

export default MatchModal;
