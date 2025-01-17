import React, { useState } from 'react';
import styled from 'styled-components';
import agroundslogo from '../assets/agrounds_circle_logo.png';
import pencil from '../assets/pencil.png';

const UserProfile = ({selectedImage, setSelectedImage}) => {
  const [imgObjUrl, setImgObjUrl] = useState(null)
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setImgObjUrl(fileURL);
      setSelectedImage(file)
    }
  };

  const handleClick = () => {
    document.getElementById('fileInput').click();
  };

  return (
    <Container>
      <Preview onClick={handleClick}>
        <EditBox>
          <Pencil src={pencil} />
        </EditBox>
        {imgObjUrl ? (
          <ProfileImage src={imgObjUrl} alt="프로필 미리보기" />
        ) : (
          <DefaultImage src={imgObjUrl} />
        )}
      </Preview>
      <FileInput
        id="fileInput"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />
    </Container>
  );
};

export default UserProfile;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Preview = styled.div`
  width: 130px;
  height: 130px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
  position: relative;
`;

const EditBox = styled.div`
  background-color: #343a3f;
  width: 130px;
  height: 50px;
  position: absolute;
  border-radius: 0 0 55px 55px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.8;
  bottom: 0;
`;

const Pencil = styled.img`
  height: 3vh;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DefaultImage = styled.img`
  width: 60%;
  height: 60%;
  object-fit: cover;
`;

const FileInput = styled.input`
  display: none;
`;
