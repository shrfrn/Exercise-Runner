'use strict'

const gExerciseCount = 60
const gIntersectionObserver = new IntersectionObserver(onScrollIntoView, { threshold: .1 })

var gScrollTimeout

async function init() {

    addEventListener('scroll', detectScrollEnd)
    createExerciseArticles()

    var prmExercises = includeHTML()

    try {
        await Promise.all(prmExercises)
        populateDropdown()
        onExSelect()
        onEndScroll()

    } catch (err) {
        console.log(err)
        throw err
    }
}
function createExerciseArticles() {

    const elExerciseSection = document.querySelector('.exercises')

    for (let i = 1; i <= gExerciseCount; i++) {
        const elExercise = document.createElement('article')
        elExerciseSection.appendChild(elExercise)

        elExercise.id = 'ex-' + i
        elExercise.classList.add('exercise')
        elExercise.classList.add('main-content')
        elExercise.setAttribute('data-include-html', `/exercises/${i}.html`)
    }
}
function populateDropdown() {

    const elDropdown = document.getElementById('exercise-selector')

    for (let i = 1; i <= gExerciseCount; i++) {
        const exId = '#ex-' + i
        const elExercise = document.querySelector(exId)
        const elTitle = elExercise.getElementsByTagName('h2')[0]
        const elOption = document.createElement('option')

        elOption.value = i
        elOption.innerText = elTitle.innerText
        elDropdown.appendChild(elOption)
    }
    onExSelect()
}
function onExSelect() {

    const elSelector = document.querySelector('#exercise-selector')
    const scriptNum = elSelector.value

    const elScriptRunner = document.querySelector('#script-runner')

    const exId = '#ex-' + scriptNum
    const elExercise = document.querySelector(exId)

    gIntersectionObserver.disconnect()

    setTimeout(() => elExercise.scrollIntoView({ behavior: "smooth", block: "start" }), 10) // dosn't work without interval

    elScriptRunner.onclick = addScript.bind(null, scriptNum)
    elScriptRunner.focus()
}
function detectScrollEnd() {

    showLogo()
    clearTimeout(gScrollTimeout)
    gScrollTimeout = setTimeout(onEndScroll, 50)
}
function onEndScroll() {

    const exerciceTitles = document.querySelectorAll('.exercise h2')
    exerciceTitles.forEach(ex => gIntersectionObserver.observe(ex))

    hideLogo()
}
function onScrollIntoView(entries) {
    const entry = entries.find(entry => entry.isIntersecting)
    if (!entry) return

    const elSelector = document.getElementById('exercise-selector')
    const exId = entry.target.parentNode.id.split('-')[1]

    elSelector.value = exId
    onExSelect()
}
function addScript(scriptNum) {
    //Append the requested script
    const elScript = document.createElement('script')
    elScript.type = 'text/javascript'
    elScript.className = 'studentScript'
    elScript.src = 'ex/' + scriptNum + '.js'
    document.head.appendChild(elScript)
}
function changeFontSize(diff) {
    const elExercises = document.querySelector('.exercises')
    const fontSize = getComputedStyle(elExercises).getPropertyValue('--ex-font-size')
    elExercises.style.setProperty('--ex-font-size', +fontSize + +diff)
}
function toggleDarkMode() {

    const currentTheme = document.documentElement.getAttribute('data-theme')

    // Switch between `dark` and `light`
    const switchToTheme = (currentTheme === 'dark') ? 'light' : 'dark'

    // Set our currenet theme to the new one
    document.documentElement.setAttribute('data-theme', switchToTheme);
}
function copyExAsComment() {
    const elSelector = document.querySelector('#exercise-selector')
    const scriptNum = elSelector.value
    const exId = '#ex-' + scriptNum

    const exStr = document.querySelector(exId).innerText
    const commentStart = '/*\n'
    const commentEnd = '\n*/'
    const commentStr = commentStart + exStr.replace(/^/mg, '// ') + commentEnd

    navigator.clipboard.writeText(commentStr)
    showMsg('Copied to clipboard', 1500)
}
function showMsg(txt, duration) {
    const elMsg = document.getElementById('msg')
    elMsg.innerText = txt
    elMsg.style.opacity = 1
    setTimeout(() => elMsg.style.opacity = 0, duration)
}
function hideLogo(){
    document.querySelector('.logo').classList.remove('show-logo')
}
function showLogo(){
    document.querySelector('.logo').classList.add('show-logo')
}
function clearConsole() {
    console.clear()
}
function toggleSettings(){
    document.querySelector('.settings').classList.toggle('transparent');
}
function hideSettings(){
    document.querySelector('.settings').classList.add('transparent');
}