import React from 'react';
import { Box, Avatar } from '@mui/material';

const UserAvatar = ({
  profilePicture,
  userName = 'User',
  size = 40,
  showStatus = true
}) => {
  // Extract first letter for fallback
  const firstLetter = userName ? userName.charAt(0) : 'U';

  // Handle different size formats
  const getSize = () => {
    if (typeof size === 'number') {
      return size;
    } else if (typeof size === 'object') {
      // For responsive sizes, we'll use the largest value for calculations
      if (size.md) return size.md;
      if (size.xs) return size.xs;
      return 100;
    }
    return 100;
  };

  const calculatedSize = getSize();
  const dotSize = Math.max(8, calculatedSize / 10);

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      {profilePicture ? (
        // If there's a profile picture URL, display it
        <Box
          sx={{
            width: size,
            height: size,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '1px solid #eee',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            bgcolor: 'white',
          }}
        >
          <img
            src={profilePicture}
            alt={userName}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Box>
      ) : (
        // If no profile picture, show the fallback avatar with initial
        <Avatar
          sx={{
            width: size,
            height: size,
            bgcolor: '#e3f2fd',
            color: '#0288d1',
            border: '1px solid #eee',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            fontWeight: 'bold',
          }}
        >
          {firstLetter}
        </Avatar>
      )}

      {/* Status indicator */}
      {showStatus && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            bgcolor: '#4caf50', // Green color for online status
            border: '2px solid white',
          }}
        />
      )}
    </Box>
  );
};

export default UserAvatar;
