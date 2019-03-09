import React, {Component} from 'react';
import { View, Text, StyleSheet, Image} from 'react-native';
import {LPButton} from '../component/LPButton';
import {StackActions, NavigationActions} from 'react-navigation';

export default class SobreScreen extends Component{

  //Configurando opções de navegação
  static navigationOptions = ({navigation}) => ({
    tabBarLabel: 'Sobre',
    tabBarIcon: ({focused, tintColor}) => 
    {
      if(focused){
        return(
          <Image source={require('../img/cadastrar_ativo.png')} style={{width:26, height:26}}></Image>
        )
      }else{
        return(
          <Image source={require('../img/cadastrar_inativo.png')} style={{width:26, height:26}}></Image>
        )
      }
    } 
  });

  constructor(props){
    super(props);
    this.state= {};

    this.voltar = this.voltar.bind(this);
    this.telaPrincipal = this.telaPrincipal.bind(this);
  }

  voltar(){
    //Passando para próxima tela
    this.props.navigation.goBack();
  }

  telaPrincipal(){
    //Passando para próxima tela
    this.props.navigation.dispatch(
      StackActions.reset({
        index:0,
        actions:[
          NavigationActions.navigate({routeName:'Home'})
        ]
      })
    )
  }

  render(){
    return(
      <View>
        <Text>Sobre</Text>
          <LPButton titulo="Voltar" onPress={() => {this.voltar()}}/>
          <LPButton titulo="Tela Principal" onPress={() => {this.telaPrincipal()}}/>
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