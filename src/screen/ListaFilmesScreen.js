import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TextInput, ImageBackground, TouchableOpacity, Picker, Modal } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import { FlatList } from 'react-native-gesture-handler';
import { LPButton } from '../component/LPButton';
var db = openDatabase({ name: 'lapelicula.db' });

//Component de Filmes
class Filmes extends Component {

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.props.onClick}>
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
        </TouchableOpacity>
      </View>
    );
  }
}

export default class ListaFilmesScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      codigo: null,
      descricao: '',
      uri: null,
      modalVisible: false,
      filmes: [],
      orderBy: 'descricao'
    };

    this.abrirCamera = this.abrirCamera.bind(this);
    this.editar = this.editar.bind(this);
  }

  buscarFilmes(ordenacao) {
    // buscar os dados dos filmes na base
    let query = (ordenacao == '' || ordenacao == null || ordenacao == undefined) ? 'SELECT * FROM filme ORDER BY descricao' : 'SELECT * FROM filme ORDER BY ' + ordenacao;

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

  openModal(codigo) {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM filme WHERE codigo = ' + codigo, [],
        (tx, res) => {

          this.setState({ modalVisible: true });

          if (res.rows.item(0) != undefined || res.rows.item(0).length > 0) {
            this.setState({ codigo: codigo });
            this.setState({ descricao: res.rows.item(0).descricao });
            this.setState({ uri: res.rows.item(0).imagem });
          }
        });
    });

  }
  closeModal() {
    this.setState({ modalVisible: false });
  }

  buscarFilmesOrdenacao(ordenacao) {
    this.setState({ orderBy: ordenacao });
    this.buscarFilmes(ordenacao);
  }

  abrirCamera() {
    this.props.navigation.navigate('Camera', { codigo : this.state.codigo, uri: this.state.uri});
  }

  editar() {
    
    //Atualiza as informações do filme
    db.transaction(tx => {
      tx.executeSql('UPDATE filme SET descricao = ?, imagem = ? WHERE codigo = ?', [this.state.descricao, this.state.uri, this.state.codigo]);
    })

    this.closeModal();
    this.buscarFilmes();
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
          <Picker.Item label="Código" value="codigo" />
          <Picker.Item label="Descrição" value="descricao" />
        </Picker>
        <FlatList data={this.state.filmes} keyExtractor={item => item.codigo.toString()} renderItem={({ item }) => <Filmes onClick={() => this.openModal(item.codigo)} onPress={() => this.excluirFilme(item.codigo)} data={item}></Filmes>}></FlatList>
        <Modal visible={this.state.modalVisible} animationType={'slide'} onRequestClose={() => this.closeModal()} style={styles.modal}>
          <View style={styles.container}>
            <View style={styles.areaFoto}>
              <View style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                <Image source={{ uri: this.state.uri }} style={{ backgroundColor: 'blue', justifyContent: 'center', alignItems: 'flex-start', width: 150, height: 150, marginBottom: 40 }} />
              </View>
              <View style={{ width: 50, heigth: 50 }}>
                <TouchableOpacity onPress={() => { this.abrirCamera() }}>
                  <View>
                    <Image source={require('../img/captura.png')} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.areaInput}>
              <TextInput style={styles.inputText}
                multiline={true} placeholder='Descrição'
                onChangeText={(valor) => this.setState({ descricao: valor })}>{this.state.descricao}</TextInput>
            </View>
            <View style={styles.areaBotao}>
              <View style={{ flex: 1 }}>
                <LPButton titulo='Salvar' onPress={() => this.editar()} />
                <LPButton titulo='Cancelar' onPress={() => this.closeModal()} />
              </View>
            </View>
          </View >
        </Modal>
      </View>
    );
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      // buscar os dados dos filmes na base
      this.buscarFilmes();
    });

    if(navigation.getParam('codigo', null) != null){
      
      this.setState({ uri: navigation.getParam('imguri', null)});
      this.setState({ codigo: navigation.getParam('codigo', null)});
      this.setState({ modalVisible: true });
    }
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
  text: {
    color: '#808080',
    fontWeight: 'bold',
    fontSize: 18,
    padding: 5
  },
  inputText: {
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'gray'
  },
  areaBotao: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center'
  },
  areaInput: {
    width: '98%'
  },
  areaFoto: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});