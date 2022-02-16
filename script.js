function obterQuizzes(){
    const promisse = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes')
    promisse.then(renderizaQuizzes)
    promisse.catch(erroAoObterQuizzes)
}

function renderizaQuizzes(resposta){
    const quizzes = resposta.data
    const lista = document.querySelector('.primeira-tela ul')
    quizzes.forEach(element => {
        lista.innerHTML += `<li> <span class="titulos"  onclick="abrirQuiz(${element.id})">${element.title}</span> <span class="efeitos" onclick="abrirQuiz(${element.id})"></span> <img src="${element.image}"></li>`  
    })
}

function erroAoObterQuizzes(){
    console.log("erro ao carregar quizzes")
}

//modifiquei a função abrirQuiz para receber com parametro o id do quiz que ela abrirá. A função renderizaQuizzes passa a passar como parametro o element.id para a função onClick das <li>  //apagar na versão final//
function abrirQuiz(id){
    document.querySelector('.primeira-tela').classList.add('esconder')
    document.querySelector('.ir-para-criacao').classList.add('esconder')
    const promise = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${id}`)
    promise.then(renderizaQuiz)
    promise.catch(erroAoObterQuiz)
}

function renderizaQuiz(resposta){
    const quiz = resposta.data
    const segundaTela = document.querySelector('.segunda-tela')
    segundaTela.innerHTML = `<div class="cabecalho-quiz">
    <div class="gradiente"></div>
    <div class="titulo-cabecalho">${quiz.title}</div>
    <img src="${quiz.image}" class="imagem-cabecalho" alt="imagem do cabeçalho-quizz"></img>
    <div>
    <ul></ul>`
}


function erroAoObterQuiz(){
    console.log("erro ao carregar quizzes")
}

//vai ser chamada quando o usuário já tiver quizzes
function primeiraTelaComQuizCriado(){
    document.querySelector('.ir-para-criacao').classList.add('esconder')
    const primeiraTela = document.querySelector('.primeira-tela p')
    primeiraTela.innerHTML = `<div class="seus-quizzes"><p>Seus Quizzes</p> <ion-icon name="add-circle"></ion-icon></div>`
}

function criarQuiz(){
    document.querySelector('.primeira-tela').classList.add('esconder')
    document.querySelector('.ir-para-criacao').classList.add('esconder')
    document.querySelector('.terceira-tela').classList.remove('esconder')

}

obterQuizzes()