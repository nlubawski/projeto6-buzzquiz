let criarTitulo = null
let criarImagem = null
let criarQuantidadeQuestoes = null
let criarQuantidadeNiveis = null
let criarQuestions = []
let perguntas = null
const quizCriado = {
    title: null,
    image: null,
    questions : [],
    levels: [],
}

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
	return Math.random() - 0.5
}

function  selecionaReposta(boxResposta){
    boxResposta.style.zIndex = 3
    if (boxResposta.parentNode.parentNode.nextElementSibling !== null){
        setTimeout(mostraProximaPergunta, 2000, boxResposta.parentNode.parentNode.nextElementSibling)
    }
}

function mostraProximaPergunta(elemento){
    elemento.scrollIntoView()
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


function mudaCorpoDaPergunta(div){
    div.classList.toggle('esconder')
    const pai = div.parentNode
    pai.querySelector('.pergunta-corpo').classList.toggle('esconder')
    
}

function prosseguirCriarPerguntas(event){
    event.preventDefault()

    criarTitulo = document.querySelector('.titulo-quiz').value
    criarImagem = document.querySelector('.img-quiz').value
    criarQuantidadeQuestoes = document.querySelector('.quantidade-de-perguntas-quiz').value
    criarQuantidadeNiveis = document.querySelector('.quantidade-de-niveis-quiz').value 

    quizCriado.title = criarTitulo
    quizCriado.image = criarImagem

    document.querySelector('.terceira-tela__primeira').classList.add('esconder')
    document.querySelector('.terceira-tela__segunda').classList.remove('esconder')

    renderizaTelaDeCriarPerguntas(criarQuantidadeQuestoes, criarQuantidadeNiveis)
}

function renderizaTelaDeCriarPerguntas(quantidadeQuestoes){
    
    const telaPerguntas = document.querySelector('.perguntas-quiz')
    for (let i = 1; i <= quantidadeQuestoes; i++){
        telaPerguntas.innerHTML += `
        <div class="pergunta-${i} perguntas">
        <span class="pergunta-topo " onclick="mudaCorpoDaPergunta(this)">
            <p>Pergunta ${i}</p>
            <ion-icon name="create-outline"></ion-icon>
        </span>
            <div class="pergunta-corpo esconder" >
                <p>Pergunta ${i}</p>
                <input type="text" minlength="20" class="pergunta"
                    placeholder="Texto da pergunta" required="required">
                <input type="color" required="required" class="pergunta-fundo"
                    placeholder="Cor de fundo da pergunta">

                <p>Resposta correta</p>
                <input type="text" minlength="1" required="required" class="resposta-correta"
                    placeholder="Resposta correta">
                <input type="url" required="required" class="resposta-correta-img"
                    placeholder="URL da imagem">

                <p>Respostas incorretas</p>
                <input type="text" minlength="1" required="required" class="resposta-errada1"
                    placeholder="Resposta incorreta 1">
                <input type="url" required="required" class="resposta-errada1-img"
                    placeholder="URL da imagem 1">

                <input type="text" minlength="1" class="resposta-errada2" placeholder="Resposta incorreta 2">
                <input type="url" class="resposta-errada2-img" placeholder="URL da imagem 2">

                <input type="text" minlength="1" class="resposta-errada3" placeholder="Resposta incorreta 3">
                <input type="url" class="resposta-errada3-img" placeholder="URL da imagem 3">
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

    adicionarPerguntasCriadas()
    renderizarTelaDeCriarNiveis()
}

function mudaCorpoDoNivel(div){
    div.classList.toggle('esconder')
    const pai = div.parentNode
    pai.querySelector('.nivel-corpo').classList.toggle('esconder')
    
}

function renderizarTelaDeCriarNiveis(){
    
    const telaNiveis = document.querySelector('.niveis-quiz')

    telaNiveis.innerHTML += `
    <div class="nivel-1 niveis">
    <span class="nivel-topo " onclick="mudaCorpoDoNivel(this)">
        <p>Nível 1</p>
        <ion-icon name="create-outline"></ion-icon>
    </span>
        <div class="nivel-corpo esconder" >
            <p>Nível 1</p>
            <input type="text" minlength="10" class="nivel"
                placeholder="Título do nível" required="required">
            <input type="number" value=0 max="100" disabled="" required="required" class="nivel-porcentagem"
                placeholder="% de acerto mínima">
            <input type="url" required="required" class="nivel-img"
                placeholder="URL da imagem do nível">
            <textArea type="text" minlength="30" required="required" class="nivel-descricao"
                placeholder="Descrição do nível">
            </textArea>
        </div>
    </div>
`
    for (let i = 2; i <= criarQuantidadeNiveis; i++){
        telaNiveis.innerHTML += `
        <div class="nivel-${i} niveis">
        <span class="nivel-topo " onclick="mudaCorpoDoNivel(this)">
            <p>Nível ${i}</p>
            <ion-icon name="create-outline"></ion-icon>
        </span>
            <div class="nivel-corpo esconder" >
                <p>Nível ${i}</p>
                <input type="text" minlength="10" class="nivel"
                    placeholder="Título do nível" required="required">
                <input type="number" min="0" max="100" required="required" class="nivel-porcentagem"
                    placeholder="% de acerto mínima">
                <input type="url" required="required" class="nivel-img"
                    placeholder="URL da imagem do nível">
                <textArea type="text" minlength="30" required="required" class="nivel-descricao"
                    placeholder="Descrição do nível">
                </textArea>
            </div>
        </div>
    `
    }

    telaNiveis.innerHTML += `
    <div class="nivel-botao">
    <button type="submit">Finalizar Quiz</button>
    </div>
    `
}

function prosseguirSeuQuizEstaPronto(event){
    event.preventDefault()

    document.querySelector('.terceira-tela__terceira').classList.add('esconder')
    document.querySelector('.terceira-tela__quarta').classList.remove('esconder')

    adicionarNiveisCriados()
}

function adicionarPerguntasCriadas(){
    perguntas = document.querySelectorAll('.perguntas')
    for(let i = 0; i < perguntas.length ;i++){
        let texto = perguntas[i].querySelector('.pergunta').value
        let cor = perguntas[i].querySelector('.pergunta-fundo').value
        
        let respostaCorreta = perguntas[i].querySelector('.resposta-correta').value
        let respostaCorretaImagem = perguntas[i].querySelector('.resposta-correta-img').value

        let respostaErrada1 = perguntas[i].querySelector('.resposta-errada1').value
        let respostaErrada1Imagem = perguntas[i].querySelector('.resposta-errada1-img').value
        
        let respostaErrada2 = perguntas[i].querySelector('.resposta-errada2').value
        let respostaErrada2Imagem = perguntas[i].querySelector('.resposta-errada2-img').value

        let respostaErrada3 = perguntas[i].querySelector('.resposta-errada3').value
        let respostaErrada3Imagem = perguntas[i].querySelector('.resposta-errada3-img').value

        let questoes = {
            title: respostaCorreta,
            color: cor,
            answers: [{
                text: respostaCorreta,
                image: respostaCorretaImagem,
                isCorrectAnswer: true,
            }, {
                text: respostaErrada1,
                image: respostaErrada1Imagem,
                isCorrectAnswer: false,
            }, ]
        }
        
        for (let i = 0; i < questoes.lenght; i++){
            for (j = 2; j < 4  ;j++){
                if (respostaErrada2 !== "" && respostaErrada2Imagem !== ""){
                    questoes.answers.push({
                        text: respostaErrada2,
                        image: respostaErrada2Imagem,
                        isCorrectAnswer: false,
                    })
                }
                if (respostaErrada3 !== "" && respostaErrada3Imagem !== ""){
                    questoes.answers.push({
                        text: respostaErrada3,
                        image: respostaErrada3Imagem,
                        isCorrectAnswer: false,
                    })
                }
            }
        }
        

    quizCriado.questions.push(questoes)       
    }
}

function adicionarNiveisCriados(){
    niveis = document.querySelectorAll('.niveis')
    for(let i = 0; i < niveis.length ;i++){

        let texto = niveis[i].querySelector('.nivel').value
        let porcentagem = niveis[i].querySelector('.nivel-porcentagem').value
        
        let nivelImagem = niveis[i].querySelector('.nivel-img').value
        let nivelDescricao = niveis[i].querySelector('.nivel-descricao').value
    
        let niveisInserir = {
            title: texto,
			image: nivelImagem,
			text: nivelDescricao,
			minValue: porcentagem,
        }
        quizCriado.levels.push(niveisInserir)
        console.log("quizCriado ==> ", quizCriado)
    }
    enviarQuizAoServidor() 
}

function enviarQuizAoServidor(){
    const promessa = axios.post('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes', quizCriado)
    promessa.then(finalizarQuiz)
    promessa.catch(erroAoEnviarQuiz)
}

function erroAoEnviarQuiz(erro){
    console.log('erro ', erro)
    console.log('erro ', erro.response)
}

function finalizarQuiz(resposta){
    const telaFinal = document.querySelector('.terceira-tela__quarta')
}

function voltarPraHome(){
    document.querySelector('.terceira-tela__quarta').classList.add('esconder')
    document.querySelector('.primeira-tela').classList.remove('esconder')
    document.querySelector('.ir-para-criacao').classList.remove('esconder')
}

function acessarQuizCriado(){
    //usar funcao da tela 2 aqui
}

obterQuizzes()