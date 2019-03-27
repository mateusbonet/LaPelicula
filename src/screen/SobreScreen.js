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
      <View style={styles.container}>
        <Text style={styles.text}>Sobre</Text>
        <Text style={styles.text}>La Pelicula Filmes</Text>
        <Text style={styles.text}>Versão: 1.0</Text>
        <Text style={styles.text}>Desenvolvimento por Mateus Bonet - UNOESC</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
  text:{
    color: '#808080',
    fontWeight: 'bold',
    textAlign: 'center'
  }
})