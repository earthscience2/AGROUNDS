import React, { useState } from 'react';
import styled from 'styled-components';
import check from '../assets/check.png';
import right from '../assets/right.png';
import Modal from './Modal';
import serviceterm1 from '../assets/term/service-term1.png';
import serviceterm2 from '../assets/term/service-term2.png';
import serviceterm3 from '../assets/term/service-term3.png';
import serviceterm4 from '../assets/term/service-term4.png';
import serviceterm5 from '../assets/term/service-term5.png';
import serviceterm6 from '../assets/term/service-term6.png';
import serviceterm7 from '../assets/term/service-term7.png';
import privacy1 from '../assets/term/privacy-term1.png';
import privacy2 from '../assets/term/privacy-term2.png';
import privacy3 from '../assets/term/privacy-term3.png';
import privacy4 from '../assets/term/privacy-term4.png';
import privacy5 from '../assets/term/privacy-term5.png';
import marketing from '../assets/term/marketing-term.png';


const TermsAgreement = ({ onClick, setMarketingAgree }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(""); 

  const openModal = (term) => {
    setModalContent(term); 
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const termsReturn = (term) => {
    switch (term) {
      case "required":
        return (
        <>
        <img src={serviceterm1} />
        <img src={serviceterm2} />
        <img src={serviceterm3} />
        <img src={serviceterm4} />
        <img src={serviceterm5} />
        <img src={serviceterm6} />
        <img src={serviceterm7} />
        </>
        );
      case "personalInfo":
        return (
          <>
          <img src={privacy1} />
          <img src={privacy2} />
          <img src={privacy3} />
          <img src={privacy4} />
          <img src={privacy5} />
          </>
          );
      case "marketingInfo":
        return (
          <>
          <img src={marketing} />
          </>
          );
      default:
        return <p>약관 정보를 찾을 수 없습니다.</p>;
    }
  };

  const [allChecked, setAllChecked] = useState(false);
  const [individualChecks, setIndividualChecks] = useState({
    required: false,
    personalInfo: false,
    marketingUsage: false,
    marketingInfo: false,
  });

  const isValid = individualChecks.required && individualChecks.personalInfo;

  const handleAllCheck = () => {
    const newState = !allChecked;
    setAllChecked(newState);
    const updatedChecks = {
      required: newState,
      personalInfo: newState,
      marketingUsage: newState,
      marketingInfo: newState,
    };
    setIndividualChecks(updatedChecks);
    setMarketingAgree(newState ? 1 : 0);
  };

  const handleIndividualCheck = (key) => {
    const updatedChecks = {
      ...individualChecks,
      [key]: !individualChecks[key],
    };
    setIndividualChecks(updatedChecks);
    setAllChecked(Object.values(updatedChecks).every(Boolean));

    if (key === "personalInfo") {
      setMarketingAgree(updatedChecks.personalInfo ? 1 : 0);
    }
  };

  return (
    <TermsAgreementStyle>
      <div className="all-check" onClick={handleAllCheck}>
        <div className={`checkbox ${allChecked ? "checked" : ""}`}>
          <img src={check} alt="check-icon" />
        </div>
        <label>모두 동의 (선택항목 포함)</label>
      </div>
      <div className="individual-checks">
        <div className="check-item" onClick={() => handleIndividualCheck("required")}>
          <div className={`checkbox ${individualChecks.required ? "checked" : ""}`}>
            <img src={check} alt="check-icon" />
          </div>
          <label>(필수) 이용약관</label>
          <img className="right-btn" src={right} alt="right-arrow" onClick={() => openModal("required")} />
        </div>
        <div className="check-item" onClick={() => handleIndividualCheck("personalInfo")}>
          <div className={`checkbox ${individualChecks.personalInfo ? "checked" : ""}`}>
            <img src={check} alt="check-icon" />
          </div>
          <label>(필수) 개인정보 수집 이용 동의</label>
          <img className="right-btn" src={right} alt="right-arrow" onClick={() => openModal("personalInfo")} />
        </div>
        <div className="check-item" onClick={() => handleIndividualCheck("marketingInfo")}>
          <div className={`checkbox ${individualChecks.marketingInfo ? "checked" : ""}`}>
            <img src={check} alt="check-icon" />
          </div>
          <label>(선택) 마케팅 정보수신 동의</label>
          <img className="right-btn" src={right} alt="right-arrow" onClick={() => openModal("marketingInfo")} />
        </div>
      </div>
      {isValid ? (
        <button className="confirmBtn" onClick={onClick} style={{ backgroundColor: "#262626", color: "white" }}>
          가입하기
        </button>
      ) : (
        <button className="confirmBtn" style={{ backgroundColor: "#F4F4F4", color: "#C6C6C6" }}>
          가입하기
        </button>
      )}

      <Modal common={false} isOpen={isModalOpen} onClose={closeModal}>
        <div className="modal-inner">{termsReturn(modalContent)}</div>
      </Modal>
    </TermsAgreementStyle>
  );
};

export default TermsAgreement;

const TermsAgreementStyle = styled.div`
  .all-check {
    background-color: #f2f4f8;
    width: 100%;
    height: 7vh;
    display: flex;
    align-items: center;
    font-size: 1.8vh;
    font-weight: 600;
    border-radius: 1.5vh;
    .checkbox {
      border-radius: 50%;
      width: 3vh;
      height: 3vh;
      border: none;
      outline: none;
      background-color: rgb(230, 233, 237);
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 2vh;
      & > img {
        width: 2vh;
      }
      &.checked {
        background-color: #0eac6a;
      }
    }
  }
  .individual-checks {
    margin: 1vh 0 5vh 0;
    .check-item {
      width: 100%;
      height: 5vh;
      display: flex;
      align-items: center;
      font-size: 1.8vh;
      font-weight: 500;
      border-radius: 1.5vh;
      label {
        width: 75%;
      }
      .right-btn {
        width: 2vh;
      }
      .checkbox {
        border-radius: 50%;
        width: 3vh;
        height: 3vh;
        border: none;
        outline: none;
        background-color: rgb(230, 233, 237);
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 2vh;
        & > img {
          width: 2vh;
        }
        &.checked {
          background-color: #0eac6a;
        }
      }
    }
  }
  .confirmBtn {
    width: 100%;
    border: none;
    height: 6vh;
    font-size: 2vh;
    font-weight: 700;
    margin-bottom: 3vh;
    border-radius: 1vh;
  }
  .modal-inner{
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    overflow-y: scroll;
    img{
      width:100%;
    }
  }
`;
