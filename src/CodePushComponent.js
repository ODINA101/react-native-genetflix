import React from 'react'
import codePush from 'react-native-code-push'

let codePushOptions = { installMode: codePush.InstallMode.ON_NEXT_RESUME, checkFrequency: codePush.CheckFrequency.ON_APP_RESUME }

export class CodePushComponent extends React.Component {

    componentDidMount() {
        //codePush.sync({ deploymentKey: "KEY" });

        codePush.sync({
            updateDialog: false,
            installMode: codePush.InstallMode.IMMEDIATE
        });
        codePush.disallowRestart();
    }
    componentWillUnmount() {
        console.log('test')
        // Reallow restarts, and optionally trigger
        // a restart if one was currently pending.
        codePush.allowRestart();
    }
    render() {
        return null
    }
}

CodePushComponent = codePush(codePushOptions)(CodePushComponent)

module.exports = CodePushComponent