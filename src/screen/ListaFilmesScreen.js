import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableHighlight, ImageBackground, TouchableOpacity, Picker } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import { FlatList } from 'react-native-gesture-handler';
var db = openDatabase({ name: 'lapelicula.db' });

//Component de Filmes
class Filmes extends Component {

  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={() => alert("Filme: " + this.props.data.descricao)} underlayColor="blue" >
          <ImageBackground resizeMode="cover" source={{ uri: this.props.data.imagem }} style={{ height: 150 }}>
            <View style={styles.viewFilme}>
              <Text style={{ fontSize: 23, color: 'black', fontWeight: 'bold' }}>{this.props.data.descricao}</Text>

              <View style={{ width: 30, heigth: 30 }}>
                <TouchableOpacity onPress={this.props.onPress}>
                  <View>
                    <Image source={require('../img/delete.png')} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </TouchableHighlight>
      </View>
    );
  }
}

export default class ListaFilmesScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      filmes: [],
      orderBy: 'descricao'
    };
  }

  buscarFilmes(ordenacao) {
    // buscar os dados dos filmes na base
    let query = (ordenacao == ''|| ordenacao == null || ordenacao == undefined) ? 'SELECT * FROM filme ORDER BY descricao' : 'SELECT * FROM filme ORDER BY ' + ordenacao;

    db.transaction(tx => {
      tx.executeSql(query, [],
        (tx, res) => {
          //tratar o resultado da consulta
          var temp = []

          for (let i = 0; i < res.rows.length; i++) {
            temp.push(res.rows.item(i));
          }
          // seta os filmes para exibir no flatlist
          this.setState({ filmes: temp });
        });
    });
  }

  excluirFilme(codigo) {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM filme WHERE codigo = ' + codigo, [],
        (tx, res) => {
          if (res.rowsAffected != 0) {
            alert('O filme foi exluído da sua lista!')
          }
        });
    });

    this.buscarFilmes();
  }

  buscarFilmesOrdenacao(ordenacao){
    this.setState({orderBy: ordenacao});
    this.buscarFilmes(ordenacao);
  }

  // configurando opções de navegação
  static navigationOptions = ({ navigation }) => ({
    tabBarLabel: 'Lista Filmes',
    tabBarIcon: ({ focused, tintColor }) => {
      if (focused) {
        return (
          <Image source={require('../img/home_ativo.png')} style={{ width: 26, height: 26 }}></Image>
        );
      } else {
        return (
          <Image source={require('../img/home_inativo.png')} style={{ width: 26, height: 26 }}></Image>
        );
      }
    }
  });

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Ordenação</Text>
        <Picker
          selectedValue={this.state.orderBy}
          style={{ height: 50, width: 200 }}
          onValueChange={(itemValue, itemIndex) =>
            this.buscarFilmesOrdenacao(itemValue)
          }>
          <Picker.Item label="Código" value="codigo"/>
          <Picker.Item label="Descrição" value="descricao"/>
        </Picker>
        <FlatList data={this.state.filmes} keyExtractor={item => item.codigo.toString()} renderItem={({ item }) => <Filmes onPress={() => this.excluirFilme(item.codigo)} data={item}></Filmes>}></FlatList>
      </View>
    );
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      // buscar os dados dos filmes na base
      this.buscarFilmes();
    });
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4'
  },
  viewFilme: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingBottom: 10
  },
  text:{
    color: '#808080',
    fontWeight: 'bold',
    fontSize: 18,
    padding: 5
  }
});