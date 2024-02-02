import styles from "./AgreeCheckbox.module.css";
import { useState } from "react";

function AgreeCheckbox({color}){
    const [allAgreed, setAllAgreed] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [marketingAgreed, setMarketingAgreed] = useState(false);
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
    setAllAgreed(checked);
    setTermsAgreed(checked);
    setPrivacyAgreed(checked);
    setMarketingAgreed(checked);
  }

  function handleTermsAgreeChange(event) {
    setTermsAgreed(event.target.checked);
  }

  function handlePrivacyAgreeChange(event) {
    setPrivacyAgreed(event.target.checked);
  }

  function handleMarketingAgreeChange(event) {
    setMarketingAgreed(event.target.checked);
  }

    return(
        <div className={styles.accept}>
            <div className={styles.block6}>
                <label >
                    <input type="checkbox" value="모두 동의합니다" checked={allAgreed} onChange={handleAllAgreeChange} style={allAgreed ? {'backgroundColor': color } : null}/>
                    
                    <p className={styles.agreeAll}> 모두 동의합니다</p>
                </label>
                < div className={styles.block3}>
                    <label >
                    <input
                        type="checkbox"
                        checked={termsAgreed}
                        onChange={handleTermsAgreeChange}
                        style={termsAgreed ? {'backgroundColor': color } : null}
                    />
                    <p className={styles.text}>이용약관 동의</p>
                    </label>
                    <label >
                    <input
                        type="checkbox"
                        checked={privacyAgreed}
                        onChange={handlePrivacyAgreeChange}
                        style={privacyAgreed ? {'backgroundColor': color } : null}
                    />
                    <p className={styles.text}>개인정보 취급방침 동의</p>
                    
                    </label>
                    <label>
                    <input
                        type="checkbox"
                        checked={marketingAgreed}
                        onChange={handleMarketingAgreeChange}
                        style={marketingAgreed ? {'backgroundColor': color } : null}
                    />
                    <p className={styles.text}> 마케팅 정보 수신 동의</p>
                   
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