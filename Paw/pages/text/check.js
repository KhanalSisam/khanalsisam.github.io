import {DBoperation} from "../../indexedDB.js"

// called from HTML to show answer
// answer are stored in alt tag in the input field
window.check = () => {
    const inputs = document.querySelectorAll("input")
    let e;
    let correct = 0
    for (let i = 0; i < inputs.length; i++){
        e = inputs[i]
        if (e.value && e.value === e.alt) {
            e.className = "input_true"
            correct += 1
        } else if (e.value) {
            e.className = "input_false"
            if(e.offsetWidth <= 55) e.style.width = "70px"
            e.value = `${e.alt}||${e.value}`
        }
    }
    const id = parseInt(window.location.href.split("#")[1])
    DBoperation({
        newLog: {
            id: id,
            progress: correct,
            last: new Date()
        }
    })
}
