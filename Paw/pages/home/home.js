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
const goto = (id) => { window.location.href = `/Paw/pages/text/text.html#${id}` }

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

