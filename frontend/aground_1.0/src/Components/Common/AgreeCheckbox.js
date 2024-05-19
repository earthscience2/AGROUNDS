import styles from "./AgreeCheckbox.module.css";
import { useState } from "react";

function AgreeCheckbox({color, setIsAgree,setAllAgree, setMarketingAgree, setTermsAgree, setPrivacyAgree,allAgree,marketingAgree,termsAgree,privacyAgree}){
    
  const [inputValue, setInputValue] = useState('');
  
  
  const handleInputChange = (event) => {
    let value = event.target.value;
    if (value.length > 8) {
      value = value.slice(0, 8);
    }
    setInputValue(value);
  };
  function handleAllAgreeChange(event) {
    const { checked } = event.target;
    setAllAgree(checked);
    setTermsAgree(checked);
    setPrivacyAgree(checked);
    setMarketingAgree(checked);
    
  }
  
  
  
  function handleTermsAgreeChange(event) {
    setTermsAgree(event.target.checked)
   
  }

  function handlePrivacyAgreeChange(event) {
    setPrivacyAgree(event.target.checked)
 
  }

  function handleMarketingAgreeChange(event) {
    setMarketingAgree(event.target.checked)
    
  }

    return(
        <div className={styles.accept}>
            <div className={styles.block6}>
                <label >
                    <input type="checkbox" value="모두 동의합니다" checked={allAgree} onChange={handleAllAgreeChange} style={allAgree ? {'backgroundColor': color } : null}/>
                    
                    <p className={styles.agreeAll}> 모두 동의합니다</p>
                </label>
                < div className={styles.block3}>
                    <label >
                    <input
                        type="checkbox"
                        checked={termsAgree}
                        onChange={handleTermsAgreeChange}
                        style={termsAgree ? {'backgroundColor': color } : null}
                    />
                    <p className={styles.text}>이용약관 동의 (필수)</p>
                    </label>
                    <label >
                    <input
                        type="checkbox"
                        checked={privacyAgree}
                        onChange={handlePrivacyAgreeChange}
                        style={privacyAgree ? {'backgroundColor': color } : null}
                    />
                    <p className={styles.text}>개인정보 취급방침 동의 (필수)</p>
                    
                    </label>
                    <label>
                    <input
                        type="checkbox"
                        checked={marketingAgree}
                        onChange={handleMarketingAgreeChange}
                        style={marketingAgree ? {'backgroundColor': color } : null}
                    />
                    <p className={styles.text}> 마케팅 정보 수신 동의 (선택)</p>
                   
                     </label>
                </div>
            </div>
        
                
            <div className={styles.block5}>
                <a href="/" className={styles.look}>보기  &gt;</a>
                <a href="/" className={styles.look}>보기  &gt;</a>
                <a href="/" className={styles.look}>보기  &gt;</a>
            
            </div>
        </div>
                
            
    )
}
export default AgreeCheckbox;