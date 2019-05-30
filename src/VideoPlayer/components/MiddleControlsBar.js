import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import * as PropTypes from 'prop-types';
import PlayerIcon from './PlayerIcon';
import { playerPlay, playerPause, playerRestart,playerFastBack, playerFastForward} from "./images/index";
export default class MiddleControlsBar extends React.PureComponent {
    constructor(props) {
        super(props)
        this.forwardVideo = () => this.props.setPosition((this.props.currentTime+5));
        this.backwardVideo = () => this.props.setPosition((this.props.currentTime-5));
        
    }
    render() {
        return (<View style={styles.barWrapper}>

        {this.props.restartButton && (<PlayerIcon style={styles.fastForward} iconSource={playerFastBack} onPress={this.backwardVideo}/>)}
        {this.props.isPaused ? (<PlayerIcon iconSource={playerPlay} onPress={this.props.setPlaying}/>) : (<PlayerIcon iconSource={playerPause} onPress={this.props.setPaused}/>)}
        {this.props.restartButton && (<PlayerIcon style={styles.fastForward} iconSource={playerFastForward} onPress={this.forwardVideo}/>)}
      </View>);
    }
}
MiddleControlsBar.propTypes = {
    // Metadata
    isPaused: PropTypes.bool.isRequired,
    restartButton: PropTypes.bool,
    // Controls
    setPlaying: PropTypes.func.isRequired,
    setPaused: PropTypes.func.isRequired,
    setPosition: PropTypes.func.isRequired // Move video to the given time (in seconds).
};
MiddleControlsBar.defaultProps = {
    restartButton: true
};
const styles = StyleSheet.create({
    barWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: 250,
        minWidth: 80,
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        borderRadius: 5,
        height:70,
        alignItems:"center"
    },
    barItem: {
        margin: 5
    },
    fastForward:{
     transform: [{ rotate: '40deg'}]
    }
});
