import { View, Text, Pressable, TouchableOpacity} from 'react-native'
import React, { useContext } from 'react'
import styles from "./style"
import { AuthContext } from '../../contexts/auth'

const Header = (props) => {
  const {userToken} = useContext(AuthContext)
  return (
    <View style={{flexDirection: "row"}}>
      <Pressable
          style={styles.nav}
          title="Main page"
          onPress={() => {props.navigation.navigate("todolist")}}
      >
        <Text style={styles.main_page}>MAIN PAGE</Text>
      </Pressable>
      <Pressable style={styles.info} onPress={()=>{props.navigation.navigate("private")}}>
       <Text style={{fontWeight: "bold", paddingHorizontal: 10, color: "orange", fontSize: 15, textAlign: "right"}}>{userToken.account.username}</Text>
     </Pressable>
     </View>
  )
}

export default Header