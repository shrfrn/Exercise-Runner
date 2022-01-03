'use strict'

const debounceInterval = 600
const gExerciseCount = 60
const gIntersectionObserver = new IntersectionObserver(onScrollIntoView, { threshold: .1 })

var gScrollTimeout

async function init() {

    addEventListener('scroll', detectScrollEnd)
    addEventListener('keydown', onKeyDown)
    addEventListener('keydown', debounce(jumpToExercise, debounceInterval))

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
        elExercise.classList.add('exercise', 'main-content')
        elExercise.setAttribute('data-include-html', `/exercises/${i > 9 ? i : '0' + i}.html`)
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
}
function onExSelect() {

    const elScriptRunner = document.querySelector('#script-runner')
    
    const scriptNum = document.querySelector('#exercise-selector').value
    const exId = '#ex-' + scriptNum
    const elExercise = document.querySelector(exId)

    gIntersectionObserver.disconnect()

    elScriptRunner.onclick = addScript.bind(null, scriptNum)
    elScriptRunner.focus()

    elExercise.scrollIntoView({ behavior: "smooth", block: "start" })
}
function detectScrollEnd() {

    showLogo()
    clearTimeout(gScrollTimeout)
    gScrollTimeout = setTimeout(onEndScroll, 50)
}
function onEndScroll() {

    const exerciseTitles = document.querySelectorAll('.exercise h2')
    exerciseTitles.forEach(ex => gIntersectionObserver.observe(ex))

    hideLogo()
}
function onKeyDown(ev){

    if(ev.key === 'c'|| ev.key === 'C') return copyExAsComment()
    if(ev.key === 'r'|| ev.key === 'R') return clearConsole()
    if(ev.key === 's'|| ev.key === 'S') return toggleSettings()

    if(isNaN(ev.key)) return

    showExNumber()
    document.querySelector('.ex-number').innerText += ev.key
}
function jumpToExercise(){
    const elExerciseSelector = document.querySelector('#exercise-selector')
    const elExNumber = document.querySelector('.ex-number')

    if(!isNaN(elExNumber.innerText)){
        if(+elExNumber.innerText > 0 && +elExNumber.innerText <= gExerciseCount){
            elExerciseSelector.value = +elExNumber.innerText
            onExSelect()
        }
    }
    hideExNumber()
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
    elScript.src = 'ex/' + (scriptNum > 9 ? scriptNum : '0' + scriptNum) + '.js'
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
    document.querySelector('.settings').classList.toggle('transparent')
}
function hideSettings(){
    document.querySelector('.settings').classList.add('transparent')
}
function showExNumber(){
    document.querySelector('.ex-number').classList.remove('transparent')
}
function hideExNumber(){
    const elExNumber = document.querySelector('.ex-number')

    elExNumber.classList.add('transparent')
    setTimeout(() => elExNumber.innerText = '', debounceInterval)
}