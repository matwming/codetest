import React from "react";
import { Button } from "element-react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";

const OutDiv = styled.div`
/* if the current url is active, then active className is applied */
 .active {
  background-color: yellow;
  transform: scale(1.2);
 }
`;

function Header(props) {
//click 'Trades' or "Withdraws" to navigate
 const changePath = path => {
  props.history.push(path);
 };

 // isActive function is used to determine whether active className is applied
 const isActive = value => {
  let isActive = null;
  const currentUrl = window.location.href;
     const res = currentUrl.indexOf(value);
  if (res !== -1) {
   isActive = "active";
  }
  return isActive;
 };
 return (
  <OutDiv>
   <div className="container bg-info mt-3 p-2 mb-2">
    <div className="row">
     <div className="col-sm-4 offset-4 text-center">
      <Button onClick={() => changePath("/")} className={isActive("trades")}>
       Trades
      </Button>
      <Button onClick={() => changePath("/withdraws")} className={isActive("withdraws")}>
       Withdraws
      </Button>
     </div>
    </div>
   </div>
  </OutDiv>
 );
}
export default withRouter(Header);
