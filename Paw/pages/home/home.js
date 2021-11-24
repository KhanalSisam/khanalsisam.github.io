import {DBoperation} from "../../indexedDB.js"

//registering  service worker
if ( "serviceWorker" in navigator) {
    navigator.serviceWorker.register("../../sw.js")
        .then(reg => {
            console.log("Register successful, Scope is", reg.scope)
        }).catch(err => {
            console.log("Register unsuccessful with:", err)
        })
} else {
    console.log("service worker not in navigator")
}

// getting texts making html and adding it to dom
(function main() {
    fetch("../../text.json")
        .then(response => response.json())
        .then(json => {
            // looping over each text
            json.forEach(text => {
                // adding it to DB
                DBoperation({newText : text})
            });
        })
        .catch(err => {
                document.getElementById("made_by").innerHTML = err.toSting()
            
        })
        .finally(() => {
            // once added to DB add it to DOM
            DBoperation({
                getAll: (texts) => {
                    const htmlList = document.createElement("div")
                    htmlList.id = "list"
                    texts.map(info => {
                        console.log(info)
                        let newRow = document.createElement("div")
                        const spaces = num_spaces(info.text)
                        const last = lastTime(info.last)
                        const width = calcWidth(info.progress, spaces)
                        
                        // console.log(info.id, info.source)
                        newRow = addElement(info.id, "id", newRow)
                        newRow = addElement("", "progress_bar", newRow, "div", width )
                        newRow.onclick = () => goto(info.id)
                        info.id % 2 == 0 ? newRow.className="row even_row" : newRow.className="row odd_row"
                        newRow = addElement(spaces, "blanks",newRow )
                        newRow = addElement(info.source, "source",newRow )
                        newRow = addElement(info.time, "time", newRow)
                        newRow = addElement(last, "last", newRow)
                        htmlList.appendChild(newRow)
                })
                document.getElementById("container").appendChild(htmlList)
            }})
        })
    
    
})()


// appends a span to given the element 
// used to add element to list like title, source time etc
function addElement(child, clsName, node, ele = "span", width = "") {
    const newEle = document.createElement(ele)
    newEle.className = clsName
    newEle.style.width = width
    newEle.innerHTML = child
    node.appendChild(newEle)
    return node
}

// calculates the width of the progress bar
const calcWidth = (progress, spaces) => `${(progress/spaces *  400).toFixed()}px`

// calcs the total no. of spaces 
const num_spaces = (text) => text.split("{").length -1

// used by the html to direct to the text page
const goto = (id) => { window.location.href = `/pages/text/text.html#${id}` }

// calcs the last time
const lastTime = (last) => {
    console.log(last)
    if (last === "~$~") {
        return last
    }
    const time = Math.abs(last - new Date)
    if (time < 60000) {
        return `${Math.round(time / 1000)}s`
    } else if(time < 3600000){
        return `${Math.round(time / 60000)}min`
    }else if (time < 86400000){
        return `${Math.round(time / 3600000)}hr`
    } else {
        return `${Math.round(time / 86400000)}d`
    }
}









// fetch("../text/text.json")
    // .then(response => response.json())
    // .then(json => {
        // const htmlList = document.createElement("div")
        // htmlList.id = "list"
        // json.map(info => {
        //     let newRow = document.createElement("div")
        //     newRow = addElement(info.id, "id", newRow)
        //     // newRow = addElement("","progress_bar", newRow, ele="div", width = calcWidth(info))
        //     newRow.onclick = () => goto(info.id)
        //     info.id % 2 == 0 ? newRow.className="row even_row" : newRow.className="row odd_row"
        //     newRow = addElement(num_spaces(info.text), "blanks",newRow )
        //     newRow = addElement(info.source, "source",newRow )
        //     newRow = addElement(info.time, "time", newRow)
        //     htmlList.appendChild(newRow)
        // })
    //     document.getElementById("container").appendChild(htmlList)
    //     addFromDB((textsInfo) => {
    //         const rows = document.getElementsByClassName("row")
    //         let row;
    //         textsInfo.forEach(info => {
    //             row = rows[info.id - 1]
    //             const spaces = parseInt(row.getElementsByClassName("blanks")[0].innerHTML)
    //             const width_ = calcWidth(info.progress, spaces)
    //             console.log(info.last, info.id -1)
    //             const last = lastTime(info.last)
    //             console.log(last, info.id)
    //             row = addElement("", "progress_bar", row, ele = "div", width = width_)
    //             row = addElement(last, "last", row)
    //         })
    //         // console.log(textsInfo)
    //         // console.log(rows)
    //     })
    // })
    // .catch(err => {
    //     console.log("failed to fetch texts from text.json, error:", err)
    // })


// getting data from indexed DB 
// function addFromDB(func) {

//     window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

//     if (!window.indexedDB) {
//         console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
//     }

//     var request = window.indexedDB.open("log", "1");

//     function getAllText(db) {
//         const txn = db.transaction(["Texts"], "readwrite")
//         const store = txn.objectStore("Texts")
//         const query = store.getAll()

//         query.onsuccess = event => func(event.target.result)
        
//         query.onerror = event => {
//             console.log(event.target.errorCode)
//         }
//         txn.oncomplete = () => {
//             db.close()
//         }
//     }

//     request.onerror = function (event) {
//         console.error("Database error: " + event.target.errorCode);
//     };
//     request.onsuccess = function (event) {
//         const db = event.target.result
//         getAllText(db)
//     }
// }
