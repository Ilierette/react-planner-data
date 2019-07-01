import * as React from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { db } from './config';
import { marketData } from '../data/market';
import { gearData } from '../data/gearData';
import { raid } from '../data/raid';

@observer
export class MasterPage extends React.Component {
    @observable matsList: any = [];

    constructor(props: any) {
        super(props);

        //this.saveMarketData();
        //this.saveGearData()
        //this.addGear();
        //this.addRaidData();
    }

    addRaidData = () => {
        raid.map((data: any) => {
            db.collection("raids").doc(data.id).set(data)
        })
    }

    saveMarketData = () => {
        marketData.map((data: any) => {
            db.collection("mats").doc(data.id).set(data)
        })
    }
    saveGearData = () => {
        gearData.map((data: any) => {
            db.collection("gears").doc(data.id).set({
                id: data.id,
                tier: data.tier,
                type: data.type,
                name: data.name,
                isActive: data.isActive,
                isOutdated: data.isOutdated
            })
            data.stages.map((stage:any)=>{
                const id = stage.name.replace(/\s/g, '')
                db.collection("gears").doc(data.id).collection("stages").doc(id).set({
                    ...stage,
                    id: id
                })
            })
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
                Data saved!
            </div>
        )
    }


}
