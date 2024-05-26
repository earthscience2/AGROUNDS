import React, { useState } from 'react';
import './create_team.scss';
import FileUpload from '../../components/file-upload/file_upload';
import client from '../../clients';
import classNames from 'classnames';
const CreateTeam = ({onClose}) => {

    const [teamName, setTeamName] = useState('');
    const [teamLogo, setTeamLogo] = useState(null);

    const changeName = (event) => {
        setTeamName(event.target.value)
    }

    const handleFileUpload = (file) => {
        setTeamLogo(file);
    }

    const onSubmitHandler = async event => {
        event.preventDefault();

        let CreateTeamData = {
            'v2_team_logo': teamLogo,
            'v2_team_name': teamName
        }

        client.post('/api/V2team/create/', CreateTeamData)
        .then(function(response){
            console.log(response)
        })
        .catch(function(error){
            console.log(error);
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
                        <div className='create-team-modal-input'><input onChange={changeName} className='create-team-modal-inputtext'type='text'/></div>
                    </div>
                    {teamLogo && teamName ? <div className={classNames('create-team-modal-button', 'black')} onClick={onSubmitHandler}>생성</div> : 
                    <div className={classNames('create-team-modal-button', 'white')} >생성</div>}
                </div>
            </div>
        </form>
    );
};

export default CreateTeam;