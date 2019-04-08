import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Trades from "./pages/trades";
import Withdraws from "./pages/withdraws";
import Header from "./UI/Header/Header";
export default function App() {
 let routes = (
  <Switch>
   <Route path="/withdraws" component={Withdraws} />
   <Route path="/trades" component={Trades} />
   <Redirect to="/trades" />
  </Switch>
 );

 return (
  <div>
   <Route path="/" component={Header} />
   {routes}
  </div>
 );
}
