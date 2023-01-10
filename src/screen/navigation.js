import TodoList from '../screen/todolist';
import UpdateTask from '../screen/updateTask';
import Login from '../screen/login';
import Register from '../screen/register';
import PrivateHome from './privateHome';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../contexts/auth';
import { useContext } from 'react';
const Stack = createNativeStackNavigator();


const Navigation = () => {
  const {userToken} = useContext(AuthContext)
  return (
    <NavigationContainer>
    <Stack.Navigator 
        initialRouteName="login"
        screenOptions={{
          headerShown: false
        }}
      >
        {userToken.token ? (
          <>
          <Stack.Screen name="todolist" component={TodoList} />
          <Stack.Screen name="updateTask" component={UpdateTask} />
          <Stack.Screen name="private" component={PrivateHome} />
          </>
          ) : (
          <>
          <Stack.Screen name="login" component={Login} />
          <Stack.Screen name="register" component={Register} />   
          </>
          )
        }
        
        
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigation