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

const ScreenshotInv = () => {
  const [img, setImage] = useState([]);
  const [previewURL, setPreviewURL] = useState([]);
  const [flag, setFlag] = useState(false);
  const [submitflag, setSubmitsetFlag] = useState(false);
  const [loadingFlag, setLoadingFlag] = useState(false);
  const [flag2, setFlag2] = useState("-1");
  const [resultImg, setResultImg] = useState([]);
  const [faildata, setFaildata] = useState([]);
  const [dynamicOpa, setDynamicOpa] = useState("");
  const [dynamicTouch, setDynamicTouch] = useState("");
  const [speedup, setSpeedup] = useState([]);
  const [trainbuff, setTrainbuff] = useState(0);
  const [resouerces, setResources] = useState([]);
  const [result, setResult] = useState([]);
  const [result2, setResult2] = useState([]);
  const [fixdata, setFixdata] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);
  const [inputval, setinputVal] = useState();
  const [fourT1, setFourT1] = useState({ time: 80, food: 300, wood: 300, rock: 0, gold: 20 });
  const [fourT2, setFourT2] = useState({ time: 80, food: 300, wood: 0, rock: 225, gold: 20 });
  const [fourT3, setFourT3] = useState({ time: 80, food: 0, wood: 300, rock: 225, gold: 20 });
  const [fourT4, setFourT4] = useState({ time: 80, food: 200, wood: 200, rock: 150, gold: 20 });
  const [fiveT1, setFiveT1] = useState({ time: 120, food: 800, wood: 800, rock: 0, gold: 400 });
  const [fiveT2, setFiveT2] = useState({ time: 120, food: 800, wood: 0, rock: 600, gold: 400 });
  const [fiveT3, setFiveT3] = useState({ time: 120, food: 0, wood: 800, rock: 600, gold: 400 });
  const [fiveT4, setFiveT4] = useState({ time: 120, food: 250, wood: 250, rock: 250, gold: 250 });
  const [upgrade1, setUpgrade1] = useState({ time: 40, food: 500, wood: 500, rock: 0, gold: 380 });
  const [upgrade2, setUpgrade2] = useState({ time: 40, food: 500, wood: 0, rock: 375, gold: 380 });
  const [upgrade3, setUpgrade3] = useState({ time: 40, food: 0, wood: 500, rock: 375, gold: 380 });
  const [upgrade4, setUpgrade4] = useState({ time: 40, food: 50, wood: 50, rock: 200, gold: 230 });
  const [fourTresult, setFourTresult] = useState([]);
  const [fiveTresult, setFiveTresult] = useState([]);
  const [upgraderesult, setupgraderesult] = useState([]);
  const [fourTresult2, setFourTresult2] = useState([]);
  const [fourTresult2backup, setFourTresult2backup] = useState([]);
  const [fiveTresult2backup, setFiveTresult2backup] = useState([]);
  const [fiveTresult2, setFiveTresult2] = useState([]);
  const [upgraderesult2, setupgraderesult2] = useState([]);
  const [upgraderesult2backup, setupgraderesult2backup] = useState([]);
  const [fourTresult3, setFourTresult3] = useState([]);
  const [fiveTresult3, setFiveTresult3] = useState([]);
  const [upgraderesult3, setupgraderesult3] = useState([]);
  const [fourTresultgrade1, setFourTresultgrade1] = useState([]);
  const [fiveTresultgrade1, setFiveTresultgrade1] = useState([]);
  const [upgraderesultgrade1, setupgraderesultgrade1] = useState([]);
  const [fourTresultgrade2, setFourTresultgrade2] = useState([]);
  const [fiveTresultgrade2, setFiveTresultgrade2] = useState([]);
  const [upgraderesultgrade2, setupgraderesultgrade2] = useState([]);
  const [language, setLanguage] = useState(localStorage.language);
  const [optionval, setOptionval] = useState([]);
  const classes = useStyles();
  const { t, i18n } = useTranslation();
  // useEffect(()=>{}, [result]);
  useEffect(() => {
    i18n.changeLanguage('ko');
    if (language === JSON.stringify("ko")) {
      console.log(language)
      i18n.changeLanguage("ko");
    } else {
      i18n.changeLanguage("en");
    }
    return () => {
      console.log('컴포넌트가 화면에서 사라짐');
    };
  }, []);

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
        setImage([...img, file])
        setPreviewURL([...previewURL, reader.result])

      }
      reader.readAsDataURL(file);
    });
    console.log(img)
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
    } else {
      console.log(img[0])
      loadingstart();


      var formData = new FormData();
      //formData.append('file',img)
      // for (const key of Object.keys(img)) {
      //   formData.append('file', img[key])
      // }
      img.forEach(file => {
        formData.append('file', file)
      })
      axios.post('inventory', formData, {
      }).then(res => {
        setFlag(true)
        console.log(res.data)
        var a = []
        var fail = []
        var fix = []
        for (var i = 0; i < res.data[0].length; i++) {
          a.push(res.data[0][i].image)
          fail.push(res.data[0][i].multiply)
          var singlefix = { type: res.data[0][i].key, amount: res.data[0][i].multiply, count: 0 }
          fix.push(singlefix)
        }
        setFixdata(fix);
        setFaildata(fail);
        console.log(res.data[1][0])
        console.log(res.data[1])
        var results = []
        for (let value in res.data[1]) {
          let resultdata = res.data[1][value]
          console.log(resultdata.result)
          results.push(resultdata.result)
        }
        setResult(results);
        setResult2(res.data[1])
        setResultImg(a);
        loadingdone()
        setSubmitsetFlag(true)
      }).catch(err => {
        console.log(err.error)
        console.log(err.data)
        console.log(err.error)
        console.log(err)
        loadingdone()
      })
    }

  }
  function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
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


  //   const onFileChange = (e) => {
  //     this.setState({ imgCollection: e.target.files })
  //   }

  const handleChange = (selected, key) => {
    var fix = fixdata
    fix[key].type = selected.value
    setFixdata(fix)
    // var newval = [...optionval]
    // newval[key] = selected.value
    // setOptionval(newval)
    console.log(`Option selected: key`, fix[key]);
  };

  const handleInputAmoutChange = (selected, key) => {
    var fix = fixdata
    fix[key].amount = selected.target.value
    setFixdata(fix)
    console.log(selected.target.value)
    console.log(`Option selected: key`, fix[key]);
  };

  const handleInputCountChange = (selected, key) => {
    var fix = fixdata
    fix[key].count = selected.target.value
    setFixdata(fix)
    console.log(`Option selected: key`, fix[key]);
  };

  const onClickAddFix = () => {
    var newresult = [...result]
    for (var i = 0; i < fixdata.length; i++) {
      const single = fixdata[i];
      if (single.type === "allfast") {
        var total = parseInt(single.amount) * parseInt(single.count)
        newresult[0] += total
        //setResult(newresult)
        console.log(total)
        console.log(newresult[0])
        console.log(result[0])
      } else if (single.type === "buildfast") {
        var total = parseInt(single.amount) * parseInt(single.count)
        //const newresult = [...result]
        newresult[2] += total
        //setResult(newresult)
        console.log(total)
      } else if (single.type === "researchfast") {
        var total = parseInt(single.amount) * parseInt(single.count)
        //const newresult = [...result]
        newresult[7] += total
        //setResult(newresult)
        console.log(total)
      } else if (single.type === "healfast") {
        var total = parseInt(single.amount) * parseInt(single.count)
        //const newresult = [...result]
        newresult[5] += total
        //setResult(newresult)
        console.log(total)
      } else if (single.type === "trainfast") {
        var total = parseInt(single.amount) * parseInt(single.count)
        //const newresult = [...result]
        newresult[9] += total
        //setResult(newresult)
        console.log(total)
      } else if (single.type === "corn") {
        var total = parseInt(single.amount) * parseInt(single.count)
        //const newresult = [...result]
        newresult[3] += total
        //setResult(newresult)
        console.log(total)
      } else if (single.type === "wood") {
        var total = parseInt(single.amount) * parseInt(single.count)
        //const newresult = [...result]
        newresult[10] += total
        //setResult(newresult)
        console.log(total)
      } else if (single.type === "rock") {
        var total = parseInt(single.amount) * parseInt(single.count)
        //const newresult = [...result]
        newresult[8] += total
        //setResult(newresult)
        console.log(total)
      } else if (single.type === "gold") {
        var total = parseInt(single.amount) * parseInt(single.count)
        //const newresult = [...result]
        newresult[4] += total

        console.log(total)
      }
    }
    setResult(newresult)
    alert("added")
  };

  let divItems = resultImg.map((item, index) => {
    var optionvalue = options.filter(option => option.value === fixdata[index].type)
    // var newval = [...optionval]
    // newval.push(optionvalue)
    // setOptionval(newval)
    return (
      <section style={{ display: "inline-block", margin: "10px" }}>
        <img width="20%" src={`data:image/jpeg;base64,${item}`} style={{ float: "left" }} />
        <Select isSearchable={false} options={options} defaultValue={optionvalue} onChange={value => handleChange(value, index)} />
        {t("min/amount")}<input style={{ width: "15%", margin: "5px" }} type="number" value={inputval} defaultValue={faildata[index]} onChange={value => handleInputAmoutChange(value, index)} />
        {t("count")}: <input style={{ width: "15%", margin: "5px" }} type="number" value={inputval} onChange={value => handleInputCountChange(value, index)} />
      </section>
    )
  });

  const onClickSpeedup = () => {
    var totalspeed = parseInt(result[0]) + parseInt(result[9])
    totalspeed = totalspeed * 60;
    console.log(totalspeed)
    var singleresult = []
    var singleresult2 = []
    var singleresult3 = []
    var cal1 = totalspeed / fourT1.time
    var cal2 = totalspeed / fourT2.time
    var cal3 = totalspeed / fourT3.time
    var cal4 = totalspeed / fourT4.time
    var cal5 = totalspeed / fiveT1.time
    var cal6 = totalspeed / fiveT2.time
    var cal7 = totalspeed / fiveT3.time
    var cal8 = totalspeed / fiveT4.time
    var cal9 = totalspeed / upgrade1.time
    var cal10 = totalspeed / upgrade2.time
    var cal11 = totalspeed / upgrade3.time
    var cal12 = totalspeed / upgrade4.time
    singleresult.push(parseInt(cal1))
    singleresult.push(parseInt(cal2))
    singleresult.push(parseInt(cal3))
    singleresult.push(parseInt(cal4))
    singleresult2.push(parseInt(cal5))
    singleresult2.push(parseInt(cal6))
    singleresult2.push(parseInt(cal7))
    singleresult2.push(parseInt(cal8))
    singleresult3.push(parseInt(cal9))
    singleresult3.push(parseInt(cal10))
    singleresult3.push(parseInt(cal11))
    singleresult3.push(parseInt(cal12))
    setFlag2("3")
    setFourTresult2(singleresult)
    setFiveTresult2(singleresult2)
    setupgraderesult2(singleresult3)
    setFourTresult2backup(singleresult)
    setFiveTresult2backup(singleresult2)
    setupgraderesult2backup(singleresult3)
  }

  const onClickBoth = () => {
    var singleresult = []
    var singleresult2 = []
    var singleresult3 = []
    var cal1 = Math.min(fourTresult[0], fourTresult2[0])
    var cal2 = Math.min(fourTresult[1], fourTresult2[1])
    var cal3 = Math.min(fourTresult[2], fourTresult2[2])
    var cal4 = Math.min(fourTresult[3], fourTresult2[3])
    var cal5 = Math.min(fiveTresult[0], fiveTresult2[0])
    var cal6 = Math.min(fiveTresult[1], fiveTresult2[1])
    var cal7 = Math.min(fiveTresult[2], fiveTresult2[2])
    var cal8 = Math.min(fiveTresult[3], fiveTresult2[3])
    var cal9 = Math.min(upgraderesult[0], upgraderesult2[0])
    var cal10 = Math.min(upgraderesult[1], upgraderesult2[1])
    var cal11 = Math.min(upgraderesult[2], upgraderesult2[2])
    var cal12 = Math.min(upgraderesult[3], upgraderesult2[3])
    singleresult.push(parseInt(cal1))
    singleresult.push(parseInt(cal2))
    singleresult.push(parseInt(cal3))
    singleresult.push(parseInt(cal4))
    singleresult2.push(parseInt(cal5))
    singleresult2.push(parseInt(cal6))
    singleresult2.push(parseInt(cal7))
    singleresult2.push(parseInt(cal8))
    singleresult3.push(parseInt(cal9))
    singleresult3.push(parseInt(cal10))
    singleresult3.push(parseInt(cal11))
    singleresult3.push(parseInt(cal12))
    setFlag2("1")
    setFourTresult3(singleresult)
    setFiveTresult3(singleresult2)
    setupgraderesult3(singleresult3)
  }

  const onClickResource = () => {
    var food = result[3]
    var wood = result[10]
    var rock = result[8]
    var gold = result[4]
    setFlag2("2")
    var singleresult = []
    var singleresult2 = []
    var singleresult3 = []
    var cal1 = Math.min(food / fourT1.food, wood / fourT1.wood, gold / fourT1.gold)
    var cal2 = Math.min(food / fourT2.food, rock / fourT2.rock, gold / fourT2.gold)
    var cal3 = Math.min(wood / fourT3.wood, rock / fourT3.rock, gold / fourT3.gold)
    var cal4 = Math.min(food / fourT4.food, wood / fourT4.wood, rock / fourT4.rock, gold / fourT4.gold)
    var cal5 = Math.min(food / fiveT1.food, wood / fiveT1.wood, gold / fiveT1.gold)
    var cal6 = Math.min(food / fiveT1.food, rock / fiveT2.rock, gold / fiveT2.gold)
    var cal7 = Math.min(wood / fiveT1.wood, rock / fiveT3.rock, gold / fiveT3.gold)
    var cal8 = Math.min(food / fiveT1.food, wood / fiveT4.wood, rock / fiveT4.rock, gold / fiveT4.gold)
    var cal9 = Math.min(food / upgrade1.food, wood / upgrade1.wood, gold / upgrade1.gold)
    var cal10 = Math.min(food / upgrade2.food, rock / upgrade2.rock, gold / upgrade2.gold)
    var cal11 = Math.min(wood / upgrade3.wood, rock / upgrade3.rock, gold / upgrade3.gold)
    var cal12 = Math.min(food / upgrade4.food, wood / upgrade4.wood, rock / upgrade4.rock, gold / upgrade4.gold)
    // var grade1 = cal1*40
    // var grade2 = cal2*40
    // var grade3 = cal3*40
    // var grade4 = cal4*40
    // var grade5 = cal5*40
    // var grade6 = cal6*40
    // var grade7 = cal7*40
    // var grade8 = cal8*40
    // var grade9 = cal9*40
    // var grade110 = cal10*40
    // var grade11 = cal11*40
    // var grade12 = cal12*40

    singleresult.push(parseInt(cal1))
    singleresult.push(parseInt(cal2))
    singleresult.push(parseInt(cal3))
    singleresult.push(parseInt(cal4))
    singleresult2.push(parseInt(cal5))
    singleresult2.push(parseInt(cal6))
    singleresult2.push(parseInt(cal7))
    singleresult2.push(parseInt(cal8))
    singleresult3.push(parseInt(cal9))
    singleresult3.push(parseInt(cal10))
    singleresult3.push(parseInt(cal11))
    singleresult3.push(parseInt(cal12))
    setFourTresult(singleresult)
    setFiveTresult(singleresult2)
    setupgraderesult(singleresult3)
  }

  const onKeyDown = (e) => {
    if (e.keyCode === 8) {
      setFourTresult2(fourTresult2backup)
      setFiveTresult2(fiveTresult2backup)
      setupgraderesult2(upgraderesult2backup)
      console.log('delete');
    }
  }

  const onTrainbuffChange = (e) => {
    console.log(e.target.value)
    if (e.target.value === "") {
      setFourTresult2(fourTresult2backup)
      setFiveTresult2(fiveTresult2backup)
      setupgraderesult2(upgraderesult2backup)
    } else {
      setTrainbuff(e.target.value)
      var afterbuff1 = [...fourTresult2];
      var afterbuff2 = [...fiveTresult2];
      var afterbuff3 = [...upgraderesult2];
      var rate = 1 + (e.target.value / 100)
      console.log(rate)
      console.log(fourTresult2.length)
      console.log(fourTresult2)

      for (var i = 0; i < fourTresult2.length; i++) {
        afterbuff1[i] = parseInt(afterbuff1[i] * rate)
        afterbuff2[i] = parseInt(afterbuff2[i] * rate)
        afterbuff3[i] = parseInt(afterbuff3[i] * rate)
        console.log(afterbuff1[i])
      }
      setFourTresult2(afterbuff1)
      setFiveTresult2(afterbuff2)
      setupgraderesult2(afterbuff3)
    }
  }
  return (
    <Fragment>
      <div className="howtouse" style={{paddingTop:"30px"}} onClick={() => { window.open("https://gamerbox.tistory.com/32","_blank") }}>
        How TO USE (ENG)
      </div>
      <div className="howtouse" style={{marginBottom:"-30px", marginTop:"10px"}} onClick={() => {window.open("https://gamerbox.tistory.com/31","_blank") }}>
        사용법 (한글)
      </div>
      <main className="Home" style={{ pointerEvents: dynamicTouch, opacity: dynamicOpa }}>
        {loadingFlag && <CommonLoading />}
        <div className="ruintitle">
          {t("screenshot_calculator")}
        </div>
            *{t("calculator.beta")}
        <section className="form-wrapper">
          <input type='file'
            class="filestyle"
            accept='image/jpg,image/png,image/jpeg'
            name='profile_img'
            size="60"
            onChange={handleFileOnChange}
          >
          </input>
          <br />
          <p style={{ fontSize: "1rem", color: "blue", textAlign: "center", fontWeight: "bolder" }}>{t("calculator.info1")}</p>
          {profile_preview}
          <br />

        </section>
        <div className="create-button" onClick={onSubmit}>
          {t("submit")}
        </div>
        <br />
        {flag && <hr style={{ height: "3px", width: "100%", color: "black", backgroundColor: "black" }} />}
        {flag && <p style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: "bolder" }}>Check List</p>}
        {flag && <p style={{ textAlign: "center", fontSize: "1rem" }}> {t("calculator.info2")} <br /> {t("calculator.info3")}</p>}
        {flag && divItems}
        {flag && <div className="create-button" onClick={onClickAddFix}>{t("calculator.addtable")}</div>}

        <p> {t("resource_calculator")}</p>
        <table>
          <tr>
            <th>{t("speedup")}</th>
            <th>{t("totalamount")}</th>
          </tr>
          <tr>
            <td>{t("speedup.arch")}</td>
            <td>{result[2]}({parseInt(result[2] / 1440)}day {parseInt((result[2] % 1440) / 60)}hour {(parseInt((result[2] % 1440) % 60))}min)</td>
          </tr>
          <tr>
            <td>{t("speedup.research")}</td>
            <td>{result[7]}({parseInt(result[7] / 1440)}day {parseInt((result[7] % 1440) / 60)}hour {(parseInt((result[7] % 1440) % 60))}min)</td>
          </tr>
          <tr>
            <td>{t("speedup.train")}</td>
            <td>{result[9]}({parseInt(result[9] / 1440)}day {parseInt((result[9] % 1440) / 60)}hour {(parseInt((result[9] % 1440) % 60))}min)</td>
          </tr>
          <tr>
            <td>{t("speedup.heal")}</td>
            <td>{result[5]}({parseInt(result[5] / 1440)}day {parseInt((result[5] % 1440) / 60)}hour {(parseInt((result[5] % 1440) % 60))}min)</td>
          </tr>
          <tr>
            <td>{t("speedup.all")}</td>
            <td>{result[0]}({parseInt(result[0] / 1440)}day {parseInt((result[0] % 1440) / 60)}hour {(parseInt((result[0] % 1440) % 60))}min)</td>
          </tr>
        </table>
        <table>
          <tr>
            <th>{t("resources")}</th>
            <th>{t("totalamount")}</th>
          </tr>
          <tr>
            <td>{t("resource.food")}</td>
            <td> <NumberFormat value={result[3]} thousandSeparator={true} displayType={'text'} />   </td>
          </tr>
          <tr>
            <td>{t("resource.wood")}</td>
            <td><NumberFormat value={result[10]} thousandSeparator={true} displayType={'text'} /></td>
          </tr>
          <tr>
            <td>{t("resource.rock")}</td>
            <td><NumberFormat value={result[8]} thousandSeparator={true} displayType={'text'} /></td>
          </tr>
          <tr>
            <td>{t("resource.gold")}</td>
            <td><NumberFormat value={result[4]} thousandSeparator={true} displayType={'text'} /></td>
          </tr>
        </table>

        <br />

        <p> {t("training_calculator")}</p>
        <div class="btn-group">
          <button onClick={onClickBoth}>speed up + resource</button>
          <button onClick={onClickSpeedup} >speed up</button>
          <button onClick={onClickResource}>resource</button>
          <input type="number" placeholder="training bonus %" onKeyDown={val => onKeyDown(val)} onChange={val => onTrainbuffChange(val)} style={{ marginLeft: "10px", height: "30px" }} />
        </div>
        <table>
          <tr>
            <th>{t("newunit(t4)")}</th>
            <th>{t("totalamount")}</th>
            <th>{t("mge1")}</th>
            <th>{t("mge2")}</th>
          </tr>
          <tr>
            <td>{t("infantry")}</td>
            <td>{flag2 === "1" && <NumberFormat value={fourTresult3[0]} thousandSeparator={true} displayType={'text'} />}{flag2 === "2" && <NumberFormat value={fourTresult[0]} thousandSeparator={true} displayType={'text'} />}{flag2 === "3" && <NumberFormat value={fourTresult2[0]} thousandSeparator={true} displayType={'text'} />}</td>
            <td>{flag2 === "1" && <NumberFormat value={fourTresult3[0] * 40} thousandSeparator={true} displayType={'text'} />}{flag2 === "2" && <NumberFormat value={fourTresult[0] * 40} thousandSeparator={true} displayType={'text'} />}{flag2 === "3" && <NumberFormat value={fourTresult2[0] * 40} thousandSeparator={true} displayType={'text'} />}</td>
            <td>{flag2 === "1" && <NumberFormat value={fourTresult3[0] * 8} thousandSeparator={true} displayType={'text'} />}{flag2 === "2" && <NumberFormat value={fourTresult[0] * 8} thousandSeparator={true} displayType={'text'} />}{flag2 === "3" && <NumberFormat value={fourTresult2[0] * 8} thousandSeparator={true} displayType={'text'} />}</td>
          </tr>
          <tr>
            <td>{t("cavalry")}</td>
            <td>{flag2 === "1" && <NumberFormat value={fourTresult3[1]} thousandSeparator={true} displayType={'text'} />}{flag2 === "2" && <NumberFormat value={fourTresult[1]} thousandSeparator={true} displayType={'text'} />}{flag2 === "3" && <NumberFormat value={fourTresult2[1]} thousandSeparator={true} displayType={'text'} />}</td>
            <td>{flag2 === "1" && <NumberFormat value={fourTresult3[1] * 40} thousandSeparator={true} displayType={'text'} />}{flag2 === "2" && <NumberFormat value={fourTresult[1] * 40} thousandSeparator={true} displayType={'text'} />}{flag2 === "3" && <NumberFormat value={fourTresult2[1] * 40} thousandSeparator={true} displayType={'text'} />}</td>
            <td>{flag2 === "1" && <NumberFormat value={fourTresult3[1] * 8} thousandSeparator={true} displayType={'text'} />}{flag2 === "2" && <NumberFormat value={fourTresult[1] * 8} thousandSeparator={true} displayType={'text'} />}{flag2 === "3" && <NumberFormat value={fourTresult2[1] * 8} thousandSeparator={true} displayType={'text'} />}</td>
          </tr>
          <tr>
            <td>{t("archer")}</td>
            <td>{flag2 === "1" && <NumberFormat value={fourTresult3[2]} thousandSeparator={true} displayType={'text'} />}{flag2 === "2" && <NumberFormat value={fourTresult[2]} thousandSeparator={true} displayType={'text'} />}{flag2 === "3" && <NumberFormat value={fourTresult2[2]} thousandSeparator={true} displayType={'text'} />}</td>
            <td>{flag2 === "1" && <NumberFormat value={fourTresult3[2] * 40} thousandSeparator={true} displayType={'text'} />}{flag2 === "2" && <NumberFormat value={fourTresult[2] * 40} thousandSeparator={true} displayType={'text'} />}{flag2 === "3" && <NumberFormat value={fourTresult2[2] * 40} thousandSeparator={true} displayType={'text'} />}</td>
            <td>{flag2 === "1" && <NumberFormat value={fourTresult3[2] * 8} thousandSeparator={true} displayType={'text'} />}{flag2 === "2" && <NumberFormat value={fourTresult[2] * 8} thousandSeparator={true} displayType={'text'} />}{flag2 === "3" && <NumberFormat value={fourTresult2[2] * 8} thousandSeparator={true} displayType={'text'} />}</td>
          </tr>
          <tr>
            <td>{t("siege")}</td>
            <td>{flag2 === "1" && <NumberFormat value={fourTresult3[3]} thousandSeparator={true} displayType={'text'} />}{flag2 === "2" && <NumberFormat value={fourTresult[3]} thousandSeparator={true} displayType={'text'} />}{flag2 === "3" && <NumberFormat value={fourTresult2[3]} thousandSeparator={true} displayType={'text'} />}</td>
            <td>{flag2 === "1" && <NumberFormat value={fourTresult3[3] * 40} thousandSeparator={true} displayType={'text'} />}{flag2 === "2" && <NumberFormat value={fourTresult[3] * 40} thousandSeparator={true} displayType={'text'} />}{flag2 === "3" && <NumberFormat value={fourTresult2[3] * 40} thousandSeparator={true} displayType={'text'} />}</td>
            <td>{flag2 === "1" && <NumberFormat value={fourTresult3[3] * 8} thousandSeparator={true} displayType={'text'} />}{flag2 === "2" && <NumberFormat value={fourTresult[3] * 8} thousandSeparator={true} displayType={'text'} />}{flag2 === "3" && <NumberFormat value={fourTresult2[3] * 8} thousandSeparator={true} displayType={'text'} />}</td>
          </tr>
        </table>
        <table>
          <tr>
            <th>{t("newunit(t5)")}</th>
            <th>{t("totalamount")}</th>
            <th>{t("mge1")}</th>
            <th>{t("mge2")}</th>
          </tr>
          <tr>
            <td>{t("infantry")}</td>
            <td>{flag2 === "1" && <NumberFormat value={fiveTresult3[0]} thousandSeparator={true} displayType={'text'} />}{flag2 === "2" && <NumberFormat value={fiveTresult[0]} thousandSeparator={true} displayType={'text'} />}{flag2 === "3" && <NumberFormat value={fiveTresult2[0]} thousandSeparator={true} displayType={'text'} />}</td>
            <td>{flag2 === "1" && <NumberFormat value={fiveTresult3[0] * 100} thousandSeparator={true} displayType={'text'} />}{flag2 === "2" && <NumberFormat value={fiveTresult[0] * 100} thousandSeparator={true} displayType={'text'} />}{flag2 === "3" && <NumberFormat value={fiveTresult2[0] * 100} thousandSeparator={true} displayType={'text'} />}</td>
            <td>{flag2 === "1" && <NumberFormat value={fiveTresult3[0] * 20} thousandSeparator={true} displayType={'text'} />}{flag2 === "2" && <NumberFormat value={fiveTresult[0] * 20} thousandSeparator={true} displayType={'text'} />}{flag2 === "3" && <NumberFormat value={fiveTresult2[0] * 20} thousandSeparator={true} displayType={'text'} />}</td>
          </tr>
          <tr>
            <td>{t("cavalry")}</td>
            <td>{flag2 === "1" && <NumberFormat value={fiveTresult3[1]} thousandSeparator={true} displayType={'text'} />}{flag2 === "2" && <NumberFormat value={fiveTresult[1]} thousandSeparator={true} displayType={'text'} />}{flag2 === "3" && <NumberFormat value={fiveTresult2[1]} thousandSeparator={true} displayType={'text'} />}</td>
            <td>{flag2 === "1" && <NumberFormat value={fiveTresult3[1] * 100} thousandSeparator={true} displayType={'text'} />}{flag2 === "2" && <NumberFormat value={fiveTresult[1] * 100} thousandSeparator={true} displayType={'text'} />}{flag2 === "3" && <NumberFormat value={fiveTresult2[1] * 100} thousandSeparator={true} displayType={'text'} />}</td>
            <td>{flag2 === "1" && <NumberFormat value={fiveTresult3[1] * 20} thousandSeparator={true} displayType={'text'} />}{flag2 === "2" && <NumberFormat value={fiveTresult[1] * 20} thousandSeparator={true} displayType={'text'} />}{flag2 === "3" && <NumberFormat value={fiveTresult2[1] * 20} thousandSeparator={true} displayType={'text'} />}</td>
          </tr>
          <tr>
            <td>{t("archer")}</td>
            <td>{flag2 === "1" && <NumberFormat value={fiveTresult3[2]} thousandSeparator={true} displayType={'text'} />}{flag2 === "2" && <NumberFormat value={fiveTresult[2]} thousandSeparator={true} displayType={'text'} />}{flag2 === "3" && <NumberFormat value={fiveTresult2[2]} thousandSeparator={true} displayType={'text'} />}</td>
            <td>{flag2 === "1" && <NumberFormat value={fiveTresult3[2] * 100} thousandSeparator={true} displayType={'text'} />}{flag2 === "2" && <NumberFormat value={fiveTresult[2] * 100} thousandSeparator={true} displayType={'text'} />}{flag2 === "3" && <NumberFormat value={fiveTresult2[2] * 100} thousandSeparator={true} displayType={'text'} />}</td>
            <td>{flag2 === "1" && <NumberFormat value={fiveTresult3[2] * 20} thousandSeparator={true} displayType={'text'} />}{flag2 === "2" && <NumberFormat value={fiveTresult[2] * 20} thousandSeparator={true} displayType={'text'} />}{flag2 === "3" && <NumberFormat value={fiveTresult2[2] * 20} thousandSeparator={true} displayType={'text'} />}</td>
          </tr>
          <tr>
            <td>{t("siege")}</td>
            <td>{flag2 === "1" && <NumberFormat value={fiveTresult3[0]} thousandSeparator={true} displayType={'text'} />}{flag2 === "2" && <NumberFormat value={fiveTresult[3]} thousandSeparator={true} displayType={'text'} />}{flag2 === "3" && <NumberFormat value={fiveTresult2[3]} thousandSeparator={true} displayType={'text'} />}</td>
            <td>{flag2 === "1" && <NumberFormat value={fiveTresult3[0] * 100} thousandSeparator={true} displayType={'text'} />}{flag2 === "2" && <NumberFormat value={fiveTresult[3] * 100} thousandSeparator={true} displayType={'text'} />}{flag2 === "3" && <NumberFormat value={fiveTresult2[3] * 100} thousandSeparator={true} displayType={'text'} />}</td>
            <td>{flag2 === "1" && <NumberFormat value={fiveTresult3[0] * 20} thousandSeparator={true} displayType={'text'} />}{flag2 === "2" && <NumberFormat value={fiveTresult[3] * 20} thousandSeparator={true} displayType={'text'} />}{flag2 === "3" && <NumberFormat value={fiveTresult2[3] * 20} thousandSeparator={true} displayType={'text'} />}</td>
          </tr>
        </table>
        <table style={{ width: "90%" }}>
          <tr>
            <th>{t("upgrade")}</th>
            <th>{t("totalamount")}</th>
            <th>{t("mge1")}</th>
            <th>{t("mge2")}</th>
          </tr>
          <tr>
            <td>{t("infantry")}</td>
            <td>{flag2 === "1" && <NumberFormat value={upgraderesult3[0]} thousandSeparator={true} displayType={'text'} />}{flag2 === "2" && <NumberFormat value={upgraderesult[0]} thousandSeparator={true} displayType={'text'} />}{flag2 === "3" && <NumberFormat value={upgraderesult2[0]} thousandSeparator={true} displayType={'text'} />}</td>
            <td>{flag2 === "1" && <NumberFormat value={upgraderesult3[0] * 60} thousandSeparator={true} displayType={'text'} />}{flag2 === "2" && <NumberFormat value={upgraderesult[0] * 60} thousandSeparator={true} displayType={'text'} />}{flag2 === "3" && <NumberFormat value={upgraderesult2[0] * 60} thousandSeparator={true} displayType={'text'} />}</td>
            <td>{flag2 === "1" && <NumberFormat value={upgraderesult3[0] * 12} thousandSeparator={true} displayType={'text'} />}{flag2 === "2" && <NumberFormat value={upgraderesult[0] * 12} thousandSeparator={true} displayType={'text'} />}{flag2 === "3" && <NumberFormat value={upgraderesult2[0] * 12} thousandSeparator={true} displayType={'text'} />}</td>
          </tr>
          <tr>
            <td>{t("cavalry")}</td>
            <td>{flag2 === "1" && <NumberFormat value={upgraderesult3[1]} thousandSeparator={true} displayType={'text'} />}{flag2 === "2" && <NumberFormat value={upgraderesult[1]} thousandSeparator={true} displayType={'text'} />}{flag2 === "3" && <NumberFormat value={upgraderesult2[1]} thousandSeparator={true} displayType={'text'} />}</td>
            <td>{flag2 === "1" && <NumberFormat value={upgraderesult3[1] * 60} thousandSeparator={true} displayType={'text'} />}{flag2 === "2" && <NumberFormat value={upgraderesult[1] * 60} thousandSeparator={true} displayType={'text'} />}{flag2 === "3" && <NumberFormat value={upgraderesult2[1] * 60} thousandSeparator={true} displayType={'text'} />}</td>
            <td>{flag2 === "1" && <NumberFormat value={upgraderesult3[1] * 12} thousandSeparator={true} displayType={'text'} />}{flag2 === "2" && <NumberFormat value={upgraderesult[1] * 12} thousandSeparator={true} displayType={'text'} />}{flag2 === "3" && <NumberFormat value={upgraderesult2[1] * 12} thousandSeparator={true} displayType={'text'} />}</td>
          </tr>
          <tr>
            <td>{t("archer")}</td>
            <td>{flag2 === "1" && <NumberFormat value={upgraderesult3[2]} thousandSeparator={true} displayType={'text'} />}{flag2 === "2" && <NumberFormat value={upgraderesult[2]} thousandSeparator={true} displayType={'text'} />}{flag2 === "3" && <NumberFormat value={upgraderesult2[2]} thousandSeparator={true} displayType={'text'} />}</td>
            <td>{flag2 === "1" && <NumberFormat value={upgraderesult3[2] * 60} thousandSeparator={true} displayType={'text'} />}{flag2 === "2" && <NumberFormat value={upgraderesult[2] * 60} thousandSeparator={true} displayType={'text'} />}{flag2 === "3" && <NumberFormat value={upgraderesult2[2] * 60} thousandSeparator={true} displayType={'text'} />}</td>
            <td>{flag2 === "1" && <NumberFormat value={upgraderesult3[2] * 12} thousandSeparator={true} displayType={'text'} />}{flag2 === "2" && <NumberFormat value={upgraderesult[2] * 12} thousandSeparator={true} displayType={'text'} />}{flag2 === "3" && <NumberFormat value={upgraderesult2[2] * 12} thousandSeparator={true} displayType={'text'} />}</td>
          </tr>
          <tr>
            <td>{t("siege")}</td>
            <td>{flag2 === "1" && <NumberFormat value={upgraderesult3[3]} thousandSeparator={true} displayType={'text'} />}{flag2 === "2" && <NumberFormat value={upgraderesult[3]} thousandSeparator={true} displayType={'text'} />}{flag2 === "3" && <NumberFormat value={upgraderesult2[3]} thousandSeparator={true} displayType={'text'} />}</td>
            <td>{flag2 === "1" && <NumberFormat value={upgraderesult3[3] * 60} thousandSeparator={true} displayType={'text'} />}{flag2 === "2" && <NumberFormat value={upgraderesult[3] * 60} thousandSeparator={true} displayType={'text'} />}{flag2 === "3" && <NumberFormat value={upgraderesult2[3] * 60} thousandSeparator={true} displayType={'text'} />}</td>
            <td>{flag2 === "1" && <NumberFormat value={upgraderesult3[3] * 12} thousandSeparator={true} displayType={'text'} />}{flag2 === "2" && <NumberFormat value={upgraderesult[3] * 12} thousandSeparator={true} displayType={'text'} />}{flag2 === "3" && <NumberFormat value={upgraderesult2[3] * 12} thousandSeparator={true} displayType={'text'} />}</td>
          </tr>
        </table>
        <br />
      </main>
    </Fragment>

  )


}

export default withTranslation()(ScreenshotInv);;
