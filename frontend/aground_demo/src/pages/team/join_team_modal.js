import React, { useEffect, useState } from 'react';
import './join_team_modal.scss';
import Search from "../../assets/search-icon.svg";
import client from '../../clients';
import GeneralBtn from '../../components/button/generalBtn';
const JoinTeamModal = ({onClose}) => {
    const [search, setSearch] = useState('');
    const [searchList, setSearchList] = useState([]);
    const [joinTeam, setJoinTeam] = useState('');
    const join = (team) => {
        setJoinTeam(team)
        console.log(team)
    }
    const onSubmitHandler = (event) => {
        event.preventDefault();

        let searchData = {
            'v2_team_name' : search,
        }
        
        client.post('/api/V2team/searchbyname/', searchData)
        .then(function(response){
            console.log(response.data);
            setSearchList(response.data)
        })
        .catch(function(error){
            alert('해당하는 팀이 없습니다');
        })

        
    }
    
    return (
        <form onSubmit={onSubmitHandler}>
            <div className='join-team-modal-bg'>
                <div className='join-team-modal-mainbg'>
                    <div className='join-team-modal-close'><div>팀 가입하기 </div><div className='modal-close'onClick={onClose}>X</div></div>
                    <div className='join-team-modal-input'>
                        <input className='join-team-modal-inputtext' placeholder='팀 이름을 입력하세요' type='text' onChange={(e) => setSearch(e.target.value)}/>
                        <div onClick={onSubmitHandler}><img className='join-team-modal-searchicon' src={Search} /></div>
                    </div>
                    <div className='join-team-modal-teambox'>
                        {searchList.map((team, index) => (
                                <div className='join-team-modal-teambox-list' onClick={() => join(team.v2_team_name)} key={index}>
                                <div className='join-team-modal-teambox-team'>{team.v2_team_name}</div>
                            </div>
                        ))}
                        
                    </div>
                    <GeneralBtn color='black'>팀 가입하기</GeneralBtn>  
                </div>
            </div>
        </form>
    );
};

export default JoinTeamModal;