function decToPercentageNum(dec) {
	return parseFloat(dec) * 100.0;
}

Number.roundUp = function(roundTo) {
    return this.toFixed(roundTo);
}

function roundUp(num, roundTo) {
    if (typeof num === "Number")
        return num.toFixed(roundTo);
    
    try {
        return parseFloat(num).toFixed(roundTo);
    }
    catch(ex) {
        throw ex;
    }
        
}

/*--------------------------------------
EXTENSION METHODS
--------------------------------------*/
//example: var greeting = String.format("Hi, {0}", name);
String.format = function () {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }
    return s;
};

Array.prototype.last = function () {
    return this[this.length - 1];
}
Array.prototype.contains = function () {
    var item = arguments[0];
    return (this.indexOf(item) != -1);
}
Array.prototype.getUniqueByValue = function (prop) {
    var a = [], l = this.length;
    for (var i = 0; i < l; i++) {
        for (var j = i + 1; j < l; j++)
            if (this[i][prop] === this[j][prop]) j = ++i;
        a.push(this[i]);
    }
    return a;
}


/*--------------------------------------
OBJECTS 
checking, managing, duplicating 
--------------------------------------*/
function isNullOrUndefined(foo) {
    if (typeof foo === 'undefined' || foo === null) {
        return true;
    }
    return false;
}
function isDefined(foo) {
    if (typeof foo === 'undefined' || foo === null) {
        return false;
    }
    return true;
}

function isNullUndefinedOrEmpty(foo) {
    if (typeof foo === 'undefined' || foo === null || (typeof foo.length !== 'undefined' && foo.length === 0)) {
        return true;
    }
    return false;
}
function isNullOrUndefinedOrEmpty(value) {
    if (typeof value === "undefined" || value === null)
        return true;
    else {
        if (value.length !== null && value.length === 0)
            return true;
        else
            return false;
    }
}

function getItemParentWithSubNodes() {
    if (!'parent' in item || isNullOrUndefined(item.parent)
              || !'subNodes' in item.parent || isNullOrUndefinedOrEmpty(item.parent.subNodes)) {
        console.log("can't find parent with subnodes");
        return;
    }
    else return item.parent;
}
function getItemParent() {
    if (!'parent' in item || isNullOrUndefined(item.parent)) {
        console.log("can't find parent");
        return;
    }
    else return item.parent;
}
/*equalsAny
------------
EXAMPLE USAGE: 
var targetValue = getSomeIndex(); 
var unacceptableValues = [false, -1, 'error'];
if ( equalsAny(x, unacceptableValues) )
console.log('recieved an unacceptable value');

OTHER IMPLEMENTATIONS:
[1, 2, otherValue, 10].some(a => a === myValue) //only works in ES6
function eq(a){ return function(b){ return a === b }}; [1, 2, otherValue, 10].some(eq(myValue)) //using currying and partial application.
    
function equalsAny(targetValue, arr) {
var result = arr.some(function (itemToCompare) {
return itemToCompare === targetValue;
});
return result;

}
*/

//Object.prototype.equalsAny = function (arr) {
//    var thisValue = this.valueOf();
//    if (isArray(arr) === false)
//        return arr === thisValue;
//    var result = false;
//    result = arr.some(function (itemToCompare) {
//        return itemToCompare === thisValue;
//    });
//    return result;
//};

var jQueryObjToString = function (jqueryObj) {
    var tmp = jQuery('<div>');
    jQuery.each(jqueryObj, function (index, item) {
        if (!jQuery.nodeName(item, "script")) {
            tmp.append(item);
        }
    });
    return tmp.html();
};

function clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj)
        return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) {
                if (attr !== "$$hashKey" && attr !== "subNodes" && attr !== "parent") /*avoid dupes in angularJS*/
                    copy[attr] = clone(obj[attr]);
                else if (attr == "subNodes" || attr == "parent")
                    copy[attr] = obj[attr];
            }

        }
        return copy;
    }
    else {
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

/*--------------------------------------
SELECT & OPTION CLASSES/METHODS
--------------------------------------*/

//Class representation of a dropdown item 
//Example: <option value="this.value">this.text</option>
function OptionItem(text, value) {
    this.text = text;
    this.value = value || text;
}

//optionList = an array of OptionItem
//ddlControl = jquery representation of a <select>
function addOptionsToDdlControl(optionList, ddlControl) {
    for (i = 0; i < optionList.length; i++) {
        var opt = optionList[i];
        var el = document.createElement("option");
        el.textContent = opt.text;
        el.value = opt.value;
        ddlControl.appendChild(el);
    }
}

function getDropdownHTML(optionList, ddlClass, ddlLabel) {
    var ddlControl, containerControl, labelControl;
    var ddlControl, containerControl, labelControl;
    if (isNullOrUndefinedOrEmpty(ddlLabel)) {
        ddlControl = document.createElement("select");
    }
    else {
        containerControl = $('<div>', { class: 'stylepicker' });

        labelControl = $('<label>').text(ddlLabel.toString());
        labelControl.appendTo(containerControl);

        ddlControl = $('<select>').addClass(ddlClass);
        ddlControl.appendTo(containerControl);
    }
    addOptionsToDropdown(optionList, ddlControl);
    ddlControl.find("option").selected = true;

    var returnAsString = false;
    if (returnAsString) {
        if (isNullOrUndefinedOrEmpty(ddlLabel))
            return jQueryObjToString($(ddlControl));
        else
            return jQueryObjToString($(containerControl));
    }
    //return as object
    if (isNullOrUndefinedOrEmpty(ddlLabel))
        return ($(ddlControl));
    else
        return $(containerControl);
}

function addOptionsToDropdown(optionList, ddlControl) {
    for (i = 0; i < optionList.length; i++) {
        var opt = optionList[i];
        var el = $('<option>', { text: opt.text, value: opt.value });
        $(ddlControl).append($(el));
    }
}




/*--------------------------------------
HTML GENERATING
--------------------------------------*/
function getHTML(buttonType, text) {
    var iconClass = "fa ";
    var buttonClass = "btn ";
    var clickFunction = "";

    if (buttonType === 'add') {
        iconClass += "fa-plus";
        buttonClass += "btnAdd";
        //clickFunction = "btnAddClick(this)";
    }
    else if (buttonType === 'delete') {
        iconClass += "fa-trash-o";
        buttonClass += "btnDelete";
        //clickFunction = "btnDeleteClick(this)";
    }
    else if (buttonType === 'move') {
        iconClass += "fa-arrows-v";
        buttonClass = "btnMove";
        //clickFunction = "btnMoveClick(this)";
    }
    else if (buttonType === 'move-up') {
        iconClass += "fa-arrow-up";
        buttonClass = "btnMoveUp";
        //clickFunction = "btnMoveClick(this)";
    }
    else if (buttonType === 'move-down') {
        iconClass += "fa-arrow-down";
        buttonClass = "btnMoveDown";
        //clickFunction = "btnMoveClick(this)";
    }
    else if (buttonType === 'cloneFragment') {
        iconClass += "fa-plus";
        buttonClass += "btnCloneFragment btnCloneFieldset";
        //clickFunction = "btnCloneFragment(this)";
    }

    var html = String.format("<button class='{2}' onclick='{3}'><i class='{0}'></i> {1}</button> ", iconClass, text, buttonClass, clickFunction);
    return html;
}

/*--------------------------------------
DOM AND UI MANIPULATION
--------------------------------------*/

//ShowElement
//example: showElement('Error', { ms:500, tag:'div'});
function showElement(html, options) {
    //defaults
    var settings = {};
    settings.ms = options.ms || 1000,
    settings.tag = options.tag;

    //setTimeout(function() {
    //$("#mainwrap").append("<h1 class='game-alert-text'" +  text + "</h1>");
    //}, settings.ms);

    jQuery('<' + settings.tag + '>')
    .html(text)
    .appendTo(jQuery("#mainwrap"))
    .fadeIn('fast',
        function () {
            // var el = jQuery(this);
            // setTimeout(function(){
            // el.fadeOut('slow',
            // function(){
            // jQuery(this).remove();
            // });
            // }, settings.ms);
        });
}


/*--------------------------------------
LOGGING AND DEBUGGING
--------------------------------------*/
var DEBUG_MODE = true;
function log(logWhen, message) {
    if (!window.log)
        return;
    if (logWhen === null || typeof logWhen === undefined)
        logWhen = "ALWAYS";
    if ((logWhen === "DEBUG" && DEBUG_MODE === true) || logWhen === "ALWAYS")
        window.log(message);
}



/*--------------------------------------
MATH
--------------------------------------*/


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


/*--------------------------------------
ARRAYS
--------------------------------------*/

function removeItemFromArray(item, arr) {
    var index = $.inArray(item, arr);
    if (index >= 0)
        arr.splice(index, 1);
}

function arrayContains(arr, item) {
    for (i = 0; i < arr.length; i++) {
        if (arr[i] == item)
            return true;
    }
    return false;
};

function getHighestFromArrayByProperty(array, propName) {
    var max = {};
    for (var i = 0; i < array.length; i++) {
        if (array[i][propName] > (max[propName] || 0))
            max = array[i];
    }
    return max;
}

function isFirstInArray(item, arr) {
    if (!isValidIndex(item, arr))
        return -1;
    return arr.indexOf(item) == 0;
}
function isLastInArray(item, arr) {
    if (!isValidIndex(item, arr))
        return -1;
    var lastIndex = arr.length - 1;
    return arr.indexOf(item) == lastIndex;
}

function isValidIndex(item, array) {
    if (isNullOrUndefinedOrEmpty(array))
        return false;
    if (array.indexOf(item) === -1)
        return false;
    else
        return true;
}


/* getItemByValue

-----example usage---

var personArray = [ 
{id:1, name: "foo", age:20, state:"AZ", role:'programmer' }, 
{id:2, name: "bar", age:30, state:"NY", role:'programmer' } 
];
var peopleFromNewYork = getItemByValue(personArray, 'state', 'NY'); //gets the first item from the array
*/
function getItemByValue(arr, propertyName, propertyValue) { /*returns a single item*/
    for (var i = 0, iLen = arr.length; i < iLen; i++) {
        if (!(propertyName in arr[i]))
            continue;
        //get all values is none has been specified
        if (isNullOrUndefinedOrEmpty(propertyValue))
            return arr[i];
        //get specific value
        else if (arr[i][propertyName] === propertyValue)
            return arr[i];
    }
    return null;
}
function getItemByValueAsValue(arr, propertyName, propertyValue) { /*returns a single item*/
    for (var i = 0, iLen = arr.length; i < iLen; i++) {
        if (!(propertyName in arr[i]))
            continue;
        //get all values is none has been specified
        if (isNullOrUndefinedOrEmpty(propertyValue))
            return arr[i][propertyName];
        //get specific value
        else if (arr[i][propertyName] === propertyValue)
            return arr[i][propertyName];
    }
    return null;
}

/* getItemsByValue

example usage-------------

var personArray = [ 
{id:1, name: "foo", age:20, state:"AZ", role:'programmer' }, 
{id:2, name: "bar", age:30, state:"NY", role:'programmer' } 
];
var programmers_array = getItemsByValue(personArray, 'role', 'programmer'); //gets both items in array
*/
function getItemsByValue(arr, propertyName, propertyValue) {  /*returns an array*/
    var resultList = [];
    for (var i = 0, iLen = arr.length; i < iLen; i++) {
        if (!(propertyName in arr[i]))
            continue;
        //get all values is none has been specified
        if (isNullOrUndefinedOrEmpty(propertyValue))
            resultList.push(arr[i]);
        //get specific values
        else if (arr[i][propertyName] === propertyValue)
            resultList.push(arr[i]);
    }
    return resultList;
}

function getItemsByValueAsValue(arr, propertyName, propertyValue) {  /*returns an array*/
    var resultList = [];
    for (var i = 0, iLen = arr.length; i < iLen; i++) {
        if (!(propertyName in arr[i]))
            continue;
        //get all values is none has been specified
        if (isNullOrUndefinedOrEmpty(propertyValue))
            resultList.push(arr[i][propertyName]);
        //get specific values
        else if (arr[i][propertyName] === propertyValue)
            resultList.push(arr[i][propertyName]);
    }
    return resultList;
}

/* getItemsAsValuePairs

example usage-------------

var personArray = [ 
{id:1, name: "foo", age:20, state:"AZ", role:'programmer' }, 
{id:2, name: "bar", age:30, state:"NY", role:'programmer' } 
];
var namesAndAges_array = getItemsAsValuePairs(personArray, 'name', 'age'); //will be [ {name:"foo", age:20}, {name:"bar", age:30} ]
*/
function getItemsAsValuePairs(arr, propertyName1, propertyName2) {  /*returns an array*/

    var resultList = [];

    for (var i = 0, iLen = arr.length; i < iLen; i++) {
        var newItem = new Object(); newItem[propertyName1] = ''; newItem[propertyName2] = '';
        if ((propertyName1 in arr[i]))
            newItem[propertyName1] = arr[i][propertyName1];
        if ((propertyName2 in arr[i]))
            newItem[propertyName2] = arr[i][propertyName2];
        resultList.push(newItem);
    }
    return resultList;
}

/*--------------------------------------
DATE
--------------------------------------*/

var formatDate = function (dstr) {
    var dat = new Date(), tody = new Date();
    dat.setTime(Date.parse(dstr));
    var td = tody.getDate(), tm = tody.getMonth() + 1, ty = tody.getFullYear(), th = tody.getHours(), tmn = tody.getMinutes(), ts = tody.getSeconds();
    var d = dat.getDate(), m = dat.getMonth() + 1, y = dat.getFullYear(), h = dat.getHours(), mn = dat.getMinutes(), s = dat.getSeconds();
    if (y == ty && m == tm && d == td) {
        var dh = th - h;
        if (dh > 0)
            return dh + ' hour' + (dh > 1 ? 's' : '') + ' ago';
        var dmn = tmn - mn;
        if (dmn > 0)
            return dmn + ' minute' + (dmn > 1 ? 's' : '') + ' ago';
        var ds = ts - s;
        return ds + ' second' + (ds > 1 ? 's' : '') + ' ago';
    } else
        return m + '/' + d + '/' + y;
};

/*--------------------------------------
XML
--------------------------------------*/

/*
XML-node and HTML-node management

* js cannot perform replace/remove operations directly on a child. a parent is required
* jquery struggles with XML. '.remove()' and '.replace()' are not stable when it comes to XML nodes  */
function deleteNode(node) {
    $(node).parent()[0].removeChild(node);
}
function replaceNode(oldNode, newNode) {
    $(oldNode).parent()[0].replaceChild(newNode, oldNode);
}
function insertBeforeNode(oldNode, newNode, selector) { //the selector is used for parent.find() - newnode will be added to the resulting array using splice
    //$(oldNode).parent()[0].replaceChild(newNode, oldNode); //replaceChild doesn't work...it only deletes, cannot add

    var oldNodeIndex = $(oldNode).parent()[0].indexOf(oldNode);
    $(oldNode).parent().find(selector).splice(Math.max(0, oldNodeIndex - 1), 0, oldNode);
}
function insertAfterNode(oldNode, newNode, selector) {

    var oldNodeIndex = $(oldNode).parent()[0].indexOf(oldNode);
    $(oldNode).parent().find(selector).splice(oldNodeIndex, 0, oldNode); //note: no need to check if index is too high. splice gracefully handles it
}

var xmlToString = function (xmlData) {

    var xmlString;
    //IE
    if (window.ActiveXObject) {
        xmlString = xmlData.xml;
    }
    // code for Mozilla, Firefox, Opera, etc.
    else {
        xmlString = (new XMLSerializer()).serializeToString(xmlData);
    }
    return xmlString;
};

/*--------------------------------------
BROWSER SPECIFIC
--------------------------------------*/

//Browser sniff
var isIE9orLower = function (version) {
    var ua = navigator.userAgent.toLowerCase();
    var check = function (r) {
        return r.test(ua);
    };
    var DOC = document;
    var isStrict = DOC.compatMode == "CSS1Compat";
    var isOpera = check(/opera/);
    var isIE = !isOpera && check(/msie/);
    var isIE7 = isIE && check(/msie 7/);
    var isIE8 = isIE && check(/msie 8/);
    var isIE9 = isIE && check(/msie 9/);

    if (isIE && true && (isIE7 == true || isIE8 == true || isIE9 == true))
        return true;
}
