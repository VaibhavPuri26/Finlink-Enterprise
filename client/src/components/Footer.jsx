import styled from 'styled-components';
function Footer() {
    const Copyright = styled.p`
  margin-top: 1.5rem;
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 1.5rem;
`
  return (
    <Copyright>
    &copy; 2024 Vaibhav Puri. All rights reserved.
    </Copyright>
  )
}

export default Footer
