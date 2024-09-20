import React from 'react';
import Nav from '../../components/display/Nav';
import styled from 'styled-components';
import Product1 from '../../assets/display/productPage/Product1.png';
import Product2 from '../../assets/display/productPage/Product2.png';
import Product3 from '../../assets/display/productPage/Product3.png';
import Product4 from '../../assets/display/productPage/Product4.png';
import RightBtn from '../../components/display/RightBtn';
import LeftBtn from '../../components/display/LeftBtn';
import { useNavigate } from 'react-router-dom';

const Product = () => {
  const navigate = useNavigate();
  return (
    <ProductStyle>
      <Nav arrow='true'/>
      <section className='product1'>
        <img src={Product1} className='img1'/>
        <div className='rightbtn'><RightBtn bgColor='#616161' children='자세히' onClick={() => navigate('/display/gps')}/></div>
      </section>
      <section className='product2'>
        <div className='leftbtn'><LeftBtn bgColor='#616161' children='자세히' onClick={() => navigate('/display/analysis')}/></div>
        <img src={Product2} className='img2'/>
      </section>
      <section className='product1'>
        <img src={Product3} className='img1'/>
        <div className='rightbtn'><RightBtn bgColor='#616161' children='자세히' onClick={() => navigate('/display/vest')}/></div>
      </section>
      <section className='product2'>
        <div className='leftbtn'><LeftBtn bgColor='#616161' children='자세히' onClick={() => navigate('/display/cam')}/></div>
        <img src={Product4} className='img2'/>
      </section>
    </ProductStyle>
  );
};

export default Product;

const ProductStyle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media screen and (max-width: 768px){
    .product1{
      height: 18vh;
      padding: 1vh 0;
      display: flex;
      justify-content: center;
      align-items: center;
      border-bottom: .15vh solid #055540;
      .img1{
        height: 15vh;
      }
      .rightbtn{
        position: absolute;
        right: 8vw;
      }
    }
    .product2{
      height: 18vh;
      padding: 1vh 0;
      display: flex;
      justify-content: center;
      align-items: center;
      border-bottom: .15vh solid #055540;
      .img2{
        height: 15vh;
      }
      .leftbtn{
        position: absolute;
        left: 8vw;
      }
    }
  }
  @media (min-width: 769px) and (max-width: 1280px) {
    .product1{
      height: 25vw;
      padding: 1vw 0;
      display: flex;
      justify-content: center;
      align-items: center;
      border-bottom: .15vh solid #055540;
      .img1{
        height: 20vw;
        padding: 0 20vw 0 0;
      }
    }
    .product2{
      height: 25vw;
      padding: 1vh 0;
      display: flex;
      justify-content: center;
      align-items: center;
      border-bottom: .15vh solid #055540;
      .img2{
        height: 20vw;
        padding: 0 0 0 20vw;
      }
    }
  } 
  @media screen and (min-width: 1281px){
    align-items: center;
    .product1{
      height: 25vh;
      padding: 1vw 0;
      display: flex;
      justify-content: center;
      align-items: center;
      border-bottom: .15vh solid #055540;
      width: 60vw;
      .img1{
        height: 20vh;
        padding: 0 20vw 0 0;
      }
    }
    .product2{
      height: 25vh;
      padding: 1vh 0;
      display: flex;
      justify-content: center;
      align-items: center;
      border-bottom: .15vh solid #055540;
      width: 60vw;
      .img2{
        height: 20vh;
        padding: 0 0 0 20vw;
      }
    }
  }
  
`