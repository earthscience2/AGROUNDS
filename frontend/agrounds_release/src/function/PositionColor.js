const PositionColor = {
  LWF: "linear-gradient(117.23deg, rgba(232, 123, 76, 0.8), rgba(210, 89, 58) , rgba(232, 125, 95) 80%)",
  ST: "linear-gradient(117.23deg, rgba(232, 123, 76, 0.8), rgba(210, 89, 58) , rgba(232, 125, 95) 80%)",
  RWF: "linear-gradient(117.23deg, rgba(232, 123, 76, 0.8), rgba(210, 89, 58) , rgba(232, 125, 95) 80%)",
  LWM: "linear-gradient(117.23deg, rgba(87, 187, 170, 0.8), rgba(72, 157, 158) , rgba(105, 217, 188) 80%)",
  CAM: "linear-gradient(117.23deg, rgba(87, 187, 170, 0.8), rgba(72, 157, 158) , rgba(105, 217, 188) 80%)",
  RWM: "linear-gradient(117.23deg, rgba(87, 187, 170, 0.8), rgba(72, 157, 158) , rgba(105, 217, 188) 80%)",
  LM: "linear-gradient(117.23deg, rgba(87, 187, 170, 0.8), rgba(72, 157, 158) , rgba(105, 217, 188) 80%)",
  CM: "linear-gradient(117.23deg, rgba(87, 187, 170, 0.8), rgba(72, 157, 158) , rgba(105, 217, 188) 80%)",
  RM: "linear-gradient(117.23deg, rgba(87, 187, 170, 0.8), rgba(72, 157, 158) , rgba(105, 217, 188) 80%)",
  LWB: "linear-gradient(117.23deg, rgba(92, 139, 245, 0.8), rgba(76, 103, 244) , rgba(114, 192, 250) 80%)",
  CDM: "linear-gradient(117.23deg, rgba(87, 187, 170, 0.8), rgba(72, 157, 158) , rgba(105, 217, 188) 80%)",
  RWB: "linear-gradient(117.23deg, rgba(92, 139, 245, 0.8), rgba(76, 103, 244) , rgba(114, 192, 250) 80%)",
  LB: "linear-gradient(117.23deg, rgba(92, 139, 245, 0.8), rgba(76, 103, 244) , rgba(114, 192, 250) 80%)",
  CB: "linear-gradient(117.23deg, rgba(92, 139, 245, 0.8), rgba(76, 103, 244) , rgba(114, 192, 250) 80%)",
  RB: "linear-gradient(117.23deg, rgba(92, 139, 245, 0.8), rgba(76, 103, 244) , rgba(114, 192, 250) 80%)",
  GK: "linear-gradient(97.23deg, rgba(209,198, 81, 0.8), rgba(186, 162, 64) , rgba(226, 207, 84) 80%)",
};


const PositionBackColor = {
  LWF: "linear-gradient(117.23deg, rgba(232, 123, 76, 0.1), rgba(210, 89, 58, 0.3) , rgba(232, 125, 95, 0) 80%)",
  ST: "linear-gradient(117.23deg, rgba(232, 123, 76, 0.1), rgba(210, 89, 58, 0.3) , rgba(232, 125, 95, 0) 80%)",
  RWF: "linear-gradient(117.23deg, rgba(232, 123, 76, 0.1), rgba(210, 89, 58, 0.3) , rgba(232, 125, 95, 0) 80%)",
  LWM: "linear-gradient(117.23deg, rgba(87, 187, 170, 0.2), rgba(72, 157, 158, 0.2) , rgba(105, 217, 188, 0.2) 80%)",
  CAM: "linear-gradient(117.23deg, rgba(87, 187, 170, 0.2), rgba(72, 157, 158, 0.2) , rgba(105, 217, 188, 0.2) 80%)",
  RWM: "linear-gradient(117.23deg, rgba(87, 187, 170, 0.2), rgba(72, 157, 158, 0.2) , rgba(105, 217, 188, 0.2) 80%)",
  LM: "linear-gradient(117.23deg, rgba(87, 187, 170, 0.2), rgba(72, 157, 158, 0.2) , rgba(105, 217, 188, 0.2) 80%)",
  CM: "linear-gradient(117.23deg, rgba(87, 187, 170, 0.2), rgba(72, 157, 158, 0.2) , rgba(105, 217, 188, 0.2) 80%)",
  RM: "linear-gradient(117.23deg, rgba(87, 187, 170, 0.2), rgba(72, 157, 158, 0.2) , rgba(105, 217, 188, 0.2) 80%)",
  LWB: "linear-gradient(117.23deg, rgba(92, 139, 245, 0.2), rgba(76, 103, 244, 0.2) , rgba(114, 192, 250, 0.2) 80%)",
  CDM: "linear-gradient(117.23deg, rgba(87, 187, 170, 0.2), rgba(72, 157, 158, 0.2) , rgba(105, 217, 188, 0.2) 80%)",
  RWB: "linear-gradient(117.23deg, rgba(92, 139, 245, 0.2), rgba(76, 103, 244, 0.2) , rgba(114, 192, 250, 0.2) 80%)",
  LB: "linear-gradient(117.23deg, rgba(92, 139, 245, 0.2), rgba(76, 103, 244, 0.2) , rgba(114, 192, 250, 0.2) 80%)",
  CB: "linear-gradient(117.23deg, rgba(92, 139, 245, 0.2), rgba(76, 103, 244, 0.2) , rgba(114, 192, 250, 0.2) 80%)",
  RB: "linear-gradient(117.23deg, rgba(92, 139, 245, 0.2), rgba(76, 103, 244, 0.2) , rgba(114, 192, 250, 0.2) 80%)",
  GK: "linear-gradient(97.23deg, rgba(209,198, 81, 0.2), rgba(186, 162, 64, 0.3) , rgba(226, 207, 84, 0.1) 80%)",
};

const PositionDotColor = (position) => {
  let color;

  switch (position) {
    case 'LWF':
    case 'ST':
    case 'RWF':
      color = '#FD6C4F';
      break;
    case 'LWM':
    case 'CAM':
    case 'RWM':
    case 'LM':
    case 'CM':
    case 'RM':
    case 'CDM':
      color = '#3CF3C1';
      break;
    case 'LWB':
    case 'RWB':
    case 'LB':
    case 'CB':
    case 'RB':
      color = '#33CAFE';
      break;
    case 'GK':
      color = '#F7E46D';
      break;
    default:
      color = '#000000'; 
  }

  return color;
};

export default PositionDotColor;


const PositionCoordinates = {
  LWF: { top: "10%", left: "20%" },
  ST: { top: "10%", left: "50%" },
  RWF: { top: "10%", left: "80%" },
  LWM: { top: "30%", left: "20%" },
  CAM: { top: "30%", left: "50%" },
  RWM: { top: "30%", left: "80%" },
  LM: { top: "50%", left: "20%" },
  CM: { top: "50%", left: "50%" },
  RM: { top: "50%", left: "80%" },
  LWB: { top: "70%", left: "20%" },
  CDM: { top: "70%", left: "50%" },
  RWB: { top: "70%", left: "80%" },
  LB: { top: "90%", left: "20%" },
  CB: { top: "90%", left: "50%" },
  RB: { top: "90%", left: "80%" },
  GK: { top: "110%", left: "50%" },
};

const AnalPositionColor = (position) => {
  let color;

  switch (position) {
    case 'LWF':
    case 'ST':
    case 'RWF':
      color = 'linear-gradient(180deg, #EC5C3A 0%, #FF8147 100%)';
      break;
    case 'LWM':
    case 'CAM':
    case 'RWM':
    case 'LM':
    case 'CM':
    case 'RM':
    case 'CDM':
      color = 'linear-gradient(180deg, #1DB48B 0%, #1EDAB7 100%)';
      break;
    case 'LWB':
    case 'RWB':
    case 'LB':
    case 'CB':
    case 'RB':
      color = 'linear-gradient(180deg, #5872FD 0%, #55AFFE 100%)';
      break;
    case 'GK':
      color = 'linear-gradient(180deg, #C5A922 0%, #DEC42F 100%)';
      break;
    default:
      color = '#000000'; 
  }

  return color;
}

export {PositionColor, PositionBackColor, PositionDotColor, PositionCoordinates, AnalPositionColor};


