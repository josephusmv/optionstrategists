function addLegInputRow() {
    let legID = 'tr' + Date.now().toString() + 'LegRow';
    let btnCPID = 'btn' + legID + 'CallPut';
    let btnLSID = 'btn' + legID + 'LongShort';
    let htmlText = '<tr id="' + legID + '">' +
        '<td><input class="enter_input" name="Strike Price" value="50"></td>' +
        '<td><button type="button" class="btn btn-warning enter_input" id="' + btnCPID + '" ' +
        'onclick="changeCallPut(' + btnCPID + ')">Call</button></td>' +
        '<td><button type="button" class="btn btn-danger enter_input" id="' + btnLSID + '" ' +
        'onclick="changeLongShort(' + btnLSID + ')">Long</button></td>' +
        '<td><input class="enter_input" type="number" name="cost" value="0.9"></td>' +
        '<td><input class="enter_input" type="number" name="lots" value="1"></td>' +
        '<td><input class="enter_input" type="number" name="Left natrual days" value="60"></td>' +
        '<td><button type="button" class="btn btn-default" style="border:none;font-size: 200%;color: blue"' +
        ' onclick="addLegInputRow()">' +
        '<i class="fa fa-plus-circle" aria-hidden="true"></i></button>' +
        '<button type="button" class="btn btn-default" style="border:none;font-size: 200%;color: red"' +
        'onclick=\"delLegInputRow(' + legID + ')\">' +
        '<i class="fa fa-minus-circle" aria-hidden="true"></i></button></td>'
        + '</tr>';
    $('#tblLegsInputs').append(htmlText);
}

function delLegInputRow(legElem) {
    let tblElem = legElem.parentElement;
    if (tblElem.children.length <= 2)
        return;
    legElem.remove();
}

function changeCallPut(elem) {
    let curClass = elem.getAttribute('class');
    if (curClass.indexOf('btn-warning') >= 0) {
        elem.setAttribute('class', 'btn btn-info enter_input');
        elem.innerText = 'Put';
    } else {
        elem.setAttribute('class', 'btn btn-warning enter_input');
        elem.innerText = 'Call';
    }
}

function changeLongShort(elem) {
    let curClass = elem.getAttribute('class');
    if (curClass.indexOf('btn-danger') >= 0) {
        elem.setAttribute('class', 'btn btn-success enter_input');
        elem.innerText = 'Short';
    } else {
        elem.setAttribute('class', 'btn btn-danger enter_input');
        elem.innerText = 'Long';
    }
}

function calculateEarns() {
    let btnElem = $('#btnCalcEarns');
    let curClass = btnElem.attr('class');
    if (curClass.indexOf('disabled') >= 0) {
        return;
    }

    btnElem.attr('class', 'btn btn-primary btn-block disabled');
    let paramsInput = readLegsInput();
    console.log(paramsInput);
    sendToServer(paramsInput);
}

function enableCalculateButton(){
    let btnElem = $('#btnCalcEarns');
    btnElem.attr('class', 'btn btn-primary btn-block');
}

function readLegsInput() {
    let legs = [];
    let tblTRDatas = $('#tblLegsInputs').find('tr');
    for (let i = 1; i < tblTRDatas.length; i++) {
        let tr = tblTRDatas[i];
        let K = tr.children[0].children[0].value;
        let optType = tr.children[1].children[0].textContent;
        let opr = tr.children[2].children[0].textContent;
        let cost = tr.children[3].children[0].value;
        let lots = tr.children[4].children[0].value;
        let days = tr.children[5].children[0].value;
        //         0   1       2     3     4     5
        legs.push([K, optType, opr, cost, lots, days]);
    }
    let ivLow = $('#numIVLow').val();
    let ivHigh = $('#numIVHigh').val();
    let curPrice = $('#numCurPrice').val();
    let rfir = $('#numRFIR').val();
    let hdays = $('#numHDays').val();

    return {ivLow: ivLow, ivHigh: ivHigh, curPrice: curPrice, hdays:hdays, rfir: rfir, legs: legs}
}

addLegInputRow();