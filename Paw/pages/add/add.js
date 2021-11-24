import {DBoperation} from "../../indexedDB.js"

(function putNewID(){
    DBoperation({
        getAllId: (ids) => {
            document.getElementById("id_from_DB").innerHTML = ids[ids.length -1 ] + 1
        }
    })
})()

window.addToDB = (dis) => {
    const id = parseInt(document.getElementById("id_from_DB").innerHTML)
    const text = {
        title: dis.title.value,
        text: dis.text.value,
        source: dis.source.value,
        time: dis.time.value,
        last: "~$~",
        progress: "",
        id: id
    }
    DBoperation({
        newText: text
    })
    location.reload()
    return false
}
