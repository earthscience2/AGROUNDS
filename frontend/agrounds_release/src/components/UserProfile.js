import React, { useState } from 'react';

const UserProfile = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file); 
      setSelectedImage(fileURL);
    }
  };

  const handleClick = () => {
    document.getElementById('fileInput').click();
  };

  return (
    <div style={styles.container}>
      <div style={styles.preview} onClick={handleClick}>
        {selectedImage ? (
          <img
            src={selectedImage}
            alt="프로필 미리보기"
            style={styles.image}
          />
        ) : (
          <div style={styles.placeholder}>업로드</div>
        )}
      </div>
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={styles.fileInput}
      />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
  },
  preview: {
    width: '130px',
    height: '130px',
    borderRadius: '50%',
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '10px',
    cursor: 'pointer',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  placeholder: {
    color: '#111111',
    textAlign: 'center',
  },
  fileInput: {
    display: 'none', 
  },
};

export default UserProfile;
