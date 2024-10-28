import React from 'react';
import './file_upload.scss';
import { useEffect, useState } from 'react';
import imageCompression from 'browser-image-compression';
import Profile from "../../assets/user-icon.svg";
const FileUpload = ({onFileUpload}) => {

    const [imageSrc, setImageSrc] = useState('');
    const [file, setFile] = useState("");

    const encodeFileToBase64 = (fileBlob) => {
        if(fileBlob!=null){
            const reader = new FileReader();
            reader.readAsDataURL(fileBlob);

            if(fileBlob.size >= 1048576){
                const options = {
                  maxSizeMB: 1, 
                  maxWidthOrHeight: 1920, 
                };
                
                imageCompression(fileBlob, options)
                  .then((compressedImage) => {
                    const compressedFile = new File([compressedImage], fileBlob.name, { type: 'image/png' })
                    setFile(compressedFile);
                    onFileUpload(compressedFile)
                  })
                  .catch((error) => {
                    console.error('이미지 압축 오류:', error);
                  });
            } else {
                setFile(fileBlob);
                onFileUpload(fileBlob)
            }
            return new Promise((resolve) => {
                reader.onload = () => {
                    setImageSrc(reader.result);
                    resolve();
                };
            });
        }
    };
    return (
        <div className='file-upload'>
            <div className='file-upload-circle'>
                <label htmlFor='camera1' >
                    {
                    imageSrc ? <img loading="lazy" src={imageSrc} alt="preview-img" className='file-upload-imagesrc'/> :
                    <img loading="lazy" src={Profile} className='file-upload-profile'/>
                    }
                </label>
                
                <input type="file" accept="image/*" className='file-upload-input' onChange={(e) => {encodeFileToBase64(e.target.files[0]);}}></input>
            </div>
            <div className='file-upload-text'>팀 로고 업로드</div>
            <div className='file-upload-description'>.jpg 형식/ 1MB 이하로 업로드 해주세요.</div>
        </div>
    );
};

export default FileUpload;