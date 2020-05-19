import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// import logo from "./logo.svg";
import "semantic-ui-css/semantic.min.css";
import ListUsers from "./routes/ListUsers";
import CreateUser from "./routes/CreateUser";
import UpdateUser from "./routes/UpdateUser";
import { Header, Container } from "semantic-ui-react";

const style = {
  h1: {
    marginTop: "3em",
  }
};

function App() {
  return (
    <Router>
      <div>
        <Header
          as="h1"
          content="Amigo Secreto"
          style={style.h1}
          textAlign="center"
        />
        <Container>
          <Switch>
            <Route path="/new-user">
              <CreateUser />
            </Route>
            <Route path="/users/:id/edit">
              <UpdateUser />
            </Route>
            <Route path="/users">
              <ListUsers />
            </Route>

            <Route path="/">
              <ListUsers />
            </Route>
          </Switch>
        </Container>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      </div>
    </Router>
  );
}


export default App;
