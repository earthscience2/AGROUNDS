import React, { useState } from 'react';
import './create_team.scss';
import FileUpload from '../../components/file-upload/file_upload';
import client from '../../clients';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
const CreateTeam = ({onClose}) => {
    const [teamName, setTeamName] = useState('');
    const [teamLogo, setTeamLogo] = useState(null);
    const navigate = useNavigate();


    const handleFileUpload = (file) => {
        setTeamLogo(file);
    }

    const onSubmitHandler = async event => {
        event.preventDefault();

        let CreateTeamData = {
            'v2_team_host': sessionStorage.getItem('usercode'),
            'v2_team_logo': teamLogo,
            'v2_team_name': teamName
        }

        console.log(CreateTeamData)

        client.post('/api/V2team/create/', CreateTeamData, {headers: {'Content-Type': 'multipart/form-data'}})
        .then(function(response){
            sessionStorage.setItem('teamcode', response.data.v2_team_code)
            sessionStorage.setItem('teamname', teamName)
            sessionStorage.setItem('usertype', 0)
            
            console.log(response)
            alert(`${teamName}팀을 생성했어요`);
            navigate('/MainPage');

        })
        .catch(function(error){
            console.log(error);
            alert(error.config.message)
        })

    }

    return (
        <form onSubmit={onSubmitHandler}>
            <div className='create-team-modal-bg'>
                <div className='create-team-modal-mainbg'>
                    <div className='create-team-modal-close'><div>팀 생성하기 </div><div className='modal-close'onClick={onClose}>X</div></div>
                    <FileUpload onFileUpload={handleFileUpload}/>
                    <div className='create-team-modal-team'>
                        <div className='create-team-modal-team-text'>팀 이름</div>
                        <div className='create-team-modal-input'><input onChange={(e) => setTeamName(e.target.value)} className='create-team-modal-inputtext'type='text'/></div>
                    </div>
                    { teamName ? <div className={classNames('create-team-modal-button', 'black')} onClick={onSubmitHandler}>생성</div> : 
                    <div className={classNames('create-team-modal-button', 'white')} >생성</div>}
                </div>
            </div>
        </form>
    );
};

export default CreateTeam;