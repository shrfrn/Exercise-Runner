function includeHTML() {

    var exercises = Array.from(document.querySelectorAll('.exercise'))
    var prmExercises = exercises.map(elExercise => {

        return new Promise((resolve, reject) => {
            const url = elExercise.getAttribute('data-include-html')
            if(!url) {
                console.log('no url');
                reject()
            }
            const xhr = new XMLHttpRequest()
            xhr.onreadystatechange = function () {
                if (this.readyState === XMLHttpRequest.DONE) {
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
            }
            xhr.open('GET', url, true)
            xhr.send()
        })
    })
    return prmExercises
}
