function obterQuizzes(){
    const promisse = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes')
    promisse.then(renderizaQuizzes)
    promisse.catch(erroAoObterQuizzes)
}

function renderizaQuizzes(resposta){
    const quizzes = resposta.data
    const lista = document.querySelector('.primeira-tela ul')
    quizzes.forEach(element => {
        lista.innerHTML += `<li> <span class="titulos"  onclick="abrirQuiz()">${element.title}</span> <span class="efeitos" onclick="abrirQuiz()"></span> <img src="${element.image}"></li>`  
    })
}

function erroAoObterQuizzes(){
    console.log("erro ao carregar quizzes")
}

function abrirQuiz(){
    document.querySelector('.primeira-tela').classList.add('esconder')
    document.querySelector('.ir-para-criacao').classList.add('esconder')
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

function mudaCorpoDaPergunta(pergunta_n){
    console.log(pergunta_n)
}

obterQuizzes()