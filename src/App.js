// import React, { Component, Fragment } from 'react'
import React, { useState, Fragment, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { v4 as uuid } from "uuid";

// import AuthenticatedRoute from './components/shared/AuthenticatedRoute'
import AutoDismissAlert from "./components/shared/AutoDismissAlert/AutoDismissAlert";
import Header from "./components/shared/Header";
import RequireAuth from "./components/shared/RequireAuth";
import Home from "./components/Home";
import SignUp from "./components/auth/SignUp";
import SignIn from "./components/auth/SignIn";
import SignOut from "./components/auth/SignOut";
import ChangePassword from "./components/auth/ChangePassword";
import AllListing from "./components/AllListing";
import Contact from "./components/Contact";
import Profile from "./components/profile/Profile"
import ItemDetail from "./components/ItemDetail"
import NewForm from "./components/profile/NewForm";
import About from "./components/About";
import FavoriteList from "./components/profile/FavoriteList";
import apiUrl from "./apiConfig";
import EditItem from "./components/profile/EditItem";
import 'bootstrap/dist/css/bootstrap.min.css'

import CreatedListings from "./components/profile/CreatedListings";


const App = () => {
  
  const backgroundColor = {
    border: '#BCCCE0',
    backgroundColor: '#e3eaf2'
  }
  //set state
  const [user, setUser] = useState(null);
  const [msgAlerts, setMsgAlerts] = useState([]);
  //store all items from db in state
  const [allItems, setAllItems] = useState([])

  console.log("user in app", user);
  console.log("message alerts", msgAlerts);
  const clearUser = () => {
    console.log("clear user ran");
    setUser(null);
  };

  const deleteAlert = (id) => {
    setMsgAlerts((prevState) => {
      return prevState.filter((msg) => msg.id !== id);
    });
  };

  const msgAlert = ({ heading, message, variant }) => {
    const id = uuid();
    setMsgAlerts(() => {
      return [{ heading, message, variant, id }];
    });
  };

  useEffect(() => {
    console.log('getting items')
    getItems()
  }, [])

  //get al listings from the db
  const getItems = () => {
    fetch(apiUrl + '/items')
    .then(response=>response.json())
    .then(foundItems=>{
      setAllItems(foundItems)
      console.log('all Items: ', foundItems.items)
    })
    .catch(err => {
      console.log(err)
    })
  }

  return (
    <Fragment >
      <Header user={user} />
      <Routes >
        <Route path="/" element={<Home msgAlert={msgAlert} user={user} allItems={allItems} />} />
        <Route path="/listeditems" element={<AllListing allItems={allItems.items} />} />
        <Route path="/about" element={<About user={user}/>} />
        <Route path ="/contact" element={<Contact /> } />
        <Route path="/listeditems/:id" element={<ItemDetail user={user} />}></Route>
        <Route path ="/profile" element={<Profile refreshItem={getItems} user={user}/> } />
        <Route path ="/favorites" element={<FavoriteList user={user}/> } />
        <Route path ="/edititem" element={<NewForm refreshItem={getItems} user={user}/> } />

        {/* What is the above (line 80 ) for ? -Dino */}
        <Route path ="/items/edit/:id" element={<EditItem user={user} /> } />

        <Route path ="/mylistings" element={<CreatedListings user={user}/> } />\



        <Route
          path="/sign-up"
          element={<SignUp msgAlert={msgAlert} setUser={setUser} />}
        />
        <Route
          path="/sign-in"
          element={<SignIn msgAlert={msgAlert} setUser={setUser} />}
        />
        <Route
          path="/sign-out"
          element={
            <RequireAuth user={user}>
              <SignOut msgAlert={msgAlert} clearUser={clearUser} user={user} />
            </RequireAuth>
          }
        />
        <Route
          path="/change-password"
          element={
            <RequireAuth user={user}>
              <ChangePassword msgAlert={msgAlert} user={user} />
            </RequireAuth>
          }
        />
      </Routes>
      {msgAlerts.map((msgAlert) => (
        <AutoDismissAlert
          key={msgAlert.id}
          heading={msgAlert.heading}
          variant={msgAlert.variant}
          message={msgAlert.message}
          id={msgAlert.id}
          deleteAlert={deleteAlert}
        />
      ))}
    </Fragment>
  );
};

export default App;
