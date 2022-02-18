function obterQuizzes(){
    const promisse = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes')
    promisse.then(renderizaQuizzes)
    promisse.catch(erroAoObterQuizzes)
}

function renderizaQuizzes(resposta){
    const quizzes = resposta.data
    const lista = document.querySelector('.primeira-tela ul')
    quizzes.forEach(element => {
        lista.innerHTML += `<li> 
        <span class="titulos"  onclick="abrirQuiz(${element.id})">
        ${element.title}
        </span> <span class="efeitos" onclick="abrirQuiz(${element.id})">
        </span> <img src="${element.image}">
        </li>`  
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
    const perguntas = quiz.questions
    const segundaTela = document.querySelector('.segunda-tela')
    segundaTela.innerHTML = `
    <div class="cabecalho-quiz">
    <div class="gradiente"></div>
    <span class="titulo-cabecalho">${quiz.title}</span>
    <img src="${quiz.image}" class="imagem-cabecalho" alt="imagem do cabeçalho-quizz">
    </div>
    <ul class="perguntas">${renderizaPerguntas(perguntas)}</ul>`
    
}

function erroAoObterQuiz(){
    console.log("erro ao carregar quizzes")
}

function renderizaPerguntas(perguntas){
    let todasAsPerguntas = ""
    perguntas.forEach(pergunta => {
        todasAsPerguntas +=`
        <section class='box-pergunta'>
            <div class="titulo-pergunta" style="background-color:${pergunta.color};">${pergunta.title}</div>
            <div class="box-respostas">
                <div class="gradiente-branco esconder"></div>
                ${renderizaRespostas(pergunta.answers.sort(comparador))}
            </div>
        </section>`
    })
    return todasAsPerguntas
}

function renderizaRespostas(respostas){
    let todasAsRespostas = ""
    respostas.forEach(resposta => {
        if (resposta.isCorrectAnswer){
            todasAsRespostas += `
            <div class="box-resposta" onclick=" selecionaReposta(this); selecionaBoxResposta(this.parentNode); this.onclick=null">
            <img src="${resposta.image}" class="imagem-resposta" alt="imagem de uma resposta">
            <spam class="texto-resposta texto-verde texto-preto">${resposta.text}</span>
            </div>`
        }else{
            todasAsRespostas += `
            <div class="box-resposta" onclick=" selecionaReposta(this); selecionaBoxResposta(this.parentNode); this.onclick=null ">
            <img src="${resposta.image}" class="imagem-resposta" alt="imagem de uma resposta">
            <spam class="texto-resposta texto-vermelho texto-preto">${resposta.text}</span>
            </div>`
        }
    })
    return todasAsRespostas
}

function comparador() { 
	return Math.random() - 0.5; 
}

function  selecionaReposta(boxResposta){
    boxResposta.style.zIndex = 3;
}

function selecionaBoxResposta(boxResposta){
    const filhosBoxResposta = boxResposta.querySelectorAll("div.gradiente-branco, spam");
    filhosBoxResposta.forEach(elemento => {
        elemento.classList.remove("esconder")
        elemento.classList.remove("texto-preto")
    })
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