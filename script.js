let criarTitulo = null
let criarImagem = null
let criarQuantidadeQuestoes = null
let criarQuantidadeNiveis = null
let criarQuestions = []



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


function mudaCorpoDaPergunta(div){
    console.log('div:::', div)
    div.classList.toggle('esconder')
    const pai = div.parentNode
    console.log('pai', pai)
    pai.querySelector('.pergunta-corpo').classList.toggle('esconder')
    
}

function prosseguirCriarPerguntas(event){
    event.preventDefault()

    criarTitulo = document.querySelector('.titulo-quiz').value
    criarImagem = document.querySelector('.img-quiz').value
    criarQuantidadeQuestoes = document.querySelector('.quantidade-de-perguntas-quiz').value
    criarQuantidadeNiveis = document.querySelector('.quantidade-de-niveis-quiz').value 

    document.querySelector('.terceira-tela__primeira').classList.add('esconder')
    document.querySelector('.terceira-tela__segunda').classList.remove('esconder')

    renderizaTelaDeCriarPerguntas(criarQuantidadeQuestoes)
}

function renderizaTelaDeCriarPerguntas(quantidade){
    
    const telaPerguntas = document.querySelector('.perguntas-quiz')
    //telaPerguntas.innerHTML += `<form onsubmit="prosseguirCriarNiveis(event)">`
    for (let i = 1; i <= quantidade; i++){
        telaPerguntas.innerHTML += `
        <div class="pergunta-${i}">
        <span class="pergunta-topo " onclick="mudaCorpoDaPergunta(this)">
            <p>Pergunta ${i}</p>
            <ion-icon name="create-outline"></ion-icon>
        </span>
            <div class="pergunta-corpo esconder" >
                <p>Pergunta ${i}</p>
                <input type="text" minlength="20" class="pergunta"
                    placeholder="Texto da pergunta" required="required">
                <input type="text" required="required" class="pergunta-fundo"
                    placeholder="Cor de fundo da pergunta">

                <p>Resposta correta</p>
                <input type="text" required="required" class="resposta-correta"
                    placeholder="Resposta correta">
                <input type="url" required="required" class="resposta-correta-img"
                    placeholder="URL da imagem">

                <p>Respostas incorretas</p>
                <input type="text" required="required" class="resposta-errada"
                    placeholder="Resposta incorreta 1">
                <input type="url" required="required" class="resposta-errada-img"
                    placeholder="URL da imagem 1">

                <input type="text" class="resposta-errada" placeholder="Resposta incorreta 2">
                <input type="url" class="resposta-errada-img" placeholder="URL da imagem 2">

                <input type="text" class="resposta-errada" placeholder="Resposta incorreta 3">
                <input type="url" class="resposta-errada-img" placeholder="URL da imagem 3">
            </div>
        </div>
    `
    }

    telaPerguntas.innerHTML += `
    <div class="pergunta-botao">
    <button type="submit">Prosseguir pra criar níveis</button>
    </div>
    `
}

function prosseguirCriarNiveis(event){
    event.preventDefault()

    document.querySelector('.terceira-tela__segunda').classList.add('esconder')
    document.querySelector('.terceira-tela__terceira').classList.remove('esconder')
}
obterQuizzes()