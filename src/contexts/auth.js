import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {createContext, useEffect, useState} from 'react';

export const AuthContext = createContext();

const address = "http://192.168.1.12:5000"
export const AuthProvider = ({children}) => {
    
  const [userToken, setUserToken] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage]= useState("")

    const register = function(username, password, navigation){    
        if(username.length == 0 || password.length == 0){
            alert("Please fill in the fields")
            return false
        }
        setIsLoading(true)
        axios.post(`${address}/account/register`, {
            username: username,
            password: password
        })
        .then(function(res){
            if(res.data.msg == "Fail")
                console.log("This username is already in use")
            else{
                console.log("You register")
                navigation.navigate("login")
                setIsLoading(false)
            }
        })
        .catch(function(err){
            console.log(err)
        })
    }

    const login = function(username, password, navigation){
        if(username.length == 0 || password.length == 0){
            alert("Please fill in the fields")
            return false
        }
        setIsLoading(true)
        axios.post(`${address}/account/login`, {
            username: username,
            password: password
        })
        .then(function(res){
            if(res.data.msg == "Fail Username"){
                setMessage("Wrong username")
                console.log("Wrong username")
                setIsLoading(false)
            }
            else if(res.data.msg == "Fail Password"){
                setMessage("Wrong password")
                console.log("Wrong password")
                setIsLoading(false)
            }
            else{           
                setUserToken(res.data)
                AsyncStorage.setItem("token", JSON.stringify(res.data))
                setMessage("")
                setIsLoading(false)
                //navigation.navigate("todolist")
            }
        })
        .catch(function(err){
            console.log("Err", err)
        })
    }
    
    const logout = () => {
        console.log(userToken.account.username, "log out")
        AsyncStorage.removeItem("token")
        setUserToken({})
        
    }

    const isLoggedIn = async () => {
        try {
    
          let userInfo = await AsyncStorage.getItem("token")
          userInfo = JSON.parse(userInfo);
    
          if(userInfo) {
            setUserToken(userInfo)
          }
    
        } catch (e) {
          console.log(`is logged in error ${e}`)
        }
      }
    
    useEffect(() => {
    isLoggedIn();
    }, [])
    

  return (
    <AuthContext.Provider
      value={{register, login, logout, userToken, isLoading, message}}>
      {children}
    </AuthContext.Provider>
  );
};