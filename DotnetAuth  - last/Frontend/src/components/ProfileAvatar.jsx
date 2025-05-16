import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const ProfileAvatar = ({
  profilePicture,
  uploadLoading,
  handleProfilePictureClick,
  size = { xs: 100, md: 150 }
}) => {
  // Handle different size formats
  const getSize = () => {
    if (typeof size === 'number') {
      return size;
    } else if (typeof size === 'object') {
      return size;
    }
    return { xs: 100, md: 150 };
  };

  const avatarSize = getSize();
  const borderWidth = typeof avatarSize === 'number' && avatarSize < 50 ? 2 : 4;
  const iconSize = typeof avatarSize === 'number' && avatarSize < 50 ? 24 : 36;
  const fontSize = typeof avatarSize === 'number' && avatarSize < 50 ? '0.7rem' : '0.9rem';
  const dotSize = typeof avatarSize === 'number' && avatarSize < 50 ? 8 : 15;

  return (
    <Box
      sx={{
        width: avatarSize,
        height: avatarSize,
        position: 'relative',
        borderRadius: '50%',
        overflow: 'hidden',
        bgcolor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(3, 169, 244, 0.2)',
        border: `${borderWidth}px solid white`,
        zIndex: 2,
      }}
    >
      {profilePicture ? (
        // If there's a profile picture, display it
        <img
          src={profilePicture}
          alt="Profile"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      ) : (
        // If no profile picture, show the default design
        <>
          {/* Blue semi-circle at the top */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '50%',
              bgcolor: '#03A9F4',
            }}
          />

          {/* "Profile" text */}
          <Typography
            variant="body1"
            component="div"
            sx={{
              fontWeight: 'bold',
              color: 'white',
              position: 'absolute',
              top: '20%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: fontSize,
              zIndex: 2,
            }}
          >
            Profile
          </Typography>

          {/* Blue dot in the bottom right */}
          <Box
            sx={{
              position: 'absolute',
              bottom: typeof avatarSize === 'number' ? avatarSize / 10 : 15,
              right: typeof avatarSize === 'number' ? avatarSize / 10 : 15,
              width: dotSize,
              height: dotSize,
              borderRadius: '50%',
              bgcolor: '#03A9F4',
              zIndex: 2,
            }}
          />
        </>
      )}

      {/* Camera icon for uploading */}
      {handleProfilePictureClick && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            bgcolor: 'primary.main',
            borderRadius: '50%',
            width: iconSize,
            height: iconSize,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid white',
            cursor: 'pointer',
            zIndex: 4,
            '&:hover': {
              bgcolor: 'primary.dark',
            }
          }}
          onClick={handleProfilePictureClick}
        >
          {uploadLoading ? (
            <CircularProgress size={iconSize/2} sx={{ color: 'white' }} />
          ) : (
            <CameraAltIcon sx={{ color: 'white', fontSize: iconSize/2 }} />
          )}
        </Box>
      )}
    </Box>
  );
};

export default ProfileAvatar;
