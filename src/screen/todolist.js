import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, Pressable, FlatList  } from 'react-native';
import Form from '../components/form'
import Header from "../components/header"
import { useContext, useEffect, useState } from 'react';
import { Button} from 'react-native';
import axios from 'axios';
import Checkbox from 'expo-checkbox';
import { AntDesign } from '@expo/vector-icons'; 
import { AuthContext } from '../contexts/auth';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Card } from 'react-native-paper';
import Constants from 'expo-constants';

const address = "http://192.168.1.12:5000"
const TodoList = ({navigation, route}) => {
  
//   // const testbtn = function(){                      //fetch api
//   //   fetch("http://192.168.1.7:5000/entity/test", {
//   //       method: 'GET',
//   //       headers: {
//   //           'Content-Type': 'application/json',
//   //       },
//   //   })
//   //   .then(async res => { 
//   //       try {
//   //           const jsonRes = await res.json();
//   //           if (res.status === 200) {
//   //               var arr = []
//   //               for(var i = 0; i < jsonRes.length; i++){
//   //                 arr.push(jsonRes[i].name) 
//   //               }
//   //               setTaskList([...taskList, ...arr])
//   //           }
//   //       } catch (err) {
//   //           console.log(err);
//   //       };
//   //   })
//   //   .catch(err => {
//   //       console.log(err);
//   //   });
//   // }

//   // const showTask = async function(){       //Viet kieu async await
//   //   try {
//   //     const res = await axios.get("http://192.168.1.7:5000/entity/test")
//   //     const data = res.data
//   //     var arr = []
//   //     for(var i = 0; i < data.length; i++){
//   //       arr.push(data[i].name) 
//   //     }
//   //     setTaskList([...taskList, ...arr])
//   //   } catch (error) {
//   //     console.log(error.message)
//   //   }
//   // }

  const [isSelectedAll, setSelectionAll] = useState(false)
  const {userToken} = useContext(AuthContext)
  const [tasks, setTasks] = useState([])
  const [checked, setChecked] = useState([])

  const findAllTask = function(){
    axios.get(`${address}/entity/task`, {
        headers: {Authorization: `Bearer ${userToken.token}`},
      })
      .then(function(res){
        var arr = []
        for(var i = 0; i < res.data.length; i++){
          arr.push(res.data[i])
        }
        //arr = arr.map((v)=>({...v, isChecked: false}))
        setTasks(arr)
      })
      .catch(function(err){
        console.log("Err:", err)
      })
  }

  const createTask = function(task){
    axios.post(`${address}/entity/create`, {
      name: task
    },{
      headers: {Authorization: `Bearer ${userToken.token}`},
    } )
      .then(function(res){
        console.log("Create Task")
      })
      .catch(function(err){
        console.log(err)
      })
  }

  const deleteTask = function(id){
    Alert.alert(
      "This task will be delete",
      "Are you sure ?",
      [
        { 
          text: "OK", onPress: () => {
            axios.delete(`${address}/entity/delete/${id}`, {
              headers: {Authorization: `Bearer ${userToken.token}`},
            })
              .then(function(res){
                console.log("Delete Task")
              })
              .catch(function(err){
                console.log(err)
              })
          } 
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Delete Pressed"),
          style: "cancel"
        }
      ]
    );
  }

  const deleteManyTask = function(ids){
    if(ids.length == 0){
      alert("Please select tasks to delete")
        return false
    }
    else{
      Alert.alert(
        "These tasks will be delete",
        "Are you sure ?",
        [
          { 
            text: "OK", onPress: () => {
              ids = ids.join("&")
              axios.delete(`${address}/entity/action/delete/${ids}`,  {
                  headers: {Authorization: `Bearer ${userToken.token}`},
                })
                .then(function(res){
                  console.log("Delete Many Task")
                  setSelectionAll(false)
                })
                .catch(function(err){
                  console.log(err)
                })
            } 
          },
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Delete Pressed"),
            style: "cancel"
          }
        ]
      )
    } 
  }

  useEffect(function(){
    findAllTask()
  }, [tasks])
    
  const handleChange = (id) => {
      const clickedCategory = checked.indexOf(id)
      const all = [...checked]
      if (clickedCategory === -1)
          all.push(id)
      else
          all.splice(clickedCategory, 1)
      all.length == tasks.length ? setSelectionAll(true) : setSelectionAll(false)

      setChecked(all)
  }

  const display = (id) => {
      const temp = [...checked]
      for(var i = 0; i < temp.length; i++)
          if(temp[i] == id)
              return true
      return false
  }

  const handleSelectAll = () => {
      if(isSelectedAll == false){
        setSelectionAll(true)
        var temp = []
        for(var i = 0; i < tasks.length; i++)
            temp.push(tasks[i]._id)
        setChecked(temp)
      }
      else{
        setSelectionAll(false)
        var temp = []
        setChecked(temp)
      }
  }
  return (
      <View style={styles.container}>
          <View style={styles.header}>
              <Header navigation={navigation} route={route}/>
              <Text style={styles.titleText}>Todo List</Text>
          </View>
          <View style={styles.body}>
              <View>
                  <ScrollView>
                      <View style={{flexDirection: "row", marginBottom: 20}}>
                          <Checkbox
                              value={isSelectedAll}
                              onValueChange={handleSelectAll}
                              color={isSelectedAll ? '#4630EB' : undefined}
                              style={{marginRight: 10, marginTop: 10, width: 25, height: 25}}
                          />
                          <Text style={{marginTop: 13}}>Select All</Text>
                          <Pressable style={{marginTop: 10, marginLeft: 10}} onPress={()=>{deleteManyTask(checked)}}>
                              <Text style={{}}><AntDesign name="delete" size={24} color="red" /></Text>
                          </Pressable>
                      </View>
                      {
                      tasks.map(function(item, index){
                          return  <View key={index} style={styles.main}>
                                      <Checkbox
                                          value={display(item._id)}
                                          onValueChange={()=>{handleChange(item._id)}}
                                          color={display(item._id) ? '#4630EB' : undefined}
                                          style={{marginRight: 10, marginTop: 10, width: 25, height: 25}}
                                      />
                                      <TouchableOpacity style={{flex: 1}} onPress={()=>{navigation.navigate("updateTask", {_id: item._id, name: item.name})}}>
                                          <Text style={styles.item}>{index+1}. {item.name.length > 25 ? item.name.slice(0, 25) + " ..." : item.name}</Text>
                                      </TouchableOpacity>
                                      <Pressable
                                          style={{marginTop: 10}} 
                                          onPress={()=>deleteTask(item._id)}        
                                      >
                                          <Text style={{}}><AntDesign name="delete" size={24} color="red" /></Text>
                                      </Pressable >
                                  </View>
                          })
                      }
          
                  </ScrollView>
              </View>
          </View>
          <View style={styles.footer}>
              <Form onAddTask = {createTask}/>
          </View>
          
          <StatusBar style="auto" />
      </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#e7feff"
    },
    titleText: {
      color: "blue",
      fontSize: 25,
      fontWeight: "bold",
      textAlign: "center",
      fontStyle: "italic",
      marginTop: 10
    },
    body: {
      flex: 1,
      paddingTop: 10,
      paddingHorizontal: 18
    },
    nav: {
      borderRadius: 44
    },
    btn: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 4,
      elevation: 3,
      backgroundColor: 'red',
      width: "15%",
      marginLeft: 10
    },
    btn_text: {
      fontSize: 15,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'white',
    },
    main: {
        flexDirection: "row"
    },
    item: {
        marginLeft: 10,
        marginBottom: 15,
        backgroundColor: "#fff",
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: "90%",
        
      },
  });

export default TodoList;