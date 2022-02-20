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
let idQuizCriado = null
let levelsDeAcerto = []
let numeroDeQuestoes = 0
let questoesRespondidas = 0
let questoesAcertadas = 0
let quizAtualId 
let quizzesFeitosPorUsuario = []


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

function renderizaQuiz(resposta){
    const quiz = resposta.data
    const perguntas = quiz.questions
    numeroDeQuestoes = perguntas.length 
    levelsDeAcerto = quiz.levels
    const segundaTela = document.querySelector('.segunda-tela')
    segundaTela.innerHTML = `
    <div class="cabecalho-quiz">
    <div class="gradiente"></div>
    <span class="titulo-cabecalho">${quiz.title}</span>
    <img src="${quiz.image}" class="imagem-cabecalho" alt="imagem do cabeçalho-quizz">
    </div>
    <ul class="perguntas">${renderizaPerguntas(perguntas)}</ul>`
    
}

function erroAoObterQuizzes(){
    console.log("erro ao carregar quizzes")
}

function abrirQuiz(id){
    document.querySelector('.primeira-tela').classList.add('esconder')
    document.querySelector('.ir-para-criacao').classList.add('esconder')
    quizAtualId = id;
    const promise = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${id}`)
    promise.then(renderizaQuiz)
    promise.catch(erroAoObterQuiz)
}

function renderizaQuizzes(resposta){
    const quizzes = resposta.data
    const meusIds = JSON.parse(localStorage.idQuizzesDoUsuario)
    const lista = document.querySelector('.primeira-tela ul')
    const listaMeusIds = document.querySelector('.meus-quizzes ul')
    listaMeusIds.innerHTML = ''
    quizzes.forEach(element => {
        
        for(let i = 0; i < meusIds.length ;i++){
            
            if (meusIds[i] === element.id){
                listaMeusIds.innerHTML += `
                <li> 
                <span class="titulos"  onclick="abrirQuiz(${element.id})">
                ${element.title}
                </span>
                </span> <span class="meu-quiz-editar"> 
                <ion-icon name="create-outline"></ion-icon>
                </span>
                <span class="meu-quiz-apagar" onclick="apagarQuiz(${element.id})"> 
                <ion-icon name="trash-outline"></ion-icon>
                </span>
                <span class="efeitos" onclick="abrirQuiz(${element.id})">
                </span> <img src="${element.image}" >
                </li>
                `  
            }else{
                lista.innerHTML += `
                <li> 
                <span class="titulos"  onclick="abrirQuiz(${element.id})">
                ${element.title}
                </span> <span class="efeitos" onclick="abrirQuiz(${element.id})">
                </span> <img src="${element.image}">
                </li>
                `  
            }
        }
    })
    if (meusIds.lenght !== 0){
        primeiraTelaComQuizCriado()
    }
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
            <div class="box-resposta" onclick="  somaRepostaCerta(); selecionaReposta(this); selecionaBoxResposta(this.parentNode); this.onclick=null">
            <img src="${resposta.image}" class="imagem-resposta" alt="imagem de uma resposta">
            <spam class="texto-resposta texto-verde texto-preto">${resposta.text}</span>
            </div>`
        }else{
            todasAsRespostas += `
            <div class="box-resposta" onclick=" selecionaReposta(this); selecionaBoxResposta(this.parentNode); this.onclick=null">
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
    questoesRespondidas += 1

    if (questoesRespondidas === numeroDeQuestoes){
        setTimeout(finalDoQuiz, 2000)
    }
}

function somaRepostaCerta(){
    questoesAcertadas += 1
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

function finalDoQuiz(){
    let porcentagemAcerto = Math.round((questoesAcertadas*100)/numeroDeQuestoes)
    let levelAlcansado 
    levelsDeAcerto.forEach(level => {
        if (porcentagemAcerto >= level.minValue){
            levelAlcansado = level
        }
    })
    segundaTela = document.querySelector(".perguntas")
    segundaTela.innerHTML += `
    <section class='box-pergunta'>
        <div class="titulo-final titulo-pergunta">${porcentagemAcerto}% de acerto: ${levelAlcansado.title}</div>
        <div class="titulo-imagem">
            <img src="${levelAlcansado.image}" class="imagem-level" alt="imagem do nivel final">
            <span class="texto-level">${levelAlcansado.text}</span>
        </div>
    </section>
    <button class="botao-reiniciar-quiz" onclick="limpaSegundaTela(); abrirQuiz(quizAtualId)">Reiniciar Quiz</button>
    <button class="voltar-home" onclick="limpaSegundaTela();  document.location.reload()">Voltar para home</button>
    `
    document.querySelector(".imagem-level").scrollIntoView()
}

function limpaSegundaTela(){
    levelsDeAcerto = []
    numeroDeQuestoes = 0
    questoesRespondidas = 0
    questoesAcertadas = 0
    const segundaTela = document.querySelector('.segunda-tela')
    segundaTela.innerHTML = ""
    
}


function primeiraTelaComQuizCriado(){
    document.querySelector('.ir-para-criacao').classList.add('esconder')
    const primeiraTelaMeus = document.querySelector('.meus-quizzes span')
    primeiraTelaMeus.innerHTML = `<div class="meus-quizzes-topo"><p>Seus Quizes</p> <ion-icon name="add-circle" onclick="criarQuiz()"></ion-icon></div>`
}

function criarQuiz(){
    document.querySelector('.primeira-tela').classList.add('esconder')
    document.querySelector('.meus-quizzes').classList.add('esconder')
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
        <div class="pergunta-${i} perguntasCriar">
        <span class="pergunta-topo" onclick="mudaCorpoDaPergunta(this)">
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
    <div class="nivel-1 niveisCriar">
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
        <div class="nivel-${i} niveisCriar">
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
    //aqui vai tela de loading

    adicionarNiveisCriados()
}

function adicionarPerguntasCriadas(){
    perguntas = document.querySelectorAll('.perguntasCriar')
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
    niveis = document.querySelectorAll('.niveisCriar')
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
    }
    enviarQuizAoServidor() 
}

function enviarQuizAoServidor(){
    const promessa = axios.post('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes', quizCriado)
    promessa.then(finalizarQuiz)
    promessa.catch(erroAoEnviarQuiz)
}

function erroAoEnviarQuiz(erro){
    alert('ERRO ao criar quiz, tente novamente ... ')
    voltarPraHome()
    document.querySelector('.terceira-tela__primeira').classList.remove('esconder')
}

function finalizarQuiz(resposta){
    const telaFinalizar = document.querySelector('.terceira-tela__quarta')
    telaFinalizar.classList.remove('esconder')
    telaFinalizar.querySelector('.finalizado-quiz ul').innerHTML = `
    <li> <span class="efeitos"></span> <img src="${resposta.data.image}" onclick="acessarQuizCriado()" </li>
    `
    idQuizCriado = resposta.data.id
    salvaIdNoStorage(idQuizCriado)
}

function voltarPraHome(){
    document.querySelector('.terceira-tela__quarta').classList.add('esconder')
    document.querySelector('.primeira-tela').classList.remove('esconder')
    primeiraTelaComQuizCriado()
    window.location.reload()
}

function acessarQuizCriado(){
    document.querySelector('.terceira-tela__quarta').classList.add('esconder')
    const promise = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${idQuizCriado}`)
    promise.then(renderizaQuiz)
    promise.catch(erroAoObterQuiz)
}

function salvaIdNoStorage(id){
    if(localStorage.length !== 0){
        quizzesFeitosPorUsuario = JSON.parse(localStorage.idQuizzesDoUsuario)
        quizzesFeitosPorUsuario.push(id)
        const quizzesFeitosPorUsuarioSerializados = JSON.stringify(quizzesFeitosPorUsuario)
        localStorage.setItem("idQuizzesDoUsuario", quizzesFeitosPorUsuarioSerializados)
    }else{
        quizzesFeitosPorUsuario.push(id)
        const quizzesFeitosPorUsuarioSerializados = JSON.stringify(quizzesFeitosPorUsuario)
        localStorage.setItem("idQuizzesDoUsuario", quizzesFeitosPorUsuarioSerializados)
    }
}

obterQuizzes()