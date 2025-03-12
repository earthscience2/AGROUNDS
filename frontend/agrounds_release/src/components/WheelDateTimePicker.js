import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

const WheelDateTimePicker = () => {
  const [ampm, setAmPm] = useState("AM");
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);

  const ampmList = ["AM", "PM"];
  const hourList = Array.from({ length: 12 }, (_, i) => i + 1);
  const minuteList = Array.from({ length: 60 }, (_, i) => i).filter((m) => m % 5 === 0); // 5분 단위

  const scrollToCenter = (ref, value, list) => {
    if (ref.current) {
      const index = list.indexOf(value);
      ref.current.scrollTo({
        top: index * 40, // 아이템 하나의 높이 (40px)
        behavior: "smooth",
      });
    }
  };

  const ampmRef = useRef(null);
  const hourRef = useRef(null);
  const minuteRef = useRef(null);

  useEffect(() => {
    scrollToCenter(ampmRef, ampm, ampmList);
    scrollToCenter(hourRef, hour, hourList);
    scrollToCenter(minuteRef, minute, minuteList);
  }, [ampm, hour, minute]);

  return (
    <Container>
      <PickerContainer>
        {/* AM/PM Picker */}
        <Picker>
          <Wheel ref={ampmRef}>
            {ampmList.map((item) => (
              <WheelItem key={item} selected={item === ampm} onClick={() => setAmPm(item)}>
                {item}
              </WheelItem>
            ))}
          </Wheel>
        </Picker>

        {/* Hour Picker */}
        <Picker>
          <Wheel ref={hourRef}>
            {hourList.map((item) => (
              <WheelItem key={item} selected={item === hour} onClick={() => setHour(item)}>
                {item}
              </WheelItem>
            ))}
          </Wheel>
        </Picker>

        {/* Minute Picker */}
        <Picker>
          <Wheel ref={minuteRef}>
            {minuteList.map((item) => (
              <WheelItem key={item} selected={item === minute} onClick={() => setMinute(item)}>
                {item.toString().padStart(2, "0")}
              </WheelItem>
            ))}
          </Wheel>
        </Picker>
      </PickerContainer>

      <SelectedTime>
        선택한 시간: <strong>{ampm} {hour}:{minute.toString().padStart(2, "0")}</strong>
      </SelectedTime>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  text-align: center;
  font-size: 18px;
  padding: 20px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const PickerContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  align-items: center;
  padding: 20px;
  position: relative;
`;

const Picker = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;


const Wheel = styled.div`
  width: 80px;
  height: 160px;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  border-radius: 10px;
  text-align: center;
  position: relative;
  
  /* 아이폰 스타일 오버레이 효과 */
  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    height: 40px;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0));
    pointer-events: none;
  }
  
  &::before {
    top: 0;
  }
  
  &::after {
    bottom: 0;
    background: linear-gradient(to top, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0));
  }
`;

const WheelItem = styled.div`
  padding: 10px;
  font-size: 18px;
  cursor: pointer;
  scroll-snap-align: center;
  color: ${(props) => (props.selected ? "#007bff" : "#888")};
  font-weight: ${(props) => (props.selected ? "bold" : "normal")};
  height: 40px;
  line-height: 40px;
`;

const SelectedTime = styled.p`
  margin-top: 20px;
  font-size: 18px;
`;

export default WheelDateTimePicker;
