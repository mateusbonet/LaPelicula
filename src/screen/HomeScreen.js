import React, {Component} from 'react';
import { View, Text, StyleSheet, BackHandler, Image} from 'react-native';
import {LPButton} from '../component/LPButton';

export default class HomeScreen extends Component{

  //Configurando opções de navegação
  static navigationOptions = ({navigation}) => ({
    tabBarLabel: 'Home',
    tabBarIcon: ({focused, tintColor}) => 
    {
      if(focused){
        return(
          <Image source={require('../img/home_ativo.png')} style={{width:26, height:26}}></Image>
        )
      }else{
        return(
          <Image source={require('../img/home_inativo.png')} style={{width:26, height:26}}></Image>
        )
      }
    }
  });

  constructor(props){
    super(props);
    this.state= {};

    this.proxima = this.proxima.bind(this);
    this.sair = this.sair.bind(this);
  }

  proxima(){
    //Passando para próxima tela
    this.props.navigation.navigate('Login');
  }
  sair(){
    //Sair do App
    BackHandler.exitApp();
  }

  render(){
    return(
      <View>
        <Text>Home</Text>
        <LPButton titulo="Próxima tela" onPress={() => {this.proxima()}}/>
        <LPButton titulo="Sair" onPress={() => {this.sair()}}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cntainer:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})