import * as React from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { db } from './config';
import { marketData } from '../data/market';
import { gearData } from '../data/gearData';

//Market


@observer
export class MasterPage extends React.Component {
    @observable marketDataMessage: boolean = false;
    @observable matsList: any = [];

    constructor(props: any) {
        super(props);

        //this.saveMarketData();
        //this.saveGearData()
        //this.matsChecker();
        //this.addGear();
    }

    saveMarketData = () => {
        marketData.map((data: any) => {
            db.collection("mats").doc(data.id).set(data).then(() => {
                this.marketDataMessage = true
            });
        })
    }
    saveGearData = () => {
        gearData.map((data: any) => {
            db.collection("gears").doc(data.id).set(data)
        })
    }
    matsChecker = () => {
        db.collection("mats").onSnapshot((querySnapshot) => {
            let mats: any = [];
            querySnapshot.forEach((doc) => {
                mats.push({
                    amount: 0,
                    id: doc.id,
                    show: true
                })
            })
            this.matsList = mats;

        })
        db.collection("users").onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                db.collection("users").doc(doc.id).set({
                    mats: this.matsList
                }, { merge: true })
            })
        })
    }
    addGear = () => {
        db.collection("users").doc("GSkIH1aMDFUREmtVvoSxFWaEBlq1").set({
            gears: (
                [
                    {
                        id: "BeltHorizon",
                        stages: [
                            {
                                name: "Stage - 1"
                            },
                            {
                                name: "Stage - 3"
                            }
                        ]
                    },
                    {
                        id: "WeaponGrandCelestial",
                        stages: [
                            {
                                name: "Stage - 3"
                            },
                            {
                                name: "Stage - 6"
                            }
                        ]
                    }
                ]
            )
        }, { merge: true })
    }

    render() {
        return (
            <div>
                Data saved:
                {
                    this.marketDataMessage &&
                    <div> Market data </div>
                }
            </div>
        )
    }


}
