import React, { Fragment, Component } from 'react';
import './BuffMain.css';
import Http from '../api';
import qs from 'qs';
import { Redirect } from 'react-router';
import { withTranslation, useTranslation } from "react-i18next";
import i18n from "i18next";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

class RuinRegister extends Component {

    state = {
        ruinitems: [], flag: -2,}

    componentDidMount() {
        this.getRuintime();
    }

    getRuintime = async text => {
        try {
            const response = await Http.get('userresponse/', {
                params: {
                    mode: 'RUIN_time'
                }
            }
            );
            console.log(response)
            if (response.status === 201) {

                if (response.data.info.length === 0) {
                    this.setState({ flag: -1 })
                } else {
                    const singleItem = response.data.info;
                    console.log(singleItem)
                    const items = []
                    singleItem.forEach(element => {
                        let date = new Date(element.ruintime)
                        //date.setHours(date.getHours()+9)
                        console.log(date.toString())
                        //const newitems = [...this.state.items]
                        if (element.ruin_type === 1) {
                            var ruin_type = 'ruin'
                        }
                        else {
                            var ruin_type = 'altar'
                        }
                        items.push({
                            id: element.ruintime_code,
                            time: element.ruintime.substring(0, 10) + " " + element.ruintime.substring(11, 19),
                            checked: false,
                            koreaTime: date.toString().substring(15, 25),
                            ruin_type: ruin_type,
                            alliance_name: element.alliance_name
                        })
                    }
                    )
                    this.setState({ ruinitems: items })
                }
            } else if (response.status) {
                this.setState({ flag: -3 })
            }
        } catch (error) {
            console.log(error)

            this.setState({ flag: 2 })
        }
    }


    handleApplyclick = async text => {
        if (this.state.flag === -1 || this.state.ruin_selected === -1) {
            console.log(this.state)
        } else {
            const selected = this.state.ruinitems.find(item => item.checked === true)
            console.log(selected)
            if (selected.checked) {
                try {
                    const response = await Http.patch('userresponse/', qs.stringify({
                        'mode': 'RUIN_register', 'ruintime_code': selected.id
                    })
                    );
                    console.log(response)
                    if (response.status === 201) {
                        alert(this.props.t("notice.applysuccess"))
                    } else {
                        alert(this.props.t("notice.applyfail"))
                    }
                    this.props.history.push({ state: this.state })

                    this.setState({ redirect: 2, ruin_selected: selected.id })
                } catch (error) {
                    if (error.response.status === 406) {
                        alert(this.props.t("notice.applyfull"))
                        this.props.history.push({ state: this.state })

                        this.setState({ redirect: 2, ruin_selected: selected.id })
                    }
                    this.props.history.push({ state: this.state })

                    this.setState({ redirect: 2, ruin_selected: selected.id })
                    console.log(error.response)
                    //console.log(response.error)
                    //alert("아이디와 비밀번호를 확인해주세요")
                }
            } else {
                this.setState({ flag: -2 })
            }
        }
    }

    handleTimeClick = (id) => {
        console.log(this.state.ruinitems)

        const { ruinitems } = this.state;
        // 파라미터로 받은 id 를 가지고 몇번째 아이템인지 찾습니다.
        const index = ruinitems.findIndex(item => item.id === id);
        const selected = ruinitems[index]; // 선택한 객체
        ruinitems.forEach(item => item.checked = false)

        const nextItems = [...ruinitems]; // 배열을 복사
        // 기존의 값들을 복사하고, checked 값을 덮어쓰기
        nextItems[index] = {
            ...selected,
            checked: !selected.checked
        };
        if (!selected.checked === false) {
            this.setState({ ruin_selected: -1 })
        }
        else {
            this.setState({ ruin_selected: 1 })
        }
        this.setState({
            ruinitems: nextItems
        });
    }

    handleTimeClick = (id) => {
        console.log(this.state.ruinitems)

        const { ruinitems } = this.state;
        // 파라미터로 받은 id 를 가지고 몇번째 아이템인지 찾습니다.
        const index = ruinitems.findIndex(item => item.id === id);
        const selected = ruinitems[index]; // 선택한 객체
        ruinitems.forEach(item => item.checked = false)

        const nextItems = [...ruinitems]; // 배열을 복사
        // 기존의 값들을 복사하고, checked 값을 덮어쓰기
        nextItems[index] = {
            ...selected,
            checked: !selected.checked
        };
        if (!selected.checked === false) {
            this.setState({ ruin_selected: -1 })
        }
        else {
            this.setState({ ruin_selected: 1 })
        }
        this.setState({
            ruinitems: nextItems
        });
    }


    render() {
        const {handleApplyclick,handleTimeClick}=this;
        let divItems = this.state.ruinitems.map((item, index) => {
            if (item.checked === true && item.ruin_type == "ruin") {
                return <div className="selectBox" key={item.id} style={{ backgroundColor: "#87ceeb", color: "#ffffff" }}
                    onClick={() => handleTimeClick(item.id)}>{"UTC : " + item.time}<br />{"Korea time : " + item.koreaTime}{"type : " + t("ruin")}
                </div>
            } else if (item.checked === true && item.ruin_type == "altar") {
                return <div className="selectBox" key={item.id} style={{ backgroundColor: "#87ceeb", color: "#ffffff" }}
                    onClick={() => handleTimeClick(item.id)}>{"UTC : " + item.time}<br />{"Korea time : " + item.koreaTime}{"type : " + t("altar")}
                </div>
            } else if (item.checked === false && item.ruin_type == "ruin") {
                return <div className="selectBox" key={item.id} onClick={() => handleTimeClick(item.id)
                }> {"UTC : " + item.time} < br /> {"Korea time : " + item.koreaTime} {"type : " + t("ruin")}
                </div >
            }
            else if (item.checked === false && item.ruin_type == "altar") {
                return <div className="selectBox" key={item.id} onClick={() => handleTimeClick(item.id)
                }> {"UTC : " + item.time} < br /> {"Korea time : " + item.koreaTime} {"type : " + t("altar")}
                </div >
            }
        });
        const { t } = this.props;
        return (
            <main className="Home">
            <div className="title2">
                {t("ruin.choosetime")}
            </div>
            <section className="form-wrapper">
                {divItems}
                {this.state.flag === -1 && <p style={{ color: '#ff4040', textAlign: 'center' }}> {t("ruin.notime")}</p>}
                {this.state.flag === -2 && <p style={{ color: '#ff4040', textAlign: 'center' }}> {t("ruin.selecttime")}</p>}
                {this.state.flag === -3 && <p style={{ color: '#ff4040', textAlign: 'center' }}> {t("notice.ServerNotConnect")}</p>}
                <div className="create-button" onClick={handleApplyclick}>
                    {t("ruin.apply")}
                </div>
            </section>
            </main>

    )




    }



}

export default withTranslation()(RuinRegister);;
