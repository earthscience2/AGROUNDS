import img from '../assets/nickname-error-tooltip.png';
import Image_Comp from './Image_Comp';

const Nickname_check_tooltip = () => {
    return(
        <img src={img} style={{
            objectFit: 'contain',
            width: '10rem',
            position: 'absolute',
            marginRight: '-10rem',
            marginTop: '-2rem'
        }}/>
    );
}

export default Nickname_check_tooltip;