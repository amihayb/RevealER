// Reveal


function MotorsSensors() {
  cleanUp();
  traces = [];
  traces.push(addLine("Tr_Tacho", 1));
  traces.push(addLine("Tr_Gyro", 1));
  //traces.push(addLine("Tr_uCmd", 2));

  var layout = {
    height: window.innerHeight,
    grid: {
      rows: 2,
      columns: 1,
      pattern: 'coupled',
    }
  };

  //https://plot.ly/javascript/configuration-options/
  let config = {
    responsive: true,
    // staticPlot: true,
    // editable: true
  };

  Plotly.newPlot("plot", traces, layout, { editable: true });
}

function replacePic(newPicTag) {
  //document.getElementById('picture_main').src = './images/show_sensors.png';
  pictureElement = document.getElementById('picture_main');
  const sources = pictureElement.getElementsByTagName('source');
  const img = document.getElementById('img_main');
  sources[0].srcset = newPicTag;
  sources[1].srcset = newPicTag;
  sources[2].srcset = newPicTag;
  img.onload = function () {
    img.width = img.naturalWidth;
    img.height = img.naturalHeight;
    console.log(`Image width set to: ${img.width}px`);
  };
  console.log("switched");
}

function replaceText(textTag) {

  var text2write;
  switch (textTag) {
    case "ShowSensors":
      text2write = "<strong>Show Sensors</strong><br>Show Padestal, EOD & Missile sensors.";
      break;

      case "jump2EOD":
      text2write = "<strong>Padestal Jump to EOD</strong><br>Start slave to EOD.<br>Test if the padestal aims on EOD target.";
      break;

      case "eod_cross":
      text2write = "<strong>Slave to EOD</strong><br>Test padestal movement at Slave to EOD";
      break;

      case "slv2eod_tr":
      text2write = "<strong>Slave to EOD: Traverse Movement Range</strong><br>Test padestal full movement range on traverse including:<ul><li>Movement somoothness</li><li>Sector limits behaviour</li><li>Passing 0 and 180 deg angles</li></ul>";
      break;

      case "slv2eod_el":
      text2write = "<strong>Slave to EOD: Elevation Movement Range</strong><br>Test padestal full movement range on elevation including:<ul><li>Movement somoothness</li><li>Sector limits behaviour</li></ul>";
      break;

      case "msl_cross":
      text2write = "<strong>Slave to Missile</strong><br>Test padestal movement at Slave to Missile";
      break;

      case "msl_squint":
      text2write = "<strong>Missile Squint at Sector Limits</strong><br>Test missile and padestal behaviour ay sector limits.<br>The padestal should wait at sector limits as the missile eye squints into the movement prohibited zone.";
      break;
  }
  
  document.getElementById("explenation_label").innerHTML = text2write;
}

function GyroCheck() {
  cleanUp();
  traces = [];
  traces.push(addLine("Tr_Gyro", 1));
  traces.push(addLine("Base_Gyro_Yaw", 1));
  traces.push(addLine("El_Gyro", 2));
  traces.push(addLine("Base_Gyro_Pitch", 2));

  plotTraces(traces);
}

function Designation() {
  cleanUp();
  traces = [];
  traces.push(addLine("Tr_Tacho", 1));
  traces.push(addLine("Tr_Resolver", 2));

  plotTraces(traces);
}


function Stabilization() {
  cleanUp();

  window.rows["Tr_Gyro_int"] = integrate(window.rows["Tr_Gyro"]);
  window.rows["El_Gyro_int"] = integrate(window.rows["El_Gyro"]);

  traces = [];
  traces.push(addLine("Tr_Gyro", 1, 1));
  traces.push(addLine("El_Gyro", 1, 2));
  traces.push(addLine("Tr_Gyro_int", 2, 1));
  traces.push(addLine("El_Gyro_int", 2, 2));

  plotTraces(traces, 2, 2);
}

function Backlash() {
  cleanUp();

  let lim = 5;
  traces = [];
  traces.push(addLine("Tr_Angle", 1,1,1000));
  traces.push(addLine("El_Angle", 2,1,1000));
  traces.push(addLimitLine(1,1,lim));
  traces.push(addLimitLine(1,1,-lim));
  traces.push(addLimitLine(2,1,lim));
  traces.push(addLimitLine(2,1,-lim));

  plotTraces(traces);
}

function Smoothness() {

  cleanUp();

  traces = [];
  traces.push(addLine("Tr_Tacho", 1, 1, r2d));
  traces.push(addLine("El_Tacho", 2, 1, r2d));
  traces.push(addLine("Tr_Vel_Command", 1, 1, r2d));
  traces.push(addLine("El_Vel_Command", 2, 1, r2d));

  /*rows["tempRow"] = plus(rows["El_Vel_Command"],0.001);
  traces.push(addLine("tempRow", 2, 1, r2d, 'Lim', false));
  rows["tempRow"] = plus(rows["El_Vel_Command"],-0.001);
  traces.push(addLine("tempRow", 2, 1, r2d, 'Lim', false));*/

  plotTraces(traces, 2, 2);

}

function IMUshake() {
  cleanUp();

  traces = [];
  traces.push(addLine("Base_Gyro_Roll", 1));
  traces.push(addLine("Base_Gyro_Pitch", 2));
  traces.push(addLine("Base_Gyro_Yaw", 3));

  plotTraces(traces, 3);
}


function ShowSensors() {
  cleanUp();

  traces = [];
  traces.push(addLine("Tr_Tacho", 1, 1, r2d));
  traces.push(addLine("Tr_Gyro", 1, 1, r2d));
  traces.push(addLine("El_Tacho", 1, 2, r2d));
  traces.push(addLine("El_Gyro", 1, 2, r2d));
  traces.push(addLine("Tr_Angle", 2, 1, r2d));
  traces.push(addLine("El_Angle", 2, 2, r2d));

  plotTraces(traces, 2, 2);
}

function Bits() {
  cleanUp();
  traces = [];
  for (var i = 1; i < 7; i++) {
    traces.push(addLine("Bit" + i + "_Tr", i, 1));
    traces.push(addLine("Bit" + i + "_El", i, 2));
  }

  plotTraces(traces, 6, 2);
}


function addLine(vName, ax_y = 1, ax_x = 1, factor = 1, showName, showLeg = true, allRows) {

  if (showName === undefined) {
    showName = vName.replace(/_/g, " ");
  }

  let x = [];
  let y = [];

  var x_axis = "Time";
  x = rows[x_axis];
  y = mult(rows[vName], factor);
  var trace = {
    x: x,
    y: y,
    xaxis: 'x' + ax_x,
    yaxis: 'y' + ax_y,
    name: showName,
    type: 'scatter',
    showlegend: showLeg,
  };
  if (!showLeg) {
    trace.line = {
      color: 'Red',
      width: 2,
    };
  }
  return trace;
}
//plotFromCSV();


function addLimitLine(ax_y = 1, ax_x = 1, val) {

  var lim1 = {
    x: [window.rows["Time"][0], window.rows["Time"].slice(-1)[0]],
    y: [val, val],
    xaxis: 'x' + ax_x,
    yaxis: 'y' + ax_y,
    name: 'Limit',
    mode: 'line',
    line: {
      color: 'Red',
      width: 2,
    },
    showlegend: false,
  }
  return lim1;
}

function addLineBin(vName, ax, allRows) {
  let x = [];
  let y = [];

  var x_axis = "time";
  x = rows[x_axis];
  y = rows[vName];
  var trace = {
    x: x,
    y: y,
    yaxis: 'y' + ax,
    name: vName,
    type: 'scatter',
  };
  return trace;
}

function plotTraces(traces, sp_r = 2, sp_c = 1) {
  var layout = {
    height: window.innerHeight,
    title: {
      text: this.fileName,
      font: {
        size: 24
      },
    },
    grid: {
      rows: sp_r,
      columns: sp_c,
      pattern: 'coupled',
    },
    annotation: [
      {
        xref: 'paper', 
        yref: 'paper',
        x: 0,
        xanchor: 'right',
        y: 1,
        yanchor: 'bottom',
        text: 'test',
        showarrow: false
      }
    ],
  };

  //https://plot.ly/javascript/configuration-options/
  let config = {
    responsive: true,
    // staticPlot: true,
    // editable: true
  };

  Plotly.newPlot("plot", traces, layout, { editable: true });
}

// Pass the checkbox name to the function
function getCheckedBoxes(chkboxName) {
  var checkboxes = document.getElementsByName(chkboxName);
  var checkboxesChecked = [];
  // loop over them all`
  for (var i = 0; i < checkboxes.length; i++) {
    // And stick the checked ones onto an array...
    if (checkboxes[i].checked) {
      checkboxesChecked.push(checkboxes[i]);
    }
  }
  // Return the array if it is non-empty, or null
  //return checkboxesChecked.length > 0 ? checkboxesChecked : null;
  return checkboxesChecked;
}


function addDropdown(values) {
  var select = document.createElement("select");
  select.name = "x_axis";
  select.id = "x_axis"

  for (const val of values) {
    var option = document.createElement("option");
    option.value = val;
    option.text = val.charAt(0).toUpperCase() + val.slice(1);
    select.appendChild(option);
  }

  var label = document.createElement("label");
  label.innerHTML = "X Axis: "
  label.htmlFor = "x_axis";

  document.getElementById("xaxis_dropdown").appendChild(label).appendChild(select);
}

const fileSelector = document.getElementById('file-selector');
fileSelector.addEventListener('change', (event) => {
  const fileList = event
    .target.files;
  console.log(fileList);
  for (const file of fileList) {
    //readFile(file);
    alert('So far it is just a demo.\nChoose tests on the left to see what is what.\n\nAmihay Blau');
  }
});

function showExample() {

  //loadFileFromURL
  file = File;
  file.name = "./PedestalLightTelemetry_17_01_2023__17_25_39.dat";
  readFile(file);
  //readFile("./PedestalLightTelemetry_17_01_2023__17_25_39.dat");

}


function readFile(file) {
  console.log(file);
  this.fileName = file.name.split('.')[0];
  if (file.name.split('.').pop() == 'dat') { // Read binary file
    readBinFile(file);
    return;
  }
  const reader = new FileReader();
  reader.addEventListener('load', (event) => {
    ttt = Plotly.d3.text(event.target.result, function (text) {
      resultlines = text.split(/\r?\n/);
      const { header, startIdx } = getHeader(resultlines);
      //console.log(header);
      //console.log(startIdx);

      //nums.push(resultlines.forEach(parseLine));	
      rows = defineObj(header);
      for (var i = startIdx; i < resultlines.length; i++) {
        var tLine = parseLine(resultlines[i]);
        //if (!isNaN(tLine[0])) {
        if (tLine.length == header.length) {
          for (var j = 0; j < header.length; j++) {
            rows[header[j]].push(tLine[j]);
          }
        }
      }
      try {
        document.getElementById("explenation_text").innerHTML = "Record loaded succesfully!<br>Select relevant test";
      } catch (error) { };
      /*try {
        cleanUp();
      } catch (error) { };*/

      return;

      addDropdown(header);
      header.forEach(addCheckbox);
      if (isEcopiaHeader(headerObj.header))
        setEcopiaRec();

      var t1 = addLine("OUTPUT", 1, rows);
      var t2 = addLine("ENCODERS_DIFF", 1, rows);
      data = [t1, t2];
      var layout = {
        grid: {
          rows: 2,
          columns: 1,
          pattern: 'coupled',
          roworder: 'bottom to top'
        }
      };

      Plotly.newPlot('plot', data, layout, { editable: true });

      //processData(rows);
      window.rows = rows;
      //return nums;
    });

    function parseLine(row) {
      //num = row.split(",").map(Number);
      num = row.split(",");
      //nums = row.split(",").filter(x => x.trim().length && !isNaN(x)).map(Number)
      //console.log(nums);
      return num;
    };

    function getHeader(resultlines) {

      headerObj = {
        header: ["TIME", "PITCH", "ROLL", "YAW", "YAW_CALIBRATION_OFFSET", "ACCEL_X", "ACCEL_Y", "ACCEL_Z", "PWM_LEFT", "PWM_RIGHT", "ENCODER_LEFT", "DIRECTION_LEFT", "ENCODER_RIGHT", "DIRECTION_RIGHT", "CURRENT_LEFT", "CURRENT_RIGHT", "CURRENT_MF", "CURRENT_MAGNET", "SENSOR_LEFT", "SENSOR_RIGHT", "BATTERY", "GAP_DETECT"],
        startIdx: 0
      }

      for (var i = 0; i < 50; i++) {
        var tLine = parseLine(resultlines[i]);
        if (tLine.length > 2 && isNaN(tLine[1])) {
          headerObj.header = verifyGoodName(tLine);
          headerObj.startIdx = i + 1;
          //return headerObj;
          break;
        };
      };
      if (document.getElementById("labelsNavBar").style.display != "none") {
        headerObj = headerFromUser(headerObj);
        return headerObj;
      }

      if (tLine.length != headerObj.header.length) { // No header
        headerObj = header4noHeader(tLine.length);
      }


      return headerObj;
    };

    function headerFromUser(headerObj) {

      headerObj.header = [];
      var tLine = parseLine(document.getElementById("labelsInput").value);
      if (tLine.length > 2 && isNaN(tLine[1])) {
        headerObj.header = verifyGoodName(tLine);
        headerObj.startIdx = 0;
        return headerObj;
      }
    }

    //plotFromCSV(event.target.result);
  });
  reader.readAsDataURL(file);
}


function readBinFile(file) {
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  reader.onload = function (e) {
    //console.log(e.target.result); /// <-- this contains an ArrayBuffer
    v = e.target.result;
    var h = new Int16Array(e.target.result);
    let lineLength = h[1];
    console.log(lineLength);
    const header = getHeader(13);

    rows = defineObj(header);

    for (let i = 0; i < v.byteLength; i += lineLength) {
      tLine = parseLine(v.slice(i, i + lineLength));
      if (tLine.length == header.length) {
        for (var j = 0; j < header.length; j++) {
          rows[header[j]].push(tLine[j]);
        }
      }
    }

    try {
      document.getElementById("explenation_text").innerHTML = "Record loaded succesfully!<br>Select relevant test";
    } catch (error) { };
  }

  function parseLine(line) {

    idx = [32, 40, 124, 128, 164, 168, 172, 176, 180, 184, 188, 192, 196, 216, 220, 312, 316, 320, 324, 328, 332, 336, 340, 344, 348, 352, 356];


    let tLine = [];
    tLine.push(new DataView(line.slice(4, 4 + 8)).getUint32(0, true) * 0.001); // Time

    idx.forEach(ix => {
      tLine.push(new DataView(line.slice(ix, ix + 4)).getFloat32(0, true));
      /*n = new DataView(line.slice(ix, ix+4));
      var num = n.getFloat32(0, true);
      tLine.push(num);*/
    });

    //n = new DataView(line.slice(156 + 8, 160 + 8))
    //var num = n.getFloat32(0, true);

    //d = new Uint8Array(e.target.result);
    return tLine;
  }

  function getHeader(OPcode) {

    if (OPcode == 13) {
      header = ['Time', 'Motion_Activity', 'BRS', 'Tr_Vel_Command', 'El_Vel_Command', 'Tr_Angle', 'El_Angle', 'Tr_Tacho', 'El_Tacho', 'Tr_Gyro', 'El_Gyro', 'Base_Gyro_Roll', 'Base_Gyro_Pitch', 'Base_Gyro_Yaw', 'Tilt_Angle_Roll', 'Tilt_Angle_Pitch', 'Bit1_Tr', 'Bit1_El', 'Bit2_Tr', 'Bit2_El', 'Bit3_Tr', 'Bit3_El', 'Bit4_Tr', 'Bit4_El', 'Bit5_Tr', 'Bit5_El', 'Bit6_Tr', 'Bit6_El'];
    }

    return header;
  }


}

function defineObj(header) {

  var obj = {};
  for (var i = 0; i < header.length; i++) {
    obj[header[i]] = [];
  };
  return obj;
};


function header4noHeader(n) {
  headerObj = {
    header: ["TIME"],
    startIdx: 0
  }
  for (var i = 1; i < n; i++) {
    headerObj.header.push("S" + i);
  }
  return headerObj;
}


function addCheckbox(colName) {
  var cont = document.createElement('container');
  cont.className = "container1";
  cont.id = colName;
  var checkbox = document.createElement('input');
  checkbox.type = "checkbox";
  checkbox.id = colName;
  checkbox.name = "signalCheckbox";
  checkbox.onclick = sel;

  var checkbox2 = document.createElement('input');
  checkbox2.type = "checkbox";
  checkbox2.id = colName;
  checkbox2.name = "signalCheckbox2";
  checkbox2.onclick = sel;

  //var span = document.createElement('span');
  //span.className="checkmark";
  var br = document.createElement('br');
  //var lbl = document.createTextNode(colName);
  br.onclick = "console.log(\"click\")";

  //var element = document.getElementById("sidenav");
  var element = document.getElementById("checkboxesPlace");
  element.appendChild(cont);
  cont.appendChild(checkbox);
  cont.appendChild(checkbox2);
  //cont.appendChild(span);
  cont.appendChild(document.createTextNode(colName));
  //cont.appendChild(lbl);
  cont.appendChild(br);

}

function verifyGoodName(name) {
  name = name.map(element => element.replace(' ', ''));
  return name;
}

function sel() {
  var checkedBoxes = getCheckedBoxes("signalCheckbox");
  var checkedBoxes2 = getCheckedBoxes("signalCheckbox2");

  traces = [];
  let i = 0;
  while (i < checkedBoxes.length) {
    traces.push(addLine(checkedBoxes[i].id, 1));
    i += 1;
  }

  i = 0;
  while (i < checkedBoxes2.length) {
    traces.push(addLine(checkedBoxes2[i].id, 2));
    i += 1;
  }

  var layout = {
    height: window.innerHeight,
    grid: {
      rows: 2,
      columns: 1,
      pattern: 'coupled',
    }
  };

  //https://plot.ly/javascript/configuration-options/
  let config = {
    responsive: true,
    // staticPlot: true,
    // editable: true
  };

  Plotly.newPlot("plot", traces, layout, { editable: true });
}

function cleanUp() {
  try {
    var explenation_text = document.getElementById("explenation_text");
    explenation_text.style.display = "none";

    let containers = document.getElementsByClassName("container1");
    for (var i = containers.length - 1; i >= 0; i--) {
      containers[i].remove();
    };
    c = document.getElementById("xaxis_dropdown").children;
    c[0].remove();
  } catch (error) { };
}

function menuItemExecute(caller, action) {
  // console.log(caller + " " + action);
  switch (action) {
    case "Rename":
      renameVar(caller);
      break;

    case "Mult":
      var factor = prompt(caller + " x ? ", 0.01);
      if (factor !== null) {
        newVarName = strClean(caller + "_x_" + factor);
        window.rows[newVarName] = mult(window.rows[caller], factor);
        addCheckbox(newVarName);
      }
      break;

    case "Diff":
      window.rows[caller + "_diff"] = diff(window.rows[caller]);
      addCheckbox(caller + "_diff");
      break;

    case "Integrate":
      window.rows[caller + "_int"] = integrate(window.rows[caller]);
      addCheckbox(caller + "_int");
      break;

    case "filter":
      var filter_w = prompt("LPF Cutoff Frequency? [Hz] ", 5);
      if (filter_w !== null) {
        window.rows[caller + "_filter"] = filter(window.rows[caller], filter_w);
        addCheckbox(caller + "_filter");
      }
      break;

    case "Detrend":
      window.rows[caller + "_detrend"] = detrend(window.rows[caller]);
      addCheckbox(caller + "_detrend");
      break;

    case "removeFirst":
      window.rows[caller + "_rem1"] = removeFirst(window.rows[caller]);
      addCheckbox(caller + "_rem1");
      break;

    case "removeMean":
      window.rows[caller + "_remMean"] = removeMean(window.rows[caller]);
      addCheckbox(caller + "_remMean");
      break;

    case "fixAngle":
      window.rows[caller + "_angFix"] = fixAngle(window.rows[caller]);
      addCheckbox(caller + "_angFix");
      break;

    case "showStat":
      showStat();
      break;

    case "cutToZoom":
      cutToZoom();
      break;

    case "dataTips":
      markDataTips();
      break;
  }
};

function renameVar(oldName) {
  var newName = prompt("Please enter new variable name", oldName);
  if (newName != null && newName !== oldName) {
    window.rows[newName] = window.rows[oldName];
    delete window.rows[oldName];
    toChange = document.getElementById(oldName);
    toChange.innerHTML = toChange.innerHTML.replaceAll(oldName, newName);
    toChange.onclick = sel;
  };
};

function showStat() {
  var gd = document.getElementById('plot')
  var xRange = gd.layout.xaxis.range
  try {
    var yRange = gd.layout.yaxis.range
  } catch {
    var yRange = gd.layout.yaxis2.range
  }
  var x_axis = document.getElementById("x_axis").value;

  var xIdx = [];
  if (typeof rows[x_axis][2] == 'string') {
    xIdx[0] = rows[x_axis][Math.floor(xRange[0])];
    xIdx[1] = rows[x_axis][Math.floor(xRange[1])];
  } else {
    xIdx = xRange;
  }

  var stat = {
    Name: [],
    Mean: [],
    STD: [],
    Min: [],
    Max: []
  }

  gd.data.forEach(trace => {
    var len = Math.min(trace.x.length, trace.y.length)
    var xInside = []
    var yInside = []

    for (var i = 0; i < len; i++) {
      var x = trace.x[i]
      var y = trace.y[i]

      if (x > xIdx[0] && x < xIdx[1] && y > yRange[0] && y < yRange[1]) {
        xInside.push(x)
        yInside.push(y)
      }
    }
    stat.Name.push(trace.name);
    stat.Mean.push(mean(yInside));
    stat.STD.push(std(yInside));
    stat.Min.push(Math.min(...yInside));
    stat.Max.push(Math.max(...yInside));
  })

  //let str = JSON.stringify(stat, null, 2);
  alert(niceStr(stat));


  function niceStr(stat) {
    //console.log(stat);
    let str = '';
    console.log(stat.Mean.length);
    for (var i = 0; i < stat.Mean.length; i++) {
      str += stat.Name[i] + ': \n';
      str += 'Min: ' + stat.Min[i].toFixed(3) + '\n';
      str += 'Max: ' + stat.Max[i].toFixed(3) + '\n';
      str += 'Mean: ' + stat.Mean[i].toFixed(3) + '\n';
      str += 'STD: ' + stat.STD[i].toFixed(3) + '\n\n';
      console.log(str);
    }
    return str;
  }
}

function cutToZoom() {
  var gd = document.getElementById('plot')
  var xRange = gd.layout.xaxis.range
  //console.log(xRange);
  var x_axis = document.getElementById("x_axis").value;

  var idx = [];
  if (typeof rows[x_axis][2] !== 'string') {
    idx[0] = rows[x_axis].findIndex((val) => val > xRange[0]);
    idx[1] = rows[x_axis].findIndex((val) => val > xRange[1]);
  } else {
    idx = xRange;
  }
  let fields = Object.keys(rows);

  fields.forEach(field => rows[field] = rows[field].slice(idx[0], idx[1]));

  sel();
}

function relativeTime() {
  rows["TIME"].map
}

function markDataTips() {
  var myPlot = document.getElementById('plot');

  myPlot.on('plotly_click', function (data) {
    var pts = '';
    for (var i = 0; i < data.points.length; i++) {
      annotate_text = 'x = ' + data.points[i].x +
        ', y = ' + data.points[i].y.toPrecision(4);
      annotation = {
        text: annotate_text,
        x: data.points[i].x,
        y: parseFloat(data.points[i].y.toPrecision(4)),
        xref: data.points[0].xaxis._id,
        yref: data.points[0].yaxis._id
      }
      annotations = plot.layout.annotations || [];
      annotations.push(annotation);

      Plotly.relayout('plot', { annotations: annotations })
    }
  });
}


////////////////////////////// Math Operations //////////////////////////////
function diff(y, x) {
  let Ts = 0.01;
  let d = [];
  for (i = 1; i < y.length; i++) {
    d[i] = (Number(y[i]) - Number(y[i - 1])) / Ts;
  }
  d[0] = d[1];
  return d;
}

function integrate(y, x) {
  let Ts = 0.01;
  let yInt = [];
  yInt[0] = parseFloat(y[0]);
  for (i = 1; i < y.length; i++) {
    yInt[i] = yInt[i - 1] + Ts * parseFloat(y[i]);
  }
  return yInt;
}

function filter(y, ws) {
  let Ts = 0.01;
  w = parseFloat(ws);
  console.log(w)
  /*let N0 = 0.0198250831839801;
  let N1 = 0.0396501663679602;
  let N2 = 0.0198250831839801;
  let D1 = -1.56731054883897;
  let D2 = 0.646610881574895;*/
  const pi = 3.1416;
  let D0 = pi ** 2 * w ** 2 + 140 * pi * w + 10000;
  let D1 = (2 * pi ** 2 * w ** 2 - 20000) / D0;
  let D2 = (pi ** 2 * w ** 2 - 140 * pi * w + 10000) / D0;
  let N0 = (w ** 2 * pi ** 2) / D0;
  let N1 = (2 * w ** 2 * pi ** 2) / D0;
  let N2 = N0;

  console.log(N0);
  console.log(N1);
  console.log(N2);
  console.log(D1);
  console.log(D2);


  //〖yf〗_k=N_0 y_k+N_1 y_(k-1)+N_2 y_(k-2)- D_1 〖yf〗_(k-1)-D_2 〖yf〗_(k-2)
  let yf = [];
  for (i = 0; i < y.length; i++) {
    yf[i] = ((i >= 2) ? parseFloat(N0 * y[i] + N1 * y[i - 1] + N2 * y[i - 2] - D1 * yf[i - 1] - D2 * yf[i - 2]) : parseFloat(y[i]));
  }
  //yf = y.map((item, i) => (i>=2) ? parseFloat(N0*y[i] + N1*y[i-1] + N2*y[i-2] - D1*yf[i-1] - D2*yf[i-2]) : parseFloat(y[i]) );
  //yf = y.map((item, i) => (i>=2) ? parseFloat(7) : parseFloat(y[i]) );

  return yf;
}

function detrend(y, x) {
  let a = (parseFloat(y[y.length - 1]) - parseFloat(y[0])) / (y.length - 1);
  let yd = y.map((item, i) => parseFloat(y[i]) - a * i);
  return yd;
}

function fixAngle(y, x) {
  let yo = [];
  let bias = 0;
  yo[0] = y[0];
  for (i = 1; i < y.length; i++) {
    bias += (y[i] - y[i - 1] > 300) ? -360 : 0;
    bias += (y[i] - y[i - 1] < -300) ? 360 : 0;
    yo[i] = y[i] + bias;
  }
  return yo;
}

function std(v) {
  mu = mean(v);
  sum = 0;
  for (var i = 0; i < v.length; i++) {
    sum += Math.pow(Math.abs(v[i] - mu), 2);
  }
  return Math.sqrt(sum / (v.length - 1));
}

function export2csv() {

  exportToCsv('download.csv', rows);
}

function exportToCsv(filename, rows) {

  var processRow = function (row) {
    var finalVal = '';
    for (var j = 0; j < row.length; j++) {
      var result = processVal(row[j])
      if (j > 0)
        finalVal += ',';
      finalVal += result;
    }
    return finalVal + '\n';
  };

  var csvFile = '';
  // for (var i = 0; i < rows.length; i++) {
  //     csvFile += processRow(rows[i]););
  // }
  let fields = Object.keys(rows);

  csvFile += processRow(Object.keys(rows));
  //Object.keys(rows).forEach(field => csvFile += processRow(rows[field]));
  for (var j = 0; j < rows[fields[0]].length; j++) {
    csvFile += column2row(rows, j);
  }


  var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    var link = document.createElement("a");
    if (link.download !== undefined) { // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  function column2row(row, j) {
    let finalVal = '';
    Object.keys(rows).forEach(field => finalVal += processVal(row[field][j]) + ',');
    finalVal = finalVal.slice(0, -1);
    return finalVal + '\n';
  }

  function processVal(val) {
    var innerValue = val === null ? '' : val.toString();
    if (val instanceof Date) {
      innerValue = val.toLocaleString();
    };
    var result = innerValue.replace(/"/g, '""');
    if (result.search(/("|,|\n)/g) >= 0)
      result = '"' + result + '"';
    return result;
  }
}

function getIdx(arr, val) {
  var indexes = [], i = -1;
  while ((i = arr.indexOf(val, i + 1)) != -1) {
    indexes.push(i);
  }
  return indexes;
}

function addLabelsLine() {

  if (document.getElementById("labelsNavBar").style.display == "none") {
    document.getElementById('labelsNavBar').style.display = 'flex';

    var SignalLabels = localStorage["SignalLabels"];
    if (SignalLabels != undefined) {
      document.getElementById("labelsInput").value = SignalLabels;
    }
    document.getElementById("labelsInput").addEventListener('input', updateValue);
  } else {
    document.getElementById('labelsNavBar').style.display = 'none';
  }

  function updateValue(e) {
    localStorage.setItem('SignalLabels', document.getElementById("labelsInput").value);
  }

  /*if ( !document.getElementById('labelsInput') ) {
 
  var label = document.createElement("label");
  label.innerHTML = "Labels: "
  label.htmlFor = "labels";
  var input = document.createElement('input');
  input.name = 'labelsInput';
  input.id = 'labelsInput';
  document.getElementById('labelsNavBar').appendChild(label);
  document.getElementById('labelsNavBar').appendChild(input);
  }
  else {
    document.getElementById('labelsInput').style.display = 'none';
 
  }*/
}

let mult = (array, factor) => array.map(x => x * factor);

const multArrays = (arr1, arr2) => arr1.map((num, i) => num * arr2[i]);

let plus = (array, plus) => array.map(x => x + plus);

let removeFirst = (array) => array.map((item, idx, all) => parseFloat(item) - parseFloat(all[0]));

let removeMean = (array) => array.map((item, idx, all) => parseFloat(item) - mean(all));

let mean = (array) => array.reduce((a, b) => parseFloat(a) + parseFloat(b)) / array.length;

let strClean = (str) => str.replace(/[^a-zA-Z0-9 ]/g, "");

let r2d = 180 / 3.1416;
let d2r = 3.1416 / 180;

//var minIdx = (array, val) => array.findIndex(n => n > val);
//var maxIdx = (array, val) => array.findIndex(n => n > val);

    ////////////////////////// End of Math Operations ///////////////////////////
