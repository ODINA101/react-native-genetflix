//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialDialog } from 'react-native-material-dialog';
import { Picker, Item } from 'native-base';
// create a component
var lens = [{
    name: "ინგლისური",
    real: "english"
},

{
    name: "ქართული",
    real: "georgian"
},
{
    name: "რუსული",
    real: "russian"
}


]

class FilterModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selected1: 0,
            selected3: 'georgian',
            startYear: 1900,
            endYear: 2019,
            lenguage: "georgian",
            value: 0,
            value1: 10,
        }
    }
    onValueChange(dat) {
        this.setState({ selected1: dat })
        console.log(dat)
        var year = 1900 + (parseInt(dat.replace("key", "")) + 1)
        console.log(year)

        this.setState({ startYear: year })


    }

    onValueChange2(dat) {
        this.setState({ selected2: dat })


        console.log(dat)
        var year = 2019 - (parseInt(dat.replace("key", "")))
        console.log(year)

        this.setState({ endYear: year })
    }
    onValueChange3(dat) {
        this.setState({ selected3: dat })

        console.log(dat)


    }
    onValueChange4(dat) {
        this.setState({ selected4: dat })
    }

    render() {
        return (
            <MaterialDialog
                title="გაფილტვრა"
                visible={this.props.visible}
                onOk={() => {
                    this.setState({ visible: false });
                    this.props.onData(this.state)
                }


                }
                onCancel={() => this.props.close()}>
                <Text>
                    წელი
                </Text>
                <View style={{ flexDirection: "row" }}>
                    <Picker
                        style={{ flex: 1 }}
                        mode='dropdown'
                        selectedValue={this.state.selected1}
                        onValueChange={this.onValueChange.bind(this)}>
                        {
                            Array.apply(null, Array(118)).map((item, i) => {
                                return (
                                    <Item label={(1900 + i + 1).toString()} key={"te"} value={"key" + i} />
                                );
                            })
                        }
                    </Picker>
                    <View style={{ flex: 0.5, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ color: "#000" }}>
                            დან
                        </Text>
                    </View>
                </View>

                <View style={{ flexDirection: "row" }}>
                    <Picker
                        style={{ flex: 1 }}
                        mode='dropdown'
                        selectedValue={this.state.selected2}
                        onValueChange={this.onValueChange2.bind(this)}>
                        {
                            Array.apply(null, Array(118)).map((item, i) => {
                                return (
                                    <Item key={"la"} label={(2019 - i).toString()} value={"key" + i} />
                                );

                            })

                        }

                    </Picker>
                    <View style={{ flex: 0.5, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ color: "#000" }}>
                            მდე
 </Text>
                    </View>
                </View>

                <Text>
                    ენა
  </Text>
                <Picker
                    mode='dropdown'
                    selectedValue={this.state.selected3}
                    onValueChange={this.onValueChange3.bind(this)}>

                    {
                        lens.map((item) => {
                            return (
                                <Item key={"si"} label={item.name} value={item.real} />

                            )
                        })
                    }

                </Picker>


            </MaterialDialog>
        );
    }
}


export default FilterModal;
