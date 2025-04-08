import React, { useEffect, useState } from 'react';
import './join_team_modal.scss';
import Search from "../../assets/search-icon.svg";
import client from '../../clients';
import GeneralBtn from '../../components/button/generalBtn';
import { useNavigate } from 'react-router-dom';
const JoinTeamModal = ({onClose}) => {
    const [search, setSearch] = useState('');
    const [searchList, setSearchList] = useState([]);
    const [joinTeam, setJoinTeam] = useState('');
    const [teamName, setTeamName] = useState('');
    const navigate = useNavigate();
    const join = (team, name) => {
        setJoinTeam(team);
        setTeamName(name);
    }
    
    const onSearchHandler = (event) => {
        event.preventDefault();

        let searchData = {
            'v2_team_name' : search,
        }
        
        client.post('/api/V2team/searchbyname/', searchData)
        .then(function(response){
            setSearchList(response.data);
            
        })
        .catch(function(error){
            alert('해당하는 팀이 없습니다');
        })
    }
    const onSubmitHandler = (e) => {
        e.preventDefault();

        let joinData = {
            'user_code' : sessionStorage.getItem('usercode'),
            'team_code' : joinTeam
        }

        client.post('/api/V2team/join-team/', joinData)
        .then(function(response){
            alert('가입되었습니다.');
            sessionStorage.setItem('teamcode', joinTeam);
            sessionStorage.setItem('teamname', teamName);
            sessionStorage.setItem('usertype', 'player')
            navigate('/MainPage')
        })
        .catch(function(error){
            alert(error);
            console.log(error)
        })

    }
    
    return (
        <form onSubmit={()=>{console.log('나는 아무것도 못행')}}>
            <div className='join-team-modal-bg'>
                <div className='join-team-modal-mainbg'>
                    <div className='join-team-modal-close'><div>팀 가입하기 </div><div className='modal-close'onClick={onClose}>X</div></div>
                    <div className='join-team-modal-input'>
                        <input className='join-team-modal-inputtext' placeholder='팀 이름을 입력하세요' type='text' onChange={(e) => setSearch(e.target.value)}/>
                        <div onClick={onSearchHandler}><img className='join-team-modal-searchicon' src={Search} /></div>
                    </div>
                    <div className='join-team-modal-teambox'>
                        {searchList.map((team, index) => (
                                <div className='join-team-modal-teambox-list' onClick={() => join(team.v2_team_code, team.v2_team_name)} key={index}>
                                <div className='join-team-modal-teambox-team'>{team.v2_team_name}</div>
                            </div>
                        ))}
                        
                    </div>
                    {joinTeam ? <GeneralBtn color='black' onClick={onSubmitHandler}>팀 가입하기</GeneralBtn>  : <GeneralBtn color='white' >팀 가입하기</GeneralBtn>}
                </div>
            </div>
        </form>
    );
};

export default JoinTeamModal;