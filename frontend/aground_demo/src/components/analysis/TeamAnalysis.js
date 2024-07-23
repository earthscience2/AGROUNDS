import React from 'react';
const data = [
    {name: '조상우', time: '23회'}, 
    {name: '선동범', time: '2회'},
    {name: '구자유', time: '231회'},
    {name: '문소영', time: '43회'},
    {name: '안의찬', time: '67회'},
    {name: '이희구', time: '23회'},

]
const TeamAnalysisC = (props) => {
    return (
    <table>
        <thead>
            <tr>
                <th colSpan="3">{props.title}</th>
            </tr>
        </thead>
        <tbody>
            {data.map((item, index) => (
            <tr key={index}>
                <td>{index+1}등</td>
                <td>{item.name}</td>
                <td>{item.time}</td>
            </tr>
            ))}
        </tbody>
    </table>
    );
};

export default TeamAnalysisC;