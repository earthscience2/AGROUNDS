import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Circle_common_btn from "./Circle_common_btn";

const WheelDateTimePicker = ({setStartTime, setEndTime, onClose}) => {
  const ampmRef = useRef(null);
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  
  const [ampm, setAmpm] = useState('오전');
  const [hour, setHour] = useState('1');
  const [minute, setMinute] = useState('30');

  const ampmOptions = ["", "", "오전", "오후", "", ""];
  const hourOptions = ["", "", ...Array.from({ length: 12 }, (_, i) => i + 1), "", ""];
  const minuteOptions = [null, null, ...Array.from({ length: 60 }, (_, i) => i), null, null];

  const handleScroll = (ref, setter, options) => {
    if (ref.current) {
      const index = Math.round(ref.current.scrollTop / (ref.current.clientHeight / 5));
      setter(options[index ]); 
    }
  };

  useEffect(() => {
    const itemHeight = '5vh'; 
    setTimeout(() => {
      ampmRef.current.scrollTop = (ampm === "오전" ? 2 : 3) * itemHeight;
      hourRef.current.scrollTop = (hour + 1) * itemHeight;
      minuteRef.current.scrollTop = (minute + 2) * itemHeight;
    }, 0);
  }, []);

  const handleConfirm = () => {
    const hour24 = ampm === "오전" ? (hour === 12 ? 0 : hour) : (hour === 12 ? 12 : hour + 12);
    const formattedTime = `${hour24.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
    if (setStartTime) setStartTime(formattedTime);
    if (setEndTime) setEndTime(formattedTime);
    
    onClose();
  };

  
  return (
    <WheelDateTimePickerS>
      <TimePickerContainer>
        <Divider />
        <PickerColumn ref={ampmRef} onScroll={() => handleScroll(ampmRef, setAmpm, ["오전", "오후"])}>
          {ampmOptions.map((val, index) => (
            <PickerItem key={index} selected={val === ampm}>{val}</PickerItem>
          ))}
        </PickerColumn>
        <PickerColumn ref={hourRef} onScroll={() => handleScroll(hourRef, setHour, Array.from({ length: 12 }, (_, i) => i + 1))}>
          {hourOptions.map((val, index) => (
            <PickerItem key={index} selected={val === hour}>{val}</PickerItem>
          ))}
        </PickerColumn>
        <PickerColumn ref={minuteRef} onScroll={() => handleScroll(minuteRef, setMinute, Array.from({ length: 60 }, (_, i) => i))}>
          {minuteOptions.map((val, index) => (
            <PickerItem key={index} selected={val === minute}>{val !== null ? val : ''}</PickerItem>
          ))}
        </PickerColumn>
      </TimePickerContainer>
      <ModalBox >
        <Circle_common_btn title={'확인'} onClick={() => handleConfirm()}/>
      </ModalBox>
    </WheelDateTimePickerS>
    
  );
};

const WheelDateTimePickerS = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  width: 100%;
`
const TimePickerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10vh 0 5vh 0;
  width: 80%;
  position: relative;
  overflow: hidden;
`;

const PickerColumn = styled.div`
  width: 30%;
  height: 25vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  text-align: center;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const PickerItem = styled.div`
  height: 5vh;
  line-height: 4vh;
  font-size: 2.5vh;
  font-weight: 600;
  color: ${(props) => (props.selected ? "black" : "rgba(51, 51, 51, 0.5)")};
  scroll-snap-align: center;
  transition: color 0.3s ease;
`;

const Divider = styled.div`
  position: absolute;
  top: 54%;
  left: 0;
  right: 0;
  height: 5vh;
  background: rgba(0, 0, 0, 0.05);
  pointer-events: none;
  transform: translateY(-50%);
  border-radius:1vh;
`;

const ModalBox = styled.div`
  width: 100%;
  padding: 0 0 5vh   0;
`
export default WheelDateTimePicker;
