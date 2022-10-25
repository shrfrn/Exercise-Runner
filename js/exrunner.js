'use strict'

import { includeHTML } from './include-html.js'
import { debounce } from './debounce.js'

const debounceInterval = 600
const gExerciseCount = 60

var gIsAutorun = false
var gIsSnapToTop = false

var gScrollTimeout
var gExSelectorReady

const gIntersectionObserver = new IntersectionObserver(onScrollIntoView, { threshold: .1 })
document.addEventListener('DOMContentLoaded', init)

async function init() {

    gExSelectorReady = false
    
    createExerciseArticles()
    var prmExercises = includeHTML()
    
    try {
        await Promise.all(prmExercises)
        
        addEventListeners()
        populateDropdown()
        
        gExSelectorReady = true

        loadSettings()
        onExSelect()

        if(gIsAutorun) {
            const scriptNum = document.querySelector('#exercise-selector').value
            addScript(scriptNum)
        }

    } catch (err) {
        console.log(err)
        throw err
    }
}
function addEventListeners(){
    addEventListener('scroll', detectScrollEnd)
    addEventListener('keydown', onKeyDown)
    addEventListener('keydown', debounce(jumpToExercise, debounceInterval))

    document.querySelector('#exercise-selector').addEventListener('change', onExSelect)
    document.querySelector('#help-btn').addEventListener('click', toggleHelp)
    document.querySelector('#clr-btn').addEventListener('click', clearConsole)
    document.querySelector('#copy-btn').addEventListener('click', copyExAsComment)
    document.querySelector('#settings-btn').addEventListener('click', toggleSettings)
    document.querySelector('#inc-font-btn').addEventListener('click', () => changeFontSize(1))
    document.querySelector('#dec-font-btn').addEventListener('click', () => changeFontSize(-1))
    document.querySelector('#dark-mode-switch').addEventListener('click', toggleDarkMode)
    document.querySelector('#autorun-switch').addEventListener('click', toggleAutorun)
    document.querySelector('#snap-switch').addEventListener('click', toggleSnapToTop)
    document.querySelector('.copy-play-bingo-func').addEventListener('click', () => copyText('.play-bingo-func'))
    document.querySelector('.exercises').addEventListener('click', hidePopups)
}
function loadSettings(){
    const settings = JSON.parse(localStorage.getItem('ExRunner'))

    if(!settings) return
    if(settings.fontSize) setFontSize(settings.fontSize)
    if(settings.isDarkMode === 'dark') toggleDarkMode()
    if(settings.isSnapToTop) toggleSnapToTop()
    
    if(settings.lastExNum ) document.querySelector('#exercise-selector').value = settings.lastExNum
    gIsAutorun = !!settings.isAutorun
    if(gIsAutorun) document.querySelector('#autorun-switch').checked = gIsAutorun
}
function saveSettings(newSettings){
    let settings = JSON.parse(localStorage.getItem('ExRunner'))
    settings = { ...settings, ...newSettings }
    localStorage.setItem('ExRunner', JSON.stringify(settings))
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
function onExSelect(snapToTop = true) { 
    const elScriptRunner = document.querySelector('#script-runner')
    
    // const scriptNum = localStorage.ExRunner.lastExNum
    const scriptNum = document.querySelector('#exercise-selector').value
    saveSettings({ lastExNum: scriptNum })
    
    const exId = '#ex-' + scriptNum
    const elExercise = document.querySelector(exId)
    
    gIntersectionObserver.disconnect()
     
    elScriptRunner.onclick = addScript.bind(null, scriptNum)
    elScriptRunner.focus()
    
    if(snapToTop) elExercise.scrollIntoView({ behavior: "smooth", block: "start" })
}
function detectScrollEnd() {
    showLogo()
    clearTimeout(gScrollTimeout)
    gScrollTimeout = setTimeout(onEndScroll, 50)
}
function onEndScroll() {
    const exerciseTitles = document.querySelectorAll('.exercise h2')
    exerciseTitles.forEach(ex => gIntersectionObserver.observe(ex))

    setTimeout(hideLogo, 1800)
}
function onKeyDown(ev){

    if(ev.metaKey || ev.shiftKey || ev.ctrlKey || ev.altKey) return

    if(handleHotkeys(ev)) return
    if(isNaN(ev.key)) return

    showExNumber()
    document.querySelector('.ex-number').innerText += ev.key
}
function handleHotkeys(ev){
    const hotKeyMap = {
        c: copyExAsComment,     C: copyExAsComment,     'ב': copyExAsComment,
        l: clearConsole,        L: clearConsole,        'ך': clearConsole,
        s: toggleSettings,      S: toggleSettings,      'ד': toggleSettings,    
        d: toggleDarkMode,      D: toggleDarkMode,      'ג': toggleDarkMode,
        a: toggleAutorun,       A: toggleAutorun,       'ש': toggleAutorun,
        h: toggleHelp,          H: toggleHelp,          'י': toggleHelp,
        p: toggleSnapToTop,     P: toggleSnapToTop,     'פ': toggleSnapToTop,

        r: () => document.querySelector('#script-runner').click(), 
        R: () => document.querySelector('#script-runner').click(),
        'ר': () => document.querySelector('#script-runner').click(),
        
        '+': () => changeFontSize(1),       '-': () => changeFontSize(-1),
        'ArrowUp': () => nextExercise(-1),  'ArrowDown': () => nextExercise(1),
        'Escape': hideModals,
    }
    if(!hotKeyMap[ev.key]) return false
    if(ev.key === 'ArrowUp' || ev.key === 'ArrowDown') ev.preventDefault()

    hotKeyMap[ev.key]()
    return true
}
function jumpToExercise(){
    const elExerciseSelector = document.querySelector('#exercise-selector')
    const elExNumber = document.querySelector('.ex-number')
    const exNumber = +elExNumber.innerText

    if(!isNaN(exNumber)){
        if(+exNumber > 0 && +exNumber <= gExerciseCount){
            elExerciseSelector.value = +exNumber
            onExSelect()
        }
    }
    elExNumber.innerText = ''
    hideExNumber()
}
function nextExercise(dir){
    const elExerciseSelector = document.querySelector('#exercise-selector')

    if(dir === -1 && +elExerciseSelector.value === 1) return
    if(dir === 1 && +elExerciseSelector.value === gExerciseCount) return

    elExerciseSelector.value = +elExerciseSelector.value + dir
    onExSelect()
}
function onScrollIntoView(entries) {

    if(!gExSelectorReady) return

    const entry = entries.find(entry => entry.isIntersecting)
    if (!entry) return

    const elSelector = document.getElementById('exercise-selector')
    const exId = entry.target.parentNode.id.split('-')[1]

    elSelector.value = exId
    onExSelect(gIsSnapToTop)
}
function addScript(scriptNum) {
    //Append the requested script
    const elScript = document.createElement('script')
    const scriptName = (scriptNum > 9 ? scriptNum : '0' + scriptNum) + '.js'
    
    elScript.type = 'text/javascript'
    elScript.className = 'studentScript'
    elScript.src = 'ex/' + scriptName
    
    elScript.addEventListener('error', () => {
        console.clear()
        console.log(`Coundn't find the script ${scriptName}...`)
    }) 
    document.head.appendChild(elScript)
}
function changeFontSize(diff) {
    const elExercises = document.querySelector('.exercises')
    const fontSize = +getComputedStyle(elExercises).getPropertyValue('--ex-font-size')
    const newFontSize = fontSize + diff

    setFontSize(newFontSize)
    saveSettings({ fontSize: newFontSize })
}
function setFontSize(fontSize){
    const elExercises = document.querySelector('.exercises')
    elExercises.style.setProperty('--ex-font-size', fontSize)
}
function toggleDarkMode() {
    const elDarkModeSwitch = document.querySelector('#dark-mode-switch')
    
    const currentTheme = document.documentElement.getAttribute('data-theme')
    const isDarkMode = (currentTheme === 'dark')
    
    // Switch between `dark` and `light`
    const switchToTheme = isDarkMode ? 'light' : 'dark'
    elDarkModeSwitch.checked = !isDarkMode
    
    // Set our currenet theme to the new one
    document.documentElement.setAttribute('data-theme', switchToTheme)
    saveSettings({ isDarkMode: switchToTheme })
}
function toggleAutorun(){
    const elAutorunSwitch = document.querySelector('#autorun-switch')
    
    gIsAutorun = !gIsAutorun
    saveSettings({ isAutorun: gIsAutorun })
    elAutorunSwitch.checked = gIsAutorun
}
function toggleSnapToTop(){
    const elSnapSwitch = document.querySelector('#snap-switch')
    
    gIsSnapToTop = !gIsSnapToTop
    saveSettings({ isSnapToTop: gIsSnapToTop })
    elSnapSwitch.checked = gIsSnapToTop
    onExSelect()
}
function copyExAsComment() {
    const elSelector = document.querySelector('#exercise-selector')
    const scriptNum = elSelector.value
    const exId = '#ex-' + scriptNum

    const exStr = document.querySelector(exId).innerText
    const commentStart = '/*\n'
    const commentEnd = '\n*/'
    const commentStr = commentStart + exStr.replace(/^/gm, '// ') + commentEnd

    navigator.clipboard.writeText(commentStr)
    showMsg('Copied to clipboard')
}
function copyText(selector){
    const elTxt = document.querySelector(selector)
    navigator.clipboard.writeText(elTxt.innerText)
    showMsg('Copied to clipboard', 1500, '.play-bingo-msg')
}
function showMsg(txt, duration = 1500, selector = '#msg') {
    const elMsg = document.querySelector(selector)
    elMsg.innerText = txt
    elMsg.style.opacity = 1
    setTimeout(() => (elMsg.style.opacity = 0), duration)
}
function hideLogo() {
    document.querySelector('.logo').classList.add('transparent')
}
function showLogo() {
    document.querySelector('.logo').classList.remove('transparent')
}
function clearConsole() {
    console.clear()
}
function toggleSettings() {
    document.querySelector('.settings').classList.toggle('transparent')
}
function toggleHelp() {
    document.querySelector('.help').classList.toggle('transparent')
}
function hidePopups() {
    document.querySelector('.settings').classList.add('transparent')
    document.querySelector('.help').classList.add('transparent')
}
function showExNumber() {
    document.querySelector('.ex-number').classList.remove('transparent')
}
function hideExNumber() {
    const elExNumber = document.querySelector('.ex-number')
    elExNumber.classList.add('transparent')
}
function hideModals(){
    document.querySelector('.help').classList.add('transparent')
    document.querySelector('.settings').classList.add('transparent')
}