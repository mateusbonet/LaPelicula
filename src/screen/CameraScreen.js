import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Button, TouchableOpacity } from 'react-native';
import { RNCamera } from 'react-native-camera';

export default class CameraScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null
  });

  constructor(props) {
    super(props);
    this.state = {
      uri: null
    }

    this.capturarFoto = this.capturarFoto.bind(this);
  }

  capturarFoto = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      let state = this.state;
      state.uri = data.uri;
      this.setState(state);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 2 }}>
          <RNCamera style={styles.preview} ref={ref => { this.camera = ref; }} captureAudio={false} type={RNCamera.Constants.Type.back} flashMode={RNCamera.Constants.FlashMode.on} permissionDialogTitle={'Precisamos de permissão para acessar a camera.'}></RNCamera>
        </View>
        <View style={{ flex: 0.5, flexDirection: 'row', justifyContent: 'center' }}>
          <Button title='Capturar' onPress={() => {this.capturarFoto()}}></Button>
        </View>
        <View style={{ flex: 1.5, justifyContent: 'center', alignItems:'center'}}>
          <Image style={{ borderWidth: 1, borderColor: 'black', height: 150, width: 150 }} source={{ uri: this.state.uri }}></Image>
          <View style={{ flexDirection: 'row' }}>
            <Button title='OK' onPress={() => this.props.navigation.navigate('Filme', { imguri: this.state.uri })}></Button>
            <Button title='Cancelar' onPress={() => this.props.navigation.navigate('Filme')}></Button>
          </View>
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black'
  },
  preview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});