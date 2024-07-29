import React from 'react';
import styled from 'styled-components';

const SelectQuarter = (props) => {
    return (
        <SelectQuarterStyle backgroundColor = {props.color}>
            <div className='division_fba_button' onClick={() => props.quater('풀경기')}>풀경기</div>
            <div className='division_fba_button' onClick={() => props.quater('전반전')}>전반전</div>
            <div className='division_fba_button' onClick={() => props.quater('후반전')}>후반전</div>
        </SelectQuarterStyle>
    );
};

const SelectQuarterStyle = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 40vh;
    margin-top: 5vh;
    .division_fba_button{
        width: 7vh;
        height: 4vh;
        line-height: 4vh;
        color: rgba(255, 255, 255, 0.667);
        text-align: center;
        background-color: #393939;
        border-radius: 1vh;
        margin: 0 .7vh;
        font-size: 1.7vh;
        cursor: pointer;
        &:hover{
            background-color: #363636;
            color: white;
            transition: 1.5s ;
        }
    }
`
export default SelectQuarter;