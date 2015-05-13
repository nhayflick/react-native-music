/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  Image,
  ListView,
  NavigatorIOS,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  View
} = React;

var AVPlayerManager = require('NativeModules').AVPlayerManager;
var DeviceEventEmitter = require('RCTDeviceEventEmitter');


var SOUNDCLOUD_CLIENT_ID = 'ff3108ddadaeeea1c2cd56d0b3617255';
var REQUEST_URL = 'http://api.soundcloud.com/tracks.json?client_id=' + SOUNDCLOUD_CLIENT_ID;

var AwesomeProject = React.createClass({
  componentWillUnmount: function () {
    AVPlayerManager.pause();
    console.log('unmount');
  },
  render: function () {
    return (
      <NavigatorIOS
        style={styles.navContainer}
        barTintColor='blue' 
        titleTextColor='white' 
        initialRoute={{
          title: 'ReactCloud',
          component: ResultsScreen
        }}/>
      );
  }
});

var ResultsScreen = React.createClass({
  getInitialState: function () {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
      }),
      loaded: false
    };
  },
  componentDidMount: function () {
    this.fetchData();
    this.subscriptions = [];
    this.subscriptions.push(DeviceEventEmitter.addListener(
      'UpdatePlaybackTime',
      (media) => console.log(media.iCurrentTime)
    ));
  },
  fetchData: function(query) {
    var queryString = '';
    if (query) {
      queryString = '&q=' + query
    }
    fetch(REQUEST_URL + queryString)
      .then((response) => response.json())
      .then((responseData) => {

        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData),
          loaded: true
        });
      })
      .done();
  },
  onSearchChange: function (event) {
    var q = event.nativeEvent.text.toLowerCase();
    this.fetchData(q);
  },
  render: function() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }
    return (<ListView 
            dataSource={this.state.dataSource}
            renderRow={this.renderTrack}
            renderSectionHeader={section => this.renderSearchBar(section)}
            pageSize={10} 
            style={styles.listView} />);
  },
  renderLoadingView: function () {
    return (
      <View style={styles.container}>
        <Text>
          Loading movies...
        </Text>
      </View>
    )
  },
  renderSearchBar: function () {
    return (
      <TouchableHighlight style={styles.container}>
        <TextInput onChange={this.onSearchChange} placeholder={'Search Here'} autoFocus={true} style={styles.searchContainer}/>
      </TouchableHighlight>
    )
  },
  renderTrack: function (track) {
    return (
      <View style={styles.container} >
        <Image
          style={styles.thumbnail}
          source={{uri: track.artwork_url}}>
        </Image>
        <TouchableOpacity onPress={() => this.selectTrack(track)}>
          <View style={styles.containerRight}>
              <Text style={styles.title}>{track.title}</Text>
              <Text style={styles.year}>{track.user.username}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  },
  selectTrack: function (track) {
    this.props.navigator.push({
      title: track.title,
      component: TrackScreen,
      passProps: {track}
    });
  }
});

var TrackScreen = React.createClass({
  render: function () {
    return (
      <View style={styles.trackScreen}>
       <Image
          style={styles.largeArtwork}
          source={{uri: this.props.track.artwork_url + '-t300x300'}}>
        </Image>
        <Text style={styles.title}>{this.props.track.title}</Text>
        <Text style={styles.year}>{this.props.track.user.username}</Text>
        <View style={{flexDirection: 'row'}}>
          <TouchableHighlight onPress={() => this.onPressPlay(this.props.track)} style={styles.playButton}>
            <Text>Play Track</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.onPressPause()} style={styles.playButton}>
            <Text>Pause Track</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  },
  onPressPlay: function (track) {
    this.play(track['stream_url'] + '?client_id=' + SOUNDCLOUD_CLIENT_ID);
  },
  onPressPause: function () {
    this.pause();
  },
  play: function (url) {
    AVPlayerManager.playMedia(url);
  },
  pause: function () {
    AVPlayerManager.pause();
  }
});

var styles = StyleSheet.create({
  navContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  searchContainer: {
    height: 40,
    width: 100,
    flex: 1,
    margin: 4,
    padding: 4,
    borderColor: 'gray',
    color: 'black',
    borderWidth: 1
  },
  trackScreen: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  thumbnail: {
    width: 100,
    height: 100
  },
  largeArtwork: {
    width: 300,
    height: 300
  },
  containerRight: {
    flex: 1
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  year: {
    textAlign: 'center',
  },
  playButton: {
    backgroundColor: 'blue',
    margin: 4,
    padding: 4,
    flex: 1
  },
  playButtonText: {
    color: 'white'
  },
  ListView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF'
  }
});

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
