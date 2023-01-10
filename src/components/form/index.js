import { View, Text, TextInput, TouchableOpacity, Keyboard } from 'react-native'
import React, {useState} from 'react'
import styles from './style'

const Form = (props) => {
    const [task, setTask] = useState("")
    const hanldeAddTask = function(){
        if(task.length == 0){
            alert("Please enter task")
            return false
        }
        props.onAddTask(task)
        setTask("")
        Keyboard.dismiss()
    }
    return (
        <View style={styles.addTask}>
            <TextInput
                value={task} 
                placeholder='Enter...' 
                style={styles.input}
                onChangeText = {(text) => setTask(text)}
            >
            </TextInput>
            <TouchableOpacity onPress={hanldeAddTask}>
                <View style={styles.iconWrapper}>
                    <Text style={styles.icon}>+</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default Form