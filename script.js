function obterQuizzes(){
    const promisse = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes')
    promisse.then(renderizaQuizzes)
    promisse.catch(erroAoObterQuizzes)
}

function renderizaQuizzes(resposta){
    const quizzes = resposta.data
    console.log('quizzes: ', quizzes)
    console.log('quizzes: ', quizzes[0].title)
    const lista = document.querySelector('.primeira-tela ul')
    quizzes.forEach(element => {
        lista.innerHTML += `<li> <span class="titulos"  onclick="abrirQuizz()">${element.title}</span> <span class="efeitos" onclick="abrirQuizz()"></span> <img src="${element.image}"></li>`  
    })
}

function erroAoObterQuizzes(){
    console.log("erro ao carregar quizzes")
}

function abrirQuizz(){
    document.querySelector('.primeira-tela').classList.add('esconder')
}

obterQuizzes()