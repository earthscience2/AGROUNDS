import React from "react";
import dodbogi from '../../assets/dodbogi.png';
function SearchLeague(){
    const style = {
        backgroundColor: 'white',
        width: '12vw',
        height: '5vw',
        borderRadius: '1.4vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Inter Semi Bold',
        fontWeight: '700',
        fontSize: '1.2vw',
        boxShadow: '0vh .3vw .5vw #949494',
        marginLeft: '80%',
        position: 'fixed',
        top: '10vw',
        
    }
    return (
        <div style={style}>리그 검색하기 <img style={{marginLeft:'1vw'}} src={dodbogi}/></div>
    )
}
export default SearchLeague;