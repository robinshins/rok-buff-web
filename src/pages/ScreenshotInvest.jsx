import React, { Fragment, useState, useEffect } from 'react';
import './ScreenshotInv.css';
import axios from '../imgapi';
import { withTranslation, useTranslation } from "react-i18next";
import i18n from "i18next";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Select from 'react-select'
import { LoopCircleLoading } from 'react-loadingg';
import { EatLoading } from 'react-loadingg';
import qs from 'qs';
import { CommonLoading } from 'react-loadingg';
import NumberFormat from 'react-number-format';

const Container = () => <CommonLoading />;

const Loading = () => <LoopCircleLoading />;

const useStyles = makeStyles({
    table: {
        maxWidth: 250,
        float: "left"
    },
});

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const ScreenshotInvest = () => {
    const [img, setImage] = useState([]);
    const [previewURL, setPreviewURL] = useState([]);
    const [flag, setFlag] = useState(false);
    const [submitflag, setSubmitsetFlag] = useState(false);
    const [loadingFlag, setLoadingFlag] = useState(false);
    const [dynamicOpa, setDynamicOpa] = useState("");
    const [dynamicTouch, setDynamicTouch] = useState("");
    const [fixdata, setFixdata] = useState([]);
    const [language, setLanguage] = useState(localStorage.language);
    const [servernumber, setServernumber] = useState(sessionStorage.servernumber.replace(/\"/g, ''));
    const [account, setAccount] = useState(sessionStorage.id.replace(/\"/g, ''));
    const [usercode, setUsercode] = useState(sessionStorage.chatId);
    const [nickname, setNickName] = useState(localStorage.username.replace(/\"/g, ''));
    const [ingamecode, setIngamecode] = useState(localStorage.usercode.replace(/\"/g, ''));
    const classes = useStyles();
    const [investResult,setInvestResult] =  useState([]);
    const { t, i18n } = useTranslation();
    // useEffect(()=>{}, [result]);
    useEffect(() => {
        console.log(sessionStorage.servernumber)
        if (language === JSON.stringify("ko")) {
           // console.log(language)
            i18n.changeLanguage("ko");
        } else {
            i18n.changeLanguage("en");
        }
        return () => {
          //  console.log('컴포넌트가 화면에서 사라짐');
        };
    }, []);

    const changeAccount = (e) =>{
        setAccount(e.target.value)
    }

    const changeServernumber = (e) =>{
        setServernumber(e.target.value)
    }

    const changeNickname = (e) =>{
        setNickName(e.target.value)
    }

    const changeIngamecode = (e) =>{
        setIngamecode(e.target.value)
    }

    const loadingstart = () => {
        setLoadingFlag(true)
        setDynamicOpa("50%")
        setDynamicTouch("none")
    }
    const loadingdone = () => {
        setLoadingFlag(false)
        setDynamicOpa("100%")
        setDynamicTouch("auto")
    }
    const handleFileOnChange = (event) => {
        event.preventDefault();

        let files = Array.from(event.target.files);

        files.forEach((file) => {
            let reader = new FileReader();
            reader.onloadend = () => {
                setImage([file])
                setPreviewURL([reader.result])

            }
            reader.readAsDataURL(file);
        });
      //  console.log(img)
    }

    const deleteImage = (index) => {
        var newprevimg = [...previewURL]
        var newimg = [...img]
        newimg.splice(index, 1)
        newprevimg.splice(index, 1)
        setPreviewURL(newprevimg)
        setImage(newimg)
    }

    let profile_preview = null;
    if (img !== null) {
        profile_preview = previewURL.map((item, index) => {
            return (
                <Fragment>
                    <div style={{ marginTop: "5px" }}>
                        <button type="button" class="close" aria-label="Close" onClick={() => deleteImage(index)} style={{ border: "none", width: "30px", height: "30px" }}>
                            <span aria-hidden="true" style={{ color: "red", width: "30px", height: "30px", fontSize: "30px" }}>&times;</span>
                        </button>
                        <img key={index} alt="previewImg" width="100%" style={{ maxWidth: "500px" }} className='profile_preview' src={item}></img>
                    </div>
                </Fragment>
            )
        }
        )

    }
    const onSubmit = (e) => {
        e.preventDefault()
        if (img.length === 0) {
            alert("put image first")
        } else if(servernumber.length===0 || account===undefined || ingamecode === undefined || nickname ===undefined){
            alert("please fill all information")
        }else {
        //    console.log(img[0])
            loadingstart();
            var formData = new FormData();
            formData.append('file', img[0])
            formData.append('server_number', servernumber)
            formData.append('account', account)
            formData.append('ingame_id', nickname)
            formData.append('ingame_code', ingamecode)
            formData.append('user_code', usercode)
            axios.post('stat', formData).then(res => {
                setFlag(true)
          //      console.log(res.data[0].result)
          //      console.log(res)
                loadingdone()
               var result = [...res.data[0].result]
                if(res.status===200){
                    setSubmitsetFlag(true)
                    setInvestResult(result)
                    alert("success")
                }else{
                    alert("fail")
                }
            }).catch(err => {
                alert("fail server error")
             //   console.log(err.error)
             //   console.log(err.data)
             //   console.log(err)
                loadingdone()
            })
        }

    }
    // Close the dropdown if the user clicks outside of it
    window.onclick = function (event) {
        if (!event.target.matches('.dropbtn')) {
            var dropdowns = document.getElementsByClassName("dropdown-content");
            var i;
            for (i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }
    var x, i, j, l, ll, selElmnt, a, b, c;
    /*look for any elements with the class "custom-select":*/
    x = document.getElementsByClassName("custom-select");
    l = x.length;
    for (i = 0; i < l; i++) {
        selElmnt = x[i].getElementsByTagName("select")[0];
        ll = selElmnt.length;
        /*for each element, create a new DIV that will act as the selected item:*/
        a = document.createElement("DIV");
        a.setAttribute("class", "select-selected");
        a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
        x[i].appendChild(a);
        /*for each element, create a new DIV that will contain the option list:*/
        b = document.createElement("DIV");
        b.setAttribute("class", "select-items select-hide");
        for (j = 1; j < ll; j++) {
            /*for each option in the original select element,
            create a new DIV that will act as an option item:*/
            c = document.createElement("DIV");
            c.innerHTML = selElmnt.options[j].innerHTML;
            c.addEventListener("click", function (e) {
                /*when an item is clicked, update the original select box,
                and the selected item:*/
                var y, i, k, s, h, sl, yl;
                s = this.parentNode.parentNode.getElementsByTagName("select")[0];
                sl = s.length;
                h = this.parentNode.previousSibling;
                for (i = 0; i < sl; i++) {
                    if (s.options[i].innerHTML == this.innerHTML) {
                        s.selectedIndex = i;
                        h.innerHTML = this.innerHTML;
                        y = this.parentNode.getElementsByClassName("same-as-selected");
                        yl = y.length;
                        for (k = 0; k < yl; k++) {
                            y[k].removeAttribute("class");
                        }
                        this.setAttribute("class", "same-as-selected");
                        break;
                    }
                }
                h.click();
            });
            b.appendChild(c);
        }
        x[i].appendChild(b);
        a.addEventListener("click", function (e) {
            /*when the select box is clicked, close any other select boxes,
            and open/close the current select box:*/
            e.stopPropagation();
            closeAllSelect(this);
            this.nextSibling.classList.toggle("select-hide");
            this.classList.toggle("select-arrow-active");
        });
    }
    function closeAllSelect(elmnt) {
        /*a function that will close all select boxes in the document,
        except the current select box:*/
        var x, y, i, xl, yl, arrNo = [];
        x = document.getElementsByClassName("select-items");
        y = document.getElementsByClassName("select-selected");
        xl = x.length;
        yl = y.length;
        for (i = 0; i < yl; i++) {
            if (elmnt == y[i]) {
                arrNo.push(i)
            } else {
                y[i].classList.remove("select-arrow-active");
            }
        }
        for (i = 0; i < xl; i++) {
            if (arrNo.indexOf(i)) {
                x[i].classList.add("select-hide");
            }
        }
    }
    /*if the user clicks anywhere outside the select box,
    then close all select boxes:*/
    document.addEventListener("click", closeAllSelect);
    const options = [
        { value: "buildfast", label: t("speedup.arch") },
        { value: "researchfast", label: t("speedup.research") },
        { value: "healfast", label: t("speedup.heal") },
        { value: "trainfast", label: t("speedup.train") },
        { value: "allfast", label: t("speedup.all") },
        { value: "corn", label: t("resource.food") },
        { value: "wood", label: t("resource.wood") },
        { value: "rock", label: t("resource.rock") },
        { value: "gold", label: t("resource.gold") },
    ]


    const handleChange = (selected, key) => {
        var fix = fixdata
        fix[key].type = selected.value
        setFixdata(fix)
       // console.log(`Option selected: key`, fix[key]);
    };

    const handleInputAmoutChange = (selected, key) => {
        var fix = fixdata
        fix[key].amount = selected.target.value
        setFixdata(fix)
       // console.log(selected.target.value)
       // console.log(`Option selected: key`, fix[key]);
    };

    const handleInputCountChange = (selected, key) => {
        var fix = fixdata
        fix[key].count = selected.target.value
        setFixdata(fix)
      //  console.log(`Option selected: key`, fix[key]);
    };

    console.log(usercode)

    return (
        <Fragment>
            <main className="Home" style={{ pointerEvents: dynamicTouch, opacity: dynamicOpa }}>
                {loadingFlag && <CommonLoading />}
                <div className="ruintitle">
                    {t("sreenshotinvest")}
                </div>
                <section className="form-wrapper">
                <p style={{ fontSize: "1rem", color: "blue", textAlign: "center", fontWeight: "bolder" }}>{t("screenshotinvest.info")}</p>
                ex)<img width="80%" src="https://ifh.cc/g/TMYO9K.jpg"/>
                <br/><br/><br/><br/>
                    <input type='file'
                        class="filestyle"
                        accept='image/jpg,image/png,image/jpeg'
                        name='profile_img'
                        size="60"
                        onChange={handleFileOnChange}
                    >
                    </input>
                    <br />
                    {profile_preview}
                    <br />
                    {t("nickname")} : &nbsp;
                    <br />
                    <input type='text'
                        value={nickname}
                        onChange={changeNickname}
                        placeholder="Ingame NickName ex)EL Bank"
                    ></input>
                    <br />
                    {t("ingamecode")} : &nbsp;
                    <br />
                    <input type='text'
                        value={ingamecode}
                        onChange={changeIngamecode}
                        placeholder="Ingame Code ex)2828282"
                    ></input>
                </section>
                <div className="create-button" onClick={onSubmit}>
                    {t("submit")}
                </div>
                <br/>
                {submitflag && <p style={{marginBottom:"15px",fontSize:"1.5rem",fontWeight:"bolder"}}> {t("result")}</p>}
                {submitflag &&<table style={{ width: "90%" }}>
          <tr>
            <th>Result</th>
            <th>{t("totalamount")}</th>
            <th></th>
          </tr>
          <tr>
            <td>User</td>
             <td>{investResult[0]}</td>
          </tr>
          <tr>
            <td>{t("combat")}</td>
            <td><NumberFormat value={investResult[2]} thousandSeparator={true} displayType={'text'} /></td>
          </tr>
          <tr>
            <td>{t("1T kill")}</td>
            <td><NumberFormat value={investResult[3]} thousandSeparator={true} displayType={'text'} /></td>
          </tr>
          <tr>
          <td>{t("2T kill")}</td>
          <td><NumberFormat value={investResult[4]} thousandSeparator={true} displayType={'text'} /></td>
          </tr>
          <tr>
          <td>{t("3T kill")}</td>
          <td><NumberFormat value={investResult[5]} thousandSeparator={true} displayType={'text'} /></td>
          </tr>
          <tr>
          <td>{t("4T kill")}</td>
          <td><NumberFormat value={investResult[6]} thousandSeparator={true} displayType={'text'} /></td>
          </tr>
          <tr>
          <td>{t("5T kill")}</td>
          <td><NumberFormat value={investResult[7]} thousandSeparator={true} displayType={'text'} /></td>
          </tr>
          <tr>
          <td>{t("death")}</td>
          <td><NumberFormat value={investResult[8]} thousandSeparator={true} displayType={'text'} /></td>
          </tr>
          <tr>
          <td>{t("aid resources")}</td>
          <td><NumberFormat value={investResult[11]} thousandSeparator={true} displayType={'text'} /></td>
          </tr>
        </table>
}
            </main>
        </Fragment>

    )


}

export default withTranslation()(ScreenshotInvest);;
