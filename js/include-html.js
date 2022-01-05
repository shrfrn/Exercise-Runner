export function includeHTML() {

    var exercises = Array.from(document.querySelectorAll('.exercise'))
    var prmExercises = exercises.map(elExercise => {

        return new Promise((resolve, reject) => {
            
            const fileName = elExercise.getAttribute('data-include-html')
            const path = window.location.pathname
            const url = path.substring(0, path.lastIndexOf('/')) + fileName
            
            if(!url) {
                console.log(`bad url ${fileName}`);
                reject(`bad url ${fileName}`)
            }
            const xhr = new XMLHttpRequest()
            xhr.onload = function () {
                if (this.status === 200) {
                    elExercise.innerHTML = this.responseText
                    resolve()
                }
                if (this.status === 404) {
                    console.log(this.responseText);
                    elExercise.innerHTML = 'Page not found.'
                    reject()
                }
            }
            xhr.open('GET', url, true)
            xhr.onerror = () => console.log('File Access Error')
            xhr.send()
        })
    })
    return prmExercises
}