// import React from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import './SellMyCar.css'; // Import the CSS file
import Container from '../../components/Container/Container';
import AdSpace from '../../components/SellMyCar_Components/AdSpace/AdSpace';
import Card from '../../components/SellMyCar_Components/Card/CardComponent';
import CardContainer from '../../components/SellMyCar_Components/Card Container/CardContainer';
import FAQ from '../../components/SellMyCar_Components/FAQ/FAQ';
import { useNavigate } from 'react-router-dom';

const faqData = [
  { question: "Question 1", answer: "This is the answer to question 1." },
  { question: "Question 2", answer: "This is the answer to question 2." },
  { question: "Question 3", answer: "This is the answer to question 3." },
  { question: "Question 4", answer: "This is the answer to question 4." },
];


const SellMyCar = () => {

  const navigate = useNavigate();

  const handleclick1 = () => {
    navigate('/consignment'); // Navigate to the Consignment page
  }
  const handleclick2 = () => {
    navigate('/post-ad'); // Navigate to the Post a Free Add page
  }
  const handleclick3 = () => {
    navigate('/quicksell'); // Navigate to the QuickSell page
  }

  return (
    <div className='sellmycar'>
       <Navbar />       
       <Container>
         <AdSpace width="728px" height="90px" adContent={<img src="ad-banner.jpg" alt="Ad" />} /> 
          <CardContainer>
            <Card title='CONSIGNMENT' onClick={handleclick1}/>
            <Card title='POST A FREE AD' onClick={handleclick2}/>
            <Card title='QUICK SELL' onClick={handleclick3}/>
          </CardContainer>
          <FAQ faqs={faqData} />
       </Container>
       <Footer/>
    </div>
  )
}

export default SellMyCar;
