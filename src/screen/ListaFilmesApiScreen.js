import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Picker } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { LPButton } from '../component/LPButton';

//Component de Filmes
class Filmes extends Component {

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.viewFilme}>
          <Text style={{ fontSize: 18, color: 'black', fontWeight: 'bold' }}>Título: {this.props.data.Title}</Text>
          <Text style={{ fontSize: 18, color: 'black', fontWeight: 'bold' }}>Ano: {this.props.data.Year}</Text>
        </View>
      </View>
    );
  }
}

export default class ListaFilmesApiScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pesquisa: '',
      filmes: [],
      filtro: 's'
    };

    this.pesquisar = this.pesquisar.bind(this);

  }

  pesquisar() {

    let url = 'http://www.omdbapi.com/?s=' + this.state.pesquisa + '&apikey=67a96ffc';

    if (this.state.filtro == 'y') {
      url = 'http://www.omdbapi.com/?s=' + this.state.pesquisa + '&y=' + this.state.pesquisa + '&apikey=67a96ffc';
    }

    fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'content-type': 'multipart/form-data'
      }
    }).then((response) => response.json())
      .then((responseJson) => {

        let ret = responseJson['Search'] == undefined ? [] : responseJson['Search'];
        this.setState({ filmes: ret })

      })
  }

  // configurando opções de navegação
  static navigationOptions = ({ navigation }) => ({
    tabBarLabel: 'Buscar Filme API',
    tabBarIcon: ({ focused, tintColor }) => {
      if (focused) {
        return (
          <Image source={require('../img/video_ativo.png')} style={{ width: 26, height: 26 }}></Image>
        );
      } else {
        return (
          <Image source={require('../img/video_inativo.png')} style={{ width: 26, height: 26 }}></Image>
        );
      }
    }
  });

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Filtrar por:</Text>
        <Picker
          selectedValue={this.state.filtro}
          style={{ height: 50, width: 200 }}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({ filtro: itemValue })
          }>
          <Picker.Item label="Titulo" value="s" />
          <Picker.Item label="Ano" value="y" />
        </Picker>
        <View style={styles.areaInput}>
          <TextInput style={styles.inputText}
            multiline={true} placeholder='Pesquisar...'
            onChangeText={(valor) => this.setState({ pesquisa: valor })} />
        </View>
        <View>
          <LPButton titulo='Pesquisar' onPress={() => this.pesquisar()} />
        </View>
        <View style={{ padding: 15}}>
          <FlatList data={this.state.filmes} keyExtractor={item => item.Title.toString()} renderItem={({ item }) => <Filmes data={item}></Filmes>}></FlatList>
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4'
  },
  text: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 18,
    padding: 5
  },
  inputText: {
    fontSize: 18,
    borderWidth: 1,
    borderColor: 'gray'
  },
  areaInput: {
    width: '98%'
  },
  viewFilme: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#D3D3D3',
    borderRadius: 5,
    paddingLeft: 10,
    margin: 5,
    paddingBottom: 10
  }
});