import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native'
import React, { useContext } from 'react'
import Header from "../components/header"
import { useEffect, useState } from 'react';
import { Button } from 'react-native';

import axios from 'axios';
import { AuthContext } from '../contexts/auth';

const address = "http://192.168.1.12:5000"
const UpdateTask = ({navigation, route}) => {
  const [task, setTask] = useState(route.params.name)
  const {userToken} = useContext(AuthContext)
  const updateTask = function(){
    axios.put(`${address}/entity/update/${route.params._id}`, {
      name: task
    }, {
      headers: {Authorization: `Bearer ${userToken.token}`},
    })
      .then(function(res){
        console.log("Update Task")
        navigation.navigate("todolist")
      })
      .catch(function(err){
        console.log("Err", err)
      })
  }
  return (
    <View>
      <Header navigation={navigation} route={route}/>
      <View style={{marginTop: 10, marginLeft: 10}}>
        <Text style={{fontSize: 25, textAlign: "center", color: "blue", fontStyle: "italic", fontWeight: "bold"}}>Update Task</Text>
        <Text>Name</Text>
        <TextInput
            multiline={true}
            // numberOfLines={4}
            value={task} 
            placeholder='Enter...' 
            style={styles.input}
            onChangeText = {(text) => setTask(text)}
        >

        </TextInput>
        <Pressable style={styles.btn} onPress={updateTask}>
          <Text style={styles.btn_text}>Update</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    marginTop: 10,
    height: 80,
    width: "80%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#21a3d0",
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  btn: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'green',
    width: "25%",
    
  },
  btn_text: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});

export default UpdateTask